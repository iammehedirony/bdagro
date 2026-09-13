import React from "react";
import {
  Sprout,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  CreditCard,
  MapPin,
  Lock,
} from "lucide-react";
import { PaymentOption } from "@/components/payment/PaymentOption";


export default function InvestmentCheckoutPage() {
  return (
    <div className="bg-white min-h-screen">

    
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <span>হোম</span>
          <ChevronRight className="w-3 h-3" />
          <span>সবুজ ধানখেত</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600">চেকআউট</span>
        </div>

        <h1 className="mt-4 text-3xl text-stone-900">
          বিনিয়োগ নিশ্চিত করুন
        </h1>

        <div className="mt-8 grid lg:grid-cols-[1fr_340px] gap-10">
          {/* LEFT: CHECKOUT FLOW */}
          <div className="space-y-8">
            {/* AMOUNT */}
            <div className="border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <span className="text-xs text-emerald-800">১</span>
                <h2 className="text-lg text-stone-900">
                  বিনিয়োগের পরিমাণ
                </h2>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <button className="flex-1 border border-emerald-800 bg-emerald-50 text-emerald-900 py-2.5 text-sm">
                    আংশিক বিনিয়োগ
                  </button>
                  <button className="flex-1 border border-stone-300 text-stone-600 py-2.5 text-sm hover:border-emerald-800">
                    পূর্ণ বিনিয়োগ (৳১,২৫,০০০)
                  </button>
                </div>
                <div className="flex items-center border border-stone-300 max-w-xs">
                  <span className="px-3 text-stone-400 text-sm">৳</span>
                  <input
                    type="text"
                    defaultValue="১০,০০০"
                    className="flex-1 py-2.5 pr-3 text-sm outline-none"
                  />
                </div>
                <div className="text-xs text-stone-400 mt-1.5">
                  সর্বনিম্ন বিনিয়োগ ৳৫,০০০ · সর্বোচ্চ ৳১,২৫,০০০
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <span className="text-xs text-emerald-800">২</span>
                <h2 className="text-lg text-stone-900">
                  পেমেন্ট পদ্ধতি
                </h2>
              </div>
              <div className="p-6 space-y-3">
                <PaymentOption
                  icon={Smartphone}
                  title="SSLCommerz"
                  sub="বিকাশ, নগদ, রকেট, লোকাল কার্ড ও ব্যাংক"
                  selected
                />
                <PaymentOption
                  icon={CreditCard}
                  title="Stripe"
                  sub="আন্তর্জাতিক ভিসা / মাস্টারকার্ড"
                />
              </div>
            </div>

            {/* BILLING INFO */}
            <div className="border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <span className="text-xs text-emerald-800">৩</span>
                <h2 className="text-lg text-stone-900">
                  বিলিং তথ্য
                </h2>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="পূর্ণ নাম"
                  className="border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700"
                />
                <input
                  type="text"
                  placeholder="ইমেইল"
                  className="border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700"
                />
                <input
                  type="text"
                  placeholder="ফোন নম্বর"
                  className="border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700 sm:col-span-2"
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-stone-500">
              <input type="checkbox" className="accent-emerald-800 mt-0.5" defaultChecked />
              <span>
                আমি বুঝতে পেরেছি এই বিনিয়োগ ঝুঁকিমুক্ত নয় এবং রিটার্ন ফসল
                বিক্রির উপর নির্ভরশীল
              </span>
            </label>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="border border-stone-200">
              <div className="p-5 flex items-center gap-4 border-b border-stone-200">
                <div className="w-12 h-12 bg-emerald-900 flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <div className="text-stone-900">
                    সবুজ ধানখেত
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    কুমিল্লা
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3 border-b border-stone-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">ঝুঁকির মাত্রা</span>
                  <span className="text-stone-800">কম</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">প্রত্যাশিত ROI</span>
                  <span className="text-emerald-800">১৫%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">মেয়াদ</span>
                  <span className="text-stone-800">৪ মাস</span>
                </div>
              </div>

              <div className="p-5 space-y-3 border-b border-stone-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">বিনিয়োগের পরিমাণ</span>
                  <span className="text-stone-800">৳১০,০০০</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">প্ল্যাটফর্ম ফি</span>
                  <span className="text-stone-800">৳০</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-700">সর্বমোট</span>
                  <span className="text-xl text-stone-900">
                    ৳১০,০০০
                  </span>
                </div>
              </div>

              <div className="p-5">
                <button className="w-full bg-amber-500 text-emerald-950 py-3 text-sm font-medium hover:bg-amber-400">
                  ৳১০,০০০ পেমেন্ট করুন
                </button>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SSLCommerz দ্বারা সুরক্ষিত পেমেন্ট</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}