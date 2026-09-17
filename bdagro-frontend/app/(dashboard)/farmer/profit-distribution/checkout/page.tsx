import React from "react";
import {
  Sprout,
  ChevronRight,
  Info,
  HandCoins,
  Smartphone,
  Landmark,
  CheckCircle2,
  Clock,
} from "lucide-react";
import StatusTag from "@/components/ui/StatusTag";


const recipients = [
  { name: "রাহাত ক.", invested: "৫০,০০০", share: "৩৫,০০০", due: "৩,৫০০", method: "বিকাশ · ০১৮৯৮-৭৬৫৪৩২", status: "বাকি" },
  { name: "তানভীর আ.", invested: "৪০,০০০", share: "৪০,০০০", due: "২,৮০০", method: "নগদ · ০১৩৩৪-৫৫৬৬৭৭", status: "বাকি" },
  { name: "সুমাইয়া হ.", invested: "১৫,০০০", share: "১৫,০০০", due: "১,০৫০", method: "SSLCommerz কার্ড", status: "বাকি" },
  { name: "কামরুল ই.", invested: "২০,০০০", share: "২০,০০০", due: "১,৪০০", method: "বিকাশ · ০১৭৭৭-১১২২৩৩", status: "পরিশোধিত" },
];


export default function FarmerPayoutCheckoutPage() {
  return (
    <div className="bg-white min-h-screen">

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <span>মুনাফা বণ্টন</span>
          <ChevronRight className="w-3 h-3" />
          <span>বীজ ক্রয় ফান্ডিং</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600">পরিশোধ</span>
        </div>

        <h1 className="mt-4 text-3xl text-stone-900">
          মুনাফা পরিশোধ নিশ্চিত করুন
        </h1>
        <p className="mt-2 text-stone-500 text-sm">
          প্রতিটি বিনিয়োগকারীকে তার অংশ অনুযায়ী সরাসরি পরিশোধ করুন।
        </p>

      

        <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-10">
          {/* LEFT: PROFIT SUMMARY + RECIPIENTS */}
          <div>
            {/* PROFIT SUMMARY */}
            <div className="border border-stone-200 p-6">
              <div className="grid sm:grid-cols-3 gap-5">
                <div>
                  <div className="text-xs text-stone-400">মোট নিট মুনাফা</div>
                  <div className="text-lg text-stone-900">
                    ৳৩৫,০০০
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-400">মুনাফা বণ্টন হার</div>
                  <div className="text-lg text-stone-900">
                    ২৫%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-400">বিনিয়োগকারীদের মোট প্রাপ্য</div>
                  <div className="text-lg text-emerald-800">
                    ৳৮,৭৫০
                  </div>
                </div>
              </div>
            </div>

            {/* RECIPIENTS LIST */}
            <div className="mt-6 border border-stone-200">
              <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                <h3 className="text-stone-900">
                  প্রাপক বিনিয়োগকারীগণ
                </h3>
                <span className="text-xs text-stone-400">৪ জন</span>
              </div>
              <div className="divide-y divide-stone-100">
                {recipients.map((r) => (
                  <div key={r.name} className="p-5 flex items-center gap-4 flex-wrap">
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-sm shrink-0">
                      {r.name[0]}
                    </div>
                    <div className="flex-1 min-w-[180px]">
                      <div className="text-sm text-stone-800">{r.name}</div>
                      <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                        {r.method.includes("SSLCommerz") ? (
                          <Landmark className="w-3 h-3" />
                        ) : (
                          <Smartphone className="w-3 h-3" />
                        )}
                        {r.method}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm text-stone-800">৳{r.due}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        বিনিয়োগ ৳{r.invested}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-2">
                      <StatusTag status={r.status} />
                      {r.status === "বাকি" && (
                        <button className="text-xs border border-emerald-800 text-emerald-900 px-3 py-1.5 hover:bg-emerald-50">
                          পরিশোধিত হিসেবে চিহ্নিত করুন
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <label className="mt-6 flex items-start gap-2 text-xs text-stone-500">
              <input type="checkbox" className="accent-emerald-800 mt-0.5" defaultChecked />
              <span>
                আমি নিশ্চিত করছি উপরের প্রতিটি বিনিয়োগকারীকে সঠিক পরিমাণ
                সরাসরি পরিশোধ করেছি
              </span>
            </label>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="border border-stone-200">
              <div className="p-5 flex items-start gap-4 border-b border-stone-200">
                <div className="w-11 h-11 bg-emerald-900 flex items-center justify-center shrink-0">
                  <HandCoins className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <div className="text-xs text-stone-400">বীজ ক্রয় ফান্ডিং</div>
                  <div className="text-stone-900">
                    মুনাফা পরিশোধ
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">মোট প্রাপক</span>
                  <span className="text-stone-800">৪ জন বিনিয়োগকারী</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">পরিশোধিত</span>
                  <span className="text-stone-800">১ জন · ৳১,৪০০</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-400">বাকি</span>
                  <span className="text-amber-700">৩ জন · ৳৭,৩৫০</span>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                  <span className="text-stone-700">সর্বমোট মুনাফা বণ্টন</span>
                  <span className="text-xl text-stone-900">
                    ৳৮,৭৫০
                  </span>
                </div>
                <button className="mt-5 w-full bg-amber-500 text-emerald-950 py-3 text-sm font-medium hover:bg-amber-400">
                  সব পরিশোধ সম্পন্ন হিসেবে চিহ্নিত করুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}