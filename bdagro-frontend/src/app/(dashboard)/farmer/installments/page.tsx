import React from "react";
import {
  AlertTriangle,
  Info,
  HandCoins,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusTag from "@/components/ui/StatusTag";
import Link from "next/link";


const settlements = [
  {
    project: "গরু মোটাতাজাকরণ",
    date: "১০ জানুয়ারি ২০২৬",
    sales: "৬৫,০০০",
    profit: "২০,৮০০",
    share: "৭,২৮০",
    sharePercent: "৩৫%",
    status: "পরিশোধিত",
  },
  {
    project: "সেচ যন্ত্র ফান্ডিং",
    date: "৫ আগস্ট ২০২৫",
    sales: "৯৮,০০০",
    profit: "৩১,৫০০",
    share: "৬,৩০০",
    sharePercent: "২০%",
    status: "পরিশোধিত",
  },
];


export default function FarmerProfitSharingPage() {
  return (
    <div className="bg-white min-h-screen flex">
      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8">
         

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="সক্রিয় ফান্ডিং" value="৳৩৫,০০০" sub="বীজ ক্রয় ফান্ডিং" />
            <StatCard label="মুনাফা বণ্টন হার" value="২৫%" tone="amber" sub="বিনিয়োগকারীর অংশ" />
            <StatCard label="প্রত্যাশিত ফসল সংগ্রহ" value="মার্চ ২০২৭" sub="নিষ্পত্তির পূর্বে" />
            <StatCard label="সম্পন্ন নিষ্পত্তি" value="২টি" sub="মোট ৳১৩,৫৮০ প্রদত্ত" />
          </div>

          {/* ACTIVE FUNDING CARD */}
          <div className="mt-8 border border-amber-200 bg-amber-50/40 p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 text-amber-700 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>ফসল সংগ্রহ সম্পন্ন হলে মুনাফা রিপোর্ট জমা দিন</span>
                </div>
                <h2 className="mt-2 text-xl text-stone-900">
                  বীজ ক্রয় ফান্ডিং
                </h2>
                <div className="text-sm text-stone-500 mt-1">
                  মোট ফান্ডিং ৳৩৫,০০০ · মেয়াদ ৬ মাস · মুনাফা বণ্টন ২৫%
                </div>
              </div>
              <button className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800 shrink-0 flex items-center gap-2">
                <HandCoins className="w-4 h-4" />
                মুনাফা রিপোর্ট জমা দিন
              </button>
            </div>
          </div>

          {/* PROFIT REPORT FORM */}
          <div className="mt-8 border border-stone-200">
            <div className="p-6 border-b border-stone-200">
              <h3 className="text-stone-900">
                মুনাফা রিপোর্ট জমা দিন
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                ফসল বা উৎপাদন বিক্রির পর প্রকৃত হিসাব দিয়ে এই ফর্মটি পূরণ করুন
              </p>
            </div>
            <div className="p-6 grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-stone-700">মোট বিক্রয় (৳)</label>
                <input
                  type="text"
                  placeholder="যেমন: ৭৫,০০০"
                  className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700"
                />
              </div>
              <div>
                <label className="text-sm text-stone-700">উৎপাদন খরচ (৳)</label>
                <input
                  type="text"
                  placeholder="যেমন: ৪০,০০০"
                  className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700"
                />
              </div>

              <div className="sm:col-span-2 border-t border-stone-200 pt-5 flex items-center justify-between">
                <span className="text-sm text-stone-500">নিট মুনাফা</span>
                <span className="text-stone-900">
                  ৳৩৫,০০০
                </span>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between">
                <span className="text-sm text-stone-500">
                  বিনিয়োগকারীর প্রাপ্য অংশ (২৫%)
                </span>
                <span className="text-xl text-emerald-800">
                  ৳৮,৭৫০
                </span>
              </div>

              <div className="sm:col-span-2">
               <Link 
  href="/farmer/installments/checkout" 
  className="w-full block text-center bg-amber-500 text-emerald-950 py-3 text-sm font-medium hover:bg-amber-400"
>
  ৳৮,৭৫০ বিনিয়োগকারীকে প্রদান করুন
</Link>
              </div>
            </div>
          </div>

          {/* SETTLEMENT HISTORY */}
          <div className="mt-8 border border-stone-200">
            <div className="p-6 border-b border-stone-200">
              <h3 className="text-stone-900">
                নিষ্পত্তির ইতিহাস
              </h3>
            </div>
            <div className="divide-y divide-stone-100">
              {settlements.map((row) => (
                <div key={row.project} className="p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-sm text-stone-800">{row.project}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{row.date}</div>
                  </div>
                  <div className="text-xs text-stone-500">
                    বিক্রয় ৳{row.sales} · নিট মুনাফা ৳{row.profit}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-stone-800">
                      ৳{row.share} <span className="text-stone-400">({row.sharePercent})</span>
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">বিনিয়োগকারীর অংশ</div>
                  </div>
                  <StatusTag status={row.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}