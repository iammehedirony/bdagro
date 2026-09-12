import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Wallet,
  BarChart3,
  ArrowDownToLine,
  Bell,
  Settings,
  MapPin,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";


const chartBars = [0, 0, 0, 13500, 0, 0, 0, 27700, 0, 0, 0, 0];
const months = ["জান", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];

const earnings = [
  { project: "গরু মোটাতাজাকরণ", sales: "৬৫,০০০", cost: "৪৪,২০০", netProfit: "২০,৮০০", investorShare: "৭,২৮০", farmerEarning: "১৩,৫২০", date: "১০ জানুয়ারি ২০২৬" },
  { project: "সেচ যন্ত্র ফান্ডিং", sales: "৯৮,০০০", cost: "৬৬,৫০০", netProfit: "৩১,৫০০", investorShare: "৬,৩০০", farmerEarning: "২৫,২০০", date: "৫ আগস্ট ২০২৫" },
];

export default function FarmerEarningsOverviewPage() {
  const maxBar = Math.max(...chartBars);

  return (
    <div className="bg-white min-h-screen flex">

    

      {/* MAIN */}
      <div className="flex-1 min-w-0">
    

        <div className="p-8">
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="সর্বমোট আয়" value="৳৩৮,৭২০" sub="মুনাফা বণ্টনের পর" />
            <StatCard label="এই বছরে আয়" value="৳৩৮,৭২০" sub="২টি নিষ্পত্তি থেকে" />
            <StatCard label="মোট বিনিয়োগকারীর অংশ" value="৳১৩,৫৮০" sub="প্রদত্ত মুনাফা" />
            <StatCard label="সর্বোচ্চ আয়কারী প্রকল্প" value="সেচ যন্ত্র" sub="৳২৫,২০০" />
          </div>

          {/* CHART */}
          <div className="mt-8 border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-stone-900">
                মাসভিত্তিক নিট আয়
              </h3>
              <span className="text-xs text-stone-400">গত ১২ মাস</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {chartBars.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full ${
                      v === Math.max(...chartBars) ? "bg-amber-500" : v > 0 ? "bg-emerald-800" : "bg-stone-100"
                    }`}
                    style={{ height: `${v > 0 ? (v / maxBar) * 100 : 3}%` }}
                  />
                  <span className="text-[10px] text-stone-400">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* EARNINGS BREAKDOWN */}
          <div className="mt-8 border border-stone-200">
            <div className="p-6 border-b border-stone-200">
              <h3 className="text-stone-900">
                প্রকল্পভিত্তিক আয়ের হিসাব
              </h3>
            </div>
            <div className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-2 px-6 py-3 border-b border-stone-200 text-xs text-stone-400">
              <span>প্রকল্প</span>
              <span className="text-right">বিক্রয়</span>
              <span className="text-right">নিট মুনাফা</span>
              <span className="text-right">বিনিয়োগকারীর অংশ</span>
              <span className="text-right">আমার আয়</span>
            </div>
            <div className="divide-y divide-stone-100">
              {earnings.map((e) => (
                <div key={e.project} className="grid grid-cols-[1.4fr_1fr_1fr_1fr_1fr] gap-2 px-6 py-4 items-center">
                  <div>
                    <div className="text-sm text-stone-800">{e.project}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{e.date}</div>
                  </div>
                  <span className="text-sm text-stone-600 text-right">৳{e.sales}</span>
                  <span className="text-sm text-stone-600 text-right">৳{e.netProfit}</span>
                  <span className="text-sm text-stone-600 text-right">৳{e.investorShare}</span>
                  <span className="text-sm text-emerald-800 text-right">
                    ৳{e.farmerEarning}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}