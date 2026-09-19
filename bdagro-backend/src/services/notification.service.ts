import type { Types } from "mongoose";
import { Notification } from "../models/Notification";
import { getIo } from "../realtime/io";
import { NotificationType } from "../utils/constants";

interface NotifyPayload {
  title: string;
  message: string;
  type?: NotificationType;
  meta?: Record<string, unknown>;
}

function getUserSocket(userId: string): string | undefined {
  return (global as any).getUserSocket?.(userId);
}

/**
 * Persists a Notification and, if the target user is currently online,
 * pushes it live over Socket.io directly to their socket.id.
 *
 * Uses the `getIo()` singleton (src/realtime/io.ts) rather than requiring
 * an Express `req.app`, so this can be called from both HTTP request
 * handlers and background workers (e.g. the BullMQ profit distribution checks).
 *
 * Emits `new-notification` event (for frontend popup) AND `notification:new` 
 * event (for existing room-based listeners like notification pages).
 */
export async function notifyUser(
  userId: Types.ObjectId | string,
  payload: NotifyPayload
) {
  const userIdStr = userId.toString();
  const notification = await Notification.create({
    user: userIdStr,
    title: payload.title,
    message: payload.message,
    type: payload.type ?? NotificationType.GENERAL,
    meta: payload.meta ?? {},
  });

  const io = getIo();
  if (io) {
    // Emit to the room for any existing listeners (e.g., notification pages)
    io.to(`user:${userIdStr}`).emit("notification:new", notification);

    // Also emit directly to the user's socket for the real-time popup
    const socketId = getUserSocket(userIdStr);
    if (socketId) {
      io.to(socketId).emit("new-notification", notification);
    }
  }

  return notification;
}
