import { Request, Response } from "express";
import mongoose from "mongoose";
import { Transaction } from "../models/Transaction";
import { TransactionType, TransactionStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";

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
  const pagination = getPagination(req);

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
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Transaction.countDocuments(filter),
  ]);

  res.json({ transactions, meta: buildMeta(total, pagination) });
}
