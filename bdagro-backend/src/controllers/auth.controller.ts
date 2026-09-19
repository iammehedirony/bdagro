import { Request, Response } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import { User } from "../models/User";
import { selectRoleSchema } from "../validators/auth.validator";
import { AppError } from "../middlewares/errorHandler";
import { UserRole } from "../utils/constants";
import { addEmailJob } from "../jobs";

/**
 * GET /api/auth/me
 * Returns the local profile for the currently authenticated account.
 * Requires `syncClerkUser` to have already run and set `req.user`.
 */
export async function getMe(req: Request, res: Response): Promise<void> {
  res.json({ user: req.user });
}

/**
 * POST /api/auth/select-role
 * One-time role selection for accounts that signed up without a role
 * already present in Clerk metadata. Only usable once — afterwards the
 * account's role is immutable through this endpoint (role changes after
 * that require an Admin action).
 *
 * Runs BEFORE `syncClerkUser`, since that middleware would 404 an account
 * that has no role yet — this route is exactly how such an account gets
 * created in the first place.
 */
export async function selectRole(req: Request, res: Response): Promise<void> {
  const { userId } = getAuth(req);
  if (!userId) {
    throw new AppError("Authentication required", 401);
  }

  const parsed = selectRoleSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(parsed.error.issues.map((e) => e.message).join(", "), 400);
  }

  const existing = await User.findOne({ clerkId: userId });
  if (existing) {
    throw new AppError("Role has already been set for this account", 409);
  }

  const clerkUser = await clerkClient.users.getUser(userId);
  const email = clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;
  const name = clerkUser.fullName || email || "Unnamed User";

  const user = await User.create({
    clerkId: userId,
    name,
    email,
    phone: parsed.data.phone,
    avatarUrl: clerkUser.imageUrl ?? null,
    role: parsed.data.role,
  });

  // Persist the choice back to Clerk's publicMetadata too, so it's
  // available immediately on the next webhook/session without a DB lookup.
   // Clerk API ব্যবহার করে ইউজারের publicMetadata আপডেট করা
    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: parsed.data.role,
        ...(parsed.data.role === "farmer" && { nidStatus: "unsubmitted" }),
      },
    });

  // Send welcome email for Farmer and Investor roles (not Admin)
  if (parsed.data.role === UserRole.FARMER || parsed.data.role === UserRole.INVESTOR) {
    await addEmailJob({
      type: "welcome",
      data: {
        userId: user._id.toString(),
        userName: name,
        userEmail: email!,
        role: parsed.data.role,
      },
    });
  }

  res.status(201).json({ user });
}
