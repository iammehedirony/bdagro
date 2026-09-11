import { Request, Response, NextFunction } from "express";
import { ZodTypeAny } from "zod";
import { AppError } from "./errorHandler";

/**
 * Validates `req[source]` against a Zod schema, replacing it with the
 * parsed (and type-coerced) result on success. Throws a 400 AppError
 * with a readable message on failure, caught by the global error handler.
 */
export function validate(schema: ZodTypeAny, source: "body" | "query" | "params" = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);
    if (!result.success) {
      const message = result.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join("; ");
      throw new AppError(message, 400);
    }
    if (source === "query") {
      // Express 5 defines `req.query` as a getter-only property (no
      // setter) on its prototype, so a plain `req.query = ...` throws a
      // TypeError at runtime. Object.defineProperty shadows it with a
      // writable own-property on this request instance instead.
      Object.defineProperty(req, "query", { value: result.data, writable: true, configurable: true });
    } else {
      req[source] = result.data;
    }
    next();
  };
}
