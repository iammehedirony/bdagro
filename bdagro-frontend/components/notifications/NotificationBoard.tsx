"use client";

import React, { useMemo, useState } from "react";
import { NotificationRow } from "./NotificationRow";
import { useNotificationsQuery } from "@/hooks/queries/useNotificationQueries";
import type { NotificationItem as ApiNotification, NotificationType } from "@/lib/services/notification.service";

interface NotificationItem {
  icon: string;
  tone: "emerald" | "amber" | "orange";
  text: string;
  time: string;
  unread?: boolean;
}

interface NotificationGroup {
  label: string;
  items: NotificationItem[];
}

interface NotificationsBoardProps {
  tabs: string[];
  categories: Record<string, NotificationType[]>;
}

const iconByType: Record<string, { icon: string; tone: NotificationItem["tone"] }> = {
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

const groupLabels = ["আজ", "গতকাল", "এই সপ্তাহে"];

export function groupNotifications(notifications: ApiNotification[]): NotificationGroup[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const groups = groupLabels.map((label) => ({ label, items: [] as NotificationItem[] }));

  notifications.forEach((notification) => {
    const createdAt = new Date(notification.createdAt);
    const dayStart = new Date(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate()).getTime();
    const daysAgo = Math.floor((startOfToday - dayStart) / 86_400_000);
    const group = daysAgo === 0 ? groups[0] : daysAgo === 1 ? groups[1] : groups[2];
    const visual = iconByType[notification.type] ?? { icon: "check-circle", tone: "emerald" as const };

    group.items.push({
      icon: visual.icon,
      tone: visual.tone,
      text: notification.message || notification.title,
      time: formatRelativeTime(createdAt, now),
      unread: !notification.isRead,
    });
  });

  return groups.filter((group) => group.items.length > 0);
}

function formatRelativeTime(date: Date, now: Date) {
  const seconds = Math.round((date.getTime() - now.getTime()) / 1000);
  const absoluteSeconds = Math.abs(seconds);
  const unit = absoluteSeconds < 60 ? "second" : absoluteSeconds < 3600 ? "minute" : absoluteSeconds < 86_400 ? "hour" : "day";
  const divisor = unit === "second" ? 1 : unit === "minute" ? 60 : unit === "hour" ? 3600 : 86_400;
  return new Intl.RelativeTimeFormat("bn", { numeric: "auto" }).format(Math.round(seconds / divisor), unit);
}

export default function NotificationsBoard({ tabs, categories }: NotificationsBoardProps) {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const { data, isLoading, isError } = useNotificationsQuery();
  const notificationGroups = useMemo(() => {
    const allowedTypes = categories[activeTab] ?? [];
    const notifications = (data?.notifications ?? []).filter(
      (notification) => activeTab === tabs[0] || allowedTypes.includes(notification.type),
    );
    return groupNotifications(notifications);
  }, [activeTab, categories, data?.notifications, tabs]);

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="p-4 lg:p-0 max-w-2xl w-full">

        {/* ডাইনামিক ফিল্টার ট্যাব */}
        <div className="flex gap-1.5 lg:gap-2 border-b border-neutral-200 overflow-x-auto">
          {tabs.map((tab: string) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 lg:px-4 py-2 lg:py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-primary-800 text-primary-900 font-medium"
                  : "border-transparent text-neutral-400 hover:text-neutral-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ডাইনামিক নোটিফিকেশন লিস্ট */}
        <div className="mt-4 lg:mt-6 border border-neutral-200 rounded-md overflow-hidden bg-white">
          {isLoading && <div className="p-4 lg:p-0 text-center text-sm text-neutral-500">নোটিফিকেশন লোড হচ্ছে...</div>}
          {isError && <div className="p-4 lg:p-0 text-center text-sm text-danger-600">নোটিফিকেশন লোড করা যায়নি।</div>}
          {!isLoading && !isError && notificationGroups.map((group: NotificationGroup, groupIndex: number) => (
            <div key={groupIndex}>
              {/* গ্রুপের টাইটেল (যেমন: আজ, গতকাল) */}
              <div className={`px-4 lg:px-5 pt-3 lg:pt-4 pb-2 text-xs font-medium text-neutral-400 ${groupIndex !== 0 ? "border-t border-neutral-200 bg-neutral-50/50" : ""}`}>
                {group.label}
              </div>

              {/* ওই গ্রুপের নোটিফিকেশনগুলো */}
              <div className="divide-y divide-neutral-100">
                {group.items.map((notification: NotificationItem, idx: number) => (
                  <NotificationRow key={idx} {...notification} />
                ))}
              </div>
            </div>
          ))}

          {/* যদি ডেটা না থাকে */}
          {!isLoading && !isError && notificationGroups.length === 0 && (
            <div className="p-4 lg:p-0 text-center text-sm text-neutral-500">
              কোনো নোটিফিকেশন নেই।
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
