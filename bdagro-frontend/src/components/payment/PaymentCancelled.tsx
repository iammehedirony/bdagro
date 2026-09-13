import React from "react";
import { Sprout, CircleSlash, ArrowLeft, LayoutDashboard } from "lucide-react";


export default function PaymentCancelledPage() {
  return (
    <div
      className="bg-white min-h-screen flex items-center justify-center px-6"
    >

      <div className="w-full max-w-md py-16">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Sprout className="w-5 h-5 text-emerald-800" />
          <span className="text-stone-900 text-lg">
            Bdagroonline
          </span>
        </div>

        <div className="border border-stone-200">
          <div className="p-8 text-center border-b border-stone-200">
            <div className="w-14 h-14 bg-amber-50 border border-amber-600 rounded-full flex items-center justify-center mx-auto">
              <CircleSlash className="w-7 h-7 text-amber-600" />
            </div>
            <h1 className="mt-5 text-2xl text-stone-900">
              পেমেন্ট বাতিল করা হয়েছে
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              আপনি পেমেন্ট প্রক্রিয়া মাঝপথে বন্ধ করেছেন। কোনো টাকা কাটা
              হয়নি।
            </p>
          </div>

          <div className="p-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">প্রকল্প</span>
              <span className="text-stone-800">সবুজ ধানখেত</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">বিনিয়োগের পরিমাণ</span>
              <span className="text-stone-800">৳১০,০০০</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">রেফারেন্স আইডি</span>
              <span className="text-stone-800">BAO-TXN-829473</span>
            </div>
          </div>

          <div className="p-6 pt-0 flex flex-col gap-3">
            <button className="w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800 flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              প্রকল্পে ফিরে যান
            </button>
            <button className="w-full border border-stone-300 text-stone-700 py-3 text-sm hover:border-emerald-800 flex items-center justify-center gap-2">
              <LayoutDashboard className="w-4 h-4" />
              ড্যাশবোর্ডে যান
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}