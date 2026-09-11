import { Request, Response } from "express";
import mongoose from "mongoose";
import { Transaction } from "../models/Transaction";
import { TransactionStatus, TransactionType } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";

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
