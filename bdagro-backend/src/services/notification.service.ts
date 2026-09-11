import type { Types } from "mongoose";
import { Notification } from "../models/Notification";
import { getIo } from "../realtime/io";

interface NotifyPayload {
  title: string;
  message: string;
  type?: string;
  meta?: Record<string, unknown>;
}

/**
 * Persists a Notification and, if a client for that user is connected,
 * pushes it live over the Socket.io room joined in server.ts
 * (`socket.on("join", userId) -> socket.join(\`user:${userId}\`)`).
 *
 * Uses the `getIo()` singleton (src/realtime/io.ts) rather than requiring
 * an Express `req.app`, so this can be called from both HTTP request
 * handlers and background workers (e.g. the BullMQ installment checks).
 */
export async function notifyUser(
  userId: Types.ObjectId | string,
  payload: NotifyPayload
) {
  const notification = await Notification.create({
    user: userId,
    title: payload.title,
    message: payload.message,
    type: payload.type ?? "general",
    meta: payload.meta ?? {},
  });

  getIo()?.to(`user:${userId}`).emit("notification:new", notification);

  return notification;
}
