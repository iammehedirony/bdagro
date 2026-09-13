import { Request, Response } from "express";
import mongoose from "mongoose";
import { Installment } from "../models/Installment";
import { Transaction } from "../models/Transaction";
import { InstallmentStatus, TransactionType, TransactionStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { InitiatePaymentInput } from "../validators/farmer.validator";
import { SubmitProfitReportInput, MarkPaidInput } from "../validators/installment.validator";
import { getPagination, buildMeta } from "../utils/pagination";

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
