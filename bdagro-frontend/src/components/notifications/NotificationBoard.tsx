"use client";

import React, { useState } from "react";
import { NotificationRow } from "./NotificationRow";

// মূল Reusable Component
export default function NotificationsBoard({ tabs, notificationGroups }: any) {
  // প্রথম ট্যাবটিকে ডিফল্ট অ্যাক্টিভ হিসেবে সেট করা হচ্ছে
  const [activeTab, setActiveTab] = useState(tabs[0]);

  return (
    <div className="bg-white h-full flex flex-col">
      <div className="p-8 max-w-2xl w-full">
        
        {/* ডাইনামিক ফিল্টার ট্যাব */}
        <div className="flex gap-2 border-b border-stone-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === tab
                  ? "border-emerald-800 text-emerald-900 font-medium"
                  : "border-transparent text-stone-400 hover:text-stone-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ডাইনামিক নোটিফিকেশন লিস্ট */}
        <div className="mt-6 border border-stone-200 rounded-md overflow-hidden bg-white">
          {notificationGroups.map((group, groupIndex) => (
            <div key={groupIndex}>
              {/* গ্রুপের টাইটেল (যেমন: আজ, গতকাল) */}
              <div className={`px-5 pt-4 pb-2 text-xs font-medium text-stone-400 ${groupIndex !== 0 ? "border-t border-stone-200 bg-stone-50/50" : ""}`}>
                {group.label}
              </div>
              
              {/* ওই গ্রুপের নোটিফিকেশনগুলো */}
              <div className="divide-y divide-stone-100">
                {group.items.map((notification, idx) => (
                  <NotificationRow key={idx} {...notification} />
                ))}
              </div>
            </div>
          ))}
          
          {/* যদি ডেটা না থাকে */}
          {notificationGroups.length === 0 && (
            <div className="p-8 text-center text-sm text-stone-500">
              কোনো নোটিফিকেশন নেই।
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}