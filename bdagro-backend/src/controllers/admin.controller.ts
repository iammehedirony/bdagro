import { Request, Response } from "express";
import { User } from "../models/User";
import { FarmerProfile } from "../models/FarmerProfile";
import { ILoanApplication, LoanApplication } from "../models/LoanApplication";
import { Project } from "../models/Project";
import { Investment } from "../models/Investment";
import { Transaction } from "../models/Transaction";
import { ProfitDistribution } from "../models/ProfitDistribution";
import {
  UserRole,
  VerificationStatus,
  LoanApplicationStatus,
  InvestmentStatus,
  TransactionType,
  TransactionStatus,
  ProjectStatus,
  UserStatus,
  NotificationType,
} from "../utils/constants";
import { buildMeta, getPagination } from "../utils/pagination";
import { AppError } from "../middlewares/errorHandler";
import mongoose, { HydratedDocument } from "mongoose";
import { notifyUser } from "../services/notification.service";
import { getIo } from "../realtime/io";
import { ApproveLoanApplicationInput, RejectInput } from "../validators/admin.validator";
import { clerkClient } from "@clerk/express";
import { addEmailJob } from "../jobs";

// ****************** dashboard home ****************
/**
 * GET /api/admin/dashboard
 * The "সেন্ট্রাল ড্যাশবোর্ড" — platform-wide totals for users, loans,
 * investments, and the two review queues (verifications, loan applications).
 */
export async function getDashboard(_req: Request, res: Response): Promise<void> {
  const [
    totalFarmers,
    totalInvestors,
    pendingVerifications,
    pendingLoanApplications,
    openProjects,
    disbursementAgg,
    investmentAgg,
  ] = await Promise.all([
    User.countDocuments({ role: UserRole.FARMER }),
    User.countDocuments({ role: UserRole.INVESTOR }),
    FarmerProfile.countDocuments({ verificationStatus: VerificationStatus.PENDING }),
    LoanApplication.countDocuments({
      status: { $in: [LoanApplicationStatus.PENDING, LoanApplicationStatus.PROCESSING] },
    }),
    Project.countDocuments({ status: { $ne: ProjectStatus.CLOSED } }),
    Transaction.aggregate([
      { $match: { type: TransactionType.LOAN_DISBURSEMENT, status: TransactionStatus.SUCCESS } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Investment.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  res.json({
    stats: {
      totalFarmers,
      totalInvestors,
      pendingVerifications,
      pendingLoanApplications,
      openProjects,
      totalLoanDisbursed: disbursementAgg[0]?.total ?? 0,
      totalInvested: investmentAgg[0]?.total ?? 0,
    },
  });
}



// ****************** verification ****************
/**
 * GET /api/admin/verifications?status=&page=&limit=
 * Defaults to the "Pending Verifications" review queue when no status
 * filter is given, matching the PRD's named admin screen.
 */
export async function listVerifications(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: VerificationStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = {
    verificationStatus: status ?? VerificationStatus.PENDING,
  };
  if (status && !Object.values(VerificationStatus).includes(status)) {
    throw new AppError("Invalid status filter", 400);
  }

  const [profiles, total] = await Promise.all([
    FarmerProfile.find(filter)
      .populate("user", "name email phone")
      .sort({ createdAt: 1 }) // oldest submissions reviewed first
      .skip(pagination.skip)
      .limit(pagination.limit),
    FarmerProfile.countDocuments(filter),
  ]);

  res.json({ profiles, meta: buildMeta(total, pagination) });
}

/**
 * POST /api/admin/verifications/:id/approve
 */
export async function approveVerification(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid profile id", 400);
  }

  const profile = await FarmerProfile.findById(id).populate("user", "clerkId");
  if (!profile) {
    throw new AppError("Farmer profile not found", 404);
  }
  if (profile.verificationStatus === VerificationStatus.APPROVED) {
    throw new AppError("Profile is already approved", 409);
  }

  const farmerUser = profile.user as any;
  if (!farmerUser?.clerkId) {
    throw new AppError("Farmer's Clerk ID not found", 500);
  }

  await clerkClient.users.updateUserMetadata(farmerUser.clerkId, {
    publicMetadata: {
      nidStatus: "approved",
    },
  });

  profile.verificationStatus = VerificationStatus.APPROVED;
  profile.verifiedBy = req.user!._id;
  profile.verifiedAt = new Date();
  profile.rejectionReason = null;
  await profile.save();

  await notifyUser(profile.user._id, {
    title: "Document verification approved",
    message: "Your NID and land document have been verified. You can now apply for a loan.",
    type: NotificationType.VERIFICATION,
  });

  res.json({ profile });
}

/**
 * POST /api/admin/verifications/:id/reject
 */
export async function rejectVerification(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid profile id", 400);
  }

  const { rejectionReason } = req.body as RejectInput;

  const profile = await FarmerProfile.findById(id);
  if (!profile) {
    throw new AppError("Farmer profile not found", 404);
  }
  if (profile.verificationStatus === VerificationStatus.APPROVED) {
    throw new AppError("An already-approved profile cannot be rejected directly", 409);
  }

  profile.verificationStatus = VerificationStatus.REJECTED;
  profile.verifiedBy = req.user!._id;
  profile.verifiedAt = new Date();
  profile.rejectionReason = rejectionReason;
  await profile.save();

  await notifyUser(profile.user._id, {
    title: "Document verification rejected",
    message: `Your submission was rejected: ${rejectionReason}`,
    type: NotificationType.VERIFICATION,
  });

  res.json({ profile });
}



// ****************** user ****************
/**
 * GET /api/admin/users?role=&status=&search=&page=&limit=
 */
export async function listUsers(req: Request, res: Response): Promise<void> {
  const { role, status, search } = req.query as { role?: UserRole; status?: UserStatus; search?: string };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = {};
  if (role) {
    if (!Object.values(UserRole).includes(role)) throw new AppError("Invalid role filter", 400);
    filter.role = role;
  }
  if (status) {
    if (!Object.values(UserStatus).includes(status)) throw new AppError("Invalid status filter", 400);
    filter.status = status;
  }
  if (search) {
    const re = new RegExp(search.trim(), "i");
    filter.$or = [{ name: re }, { email: re }, { phone: re }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit),
    User.countDocuments(filter),
  ]);

  const farmerIds = users.filter((user) => user.role === UserRole.FARMER).map((user) => user._id);
  const farmerProfiles = await FarmerProfile.find(
    { user: { $in: farmerIds } },
    "user verificationStatus"
  ).lean();
  const verificationByUserId = new Map(
    farmerProfiles.map((profile) => [profile.user.toString(), profile.verificationStatus ?? null])
  );
  const usersWithVerification = users.map((user) => ({
    ...user.toObject(),
    nidVerificationStatus: user.role === UserRole.FARMER
      ? verificationByUserId.get(user._id.toString()) ?? null
      : null,
  }));

  res.json({ users: usersWithVerification, meta: buildMeta(total, pagination) });
}


// ****************** loans page ****************
/**
 * GET /api/admin/loan-applications?status=&page=&limit=
 */
export async function listLoanApplications(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: LoanApplicationStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = {};
  if (status) {
    if (!Object.values(LoanApplicationStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = status;
  }

  const [applications, total] = await Promise.all([
    LoanApplication.find(filter)
      .populate("farmer", "name email phone")
      .populate("loanProduct", "name category")
      .sort({ createdAt: 1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    LoanApplication.countDocuments(filter),
  ]);

  res.json({ applications, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/admin/all-projects?status=&page=&limit=
 * Combines every loan application with its marketplace project, when one
 * exists, so the admin project screen can show pending and rejected items too.
 */
export async function listAllProjects(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: LoanApplicationStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = {};
  if (status) {
    if (!Object.values(LoanApplicationStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = status;
  }

  const [applications, total] = await Promise.all([
    LoanApplication.find(filter)
      .populate("farmer", "name email phone")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit)
      .lean(),
    LoanApplication.countDocuments(filter),
  ]);

  const applicationIds = applications.map((application) => application._id);
  const farmerIds = applications.map((application) => application.farmer._id);
  const [projects, farmerProfiles] = await Promise.all([
    Project.find({ loanApplication: { $in: applicationIds } })
      .select("loanApplication fundedAmount fundingGoal farmImage")
      .lean(),
    FarmerProfile.find({ user: { $in: farmerIds } })
      .select("user address")
      .lean(),
  ]);

  const projectByApplicationId = new Map(projects.map((project) => [project.loanApplication.toString(), project]));
  const districtByFarmerId = new Map(
    farmerProfiles.map((profile) => [profile.user.toString(), profile.address?.district ?? null])
  );

  const combined = applications.map((application) => {
    const project = projectByApplicationId.get(application._id.toString());
    const farmer = application.farmer as unknown as { _id: mongoose.Types.ObjectId; name: string; email?: string; phone?: string };

    return {
      application: {
        ...application,
        farmImage: application.farmImage ?? null,
      },
      farmer: {
        ...farmer,
        district: districtByFarmerId.get(farmer._id.toString()) ?? null,
      },
      project: project
        ? {
            _id: project._id,
            fundedAmount: project.fundedAmount,
            fundingGoal: project.fundingGoal,
            farmImage: project.farmImage ?? null,
          }
        : null,
    };
  });

  res.json({ applications: combined, meta: buildMeta(total, pagination) });
}

/** Notifies the farmer + pushes a live status update over Socket.io. */
async function broadcastStatusUpdate(
  application: HydratedDocument<ILoanApplication>,
  message: string
): Promise<void> {
  await notifyUser(application.farmer, {
    title: "Loan application update",
    message,
    type: NotificationType.PROJECT,
    meta: { loanApplicationId: application._id, status: application.status },
  });

  const io = getIo();
  io?.to(`user:${application.farmer}`).emit("loan:status_updated", {
    loanApplicationId: application._id,
    status: application.status,
  });
}

/**
 * POST /api/admin/loan-applications/:id/approve
 * Approves the application AND creates the marketplace `Project` from it
 * in the same step — this is the only place Projects get created.
 */
export async function approveLoanApplication(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid application id", 400);
  }

  const body = req.body as ApproveLoanApplicationInput;

  const application = await LoanApplication.findById(id);
  if (!application) {
    throw new AppError("Loan application not found", 404);
  }
  if (application.status === LoanApplicationStatus.APPROVED) {
    throw new AppError("Application is already approved", 409);
  }
  if (application.status === LoanApplicationStatus.REJECTED) {
    throw new AppError("A rejected application cannot be approved", 409);
  }

  application.status = LoanApplicationStatus.APPROVED;
  application.reviewedBy = req.user!._id;
  application.reviewedAt = new Date();
  application.rejectionReason = null;
  await application.save();

  const project = await Project.create({
    loanApplication: application._id,
    farmer: application.farmer,
    title: application.projectTitle,
    description: application.projectDescription,
    location: body.location || application.location,
    landArea: application.landArea,
    expectedHarvestDate: application.expectedHarvestDate,
    farmImage: application.farmImage,
    cropType: body.cropType || application.cropType || "unspecified",
    riskLevel: body.riskLevel,
    expectedROIPercent: body.expectedROIPercent,
    fundingGoal: body.fundingGoal ?? application.requestedAmount,
    fundingDeadline: body.fundingDeadline ?? null,
  });

  await broadcastStatusUpdate(
    application,
    "Congratulations! Your loan application was approved and is now live on the investor marketplace."
  );

  // Send loan approval email to farmer
  const farmer = await User.findById(application.farmer);
  if (farmer?.email) {
    await addEmailJob({
      type: "loan-approval",
      data: {
        farmerId: farmer._id.toString(),
        farmerName: farmer.name,
        farmerEmail: farmer.email,
        projectTitle: project.title,
        loanAmount: application.requestedAmount,
      },
    });
  }

  res.json({ application, project });
}

/**
 * POST /api/admin/loan-applications/:id/reject
 */
export async function rejectLoanApplication(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid application id", 400);
  }

  const { rejectionReason } = req.body as RejectInput;

  const application = await LoanApplication.findById(id);
  if (!application) {
    throw new AppError("Loan application not found", 404);
  }
  if (application.status === LoanApplicationStatus.APPROVED) {
    throw new AppError("An approved application cannot be rejected", 409);
  }

  application.status = LoanApplicationStatus.REJECTED;
  application.reviewedBy = req.user!._id;
  application.reviewedAt = new Date();
  application.rejectionReason = rejectionReason;
  await application.save();

  await broadcastStatusUpdate(application, `Your loan application was rejected: ${rejectionReason}`);

  res.json({ application });
}








// ****************** transactions ****************
/**
 * GET /api/admin/transactions?type=&status=&userId=&page=&limit=
 * The "সমস্ত ট্রানজেকশন মনিটর করা" admin screen — every money movement
 * on the platform, across all users.
 */
export async function listAllTransactions(req: Request, res: Response): Promise<void> {
  const { type, status, userId } = req.query as {
    type?: TransactionType;
    status?: TransactionStatus;
    userId?: string;
  };
  const filter: Record<string, unknown> = {};
  if (type) {
    if (!Object.values(TransactionType).includes(type)) throw new AppError("Invalid type filter", 400);
    filter.type = type;
  }
  if (status) {
    if (!Object.values(TransactionStatus).includes(status)) throw new AppError("Invalid status filter", 400);
    filter.status = status;
  }
  if (userId) {
    if (!mongoose.isValidObjectId(userId)) throw new AppError("Invalid userId filter", 400);
    filter.user = userId;
  }

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .populate("user", "name role")
      .populate({
        path: "relatedInvestment",
        populate: [
          { path: "investor", select: "name role" },
          { path: "project", select: "title farmer", populate: { path: "farmer", select: "name role" } },
        ],
      })
      .sort({ createdAt: -1 })
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  const transactionIds = transactions.map((transaction) => transaction._id);
  const distributionIds = transactions
    .map((transaction) => transaction.relatedProfitDistribution)
    .filter(Boolean);
  const legacyPayoutProjectIds = transactions
    .filter((transaction) => transaction.type === TransactionType.PAYOUT)
    .map((transaction) => transaction.relatedProfitDistribution)
    .filter(Boolean);

  const [distributions, legacyPayoutProjects] = await Promise.all([
    ProfitDistribution.find({
      $or: [{ transaction: { $in: transactionIds } }, { _id: { $in: distributionIds } }],
    })
      .populate("farmer", "name role")
      .populate("investor", "name role")
      .populate("project", "title farmer")
      .lean(),
    Project.find({ _id: { $in: legacyPayoutProjectIds } })
      .populate("farmer", "name role")
      .select("title farmer")
      .lean(),
  ]);

  const distributionsByTransaction = new Map(
    distributions.filter((distribution) => distribution.transaction).map((distribution) => [distribution.transaction!.toString(), distribution]),
  );
  const distributionsById = new Map(distributions.map((distribution) => [distribution._id.toString(), distribution]));
  const projectsById = new Map(legacyPayoutProjects.map((project) => [project._id.toString(), project]));

  const normalizedTransactions = transactions.map((transaction) => {
    const investment = transaction.relatedInvestment as any;
    const distributionId = transaction.relatedProfitDistribution?.toString();
    const distribution = distributionsByTransaction.get(transaction._id.toString())
      ?? (distributionId ? distributionsById.get(distributionId) : undefined);
    const legacyProject = transaction.relatedProfitDistribution
      ? projectsById.get(transaction.relatedProfitDistribution.toString())
      : undefined;
    const project = investment?.project ?? distribution?.project ?? legacyProject;
    const investor = investment?.investor ?? distribution?.investor
      ?? ([TransactionType.INVESTMENT, TransactionType.PAYOUT].includes(transaction.type) ? transaction.user : null);
    const farmer = project?.farmer ?? distribution?.farmer ?? null;

    return {
      ...transaction,
      project: project ? { _id: project._id, title: project.title } : null,
      investor: investor ? { _id: investor._id, name: investor.name } : null,
      farmer: farmer ? { _id: farmer._id, name: farmer.name } : null,
    };
  });

  res.json({
    transactions: normalizedTransactions,
    meta: { total, page: 1, limit: total, totalPages: 1 },
  });
}





// ****************** profile ****************
/**
 * GET /api/admin/profile
 * Returns the admin's own profile
 */
export async function getAdminProfile(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new AppError("Admin user not found", 404);
  }
  res.json({ user });
}

/**
 * PATCH /api/admin/profile
 * Updates the admin's own profile details
 */
export async function updateAdminProfile(req: Request, res: Response): Promise<void> {
  const { name } = req.body;
  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new AppError("Admin user not found", 404);
  }

  if (name) user.name = name;

  await user.save();

  // If email or name changes, sync back to Clerk implicitly or explicitly
  // We sync name here
  if (name) {
    const firstName = name.split(" ")[0];
    const lastName = name.substring(firstName.length).trim();
    await clerkClient.users.updateUser(user.clerkId, {
      firstName,
      lastName: lastName || undefined,
    });
  }

  res.json({ user });
}
