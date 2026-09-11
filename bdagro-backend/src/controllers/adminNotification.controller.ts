import { Request, Response } from "express";
import { User } from "../models/User";
import { AppError } from "../middlewares/errorHandler";
import { notifyUser } from "../services/notification.service";
import { SendNotificationInput } from "../validators/admin.validator";

/**
 * POST /api/admin/notifications
 * Manually push a real-time notification/alert to specific users
 * (`userIds`) and/or everyone with a given `role` — the PRD's
 * "নির্দিষ্ট ইভেন্টে ইউজারদের কাছে রিয়েল-টাইম নোটিফিকেশন পাঠানো".
 */
export async function sendNotification(req: Request, res: Response): Promise<void> {
  const body = req.body as SendNotificationInput;

  let targetUserIds: string[] = body.userIds ?? [];

  if (body.role) {
    const usersWithRole = await User.find({ role: body.role }).select("_id");
    targetUserIds = [...targetUserIds, ...usersWithRole.map((u) => u._id.toString())];
  }

  const uniqueIds = Array.from(new Set(targetUserIds));
  if (uniqueIds.length === 0) {
    throw new AppError("No matching recipients found", 400);
  }

  const notifications = await Promise.all(
    uniqueIds.map((userId) =>
      notifyUser(userId, { title: body.title, message: body.message, type: body.type })
    )
  );

  res.status(201).json({ sentCount: notifications.length });
}
