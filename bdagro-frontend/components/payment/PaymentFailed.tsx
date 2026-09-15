import React from "react";
import { Sprout, XCircle, RotateCcw, MessageCircle } from "lucide-react";



export default function PaymentFailedPage() {
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
            <div className="w-14 h-14 bg-orange-50 border border-orange-600 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-7 h-7 text-orange-600" />
            </div>
            <h1 className="mt-5 text-2xl text-stone-900">
              পেমেন্ট ব্যর্থ হয়েছে
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              আপনার অ্যাকাউন্ট থেকে কোনো টাকা কাটা হয়নি। অনুগ্রহ করে আবার
              চেষ্টা করুন।
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
              <span className="text-stone-400">ব্যর্থতার কারণ</span>
              <span className="text-stone-800">অপর্যাপ্ত ব্যালেন্স</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">রেফারেন্স আইডি</span>
              <span className="text-stone-800">BAO-TXN-829472</span>
            </div>
          </div>

          <div className="p-6 pt-0 flex flex-col gap-3">
            <button className="w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800 flex items-center justify-center gap-2">
              <RotateCcw className="w-4 h-4" />
              আবার চেষ্টা করুন
            </button>
            <button className="w-full border border-stone-300 text-stone-700 py-3 text-sm hover:border-emerald-800 flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" />
              সাপোর্টে যোগাযোগ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}