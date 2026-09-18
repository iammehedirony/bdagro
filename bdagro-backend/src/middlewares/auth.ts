import { Request, Response, NextFunction } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { User } from "../models/User";
import { UserStatus } from "../utils/constants";
import { upsertUser, normalizeFromApi } from "../services/user.service";

/**
 * Must run after `requireAuth()` (or at least `clerkMiddleware()`) so that
 * `getAuth(req)` has a Clerk session to read.
 *
 * Resolves the Clerk session into our local `User` document and attaches
 * it as `req.user`. If the webhook hasn't landed yet (e.g. local dev
 * without a webhook tunnel, or a race right after sign-up), it self-heals
 * by fetching the user from Clerk directly and upserting locally.
 *
 * Responds 404 if the account genuinely doesn't exist yet locally and has
 * no resolvable role — the client should call POST /api/auth/select-role
 * first.
 */
export async function syncClerkUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  const {isAuthenticated, userId } = getAuth(req);

  if (!isAuthenticated || !userId) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    const clerkUser = await clerkClient.users.getUser(userId);
    user = await upsertUser(normalizeFromApi(clerkUser));
  }

  if (!user) {
    res.status(404).json({
      message: "No profile found for this account yet. Please select a role to continue.",
      code: "ROLE_NOT_SELECTED",
    });
    return;
  }

  if (user.status !== UserStatus.ACTIVE) {
    res.status(403).json({ message: `Account is ${user.status}. Contact support.` });
    return;
  }

  user.lastLoginAt = new Date();
  await user.save();

  req.user = user;
  next();
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = getAuth(req);
  console.log(req.headers, req.body)
  console.log("userId", userId);
  if (!userId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
};