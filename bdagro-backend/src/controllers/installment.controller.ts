import { Request, Response } from "express";
import mongoose from "mongoose";
import { Installment } from "../models/Installment";
import { Transaction } from "../models/Transaction";
import { InstallmentStatus, TransactionType, TransactionStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { InitiatePaymentInput } from "../validators/farmer.validator";
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
