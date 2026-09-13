import { Request, Response } from "express";
import { Notification } from "../models/Notification";
import { AppError } from "../middlewares/errorHandler";
import { getPagination, buildMeta } from "../utils/pagination";
import mongoose from "mongoose";

/**
 * GET user's notifications
 * Matches /api/farmers/notifications OR /api/investors/notifications
 */
export async function listMyNotifications(req: Request, res: Response): Promise<void> {
  const { isRead } = req.query;
  const pagination = getPagination(req);

  const filter: Record<string, unknown> = { user: req.user!._id };
  
  if (isRead !== undefined) {
    filter.isRead = isRead === "true";
  }

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip(pagination.skip)
      .limit(pagination.limit),
    Notification.countDocuments(filter),
  ]);

  res.json({ notifications, meta: buildMeta(total, pagination) });
}

/**
 * PUT user's notification / mark as read
 */
export async function markNotificationAsRead(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    throw new AppError("Invalid notification id", 400);
  }

  const notification = await Notification.findOneAndUpdate(
    { _id: id, user: req.user!._id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new AppError("Notification not found", 404);
  }

  res.json({ notification });
}

/**
 * PUT mark all read
 */
export async function markAllNotificationsAsRead(req: Request, res: Response): Promise<void> {
  await Notification.updateMany({ user: req.user!._id, isRead: false }, { isRead: true });
  res.json({ success: true, message: "All notifications marked as read" });
}
