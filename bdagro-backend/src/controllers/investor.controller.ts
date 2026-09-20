import { Request, Response } from "express";
import mongoose from "mongoose";
import { Investment } from "../models/Investment";
import { Project } from "../models/Project";
import { Transaction } from "../models/Transaction";
import { ProfitDistribution } from "../models/ProfitDistribution";
import {
  ProjectStatus,
  InvestmentType,
  InvestmentStatus,
  TransactionType,
  TransactionStatus,
} from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { CreateInvestmentInput } from "../validators/investor.validator";
import { getPagination, buildMeta } from "../utils/pagination";
import { CreateInvestorProfileInput } from "../validators/investor.validator";
import { InvestorProfile } from "../models";
import { User } from "../models";
import { clerkClient } from "@clerk/express";
import { UpdateInvestorProfileInput } from "../validators/settings.validator";

/**
 * POST /api/investors/profile
 * Creates the investor's initial preference profile after registration.
 */
export async function createInvestorProfile(req: Request, res: Response): Promise<void> {
  const body = req.body as CreateInvestorProfileInput;

  const existingProfile = await InvestorProfile.findOne({ user: req.user!._id });
  if (existingProfile) {
    throw new AppError("Investor profile already exists", 409);
  }

  const profile = await InvestorProfile.create({
    user: req.user!._id,
    preferences: {
      preferredCropTypes: body.preferredCropTypes,
      maxRiskLevel: body.maxRiskLevel,
      monthlyInvestmentPlan: body.monthlyInvestmentPlan,
    },
  });

  res.status(201).json({ profile });
}


// ************** portfolio dashboard ************

interface PortfolioAggregate {
  totalInvested: number;
  totalReturned: number;
  projectIds: unknown[];
}

const excludedInvestmentStatuses = [InvestmentStatus.FAILED, InvestmentStatus.REFUNDED];

/**
 * GET /api/investors/portfolio
 * The "পোর্টফোলিও ড্যাশবোর্ড" — total invested, distinct running projects,
 * and ROI-to-date, computed live from completed Investments (rather than
 * trusting only the denormalized InvestorProfile counters).
 */
export async function getPortfolio(req: Request, res: Response): Promise<void> {
  const investorId = req.user!._id;

  const [totals] = await Investment.aggregate<PortfolioAggregate>([
    { $match: { investor: investorId, status: { $nin: excludedInvestmentStatuses } } },
    {
      $group: {
        _id: null,
        totalInvested: { $sum: "$amount" },
        totalReturned: { $sum: "$returnAmount" },
        projectIds: { $addToSet: "$project" },
      },
    },
  ]);

  const investments = await Investment.find({
    investor: investorId,
    status: { $nin: excludedInvestmentStatuses },
  })
    .populate("project", "title location cropType riskLevel expectedROIPercent status fundingGoal fundedAmount")
    .sort({ createdAt: -1 });

  const totalInvested = totals?.totalInvested ?? 0;
  const totalReturned = totals?.totalReturned ?? 0;

  res.json({
    portfolio: {
      totalInvested,
      currentValue: totalInvested + totalReturned,
      roiPercent: totalInvested > 0 ? (totalReturned / totalInvested) * 100 : 0,
      activeInvestmentsCount: investments.filter(
        (investment) => investment.status === InvestmentStatus.PENDING || investment.status === InvestmentStatus.COMPLETED
      ).length,
      completedProjectsCount: investments.filter((investment) => investment.status === InvestmentStatus.RETURNED).length,
    },
    investments,
  });
}



// ************** investments ************
/**
 * POST /api/investors/investments
 * Commits an investor's funding intent toward a project. This creates the
 * pending ledger Transaction + Investment records; the actual
 * SSLCommerz/Stripe checkout and its webhook-driven confirmation
 * (which increments the project's fundedAmount) is roadmap item #5 —
 * see `src/services/investment.service.ts#confirmInvestment`.
 */
export async function createInvestment(req: Request, res: Response): Promise<void> {
  const body = req.body as CreateInvestmentInput;

  if (!mongoose.isValidObjectId(body.project)) {
    throw new AppError("Invalid project id", 400);
  }

  const project = await Project.findById(body.project);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  if (![ProjectStatus.OPEN, ProjectStatus.PARTIALLY_FUNDED].includes(project.status)) {
    throw new AppError("This project is not currently accepting investment", 409);
  }

  const remaining = project.fundingGoal - project.fundedAmount;
  if (remaining <= 0) {
    throw new AppError("This project has already been fully funded", 409);
  }

  if (body.investmentType === InvestmentType.FULL) {
    if (body.amount !== remaining) {
      throw new AppError(`A full investment must exactly cover the remaining amount: ${remaining}`, 400);
    }
  } else if (body.amount > remaining) {
    throw new AppError(`Partial investment amount cannot exceed the remaining amount: ${remaining}`, 400);
  }

  const transaction = await Transaction.create({
    user: req.user!._id,
    type: TransactionType.INVESTMENT,
    amount: body.amount,
    paymentMethod: body.paymentMethod,
    status: TransactionStatus.PENDING,
    metadata: { billing: body.billing },
  });

  const investment = await Investment.create({
    investor: req.user!._id,
    project: project._id,
    amount: body.amount,
    investmentType: body.investmentType,
    status: InvestmentStatus.PENDING,
    transaction: transaction._id,
  });

  transaction.relatedInvestment = investment._id;
  await transaction.save();

// TODO(#5 payment integration): create the actual SSLCommerz/Stripe
  // checkout session and return its redirect URL here. Once the gateway
  // webhook confirms payment, call `confirmInvestment(investment._id)`
  // to mark it COMPLETED and update the project's funding progress.

  res.status(201).json({
    investment,
    transaction,
    message: "Investment initiated. Gateway checkout integration is pending (see roadmap).",
  });
}


// ************** roi tracking ************

interface MonthlyROI {
  month: string;
  year: number;
  amount: number;
  count: number;
}

interface ProjectROI {
  projectId: string;
  projectTitle: string;
  location: string;
  invested: number;
  earned: number;
  roi: number;
  status: string;
}

interface InvestorPayout {
  id: string;
  amount: number;
  paidAt: Date;
  paymentMethod: string;
  gatewayTransactionId: string | null;
  project: { id: string; title: string; location: string } | null;
}

/**
 * GET /api/investors/roi-tracking
 * Returns monthly ROI chart data and per-project ROI breakdown
 */
export async function getROITracking(req: Request, res: Response): Promise<void> {
  const investorId = req.user!._id;

  // Investment.returnAmount is the source of truth for project-level returns.
  const investments = await Investment.find({ investor: investorId })
    .populate("project", "title location status")
    .lean();

  // Payouts can be created by either manual settlement or a distribution gateway.
  const payoutTransactions = await Transaction.find({
    user: investorId,
    type: { $in: [TransactionType.PAYOUT, TransactionType.PROFIT_DISTRIBUTION] },
    status: TransactionStatus.SUCCESS,
  })
    .populate("relatedInvestment", "project")
    .sort({ createdAt: -1 })
    .lean();
  const paidDistributions = await ProfitDistribution.find({
    investor: investorId,
    status: "paid",
  } as Record<string, unknown>)
    .populate("project", "title location")
    .lean();
  const distributionsByTransaction = new Map(
    paidDistributions
      .filter((distribution) => distribution.transaction)
      .map((distribution) => [distribution.transaction!.toString(), distribution]),
  );

  const projectROIs: ProjectROI[] = investments.reduce<ProjectROI[]>((rows, investment) => {
    const project = investment.project as any;
    if (!project) return rows;

    const existing = rows.find((row) => row.projectId === project._id.toString());
    if (existing) {
      existing.invested += investment.amount;
      existing.earned += investment.returnAmount;
      existing.roi = existing.invested > 0 ? (existing.earned / existing.invested) * 100 : 0;
      return rows;
    }

    rows.push({
      projectId: project._id.toString(),
      projectTitle: project.title || "Unknown Project",
      location: project.location || "",
      invested: investment.amount,
      earned: investment.returnAmount,
      roi: investment.amount > 0 ? (investment.returnAmount / investment.amount) * 100 : 0,
      status: project.status || investment.status,
    });
    return rows;
  }, []);

  const payouts: InvestorPayout[] = payoutTransactions.map((transaction) => {
    const investment = transaction.relatedInvestment as any;
    const distribution = distributionsByTransaction.get(transaction._id.toString()) as any;
    const project = distribution?.project
      ?? investments.find((item) => item._id.toString() === investment?._id?.toString())?.project as any;

    return {
      id: transaction._id.toString(),
      amount: transaction.amount,
      paidAt: transaction.updatedAt ?? transaction.createdAt,
      paymentMethod: transaction.paymentMethod,
      gatewayTransactionId: transaction.gatewayTransactionId,
      project: project?._id
        ? { id: project._id.toString(), title: project.title, location: project.location }
        : null,
    };
  });

  // Calculate monthly payout data for the last 12 months.
  const monthlyData: MonthlyROI[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);
    const monthPayouts = payouts.filter((payout) => payout.paidAt >= monthStart && payout.paidAt <= monthEnd);

    monthlyData.push({
      month: targetDate.toLocaleString("en-US", { month: "short" }),
      year: targetDate.getFullYear(),
      amount: Math.round(monthPayouts.reduce((sum, payout) => sum + payout.amount, 0)),
      count: monthPayouts.length,
    });
  }

  const totalEarned = projectROIs.reduce((sum, project) => sum + project.earned, 0);
  const totalInvested = projectROIs.reduce((sum, project) => sum + project.invested, 0);
  const averageROI = totalInvested > 0 ? (totalEarned / totalInvested) * 100 : 0;
  const topPerformer = projectROIs.reduce<ProjectROI | null>(
    (max, project) => (!max || project.roi > max.roi ? project : max),
    null,
  );

  res.json({
    summary: {
      totalEarned: Math.round(totalEarned),
      averageROI: Math.round(averageROI * 10) / 10,
      topPerformer: topPerformer?.projectTitle ?? "N/A",
      topPerformerROI: Math.round((topPerformer?.roi ?? 0) * 10) / 10,
      completedPayouts: payouts.length,
      latestPayoutAt: payouts[0]?.paidAt ?? null,
    },
    monthlyData,
    projectROIs: projectROIs.map((project) => ({
      ...project,
      earned: Math.round(project.earned),
      roi: Math.round(project.roi * 10) / 10,
      status: project.status,
    })),
    payouts,
  });
}


// ************** transactions ************
/**
 * GET /api/investors/transactions?type=&status=&page=&limit=
 */
export async function listMyTransactions(req: Request, res: Response): Promise<void> {
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
      .populate({ path: "relatedInvestment", populate: { path: "project", select: "title" } })
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Transaction.countDocuments(filter),
  ]);

  const projectIds = transactions.flatMap((transaction) => {
    const investmentProject = (transaction.relatedInvestment as any)?.project?._id;
    return [transaction.relatedProfitDistribution, investmentProject].filter(Boolean);
  });
  const projects = await Project.find({ _id: { $in: projectIds } }).select("title location").lean();
  const projectsById = new Map(projects.map((project) => [project._id.toString(), project]));

  const normalizedTransactions = transactions.map((transaction) => {
    const investmentProject = (transaction.relatedInvestment as any)?.project;
    const project = projectsById.get(
      (transaction.relatedProfitDistribution ?? investmentProject?._id)?.toString(),
    ) ?? investmentProject;

    return { ...transaction.toObject(), project: project ?? null };
  });

res.json({ transactions: normalizedTransactions, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/investors/transactions/:id/receipt
 * A structured JSON "money receipt" for a completed transaction (the
 * PRD's ট্রানজেকশন হিস্ট্রি ও মানি রিসিপ্ট feature). Rendering this as a
 * downloadable PDF is a natural follow-up once the frontend/export layer
 * is in place; for now the API returns the data a receipt needs.
 */
export async function getMyTransactionReceipt(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid transaction id", 400);
  }

  const transaction = await Transaction.findOne({ _id: id, user: req.user!._id }).populate({
    path: "relatedInvestment",
    populate: { path: "project", select: "title cropType" },
  });

  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }

  if (transaction.status !== TransactionStatus.SUCCESS) {
    throw new AppError("A receipt is only available for successfully completed transactions", 409);
  }

  res.json({
    receipt: {
      receiptNumber: transaction._id,
      issuedAt: transaction.updatedAt,
      amount: transaction.amount,
      type: transaction.type,
      paymentMethod: transaction.paymentMethod,
      gatewayTransactionId: transaction.gatewayTransactionId,
      relatedInvestment: transaction.relatedInvestment,
    },
  });
}

/**
 * GET /api/investors/profile
 * Returns combined User + InvestorProfile data for account settings page
 */
export async function getInvestorProfile(req: Request, res: Response): Promise<void> {
  const [user, profile] = await Promise.all([
    User.findById(req.user!._id).select("name email phone avatarUrl").lean(),
    InvestorProfile.findOne({ user: req.user!._id }).lean(),
  ]);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.json({ user, profile });
}

/**
 * PATCH /api/investors/profile
 * Updates investor profile: name, phone, address, preferences.maxRiskLevel
 * Syncs name with Clerk
 */
export async function updateInvestorProfile(req: Request, res: Response): Promise<void> {
  const body = req.body as UpdateInvestorProfileInput;

  const user = await User.findById(req.user!._id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  const profile = await InvestorProfile.findOne({ user: req.user!._id });
  if (!profile) {
    throw new AppError("Investor profile not found", 404);
  }

  // Update User fields
  if (body.name) user.name = body.name;
  if (body.phone !== undefined) user.phone = body.phone;

  // Update InvestorProfile preferences
  if (body.maxRiskLevel !== undefined) {
    profile.preferences.maxRiskLevel = body.maxRiskLevel;
  }

  await Promise.all([user.save(), profile.save()]);

  // Sync name with Clerk
  if (body.name) {
    const firstName = body.name.split(" ")[0];
    const lastName = body.name.substring(firstName.length).trim();
    await clerkClient.users.updateUser(user.clerkId, {
      firstName,
      lastName: lastName || undefined,
    });
  }

  // Return updated combined data
  const updatedUser = await User.findById(req.user!._id).select("name email phone avatarUrl").lean();
  const updatedProfile = await InvestorProfile.findOne({ user: req.user!._id }).lean();

  res.json({ user: updatedUser, profile: updatedProfile });
}
