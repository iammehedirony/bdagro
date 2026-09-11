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
