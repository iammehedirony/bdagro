import type { Server } from "socket.io";

let ioInstance: Server | null = null;

/** Called once from server.ts right after the Socket.io server is created. */
export function setIo(io: Server): void {
  ioInstance = io;
}

/**
 * Returns the live Socket.io server, or `null` if called before server.ts
 * has initialized it (e.g. during very early boot). Kept as a plain
 * getter (rather than requiring `req.app`) so background workers —
 * which have no Express request/app context — can push real-time
 * notifications too.
 */
export function getIo(): Server | null {
  return ioInstance;
}
