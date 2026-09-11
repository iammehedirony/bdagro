import { Request, Response } from "express";
import mongoose from "mongoose";
import { clerkClient } from "@clerk/express";
import { User } from "../models/User";
import { UserRole, UserStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";
import { notifyUser } from "../services/notification.service";
import { UpdateUserStatusInput, UpdateUserRoleInput } from "../validators/admin.validator";

/**
 * GET /api/admin/users?role=&status=&search=&page=&limit=
 */
export async function listUsers(req: Request, res: Response): Promise<void> {
  const { role, status, search } = req.query as { role?: UserRole; status?: UserStatus; search?: string };
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = {};
  if (role) {
    if (!Object.values(UserRole).includes(role)) throw new AppError("Invalid role filter", 400);
    filter.role = role;
  }
  if (status) {
    if (!Object.values(UserStatus).includes(status)) throw new AppError("Invalid status filter", 400);
    filter.status = status;
  }
  if (search) {
    const re = new RegExp(search.trim(), "i");
    filter.$or = [{ name: re }, { email: re }, { phone: re }];
  }

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit),
    User.countDocuments(filter),
  ]);

  res.json({ users, meta: buildMeta(total, pagination) });
}

/**
 * GET /api/admin/users/:id
 */
export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid user id", 400);
  }
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }
  res.json({ user });
}

/**
 * PATCH /api/admin/users/:id/status
 * Suspend, block, or reactivate any account except the acting admin's own.
 */
export async function updateUserStatus(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid user id", 400);
  }
  if (id === req.user!._id.toString()) {
    throw new AppError("You cannot change your own account status", 400);
  }

  const { status, reason } = req.body as UpdateUserStatusInput;

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.status = status;
  user.statusReason = reason ?? null;
  await user.save();

  if (status !== UserStatus.ACTIVE) {
    await notifyUser(user._id, {
      title: "Account status changed",
      message: `Your account has been ${status}${reason ? `: ${reason}` : ""}.`,
      type: "account_status",
    });
  }

  res.json({ user });
}

/**
 * PATCH /api/admin/users/:id/role
 * Assigns a new role, including promoting an account to Admin — the
 * PRD's "নতুন অ্যাডমিন রোল অ্যাসাইন করা". Also mirrors the change into
 * Clerk's publicMetadata so it's consistent on the next login/webhook.
 */
export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid user id", 400);
  }
  if (id === req.user!._id.toString()) {
    throw new AppError("You cannot change your own role", 400);
  }

  const { role } = req.body as UpdateUserRoleInput;

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  user.role = role;
  await user.save();

  await clerkClient.users.updateUserMetadata(user.clerkId, { publicMetadata: { role } });

  await notifyUser(user._id, {
    title: "Account role updated",
    message: `Your account role has been changed to ${role}.`,
    type: "account_role",
  });

  res.json({ user });
}
