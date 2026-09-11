import React from "react";
import NotificationsBoard from "@/components/notifications/NotificationBoard";

export default function FarmerNotifications() {
  const investorTabs = ["সব", "বিনিয়োগ", "ফান্ডিং", "পেমেন্ট"];

  const investorNotifications = [
    {
      label: "আজ",
      items: [
        { icon: "check-circle", tone: "emerald" as const, text: "সবুজ ধানখেত প্রকল্পে আপনার বিনিয়োগ অনুমোদিত হয়েছে", time: "১০ মিনিট আগে", unread: true },
        { icon: "banknote", tone: "emerald" as const, text: "মাছ চাষ প্রকল্প থেকে ৳৬,৬০০ রিটার্ন জমা হয়েছে", time: "৩ ঘণ্টা আগে", unread: true },
      ],
    },
    {
      label: "গতকাল",
      items: [
        { icon: "trending-up", tone: "amber" as const, text: "আম বাগান প্রকল্প ৫০% ফান্ডিং সম্পন্ন করেছে", time: "গতকাল, ৪:০০ PM", unread: false },
        { icon: "clock", tone: "amber" as const, text: "আম বাগান প্রকল্প এখনো Processing ধাপে আছে", time: "গতকাল, ১১:০০ AM", unread: false },
      ],
    },
  ];

  return (
    <NotificationsBoard
      tabs={investorTabs}
      notificationGroups={investorNotifications}
    />
  );
}
