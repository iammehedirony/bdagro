import React from "react";
import { Sprout, CheckCircle2, Download, ArrowRight } from "lucide-react";



export default function PaymentSuccessPage() {
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
            <div className="w-14 h-14 bg-emerald-50 border border-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7 text-emerald-700" />
            </div>
            <h1 className="mt-5 text-2xl text-stone-900">
              পেমেন্ট সফল হয়েছে
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              আপনার বিনিয়োগ সফলভাবে সম্পন্ন হয়েছে। কৃষককে জানানো হয়েছে।
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
              <span className="text-stone-400">পেমেন্ট পদ্ধতি</span>
              <span className="text-stone-800">SSLCommerz · bKash</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">ট্রানজেকশন আইডি</span>
              <span className="text-stone-800">BAO-TXN-829471</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400">তারিখ ও সময়</span>
              <span className="text-stone-800">১০ সেপ্টেম্বর ২০২৬, ৪:১২ PM</span>
            </div>
          </div>

          <div className="p-6 pt-0 flex flex-col gap-3">
            <button className="w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800 flex items-center justify-center gap-2">
              ড্যাশবোর্ডে যান
              <ArrowRight className="w-4 h-4" />
            </button>
            <button className="w-full border border-stone-300 text-stone-700 py-3 text-sm hover:border-emerald-800 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              রসিদ ডাউনলোড করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}