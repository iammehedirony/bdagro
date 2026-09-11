import { Request } from "express";

export interface Pagination {
  page: number;
  limit: number;
  skip: number;
}

/** Reads `?page=&limit=` off a request, clamped to sane bounds. */
export function getPagination(req: Request): Pagination {
  const page = Math.max(parseInt(String(req.query.page ?? "1"), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "10"), 10) || 10, 1), 50);
  return { page, limit, skip: (page - 1) * limit };
}

export function buildMeta(total: number, { page, limit }: Pagination) {
  return { total, page, limit, totalPages: Math.max(Math.ceil(total / limit), 1) };
}
