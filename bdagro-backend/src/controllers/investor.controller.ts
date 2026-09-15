import { Request, Response } from "express";
import mongoose from "mongoose";
import { Investment } from "../models/Investment";
import { Project } from "../models/Project";
import { Transaction } from "../models/Transaction";
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
import { UpdateInvestorSettingsInput } from "../validators/settings.validator";
import { InvestorProfile } from "../models";


// ************** portfolio dashboard ************

interface PortfolioAggregate {
  totalInvested: number;
  totalReturned: number;
  projectIds: unknown[];
}

/**
 * GET /api/investors/portfolio
 * The "পোর্টফোলিও ড্যাশবোর্ড" — total invested, distinct running projects,
 * and ROI-to-date, computed live from completed Investments (rather than
 * trusting only the denormalized InvestorProfile counters).
 */
export async function getPortfolio(req: Request, res: Response): Promise<void> {
  const investorId = req.user!._id;

  const [totals] = await Investment.aggregate<PortfolioAggregate>([
    { $match: { investor: investorId, status: InvestmentStatus.COMPLETED } },
    {
      $group: {
        _id: null,
        totalInvested: { $sum: "$amount" },
        totalReturned: { $sum: "$returnAmount" },
        projectIds: { $addToSet: "$project" },
      },
    },
  ]);

  const recentInvestments = await Investment.find({ investor: investorId })
    .populate("project", "title cropType riskLevel expectedROIPercent status")
    .sort({ createdAt: -1 })
    .limit(5);

  res.json({
    portfolio: {
      totalInvested: totals?.totalInvested ?? 0,
      totalReturned: totals?.totalReturned ?? 0,
      activeProjectsCount: totals?.projectIds?.length ?? 0,
    },
    recentInvestments,
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

/**
 * GET /api/investors/investments?status=&page=&limit=
 */
export async function listMyInvestments(req: Request, res: Response): Promise<void> {
  const { status } = req.query as { status?: InvestmentStatus };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = { investor: req.user!._id };
  if (status) {
    if (!Object.values(InvestmentStatus).includes(status)) {
      throw new AppError("Invalid status filter", 400);
    }
    filter.status = status;
  }

  const [investments, total] = await Promise.all([
    Investment.find(filter)
      .populate("project", "title cropType riskLevel expectedROIPercent status")
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Investment.countDocuments(filter),
  ]);

  res.json({ investments, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/investors/investments/:id
 */
export async function getMyInvestmentById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid investment id", 400);
  }

  const investment = await Investment.findOne({ _id: id, investor: req.user!._id }).populate(
    "project",
    "title cropType riskLevel expectedROIPercent status fundingGoal fundedAmount"
  );

  if (!investment) {
    throw new AppError("Investment not found", 404);
  }

  res.json({ investment });
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
  invested: number;
  earned: number;
  roi: number;
  status: string;
}

/**
 * GET /api/investors/roi-tracking
 * Returns monthly ROI chart data and per-project ROI breakdown
 */
export async function getROITracking(req: Request, res: Response): Promise<void> {
  const investorId = req.user!._id;

  // Get all investments for this investor
  const investments = await Investment.find({ investor: investorId })
    .populate("project", "title status")
    .lean();

  // Get all transactions related to returns (profit distributions)
  const transactions = await Transaction.find({
    user: investorId,
    type: TransactionType.INVESTMENT,
    status: TransactionStatus.SUCCESS,
    relatedInvestment: { $in: investments.map((inv) => inv._id) },
  })
    .sort({ createdAt: 1 })
    .lean();

  // Calculate monthly ROI data for the last 12 months
  const monthlyData: MonthlyROI[] = [];
  const now = new Date();

  for (let i = 11; i >= 0; i--) {
    const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStart = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1);
    const monthEnd = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0, 23, 59, 59);

    const monthTransactions = transactions.filter(
      (t) => new Date(t.createdAt) >= monthStart && new Date(t.createdAt) <= monthEnd
    );

    const monthlyAmount = monthTransactions.reduce((sum, t) => {
      // Calculate profit portion (difference between return and principal)
      const investment = investments.find((inv) => inv._id.toString() === t.relatedInvestment?.toString());
      if (investment) {
        // Assume transactions include both principal + profit
        // For ROI tracking, we only want the profit portion
        const profit = t.amount - investment.amount;
        return sum + Math.max(profit, 0);
      }
      return sum;
    }, 0);

    monthlyData.push({
      month: targetDate.toLocaleString("en-US", { month: "short" }),
      year: targetDate.getFullYear(),
      amount: Math.round(monthlyAmount),
      count: monthTransactions.length,
    });
  }

  // Calculate per-project ROI
  const projectROIs: ProjectROI[] = await Promise.all(
    investments.map(async (investment) => {
      // Get all return transactions for this investment
      const returnTransactions = await Transaction.find({
        user: investorId,
        relatedInvestment: investment._id,
        type: TransactionType.INVESTMENT,
        status: TransactionStatus.SUCCESS,
      }).lean();

      const totalReturns = returnTransactions.reduce((sum, t) => sum + t.amount, 0);
      const profit = totalReturns - investment.amount;
      const roiPercent = investment.amount > 0 ? (profit / investment.amount) * 100 : 0;

      return {
        projectId: investment.project._id.toString(),
        projectTitle: (investment.project as any)?.title || "Unknown Project",
        invested: investment.amount,
        earned: Math.round(profit),
        roi: Math.round(roiPercent * 10) / 10, // Round to 1 decimal
        status: (investment.project as any)?.status || investment.status,
      };
    })
  );

  // Calculate summary stats
  const totalEarned = projectROIs.reduce((sum, p) => sum + p.earned, 0);
  const totalInvested = projectROIs.reduce((sum, p) => sum + p.invested, 0);
  const averageROI = totalInvested > 0 ? (totalEarned / totalInvested) * 100 : 0;
  const topPerformer = projectROIs.reduce(
    (max, p) => (p.roi > max.roi ? p : max),
    { projectTitle: "N/A", roi: 0 }
  );

  res.json({
    summary: {
      totalEarned: Math.round(totalEarned),
      averageROI: Math.round(averageROI * 10) / 10,
      topPerformer: topPerformer.projectTitle,
      topPerformerROI: topPerformer.roi,
      completedPayouts: transactions.length,
    },
    monthlyData,
    projectROIs,
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

  res.json({ transactions, meta: buildMeta(total, pagination) });
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


// ************** settings ************
/**
 * PUT /api/investors/settings
 * Updates investor-specific settings (risk tolerance, payment methods, notifications)
 */
export async function updateInvestorSettings(req: Request, res: Response): Promise<void> {
  const body = req.body as UpdateInvestorSettingsInput;

  const profile = await InvestorProfile.findOne({ user: req.user!._id });
  if (!profile) {
    throw new AppError("Investor profile not found", 404);
  }

  if (!profile.settings) {
    profile.settings = {
      notifyNewProjects: true,
      notifyFundingUpdates: true,
      notifyPaymentConfirmation: true,
      notifyPromotional: false,
    };
  }

  // Update settings
  if (body.riskTolerance !== undefined) profile.settings.riskTolerance = body.riskTolerance;
  if (body.defaultPaymentGateway !== undefined)
    profile.settings.defaultPaymentGateway = body.defaultPaymentGateway;
  if (body.returnAccountNumber !== undefined)
    profile.settings.returnAccountNumber = body.returnAccountNumber;
  if (body.notifyNewProjects !== undefined) profile.settings.notifyNewProjects = body.notifyNewProjects;
  if (body.notifyFundingUpdates !== undefined)
    profile.settings.notifyFundingUpdates = body.notifyFundingUpdates;
  if (body.notifyPaymentConfirmation !== undefined)
    profile.settings.notifyPaymentConfirmation = body.notifyPaymentConfirmation;
  if (body.notifyPromotional !== undefined) profile.settings.notifyPromotional = body.notifyPromotional;

  await profile.save();

  res.json({ settings: profile.settings, message: "Settings updated successfully" });
}
