  import { Sprout, LayoutDashboard, Wallet, Bell, Settings, BarChart3, TrendingUp, ArrowLeftRight } from "lucide-react";
  
  export const farmerMenu = [
    // লক্ষ্য করুন: আইকনগুলোকে কম্পোনেন্ট হিসেবে < /> দিয়ে পাস করা হয়েছে
    { label: "ওভারভিউ", href: "/farmer", icon: <LayoutDashboard /> },
    { label: "আমার প্রকল্প", href: "/farmer/projects", icon: <Sprout /> },
    { label: "মুনাফা বণ্টন", href: "/farmer/profit-distribution", icon: <Wallet /> },
     { label: "লেনদেন", href: "/farmer/transactions", icon: <ArrowLeftRight /> },
    { label: "নোটিফিকেশন", href: "/farmer/notifications", icon: <Bell /> },
    { label: "সেটিংস", href: "/farmer/settings", icon: <Settings /> },
  ];

  export const investorMenu = [
    // লক্ষ্য করুন: আইকনগুলোকে কম্পোনেন্ট হিসেবে < /> দিয়ে পাস করা হয়েছে
    { label: "ওভারভিউ", href: "/investor", icon: <LayoutDashboard /> },
    { label: "আমার বিনিয়োগ", href: "/investor/investments", icon: <Sprout /> },
    { label: "রিটার্ন ট্র্যাকিং", href: "/investor/roi-tracking", icon: <TrendingUp /> },
    { label: "লেনদেন", href: "/investor/transactions", icon: <ArrowLeftRight /> },
    { label: "নোটিফিকেশন", href: "/investor/notifications", icon: <Bell /> },
    { label: "সেটিংস", href: "/investor/settings", icon: <Settings /> },
  ];

  export const adminMenu = [
    // লক্ষ্য করুন: আইকনগুলোকে কম্পোনেন্ট হিসেবে < /> দিয়ে পাস করা হয়েছে
    { label: "ওভারভিউ", href: "/admin", icon: <LayoutDashboard /> },
    { label: "যাচাই অপেক্ষমাণ", href: "/admin/verification", icon: <Sprout /> },
    { label: "ইউজার ম্যানেজমেন্ট", href: "/admin/user-management", icon: <Wallet /> },
    { label: "সব প্রকল্প", href: "/admin/all-projects", icon: <Sprout /> },
    { label: "লেনদেন", href: "/admin/transactions", icon: <ArrowLeftRight /> },
    { label: "নোটিফিকেশন", href: "/admin/notifications", icon: <Bell /> },
    { label: "সেটিংস", href: "/admin/settings", icon: <Settings /> },
  ];

     export const farmerHeaderConfig = [
    { pathMatch: '/farmer/projects', title: 'আমার প্রকল্পসমূহ', buttonText: 'নতুন প্রকল্প পোস্ট করুন', buttonLink: '/loans/application' },
    { pathMatch: '/farmer/profit-distribution', title: 'মুনাফা বণ্টন'},
    { pathMatch: '/farmer/transactions', title: 'লেনদেন' },
    { pathMatch: '/farmer/notifications', title: 'নোটিফিকেশন' },
    { pathMatch: '/farmer/settings', title: 'অ্যাকাউন্ট সেটিংস' }
  ];

  export const investorHeaderConfig = [
    { pathMatch: '/investor/investments', title: 'আমার বিনিয়োগ', buttonText: 'নতুন বিনিয়োগ করুন', buttonLink: '/projects' },
    { pathMatch: '/investor/roi-tracking', title: 'রিটার্ন ট্র্যাকিং' },
    { pathMatch: '/investor/transactions', title: 'লেনদেন' },
    { pathMatch: '/investor/notifications', title: 'নোটিফিকেশন' },
    { pathMatch: '/investor/settings', title: 'অ্যাকাউন্ট সেটিংস' },
     { pathMatch: '/investor', title: 'ইনভেস্টর ওভারভিউ'}
  ];

   export const adminHeaderConfig = [
    { pathMatch: '/admin/verification', title: 'যাচাই অপেক্ষমাণ', buttonText: null },
    { pathMatch: '/admin/user-management', title: 'ইউজার ম্যানেজমেন্ট', buttonText: null },
     { pathMatch: '/admin/all-projects', title: 'সব প্রকল্প', buttonText: null },
    { pathMatch: '/admin/transactions', title: 'লেনদেন ও পেআউট', buttonText: null },
    { pathMatch: '/admin/notifications', title: 'নোটিফিকেশন' },
    { pathMatch: '/admin/settings', title: 'অ্যাকাউন্ট সেটিংস' },
     { pathMatch: '/admin', title: 'অ্যাডমিন ওভারভিউ', buttonText: null },
  ];

