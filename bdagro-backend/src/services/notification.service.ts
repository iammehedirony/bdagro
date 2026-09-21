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
  // FORCE string conversion - handle ObjectId, string, or any other type
  const userIdStr = String(userId);
  console.log(`[notifyUser] Called for userId: "${userIdStr}" (type: ${typeof userId}, constructor: ${userId?.constructor?.name}), notification type: ${payload.type ?? NotificationType.GENERAL}`);
  
  const notification = await Notification.create({
    user: userIdStr,
    title: payload.title,
    message: payload.message,
    type: payload.type ?? NotificationType.GENERAL,
    meta: payload.meta ?? {},
  });

  console.log(`[notifyUser] Notification created in DB: ${notification._id}`);

  const io = getIo();
  if (io) {
    // FORCE string conversion for room name
    const roomName = `user:${String(userIdStr)}`;
    
    // DEBUG: Log the EXACT room being emitted to
    console.log(`[notifyUser] [ROOM] ACTUAL ROOM EMITTING TO: "${roomName}"`);
    console.log(`[notifyUser] [ROOM] userIdStr value: "${userIdStr}", length: ${userIdStr.length}`);
    
    // Single emission to the MongoDB _id room (frontend joins this exact room)
    console.log(`[notifyUser] Emitting "new-notification" to room "${roomName}"`);
    io.to(roomName).emit("new-notification", notification);

    // Also emit notification:new for notification pages
    console.log(`[notifyUser] Emitting "notification:new" to room "${roomName}"`);
    io.to(roomName).emit("notification:new", notification);
  } else {
    console.error(`[notifyUser] Socket.io instance not available!`);
  }

  return notification;
}
