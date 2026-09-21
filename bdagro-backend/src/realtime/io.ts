import type { Server, Socket } from "socket.io";

let ioInstance: Server | null = null;

// Map to track userId -> socket.id for targeted emissions
// Key is MongoDB ObjectId string (the room name)
const userSocketMap = new Map<string, string>();

function addUserSocket(userId: string, socketId: string): void {
  const key = String(userId);
  userSocketMap.set(key, socketId);
  console.log(`[Socket.io] [MAP] User "${key}" mapped to socket ${socketId} (map size: ${userSocketMap.size})`);
}

function removeUserSocket(userId: string): void {
  const key = String(userId);
  userSocketMap.delete(key);
  console.log(`[Socket.io] [MAP] User "${key}" removed from socket map (map size: ${userSocketMap.size})`);
}

export function getUserSocket(userId: string): string | undefined {
  return userSocketMap.get(String(userId));
}

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

/** Initialize Socket.io connection handlers. Call once after creating the Server. */
export function initializeSocketHandlers(io: Server): void {
  io.on("connection", (socket: Socket) => {
    const socketId = socket.id;
    console.log(`[Socket.io] [CONNECT] Client connected: ${socketId}`);
    console.log(`[Socket.io] [CONNECT] Handshake auth:`, socket.handshake.auth);

    // Client joins a room keyed by their MongoDB _id
    socket.on("join", (receivedId: unknown) => {
      // FORCE string conversion - handle any type sent by frontend
      const userId = String(receivedId ?? "");
      console.log(`[Socket.io] [JOIN] Received join event. Raw: "${receivedId}" (type: ${typeof receivedId}, constructor: ${receivedId?.constructor?.name}), Converted: "${userId}"`);

      if (userId && userId !== "undefined" && userId !== "null") {
        // FORCE string conversion for room name
        const roomName = `user:${String(userId)}`;
        socket.join(roomName);
        addUserSocket(userId, socketId);
        // DEBUG: Log the EXACT room joined
        console.log(`[Socket.io] [JOIN] [ROOM] SOCKET ACTUALLY JOINED ROOM: "${roomName}"`);
        // Send acknowledgment back to client
        socket.emit("join:ack", { success: true, room: roomName, userId });
      } else {
        console.log(`[Socket.io] [JOIN] Empty/invalid userId received, ignoring. Raw: "${receivedId}"`);
        socket.emit("join:ack", { success: false, error: "Invalid userId" });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`[Socket.io] [DISCONNECT] Client disconnected: ${socketId}, reason: ${reason}`);
      // Find and remove user from map
      for (const [userId, sid] of userSocketMap.entries()) {
        if (sid === socketId) {
          removeUserSocket(userId);
          break;
        }
      }
    });

    socket.on("error", (err) => {
      console.error(`[Socket.io] [ERROR] Socket error:`, err);
    });
  });

  // Expose the map getter for services to use
  (global as any).getUserSocket = getUserSocket;
}