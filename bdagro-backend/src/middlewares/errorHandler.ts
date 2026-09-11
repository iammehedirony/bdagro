import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

/** Custom error class so controllers can throw with an explicit HTTP status. */
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

interface MongoDuplicateKeyError extends Error {
  code: number;
  keyPattern?: Record<string, unknown>;
}

/**
 * Centralized error handler. Express 5 natively forwards rejected
 * promises from async route handlers/middleware to this handler — no
 * try/catch boilerplate or the old `express-async-errors` package needed
 * in every controller.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error("[Error]", err);

  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).json({
      message: "Validation failed",
      errors: Object.values(err.errors).map((e) => e.message),
    });
    return;
  }

  if (typeof err === "object" && err !== null && (err as MongoDuplicateKeyError).code === 11000) {
    const dupErr = err as MongoDuplicateKeyError;
    res.status(409).json({
      message: "Duplicate value",
      field: Object.keys(dupErr.keyPattern || {})[0],
    });
    return;
  }

  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err instanceof Error ? err.message : "Internal Server Error";

  res.status(statusCode).json({ message });
}

export function notFound(req: Request, res: Response): void {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}
