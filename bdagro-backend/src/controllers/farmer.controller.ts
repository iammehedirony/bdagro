import { Request, Response } from "express";
import { LoanApplication } from "../models/LoanApplication";
import { Project } from "../models/Project";
import { Investment } from "../models/Investment";
import { Notification } from "../models/Notification";
import { InstallmentStatus, LoanApplicationStatus, ProjectStatus, TransactionStatus, TransactionType, VerificationStatus } from "../utils/constants";
import { CreateLoanApplicationInput, InitiatePaymentInput, SubmitFarmerProfileInput, UpdateFarmerProjectInput } from "../validators/farmer.validator";
import { clerkClient, getAuth } from "@clerk/express";
import { AppError } from "../middlewares/errorHandler";
import { FarmerProfile, Installment, LoanProduct, Transaction } from "../models";
import { uploadToCloudinary } from "../middlewares/upload";
import mongoose from "mongoose";
import { buildMeta, getPagination } from "../utils/pagination";
import { MarkPaidInput, SubmitProfitReportInput } from "../validators/installment.validator";
import { UpdateFarmerSettingsInput } from "../validators/settings.validator";


// ****************** farmer profile ****************

type UploadedFiles = { [fieldname: string]: Express.Multer.File[] } | undefined;

/**
 * GET /api/farmers/profile/me
 */
export async function getMyProfile(req: Request, res: Response): Promise<void> {
  const profile = await FarmerProfile.findOne({ user: req.user!._id });
  if (!profile) {
    throw new AppError("No farmer profile submitted yet", 404);
  }
  res.json({ profile });
}

/**
 * PUT /api/farmers/profile
 * Creates the profile on first submission, or resubmits it (e.g. after a
 * rejection). Once `verificationStatus` is APPROVED, edits are blocked —
 * changing verified identity/land documents needs an Admin-mediated flow,
 * not a silent self-edit.
 */
export async function submitProfile(req: Request, res: Response): Promise<void> {
  const body = req.body as SubmitFarmerProfileInput;
  const files = req.files as UploadedFiles;
  const { userId } = getAuth(req);

  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const nidFrontFile = files?.nidFront?.[0];
  const nidBackFile = files?.nidBack?.[0];

  const existing = await FarmerProfile.findOne({ user: req.user!._id });

  if (existing && existing.verificationStatus === VerificationStatus.APPROVED) {
    throw new AppError("Profile is already verified and can no longer be self-edited. Contact support.", 409);
  }

  if (!existing && (!nidFrontFile || !nidBackFile)) {
    throw new AppError("Both nidFrontFile and nidBackFile are required for first submission", 400);
  }

  const [nidFrontUpload, nidBackUpload] = await Promise.all([
    nidFrontFile ? uploadToCloudinary(nidFrontFile, req.user!._id.toString()) : undefined,
    nidBackFile ? uploadToCloudinary(nidBackFile, req.user!._id.toString()) : undefined,
  ]);

  await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        nidStatus: "submitted"
      },
    });

  const update = {
    nidNumber: body.nidNumber,
    nidName: body.nidName,
    address: {
      district: body.address.district,
      upazila: body.address.upazila,
      village: body.address.village,
      fullAddress: body.address.fullAddress,
    },
    dob: body.dob,
    nidImageUrl: [
      nidFrontUpload?.secure_url ?? existing?.nidImageUrl[0],
      nidBackUpload?.secure_url ?? existing?.nidImageUrl[1],
    ],
    verificationStatus: VerificationStatus.PENDING,
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
  };

  const profile = await FarmerProfile.findOneAndUpdate({ user: req.user!._id }, update, {
    new: true,
    upsert: true,
    setDefaultsOnInsert: true,
    runValidators: true,
  });

  // TODO once Admin routes exist: notify admins (Notification + Socket.io
  // `verification:new_submission`) that a new/updated profile needs review.

  res.status(existing ? 200 : 201).json({ profile });
}


// ****************** loans ****************
/**
 * POST /api/farmers/loan-applications
 * A farmer can only apply once their identity/land documents are Approved.
 * Accepts optional document uploads via multipart/form-data.
 */
export async function createApplication(req: Request, res: Response): Promise<void> {
  const body = req.body as CreateLoanApplicationInput;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

  const profile = await FarmerProfile.findOne({ user: req.user!._id });
  if (!profile || profile.verificationStatus !== VerificationStatus.APPROVED) {
    throw new AppError("Complete document verification before applying for a loan", 403);
  }

  if (!mongoose.isValidObjectId(body.loanProduct)) {
    throw new AppError("Invalid loanProduct id", 400);
  }

  const loanProduct = await LoanProduct.findById(body.loanProduct);
  if (!loanProduct || !loanProduct.isActive) {
    throw new AppError("Loan product not found or no longer available", 404);
  }

  if (body.requestedAmount < loanProduct.minAmount || body.requestedAmount > loanProduct.maxAmount) {
    throw new AppError(
      `requestedAmount must be between ${loanProduct.minAmount} and ${loanProduct.maxAmount} for this product`,
      400
    );
  }

  if (body.durationMonths > loanProduct.maxDurationMonths) {
    throw new AppError(`durationMonths cannot exceed ${loanProduct.maxDurationMonths} for this product`, 400);
  }

  const [landDeedUpload, incomeProofUpload] = await Promise.all([
    files?.landDeed?.[0]
      ? uploadToCloudinary(files.landDeed[0], req.user!._id.toString())
      : undefined,
    files?.incomeProof?.[0]
      ? uploadToCloudinary(files.incomeProof[0], req.user!._id.toString())
      : undefined,
  ]);

  const application = await LoanApplication.create({
    farmer: req.user!._id,
    loanProduct: loanProduct._id,
    requestedAmount: body.requestedAmount,
    durationMonths: body.durationMonths,
    projectTitle: body.projectTitle,
    projectDescription: body.projectDescription,
    cropType: body.cropType,
    landDeedUrl: landDeedUpload?.secure_url,
    incomeProofUrl: incomeProofUpload?.secure_url,
    status: LoanApplicationStatus.PENDING,
  });

  // TODO once Admin routes exist: emit `loan:new_application` to the admin
  // room and create a Notification, so the review queue updates live.

  res.status(201).json({ application });
}

/**
 * GET /api/farmers/loan-applications?status=&page=&limit=
 */
export async function listMyApplications(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: LoanApplicationStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = { farmer: req.user!._id };
  if (status) {
    if (!Object.values(LoanApplicationStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = status;
  }

  const [applications, total] = await Promise.all([
    LoanApplication.find(filter)
      .populate("loanProduct", "name category interestRatePercent")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    LoanApplication.countDocuments(filter),
  ]);

  res.json({ applications, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/farmers/loan-applications/:id
 */
export async function getMyApplicationById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid application id", 400);
  }

  const application = await LoanApplication.findOne({ _id: id, farmer: req.user!._id }).populate(
    "loanProduct",
    "name category interestRatePercent maxDurationMonths"
  );

  if (!application) {
    throw new AppError("Loan application not found", 404);
  }

  res.json({ application });
}


// ****************** project ****************
/**
 * GET /api/farmers/projects
 * Lists all projects for the farmer (combining LoanApplications and their resulting Projects).
 */
export async function listMyProjects(req: Request, res: Response): Promise<void> {
  const pagination = getPagination(req);
  const filter = { farmer: req.user!._id };

  const [applications, total] = await Promise.all([
    LoanApplication.find(filter)
      .populate("loanProduct", "name category interestRatePercent")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    LoanApplication.countDocuments(filter),
  ]);

  // Fetch corresponding Projects for approved applications
  const applicationIds = applications.map((app) => app._id);
  const projects = await Project.find({ loanApplication: { $in: applicationIds } }).lean();

  const projectMap = new Map(projects.map((p) => [p.loanApplication.toString(), p]));

  const combinedProjects = applications.map((app) => {
    const project = projectMap.get(app._id.toString());
    return {
      ...app,
      // If a project exists, embed its marketplace stats
      marketplaceProject: project || null,
    };
  });

  res.json({ projects: combinedProjects, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/farmers/projects/:id
 * Gets project details, including investor list if it is an approved Project.
 */
export async function getMyProjectById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid project id", 400);
  }

  const application = await LoanApplication.findOne({
    _id: id,
    farmer: req.user!._id,
  })
    .populate("loanProduct", "name category interestRatePercent maxDurationMonths")
    .lean();

  if (!application) {
    throw new AppError("Project not found", 404);
  }

  let marketplaceProject = null;
  let investments: any[] = [];

  if (application.status === LoanApplicationStatus.APPROVED) {
    marketplaceProject = await Project.findOne({ loanApplication: application._id }).lean();
    if (marketplaceProject) {
      investments = await Investment.find({ project: marketplaceProject._id })
        .populate("investor", "name")
        .sort({ createdAt: -1 })
        .lean();
    }
  }

  res.json({
    project: {
      ...application,
      marketplaceProject,
      investments,
    },
  });
}

/**
 * POST /api/farmers/projects
 * Creates a new project (which is technically a LoanApplication).
 */
export async function createMyProject(req: Request, res: Response): Promise<void> {
  const body = req.body as CreateLoanApplicationInput;

  const profile = await FarmerProfile.findOne({ user: req.user!._id });
  if (!profile || profile.verificationStatus !== VerificationStatus.APPROVED) {
    throw new AppError("Complete document verification before creating a project", 403);
  }

  if (!mongoose.isValidObjectId(body.loanProduct)) {
    throw new AppError("Invalid loanProduct id", 400);
  }

  const loanProduct = await LoanProduct.findById(body.loanProduct);
  if (!loanProduct || !loanProduct.isActive) {
    throw new AppError("Loan product not found or no longer available", 404);
  }

  if (body.requestedAmount < loanProduct.minAmount || body.requestedAmount > loanProduct.maxAmount) {
    throw new AppError(
      `requestedAmount must be between ${loanProduct.minAmount} and ${loanProduct.maxAmount} for this product`,
      400
    );
  }

  if (body.durationMonths > loanProduct.maxDurationMonths) {
    throw new AppError(`durationMonths cannot exceed ${loanProduct.maxDurationMonths} for this product`, 400);
  }

  const application = await LoanApplication.create({
    farmer: req.user!._id,
    loanProduct: loanProduct._id,
    requestedAmount: body.requestedAmount,
    durationMonths: body.durationMonths,
    projectTitle: body.projectTitle,
    projectDescription: body.projectDescription,
    cropType: body.cropType,
    status: LoanApplicationStatus.PENDING,
  });

  res.status(201).json({ project: application });
}

/**
 * PUT /api/farmers/projects/:id
 * Updates a pending project (LoanApplication).
 */
export async function updateMyProject(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid project id", 400);
  }

  const body = req.body as UpdateFarmerProjectInput;

  const application = await LoanApplication.findOne({ _id: id, farmer: req.user!._id });
  if (!application) {
    throw new AppError("Project not found", 404);
  }

  if (application.status !== LoanApplicationStatus.PENDING) {
    throw new AppError("You can only edit projects that are in Pending status", 403);
  }

  if (body.requestedAmount || body.durationMonths) {
    const loanProduct = await LoanProduct.findById(application.loanProduct);
    if (!loanProduct) {
      throw new AppError("Associated loan product not found", 404);
    }
    const requestedAmount = body.requestedAmount ?? application.requestedAmount;
    if (requestedAmount < loanProduct.minAmount || requestedAmount > loanProduct.maxAmount) {
      throw new AppError(
        `requestedAmount must be between ${loanProduct.minAmount} and ${loanProduct.maxAmount} for this product`,
        400
      );
    }
    const durationMonths = body.durationMonths ?? application.durationMonths;
    if (durationMonths > loanProduct.maxDurationMonths) {
      throw new AppError(`durationMonths cannot exceed ${loanProduct.maxDurationMonths} for this product`, 400);
    }
  }

  if (body.requestedAmount !== undefined) application.requestedAmount = body.requestedAmount;
  if (body.durationMonths !== undefined) application.durationMonths = body.durationMonths;
  if (body.projectTitle !== undefined) application.projectTitle = body.projectTitle;
  if (body.projectDescription !== undefined) application.projectDescription = body.projectDescription;
  if (body.cropType !== undefined) application.cropType = body.cropType;

  await application.save();

  res.json({ project: application });
}


// ************** installments ************

/**
 * GET /api/farmers/installments?status=&page=&limit=
 */
export async function listMyInstallments(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: InstallmentStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = { farmer: req.user!._id };
  if (status) {
    if (!Object.values(InstallmentStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = status;
  }

  const [installments, total] = await Promise.all([
    Installment.find(filter)
      .populate("loanApplication", "projectTitle")
      .sort({ dueDate: 1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Installment.countDocuments(filter),
  ]);

  res.json({ installments, meta: buildMeta(total, pagination) });
}

/**
 * POST /api/farmers/installments/:id/pay
 *
 * Opens a payment against a due/overdue installment. This creates the
 * ledger `Transaction` record and links it to the installment, but the
 * actual SSLCommerz/Stripe checkout-session creation and webhook-based
 * confirmation is a separate roadmap item (#5) — until that's wired up,
 * this returns the pending Transaction so the frontend has a stable
 * shape to build against.
 */
export async function initiatePayment(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid installment id", 400);
  }

  const body = req.body as InitiatePaymentInput;

  const installment = await Installment.findOne({ _id: id, farmer: req.user!._id });
  if (!installment) {
    throw new AppError("Installment not found", 404);
  }

  if (installment.status === InstallmentStatus.PAID) {
    throw new AppError("This installment has already been paid", 409);
  }

  const transaction = await Transaction.create({
    user: req.user!._id,
    type: TransactionType.LOAN_REPAYMENT,
    amount: installment.amount,
    paymentMethod: body.paymentMethod,
    status: TransactionStatus.PENDING,
    relatedLoanApplication: installment.loanApplication,
    relatedInstallment: installment._id,
  });

  installment.transaction = transaction._id;
  await installment.save();

  // TODO(#5 payment integration): call the SSLCommerz/Stripe SDK here to
  // create the actual checkout session and return its redirect URL. The
  // gateway's webhook should then flip `transaction.status` to SUCCESS
  // and mark this installment PAID (with `paidAt`).
  res.status(201).json({
    transaction,
    message: "Payment initiated. Gateway checkout integration is pending (see roadmap).",
  });
}

/**
 * POST /api/farmers/installments/:id/profit-report
 * Submits a profit report for a project after harvest/sales completion.
 * Calculates net profit and investor share amount.
 */
export async function submitProfitReport(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid installment id", 400);
  }

  const body = req.body as SubmitProfitReportInput;

  const installment = await Installment.findOne({ _id: id, farmer: req.user!._id }).populate(
    "loanApplication"
  );
  if (!installment) {
    throw new AppError("Installment not found", 404);
  }

  const netProfit = body.totalSales - body.productionCost;
  if (netProfit < 0) {
    throw new AppError("Net profit cannot be negative (sales must exceed production cost)", 400);
  }

  const investorShareAmount = (netProfit * body.profitSharePercent) / 100;

  // Store profit report metadata on the installment
  installment.metadata = {
    profitReport: {
      totalSales: body.totalSales,
      productionCost: body.productionCost,
      netProfit,
      profitSharePercent: body.profitSharePercent,
      investorShareAmount,
      submittedAt: new Date(),
    },
  };
  await installment.save();

  res.json({
    installment,
    profitReport: {
      totalSales: body.totalSales,
      productionCost: body.productionCost,
      netProfit,
      profitSharePercent: body.profitSharePercent,
      investorShareAmount,
    },
  });
}

/**
 * POST /api/farmers/installments/:id/mark-paid
 * Marks the installment as paid after the farmer has distributed
 * profits to all investors manually (off-platform).
 */
export async function markAsPaid(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid installment id", 400);
  }

  const body = req.body as MarkPaidInput;

  if (!body.confirmPaid) {
    throw new AppError("You must confirm that all investors have been paid", 400);
  }

  const installment = await Installment.findOne({ _id: id, farmer: req.user!._id });
  if (!installment) {
    throw new AppError("Installment not found", 404);
  }

  if (installment.status === InstallmentStatus.PAID) {
    throw new AppError("This installment is already marked as paid", 409);
  }

  installment.status = InstallmentStatus.PAID;
  installment.paidAt = new Date();
  await installment.save();

  res.json({
    installment,
    message: "Installment marked as paid successfully",
  });
}

/**
 * GET /api/farmers/installments/:id/recipients
 * Returns detailed breakdown of profit distribution to individual investors
 */
export async function getInstallmentRecipients(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid installment id", 400);
  }

  const installment = await Installment.findOne({ _id: id, farmer: req.user!._id })
    .populate("loanApplication")
    .lean();

  if (!installment) {
    throw new AppError("Installment not found", 404);
  }

  // Get profit report data from metadata
  const profitReport = installment.metadata?.profitReport as any;
  if (!profitReport) {
    throw new AppError("Profit report not yet submitted for this installment", 404);
  }

  // Get the project associated with this loan application
  const project = await Project.findOne({ loanApplication: installment.loanApplication }).lean();

  if (!project) {
    throw new AppError("Associated project not found", 404);
  }

  // Get all investments for this project
  const investments = await Investment.find({ project: project._id })
    .populate("investor", "name phone")
    .lean();

  // Calculate profit share for each investor based on their investment proportion
  const totalInvested = project.fundedAmount;
  const totalProfitDue = profitReport.investorShareAmount;

  const recipients = investments.map((investment: any) => {
    const investmentProportion = investment.amount / totalInvested;
    const profitShare = Math.round(totalProfitDue * investmentProportion);

    return {
      investorId: investment.investor._id,
      investorName: investment.investor.name,
      investedAmount: investment.amount,
      profitShare,
      profitSharePercent: Math.round(investmentProportion * 100 * 10) / 10,
      paymentMethod: investment.paymentMethod || "sslcommerz",
      // Note: In a real system, payment account details would come from investor settings
      status: "pending", // All pending until the entire installment is marked as paid
    };
  });

  const summary = {
    totalRecipients: recipients.length,
    totalProfitDue,
    paidCount: 0,
    pendingCount: recipients.length,
    installmentStatus: installment.status,
  };

  res.json({ recipients, summary, profitReport });
}



// ************** transactions ************

/**
 * GET /api/farmers/transactions?type=&status=&page=&limit=
 */
export async function listFarmerTransactions(req: Request, res: Response): Promise<void> {
  const { type, status } = req.query as { type?: TransactionType; status?: TransactionStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = { user: req.user!._id };
  if (type) {
    if (!Object.values(TransactionType).includes(type)) {
      throw new AppError("Invalid type filter", 400);
    }
    filter.type = type;
  }
  if (status) {
    if (!Object.values(TransactionStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = status;
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate("relatedLoanApplication", "projectTitle cropType")
      .populate("relatedInstallment")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Transaction.countDocuments(filter),
  ]);

  res.json({ transactions, meta: buildMeta(total, pagination) });
}



// ************** farmer dashboard home ************
/**
 * GET /api/farmers/dashboard
 * Returns aggregated dashboard summary for the farmer:
 * - Active projects count
 * - Total funds raised across all projects
 * - Total unique investors count
 * - Recent activity feed
 */
export async function getFarmerDashboard(req: Request, res: Response): Promise<void> {
  const farmerId = req.user!._id;

  // Get all loan applications for this farmer
  const applications = await LoanApplication.find({ farmer: farmerId }).lean();

  // Get approved applications that have marketplace projects
  const approvedApplicationIds = applications
    .filter((app) => app.status === LoanApplicationStatus.APPROVED)
    .map((app) => app._id);

  const projects = await Project.find({
    loanApplication: { $in: approvedApplicationIds },
  }).lean();

  // Calculate stats
  const activeProjectsCount = projects.filter(
    (p) => p.status === ProjectStatus.OPEN || p.status === ProjectStatus.PARTIALLY_FUNDED
  ).length;

  const pendingApplicationsCount = applications.filter(
    (app) => app.status === LoanApplicationStatus.PENDING
  ).length;

  const totalFundsRaised = projects.reduce((sum, p) => sum + p.fundedAmount, 0);

  // Get unique investors across all farmer's projects
  const projectIds = projects.map((p) => p._id);
  const investments = await Investment.find({
    project: { $in: projectIds },
  })
    .select("investor")
    .lean();

  const uniqueInvestors = new Set(investments.map((inv) => inv.investor.toString()));
  const totalInvestorsCount = uniqueInvestors.size;

  // Get recent activity (recent investments + notifications)
  const recentInvestments = await Investment.find({
    project: { $in: projectIds },
  })
    .populate("investor", "name")
    .populate("project", "title")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const recentNotifications = await Notification.find({
    user: farmerId,
  })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  // Combine and sort activity feed
  const activityFeed = [
    ...recentInvestments.map((inv) => ({
      type: "investment",
      text: `${(inv.project as any)?.title || "প্রকল্প"}-এ নতুন বিনিয়োগ পেয়েছেন ৳${inv.amount.toLocaleString()}`,
      time: inv.createdAt,
      meta: inv,
    })),
    ...recentNotifications.map((notif) => ({
      type: "notification",
      text: notif.message,
      time: notif.createdAt,
      meta: notif,
    })),
  ]
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, 10);

  // Get project summaries for dashboard display
  const projectSummaries = await Promise.all(
    projects.slice(0, 5).map(async (project) => {
      const investorCount = await Investment.countDocuments({ project: project._id });
      return {
        _id: project._id,
        title: project.title,
        cropType: project.cropType,
        fundingGoal: project.fundingGoal,
        fundedAmount: project.fundedAmount,
        fundingPercent: Math.round((project.fundedAmount / project.fundingGoal) * 100),
        status: project.status,
        investorCount,
      };
    })
  );

  res.json({
    summary: {
      activeProjectsCount,
      pendingApplicationsCount,
      totalFundsRaised,
      totalInvestorsCount,
    },
    projectSummaries,
    activityFeed,
  });
}


// ************** settings ************
/**
 * PUT /api/farmers/settings
 * Updates farmer-specific settings (payment methods, notification preferences)
 */
export async function updateFarmerSettings(req: Request, res: Response): Promise<void> {
  const body = req.body as UpdateFarmerSettingsInput;

  const profile = await FarmerProfile.findOne({ user: req.user!._id });
  if (!profile) {
    throw new AppError("Farmer profile not found", 404);
  }

  if (!profile.settings) {
    profile.settings = {
      notifyInvestmentUpdates: true,
      notifyProfitReportReminders: true,
      notifyProjectStatusChanges: true,
      notifyPromotional: false,
    };
  }

  // Update settings
  if (body.bkashNumber !== undefined) profile.settings.bkashNumber = body.bkashNumber;
  if (body.nagadNumber !== undefined) profile.settings.nagadNumber = body.nagadNumber;
  if (body.bankAccount !== undefined) profile.settings.bankAccount = body.bankAccount;
  if (body.defaultPaymentGateway !== undefined)
    profile.settings.defaultPaymentGateway = body.defaultPaymentGateway;
  if (body.notifyInvestmentUpdates !== undefined)
    profile.settings.notifyInvestmentUpdates = body.notifyInvestmentUpdates;
  if (body.notifyProfitReportReminders !== undefined)
    profile.settings.notifyProfitReportReminders = body.notifyProfitReportReminders;
  if (body.notifyProjectStatusChanges !== undefined)
    profile.settings.notifyProjectStatusChanges = body.notifyProjectStatusChanges;
  if (body.notifyPromotional !== undefined) profile.settings.notifyPromotional = body.notifyPromotional;

  await profile.save();

  res.json({ settings: profile.settings, message: "Settings updated successfully" });
}