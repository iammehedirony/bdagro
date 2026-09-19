"use client";

import React, { useEffect, useState } from "react";
import { X, CheckCircle2, TrendingUp, AlertTriangle, Banknote, ShieldCheck, FileText } from "lucide-react";
import { useSocket } from "@/context/SocketContext";

interface RealtimeNotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  meta: Record<string, unknown>;
}

interface NotificationToastProps {
  notification: RealtimeNotification;
  onClose: (id: string) => void;
}

function NotificationToast({ notification, onClose }: NotificationToastProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev - 100 / 50;
        if (next <= 0) {
          onClose(notification._id);
          return 0;
        }
        return next;
      });
    }, 100);

    return () => clearInterval(interval);
  }, [notification._id, onClose]);

  const toneMap = {
    emerald: { bar: "bg-emerald-700", iconBg: "bg-emerald-50", iconColor: "text-emerald-700" },
    amber: { bar: "bg-amber-500", iconBg: "bg-amber-50", iconColor: "text-amber-700" },
    orange: { bar: "bg-orange-500", iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  };

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "check-circle": CheckCircle2,
    "trending-up": TrendingUp,
    "alert-triangle": AlertTriangle,
    "banknote": Banknote,
    "shield-check": ShieldCheck,
    "file-text": FileText,
  };

  const typeConfig: Record<string, { icon: string; tone: "emerald" | "amber" | "orange" }> = {
    verification: { icon: "shield-check", tone: "emerald" },
    project: { icon: "file-text", tone: "amber" },
    investment: { icon: "trending-up", tone: "emerald" },
    funding: { icon: "trending-up", tone: "amber" },
    profit_distribution: { icon: "banknote", tone: "emerald" },
    payment: { icon: "banknote", tone: "emerald" },
    transaction: { icon: "banknote", tone: "emerald" },
    general: { icon: "alert-triangle", tone: "orange" },
    system: { icon: "alert-triangle", tone: "orange" },
  };

  const config = typeConfig[notification.type] ?? { icon: "check-circle", tone: "emerald" as const };
  const Icon = iconMap[config.icon] ?? CheckCircle2;
  const t = toneMap[config.tone];

  return (
    <div className="w-80 bg-white border border-stone-200 shadow-lg animate-slide-in">
      <div className="flex overflow-hidden">
        <div className={`w-1 ${t.bar} shrink-0`} />
        <div className="flex-1 p-4">
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${t.iconBg}`}>
              <Icon className={`w-4 h-4 ${t.iconColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm text-stone-900">{notification.title}</div>
              <div className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                {notification.message}
              </div>
              <div className="text-[11px] text-stone-400 mt-1.5">
                {new Date(notification.createdAt).toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
            <button
              onClick={() => onClose(notification._id)}
              className="text-stone-300 hover:text-stone-600 shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      <div className="h-0.5 w-full bg-stone-100 -mt-[1px]">
        <div
          className={`h-0.5 transition-all duration-100 ${t.bar}`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default function RealtimeNotificationListener() {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<RealtimeNotification[]>([]);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (notification: RealtimeNotification) => {
      console.log("[Realtime] New notification received:", notification);
      setNotifications((prev) => [...prev, notification]);
    };

    socket.on("new-notification", handleNewNotification);

    return () => {
      socket.off("new-notification", handleNewNotification);
    };
  }, [socket]);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n._id !== id));
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-[100] pointer-events-none">
      {notifications.map((notification) => (
        <div key={notification._id} className="pointer-events-auto">
          <NotificationToast notification={notification} onClose={removeNotification} />
        </div>
      ))}
    </div>
  );
}