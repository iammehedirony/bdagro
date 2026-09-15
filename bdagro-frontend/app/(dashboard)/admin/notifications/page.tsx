import NotificationsBoard from "@/components/notifications/NotificationBoard";
import React from "react";

export default function AdminNotificationsPage() {
  const adminTabs = ["সব", "যাচাইকরণ", "প্রকল্প", "লেনদেন"];

  const adminNotifications = [
    {
      label: "আজ",
      items: [
        // লক্ষ্য করুন: icon এখন স্ট্রিং ("ShieldCheck") এবং tone নতুন সিমেটিক নামে ("accent")
        { icon: "ShieldCheck", tone: "accent", text: "সালমা বেগম নতুন NID যাচাইয়ের জন্য জমা দিয়েছেন", time: "১০ মিনিট আগে", unread: true },
        { icon: "FileText", tone: "accent", text: 'মনির হোসেন "লিচু বাগান সম্প্রসারণ" প্রকল্প জমা দিয়েছেন', time: "১ ঘণ্টা আগে", unread: true },
      ],
    },
    {
      label: "গতকাল",
      items: [
        // tone: emerald এর জায়গায় primary এবং orange এর জায়গায় danger
        { icon: "Banknote", tone: "primary", text: "সবুজ ধানখেত প্রকল্পে ৳১০,০০০-এর বেশি একক বিনিয়োগ হয়েছে", time: "গতকাল, ৬:০০ PM", unread: false },
        { icon: "AlertTriangle", tone: "danger", text: "পুকুরে মাছ চাষ প্রকল্পে সন্দেহজনক তথ্য চিহ্নিত হয়েছে", time: "গতকাল, ১১:০০ AM", unread: false },
      ],
    },
    {
      label: "এই সপ্তাহে",
      items: [
        { icon: "ShieldCheck", tone: "primary", text: "৫ জন কৃষকের NID স্বয়ংক্রিয়ভাবে পুনঃযাচাই সম্পন্ন হয়েছে", time: "৩ দিন আগে", unread: false },
        { icon: "FileText", tone: "accent", text: "পোল্ট্রি খামার প্রকল্প অনুমোদনের অপেক্ষায় ৪৮ ঘণ্টা পার হয়েছে", time: "৪ দিন আগে", unread: false },
      ],
    }
  ];

  return (
    <NotificationsBoard
      tabs={adminTabs}
      notificationGroups={adminNotifications}
    />
  );
}