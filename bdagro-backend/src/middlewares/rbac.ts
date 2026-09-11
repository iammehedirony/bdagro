import { Request, Response, NextFunction } from "express";
import { UserRole, UserStatus } from "../utils/constants";

/**
 * RBAC middleware factory.
 * Usage: router.get("/admin/stats", requireAuth, requireRole(UserRole.ADMIN), handler)
 *
 * Assumes an earlier auth middleware (Clerk) has already attached
 * `req.user` = the Mongoose User document for the logged-in account.
 * That Clerk-integration middleware will be added in the Auth step.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(" or ")}`,
      });
      return;
    }

    if (req.user.status !== UserStatus.ACTIVE) {
      res.status(403).json({
        message: `Account is ${req.user.status}. Contact support.`,
      });
      return;
    }

    next();
  };
}
