import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { TransactionStatus, TransactionType } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";

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
