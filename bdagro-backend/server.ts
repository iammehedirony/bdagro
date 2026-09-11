import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./src/app";
import { connectDB } from "./src/config/db";
import { setIo } from "./src/realtime/io";
import { startBackgroundJobs } from "./src/jobs";

const PORT = process.env.PORT || 5000;

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

  io.on("connection", (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    // Client joins a room keyed by their own userId after auth,
    // so we can emit targeted events like `loan:status_updated`.
    socket.on("join", (userId: string) => {
      if (userId) socket.join(`user:${userId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  // Registers `io` in a singleton (src/realtime/io.ts) so both request
  // handlers AND background workers (no `req.app` available there) can
  // push real-time notifications.
  setIo(io);

  server.listen(PORT, () => {
    console.log(
      `[Server] Bdagroonline backend running on port ${PORT} (${process.env.NODE_ENV || "development"})`
    );
  });

  // Background jobs (BullMQ installment due-date/overdue checks) need
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
