import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server, Socket } from "socket.io";
import app from "./src/app";
import { connectDB } from "./src/config/db";
import { setIo } from "./src/realtime/io";
import { startBackgroundJobs } from "./src/jobs";

const PORT = process.env.PORT || 5000;

// Map to track userId -> socket.id for targeted emissions
const userSocketMap = new Map<string, string>();

function addUserSocket(userId: string, socketId: string) {
  userSocketMap.set(userId, socketId);
  console.log(`[Socket.io] User ${userId} mapped to socket ${socketId}`);
}

function removeUserSocket(userId: string) {
  userSocketMap.delete(userId);
  console.log(`[Socket.io] User ${userId} removed from socket map`);
}

function getUserSocket(userId: string): string | undefined {
  return userSocketMap.get(userId);
}

async function start(): Promise<void> {
  await connectDB();

  const server = http.createServer(app);

  // Socket.io setup - used for real-time loan status tracking,
  // live project funding updates, and admin notifications/alerts.
  const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:3000",
      credentials: true,
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Client joins a room keyed by their own userId after auth,
    // so we can emit targeted events like `loan:status_updated`.
    socket.on("join", (userId: string) => {
      if (userId) {
        socket.join(`user:${userId}`);
        addUserSocket(userId, socket.id);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
      // Find and remove user from map
      for (const [userId, socketId] of userSocketMap.entries()) {
        if (socketId === socket.id) {
          removeUserSocket(userId);
          break;
        }
      }
    });
  });

  // Expose the map getter for services to use
  (global as any).getUserSocket = getUserSocket;

  // Registers `io` in a singleton (src/realtime/io.ts) so both request
  // handlers AND background workers (no `req.app` available there) can
  // push real-time notifications.
  setIo(io);

  server.listen(PORT, () => {
    console.log(
      `[Server] Bdagroonline backend running on port ${PORT} (${process.env.NODE_ENV || "development"})`
    );
  });

  // Background jobs (BullMQ profit distribution due-date/overdue checks) need
  // Redis. Started without blocking server startup — if Redis isn't
  // running locally, the API still serves requests; only the scheduled
  // checks fail (logged, not fatal).
  startBackgroundJobs().catch((err) => {
    console.error("[Jobs] Failed to start background jobs (is Redis running?):", err);
  });
}

start().catch((err) => {
  console.error("[Server] Failed to start:", err);
  process.exit(1);
});
