"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useUser } from "@clerk/nextjs";
import { useApi } from "@/lib/useApi";
import { getMe } from "@/lib/services/auth.service";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  emit: (event: string, data: unknown) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const api = useApi();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mongoId, setMongoId] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Fetch MongoDB user ID on user change
  useEffect(() => {
    if (!isLoaded || !user) {
      setMongoId(null);
      return;
    }

    let cancelled = false;

    async function fetchMongoId() {
      try {
        console.log("[SocketContext] Fetching MongoDB user profile for Clerk ID:", user?.id);
        const response = await getMe(api);
        if (!cancelled && response.user?.id) {
          const id = response.user.id;
          console.log("[SocketContext] Got MongoDB _id:", id);
          console.log("[SocketContext] Now initializing socket with ID:", id);
          setMongoId(id);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("[SocketContext] Failed to fetch MongoDB user profile:", err);
        }
      }
    }

    fetchMongoId();

    return () => {
      cancelled = true;
    };
  }, [user, isLoaded, api]);

  // Socket initialization - runs when mongoId state changes
  useEffect(() => {
    if (!isLoaded || !user) {
      console.log("[SocketContext] Not loaded or no user, skipping connection");
      return;
    }

    if (!mongoId) {
      console.log("[SocketContext] Waiting for MongoDB _id...");
      return;
    }

    console.log("[SocketContext] Initializing socket connection for user:", user.id, "with MongoDB _id:", mongoId);
    console.log("[SocketContext] Socket URL:", SOCKET_URL);

    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      auth: {
        userId: mongoId,
      },
    });

    newSocket.on("connect", () => {
      console.log("[SocketContext] [CONNECT] Socket connected:", newSocket.id, "| transport:", newSocket.io.engine.transport.name);
      // FORCE string conversion for join emission
      const joinId = String(mongoId);
      console.log("[SocketContext] [CONNECT] Emitting join for MongoDB _id:", joinId, "(type:", typeof mongoId, ")");
      setIsConnected(true);
      newSocket.emit("join", joinId);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("[SocketContext] [DISCONNECT] Socket disconnected:", reason, "| was connected:", newSocket.connected);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("[SocketContext] [CONNECT_ERROR] Connection error:", error.message);
      setIsConnected(false);
    });

    newSocket.on("reconnect", (attemptNumber) => {
      console.log("[SocketContext] [RECONNECT] Reconnected after", attemptNumber, "attempts | transport:", newSocket.io.engine.transport.name);
      const joinId = String(mongoId);
      console.log("[SocketContext] [RECONNECT] Re-emitting join for MongoDB _id:", joinId);
      newSocket.emit("join", joinId);
    });

    newSocket.on("reconnect_attempt", (attemptNumber) => {
      console.log("[SocketContext] [RECONNECT_ATTEMPT] Attempt:", attemptNumber);
    });

    newSocket.on("reconnect_failed", () => {
      console.error("[SocketContext] [RECONNECT_FAILED] Reconnection failed");
    });

    // Listen for join acknowledgment if server sends one
    newSocket.on("join:ack", (data: any) => {
      console.log("[SocketContext] [JOIN_ACK] Server acknowledged join:", data);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      console.log("[SocketContext] [CLEANUP] Cleaning up socket:", newSocket.id);
      newSocket.off("connect");
      newSocket.off("disconnect");
      newSocket.off("connect_error");
      newSocket.off("reconnect");
      newSocket.off("reconnect_attempt");
      newSocket.off("reconnect_failed");
      newSocket.off("join:ack");
      newSocket.disconnect();
      socketRef.current = null;
      setSocket(null);
      setIsConnected(false);
    };
  }, [user, isLoaded, mongoId]);

  const emit = useCallback((event: string, data: unknown) => {
    console.log("[SocketContext] [EMIT] Emitting event:", event, data);
    socketRef.current?.emit(event, data);
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, emit }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}