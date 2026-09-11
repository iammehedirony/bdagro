import React from "react"; // আপনার Reusable কম্পোনেন্টের পাথ
import { CheckCircle2, TrendingUp, Clock, Banknote } from "lucide-react";
import NotificationsBoard from "@/components/notifications/NotificationBoard";

export default function InvestorNotifications() {
  // ইনভেস্টরের জন্য নির্দিষ্ট ট্যাব
  const investorTabs = ["সব", "বিনিয়োগ", "ফান্ডিং", "পেমেন্ট"];

  // ইনভেস্টরের ডাইনামিক ডেটা গ্রুপ
  const investorNotifications = [
    {
      label: "আজ",
      items: [
        { icon: CheckCircle2, tone: "emerald", text: "সবুজ ধানখেত প্রকল্পে আপনার বিনিয়োগ অনুমোদিত হয়েছে", time: "১০ মিনিট আগে", unread: true },
        { icon: Banknote, tone: "emerald", text: "মাছ চাষ প্রকল্প থেকে ৳৬,৬০০ রিটার্ন জমা হয়েছে", time: "৩ ঘণ্টা আগে", unread: true },
      ],
    },
    {
      label: "গতকাল",
      items: [
        { icon: TrendingUp, tone: "amber", text: "আম বাগান প্রকল্প ৫০% ফান্ডিং সম্পন্ন করেছে", time: "গতকাল, ৪:০০ PM", unread: false },
        { icon: Clock, tone: "amber", text: "আম বাগান প্রকল্প এখনো Processing ধাপে আছে", time: "গতকাল, ১১:০০ AM", unread: false },
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