import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Wallet,
  Bell,
  Settings,
  ShieldCheck,
  Lock,
} from "lucide-react";
import Field from "@/components/form/Field";
import { Toggle } from "@/components/form/Toggle";

export default function FarmerSettingsPage() {
  return (
    <div className="bg-white min-h-screen flex">
      
      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8 max-w-2xl space-y-10">
          {/* PROFILE */}
          <div>
            <h2 className="text-xl text-stone-900 mb-4">
              প্রোফাইল তথ্য
            </h2>
            <div className="border border-stone-200 p-6 grid sm:grid-cols-2 gap-5">
              <Field label="পূর্ণ নাম" value="আব্দুল করিম" />
              <Field label="ফোন নম্বর" value="+৮৮০ ১৭১২-৩৪৫৬৭৮" />
              <Field label="ইমেইল" placeholder="you@email.com" />
              <Field label="খামারের ঠিকানা" value="বুড়িচং, কুমিল্লা" />
            </div>
          </div>

          {/* NID VERIFICATION */}
          <div>
            <h2 className="text-xl text-stone-900 mb-4">
              NID ভেরিফিকেশন
            </h2>
            <div className="border border-stone-200 p-6 flex items-center gap-4">
              <div className="w-11 h-11 bg-emerald-50 border border-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
              </div>
              <div className="flex-1">
                <div className="text-sm text-stone-800">যাচাইকৃত</div>
                <div className="text-xs text-stone-400 mt-0.5">
                  NID নম্বর: ৩৪৫৬ XXXX XXXX · ভেরিফাইড ১২ জুন ২০২৬
                </div>
              </div>
              <span className="text-xs border border-emerald-600 text-emerald-800 bg-emerald-50 px-2 py-0.5">
                Approved
              </span>
            </div>
          </div>

          {/* PAYOUT ACCOUNT */}
          <div>
            <h2 className="text-xl text-stone-900 mb-4">
              উত্তোলনের অ্যাকাউন্ট
            </h2>
            <div className="border border-stone-200 p-6 grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-stone-700">পেমেন্ট মাধ্যম</label>
                <select className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-emerald-700">
                  <option>বিকাশ</option>
                  <option>নগদ</option>
                  <option>ব্যাংক অ্যাকাউন্ট</option>
                </select>
              </div>
              <Field label="অ্যাকাউন্ট নম্বর" placeholder="০১XXXXXXXXX" />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <h2 className="text-xl text-stone-900 mb-4">
              পাসওয়ার্ড পরিবর্তন
            </h2>
            <div className="border border-stone-200 p-6 grid sm:grid-cols-2 gap-5">
              <Field label="বর্তমান পাসওয়ার্ড" type="password" placeholder="••••••••" />
              <Field label="নতুন পাসওয়ার্ড" type="password" placeholder="••••••••" />
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div>
            <h2 className="text-xl text-stone-900 mb-4">
              নোটিফিকেশন পছন্দ
            </h2>
            <div className="border border-stone-200 px-6 divide-y divide-stone-100">
              <Toggle label="বিনিয়োগ ও ফান্ডিং আপডেট" sub="নতুন বিনিয়োগ এলে জানানো হবে" defaultOn />
              <Toggle label="কিস্তি রিমাইন্ডার" sub="কিস্তির তারিখের আগে SMS/নোটিফিকেশন" defaultOn />
              <Toggle label="প্রকল্প স্ট্যাটাস পরিবর্তন" sub="অনুমোদন বা প্রত্যাখ্যান হলে জানানো হবে" defaultOn />
              <Toggle label="প্রোমোশনাল আপডেট" sub="নতুন ফিচার ও অফার সম্পর্কে তথ্য" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800">
              পরিবর্তন সংরক্ষণ করুন
            </button>
            <button className="text-sm text-stone-500 hover:text-stone-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              অ্যাকাউন্ট নিষ্ক্রিয় করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}