import { Request, Response } from "express";
import { LoanProduct } from "../models/LoanProduct";
import { LoanCategory } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";

/**
 * GET /api/loan-products?category=&page=&limit=
 * The farmer "লোন এক্সপ্লোরার" — browse available loan products.
 * Read-only catalog; only Admin (future route) can create/edit entries.
 */
export async function listLoanProducts(req: Request, res: Response): Promise<void> {
  const { category } = req.query as { category?: LoanCategory };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = { isActive: true };
  if (category) {
    if (!Object.values(LoanCategory).includes(category)) {
      throw new AppError("Invalid category filter", 400);
    }
    filter.category = category;
  }

  const [products, total] = await Promise.all([
    LoanProduct.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit),
    LoanProduct.countDocuments(filter),
  ]);

  res.json({ products, meta: buildMeta(total, pagination) });
}
