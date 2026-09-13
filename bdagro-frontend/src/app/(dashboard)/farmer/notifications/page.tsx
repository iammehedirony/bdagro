import NotificationsBoard from "@/components/notifications/NotificationBoard";
import React from "react";


export default function FarmerNotificationsPage() {
  // ফার্মারের জন্য নতুন ট্যাব
  const farmerTabs = ["সব", "প্রকল্প", "মুনাফা বণ্টন", "যাচাইকরণ"];

  // ফার্মারের নতুন নোটিফিকেশন ডেটা
  const farmerNotifications = [
    {
      label: "আজ",
      items: [
        { 
          icon: "CheckCircle2", 
          tone: "primary", // emerald এর বদলে primary
          text: "সবুজ ধানখেত প্রকল্পে নতুন বিনিয়োগ পেয়েছেন ৳১০,০০০", 
          time: "১০ মিনিট আগে", 
          unread: true 
        },
        { 
          icon: "AlertTriangle", 
          tone: "accent", // amber এর বদলে accent
          text: "বীজ ক্রয় ফান্ডিংয়ের মুনাফা রিপোর্ট জমা দেওয়ার সময় হয়েছে", 
          time: "৩ ঘণ্টা আগে", 
          unread: true 
        },
      ],
    },
    {
      label: "গতকাল",
      items: [
        { 
          icon: "TrendingUp", 
          tone: "accent", 
          text: "আম বাগান প্রকল্প ৫০% ফান্ডিং সম্পন্ন করেছে", 
          time: "গতকাল, ৪:০০ PM", 
          unread: false 
        },
        { 
          icon: "ShieldCheck", 
          tone: "primary", 
          text: "আপনার NID ভেরিফিকেশন অনুমোদিত হয়েছে", 
          time: "গতকাল, ১১:০০ AM", 
          unread: false 
        },
      ],
    },
    {
      label: "এই সপ্তাহে",
      items: [
        { 
          icon: "Users", 
          tone: "primary", 
          text: "সবুজ ধানখেত প্রকল্পে মোট ৬২ জন বিনিয়োগকারী যুক্ত হয়েছেন", 
          time: "৩ দিন আগে", 
          unread: false 
        },
        { 
          icon: "AlertTriangle", 
          tone: "danger", // orange এর বদলে danger
          text: "পুকুরে মাছ চাষ প্রকল্পের আবেদন প্রত্যাখ্যাত হয়েছে", 
          time: "৫ দিন আগে", 
          unread: false 
        },
      ],
    }
  ];

  return (
    <NotificationsBoard
      tabs={farmerTabs}
      notificationGroups={farmerNotifications}
    />
  );
}