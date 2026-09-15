"use client";

import React, { useState } from "react";
import { NotificationRow } from "./NotificationRow";

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
  notificationGroups: NotificationGroup[];
}

// মূল Reusable Component
export default function NotificationsBoard({ tabs, notificationGroups }: NotificationsBoardProps) {
  // প্রথম ট্যাবটিকে ডিফল্ট অ্যাক্টিভ হিসেবে সেট করা হচ্ছে
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="p-8 max-w-2xl w-full">

        {/* ডাইনামিক ফিল্টার ট্যাব */}
        <div className="flex gap-2 border-b border-neutral-200 overflow-x-auto">
          {tabs.map((tab: string) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
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
        <div className="mt-6 border border-neutral-200 rounded-md overflow-hidden bg-white">
          {notificationGroups.map((group: NotificationGroup, groupIndex: number) => (
            <div key={groupIndex}>
              {/* গ্রুপের টাইটেল (যেমন: আজ, গতকাল) */}
              <div className={`px-5 pt-4 pb-2 text-xs font-medium text-neutral-400 ${groupIndex !== 0 ? "border-t border-neutral-200 bg-neutral-50/50" : ""}`}>
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
          {notificationGroups.length === 0 && (
            <div className="p-8 text-center text-sm text-neutral-500">
              কোনো নোটিফিকেশন নেই।
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
