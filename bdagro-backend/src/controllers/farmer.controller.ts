import { Request, Response } from "express";
import { LoanApplication } from "../models/LoanApplication";
import { Project } from "../models/Project";
import { Investment } from "../models/Investment";
import { Notification } from "../models/Notification";
import { NotificationType, ProfitDistributionStatus, LoanApplicationStatus, ProjectStatus, TransactionStatus, TransactionType, UserRole, VerificationStatus } from "../utils/constants";
import { CreateLoanApplicationInput, InitiatePaymentInput, SaveProjectProfitReportInput, SubmitFarmerProfileInput, UpdateFarmerProjectInput } from "../validators/farmer.validator";
import { clerkClient, getAuth } from "@clerk/express";
import { AppError } from "../middlewares/errorHandler";
import { FarmerProfile, ProfitDistribution, LoanProduct, Transaction, User } from "../models";
import { uploadToCloudinary } from "../middlewares/upload";
import mongoose from "mongoose";
import { buildMeta, getPagination } from "../utils/pagination";
import { MarkPaidInput, SubmitProfitReportInput } from "../validators/profitDistribution.validator";
import { UpdateFarmerSettingsInput } from "../validators/settings.validator";
import { notifyUser } from "../services/notification.service";


// ****************** farmer profile ****************

type UploadedFiles = { [fieldname: string]: Express.Multer.File[] } | undefined;

async function notifyAdmins(message: string, meta: Record<string, unknown>, type: NotificationType): Promise<void> {
  const admins = await User.find({ role: UserRole.ADMIN }).select("_id").lean();
  await Promise.all(admins.map((admin) => notifyUser(admin._id, {
    title: "New farmer activity",
    message,
    type,
    meta,
  })));
}

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

  await notifyAdmins(
    `${req.user!.name} submitted documents for verification.`,
    { farmerId: req.user!._id, profileId: profile!._id },
    NotificationType.VERIFICATION,
  );

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
  const farmImageUpload = files?.farmImage?.[0]
    ? await uploadToCloudinary(files.farmImage[0], req.user!._id.toString())
    : undefined;

  const application = await LoanApplication.create({
    farmer: req.user!._id,
    loanProduct: loanProduct._id,
    requestedAmount: body.requestedAmount,
    durationMonths: body.durationMonths,
    projectTitle: body.projectTitle,
    projectDescription: body.projectDescription,
    location: body.location,
    landArea: body.landArea,
    expectedHarvestDate: body.expectedHarvestDate,
    farmImage: farmImageUpload?.secure_url ?? null,
    cropType: body.cropType,
    landDeedUrl: landDeedUpload?.secure_url,
    incomeProofUrl: incomeProofUpload?.secure_url,
    status: LoanApplicationStatus.PENDING,
  });

  await notifyAdmins(
    `${req.user!.name} submitted a new project for review.`,
    { farmerId: req.user!._id, loanApplicationId: application._id },
    NotificationType.PROJECT,
  );

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
    location: body.location,
    landArea: body.landArea,
    expectedHarvestDate: body.expectedHarvestDate,
    farmImage: null,
    cropType: body.cropType,
    status: LoanApplicationStatus.PENDING,
  });

  await notifyAdmins(
    `${req.user!.name} submitted a new project for review.`,
    { farmerId: req.user!._id, loanApplicationId: application._id },
    NotificationType.PROJECT,
  );

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
  if (body.location !== undefined) application.location = body.location;
  if (body.cropType !== undefined) application.cropType = body.cropType;

  await application.save();

  res.json({ project: application });
}


// ************** profit distributions ************

/**
 * GET /api/farmers/profit-distributions?status=&page=&limit=
 */
export async function listMyProfitDistributions(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: ProfitDistributionStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = { farmer: req.user!._id };
  if (status) {
    if (!Object.values(ProfitDistributionStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = status;
  }

  const [profitDistributions, total] = await Promise.all([
    ProfitDistribution.find(filter)
      .populate("project", "title")
      .sort({ dueDate: 1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    ProfitDistribution.countDocuments(filter),
  ]);

  res.json({ profitDistributions, meta: buildMeta(total, pagination) });
}

/**
 * POST /api/farmers/profit-distributions/:id/pay
 *
 * Opens a payment against a pending/overdue profit distribution. This creates the
 * ledger `Transaction` record and links it to the distribution, but the
 * actual SSLCommerz/Stripe checkout-session creation and webhook-based
 * confirmation is a separate roadmap item (#5) — until that's wired up,
 * this returns the pending Transaction so the frontend has a stable
 * shape to build against.
 */
export async function initiatePayment(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid profit distribution id", 400);
  }

  const body = req.body as InitiatePaymentInput;

  const profitDistribution = await ProfitDistribution.findOne({ _id: id, farmer: req.user!._id }).populate("project");
  if (!profitDistribution) {
    throw new AppError("Profit distribution not found", 404);
  }

  if (profitDistribution.status === ProfitDistributionStatus.PAID) {
    throw new AppError("This profit distribution has already been paid", 409);
  }

  const transaction = await Transaction.create({
    user: req.user!._id,
    type: TransactionType.PROFIT_DISTRIBUTION,
    amount: profitDistribution.amount,
    paymentMethod: body.paymentMethod,
    status: TransactionStatus.PENDING,
    relatedLoanApplication: (profitDistribution.project as any).loanApplication,
    relatedProfitDistribution: profitDistribution._id,
  });

  profitDistribution.transaction = transaction._id;
  await profitDistribution.save();

  // TODO(#5 payment integration): call the SSLCommerz/Stripe SDK here to
  // create the actual checkout session and return its redirect URL. The
  // gateway's webhook should then flip `transaction.status` to SUCCESS
  // and mark this profit distribution PAID (with `paidAt`).
  res.status(201).json({
    transaction,
    message: "Payment initiated. Gateway checkout integration is pending (see roadmap).",
  });
}

/**
 * POST /api/farmers/profit-distributions/:id/profit-report
 * Submits a profit report for a project after harvest/sales completion.
 * Calculates net profit and investor share amount.
 */
export async function submitProfitReport(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid profit distribution id", 400);
  }

  const body = req.body as SubmitProfitReportInput;

  const profitDistribution = await ProfitDistribution.findOne({ _id: id, farmer: req.user!._id });
  if (!profitDistribution) {
    throw new AppError("Profit distribution not found", 404);
  }

  const netProfit = body.totalSales - body.productionCost;
  if (netProfit < 0) {
    throw new AppError("Net profit cannot be negative (sales must exceed production cost)", 400);
  }

  const investorShareAmount = (netProfit * body.profitSharePercent) / 100;

  // Store the profit report on the distribution until investor payouts complete.
  profitDistribution.metadata = {
    profitReport: {
      totalSales: body.totalSales,
      productionCost: body.productionCost,
      netProfit,
      profitSharePercent: body.profitSharePercent,
      investorShareAmount,
      submittedAt: new Date(),
    },
  };
  await profitDistribution.save();

  const investments = await Investment.find({ project: profitDistribution.project }).select("investor").lean();
  await Promise.all(investments.map((investment) => notifyUser(investment.investor, {
    title: "Profit report submitted",
    message: "A profit report is available for one of your investments.",
    type: NotificationType.PROFIT_DISTRIBUTION,
    meta: { profitDistributionId: profitDistribution._id },
  })));

  res.json({
    profitDistribution,
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
 * POST /api/farmers/profit-distributions/:id/mark-paid
 * Marks the profit distribution as paid after the farmer has distributed
 * profits to all investors manually (off-platform).
 */
export async function markAsPaid(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid profit distribution id", 400);
  }

  const body = req.body as MarkPaidInput;

  if (!body.confirmPaid) {
    throw new AppError("You must confirm that all investors have been paid", 400);
  }

  const profitDistribution = await ProfitDistribution.findOne({ _id: id, farmer: req.user!._id });
  if (!profitDistribution) {
    throw new AppError("Profit distribution not found", 404);
  }

  if (profitDistribution.status === ProfitDistributionStatus.PAID) {
    throw new AppError("This profit distribution is already marked as paid", 409);
  }

  profitDistribution.status = ProfitDistributionStatus.PAID;
  profitDistribution.paidAt = new Date();
  await profitDistribution.save();

  const investments = await Investment.find({ project: profitDistribution.project }).select("investor").lean();
  await Promise.all(investments.map((investment) => notifyUser(investment.investor, {
    title: "Profit distribution completed",
    message: "Your profit distribution has been marked as paid.",
    type: NotificationType.PROFIT_DISTRIBUTION,
    meta: { profitDistributionId: profitDistribution._id },
  })));

  res.json({
    profitDistribution,
    message: "Profit distribution marked as paid successfully",
  });
}

/**
 * GET /api/farmers/profit-distributions/:id/recipients
 * Returns detailed breakdown of profit distribution to individual investors
 */
export async function getProfitDistributionRecipients(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid profit distribution id", 400);
  }

  const profitDistribution = await ProfitDistribution.findOne({ _id: id, farmer: req.user!._id })
    .populate("project")
    .lean();

  if (!profitDistribution) {
    throw new AppError("Profit distribution not found", 404);
  }

  // Get profit report data from metadata
  const profitReport = profitDistribution.metadata?.profitReport as any;
  if (!profitReport) {
    throw new AppError("Profit report not yet submitted for this profit distribution", 404);
  }

  const project = await Project.findById((profitDistribution.project as any)._id).lean();

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
      status: "pending", // All pending until the entire distribution is marked as paid
    };
  });

  const summary = {
    totalRecipients: recipients.length,
    totalProfitDue,
    paidCount: 0,
    pendingCount: recipients.length,
    profitDistributionStatus: profitDistribution.status,
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

  const farmerProjects = await Project.find({ farmer: req.user!._id }).select("_id").lean();
  const projectIds = farmerProjects.map((project) => project._id);
  const farmerInvestments = await Investment.find({ project: { $in: projectIds } }).select("_id").lean();

  const filter: Record<string, unknown> = {
    $or: [
      { user: req.user!._id },
      { relatedInvestment: { $in: farmerInvestments.map((investment) => investment._id) } },
      { relatedProfitDistribution: { $in: projectIds } },
    ],
  };
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
      .populate({
        path: "relatedInvestment",
        populate: [
          { path: "investor", select: "name" },
          { path: "project", select: "title location" },
        ],
      })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Transaction.countDocuments(filter),
  ]);

  const transactionIds = transactions.map((transaction) => transaction._id);
  const [payoutInvestments, distributions, projects] = await Promise.all([
    Investment.find({ transaction: { $in: transactionIds } })
      .populate("investor", "name")
      .populate("project", "title location")
      .lean(),
    ProfitDistribution.find({ transaction: { $in: transactionIds } })
      .populate("investor", "name")
      .populate("project", "title location")
      .lean(),
    Project.find({ _id: { $in: projectIds } }).select("title location").lean(),
  ]);
  const payoutInvestmentsByTransaction = new Map(
    payoutInvestments.filter((investment) => investment.transaction).map((investment) => [investment.transaction!.toString(), investment]),
  );
  const distributionsByTransaction = new Map(
    distributions.filter((distribution) => distribution.transaction).map((distribution) => [distribution.transaction!.toString(), distribution]),
  );
  const projectsById = new Map(projects.map((project) => [project._id.toString(), project]));

  const normalizedTransactions = transactions.map((transaction) => {
    const investment = transaction.relatedInvestment as any;
    const payoutInvestment = payoutInvestmentsByTransaction.get(transaction._id.toString()) as any;
    const distribution = distributionsByTransaction.get(transaction._id.toString()) as any;
    const project = investment?.project ?? payoutInvestment?.project ?? distribution?.project
      ?? (transaction.relatedProfitDistribution
        ? projectsById.get(transaction.relatedProfitDistribution.toString())
        : undefined);
    const investor = investment?.investor ?? payoutInvestment?.investor ?? distribution?.investor;

    return {
      ...transaction.toObject(),
      project: project ? { _id: project._id, title: project.title, location: project.location } : null,
      counterparty: investor ? { _id: investor._id, name: investor.name } : null,
    };
  });

  res.json({ transactions: normalizedTransactions, meta: buildMeta(total, pagination) });
}

// ************** profit distribution ************

export async function getProfitDistribution(req: Request, res: Response): Promise<void> {
  const farmerId = req.user!._id;
  const activeProjectStatuses = [ProjectStatus.OPEN, ProjectStatus.PARTIALLY_FUNDED];
  const readyHarvestCutoff = new Date();
  readyHarvestCutoff.setDate(readyHarvestCutoff.getDate() + 30);

  const [activeProjects, applications, closedProjects, readyProjects] = await Promise.all([
    Project.find({ farmer: farmerId, status: { $in: activeProjectStatuses } }).lean(),
    LoanApplication.find({ farmer: farmerId }).populate("loanProduct", "profitSharePercent").lean(),
    Project.find({
      farmer: farmerId,
      status: ProjectStatus.CLOSED,
      "profitReport.submittedAt": { $type: "date" },
    })
      .sort({ "profitReport.submittedAt": -1 })
      .lean(),
    Project.find({
      farmer: farmerId,
      status: { $in: [ProjectStatus.FULLY_FUNDED, ProjectStatus.CLOSED] },
      expectedHarvestDate: { $ne: null, $lte: readyHarvestCutoff },
      profitReport: null,
      $expr: { $gte: ["$fundedAmount", "$fundingGoal"] },
    })
      .populate({
        path: "loanApplication",
        match: { status: LoanApplicationStatus.APPROVED },
        select: "projectTitle durationMonths loanProduct",
        populate: { path: "loanProduct", select: "profitSharePercent" },
      })
      .lean(),
  ]);

  const activeApplicationIds = activeProjects.map((project) => project.loanApplication.toString());
  const activeApplications = applications.filter((application) =>
    activeApplicationIds.includes(application._id.toString())
  );
  const activeFundingAmount = activeProjects.reduce((sum, project) => sum + project.fundedAmount, 0);
  const profitDistributionRate = activeApplications[0]?.loanProduct
    ? (activeApplications[0].loanProduct as any).profitSharePercent
    : 0;

  const activeDistributions = await ProfitDistribution.find({
    farmer: farmerId,
    project: { $in: activeProjects.map((project) => project._id) },
  })
    .sort({ dueDate: 1 })
    .limit(1)
    .lean();

  const settlements = closedProjects.map((project) => ({
    id: project._id,
    project: project.title,
    date: project.profitReport!.submittedAt,
    sales: project.profitReport!.totalSales,
    profit: project.profitReport!.netProfit,
    share: project.profitReport!.investorShareAmount,
    sharePercent: project.profitReport!.profitSharePercent,
    status: "success",
  }));

  res.json({
    stats: {
      activeFundingAmount,
      profitDistributionRate,
      expectedHarvestDate: readyProjects.find((project) => project.expectedHarvestDate)?.expectedHarvestDate
        ?? activeDistributions[0]?.dueDate
        ?? null,
      completedSettlements: closedProjects.length,
      completedSettlementAmount: closedProjects.reduce(
        (sum, project) => sum + (project.profitReport?.investorShareAmount ?? 0),
        0,
      ),
    },
    readyProjects: readyProjects
      .filter((project) => project.loanApplication)
      .map((project) => {
        const application = project.loanApplication as any;
        return {
          id: project._id,
          title: project.title,
          fundingAmount: project.fundedAmount,
          durationMonths: application.durationMonths,
          profitShare: application.loanProduct.profitSharePercent,
          expectedHarvestDate: project.expectedHarvestDate,
        };
      }),
    settlements,
  });
}

export async function getProjectProfitReport(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid project id", 400);
  }

  const project = await Project.findOne({ _id: id, farmer: req.user!._id })
    .select("_id title expectedHarvestDate profitReport")
    .lean();
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  res.json({
    projectId: project._id,
    projectTitle: project.title,
    expectedHarvestDate: project.expectedHarvestDate,
    profitReport: project.profitReport ?? null,
  });
}

export async function saveProjectProfitReport(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid project id", 400);
  }

  const body = req.body as SaveProjectProfitReportInput;
  const project = await Project.findOne({
    _id: id,
    farmer: req.user!._id,
    status: { $in: [ProjectStatus.FULLY_FUNDED, ProjectStatus.CLOSED] },
    $expr: { $gte: ["$fundedAmount", "$fundingGoal"] },
  });
  if (!project) {
    throw new AppError("Eligible funded project not found", 404);
  }
  const hasSavedProfitReport = Boolean(project.profitReport?.submittedAt);
  if (hasSavedProfitReport) {
    throw new AppError("A profit report has already been saved for this project", 409);
  }

  const application = await LoanApplication.findOne({
    _id: project.loanApplication,
    farmer: req.user!._id,
    status: LoanApplicationStatus.APPROVED,
  }).populate("loanProduct", "profitSharePercent");
  if (!application) {
    throw new AppError("Approved loan application not found", 404);
  }

  const profitSharePercent = (application.loanProduct as any).profitSharePercent;
  const netProfit = body.totalSales - body.productionCost;
  if (netProfit < 0) {
    throw new AppError("Net profit cannot be negative", 400);
  }

  const investorShareAmount = (netProfit * profitSharePercent) / 100;
  project.profitReport = {
    totalSales: body.totalSales,
    productionCost: body.productionCost,
    netProfit,
    profitSharePercent,
    investorShareAmount,
    submittedAt: new Date(),
  };
  await project.save();

  res.status(201).json({ project, profitReport: project.profitReport });
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
  const expectedProfit = projects.reduce(
    (sum, p) => sum + (p.fundedAmount * p.expectedROIPercent) / 100,
    0
  );

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

  // Every loan application is a dashboard project row. Approved applications
  // are enriched with their marketplace project's funding information.
  const projectByApplicationId = new Map(
    projects.map((project) => [project.loanApplication.toString(), project])
  );
  const projectSummaries = await Promise.all(
    applications.map(async (application) => {
      const project = projectByApplicationId.get(application._id.toString());
      const investorCount = project
        ? await Investment.countDocuments({ project: project._id })
        : 0;
      const fundingGoal = project?.fundingGoal ?? application.requestedAmount;
      const fundedAmount = project?.fundedAmount ?? 0;

      return {
        _id: application._id,
        title: application.projectTitle,
        cropType: project?.cropType ?? application.cropType ?? "-",
        fundingGoal,
        fundedAmount,
        fundingPercent: project && fundingGoal > 0
          ? Math.round((fundedAmount / fundingGoal) * 100)
          : 0,
        status: application.status,
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
      expectedProfit,
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