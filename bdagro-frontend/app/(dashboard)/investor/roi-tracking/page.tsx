import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ArrowLeftRight,
  Search,
  Bell,
  Settings,
  MapPin,
  Banknote,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";


const chartBars = [0, 0, 2200, 0, 3100, 0, 0, 6600, 0, 0, 7280, 6300];
const months = ["জান", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন", "জুলাই", "আগস্ট", "সেপ্টে", "অক্টো", "নভে", "ডিসে"];

const projectReturns = [
  { name: "সবুজ ধানখেত", location: "কুমিল্লা", invested: "৫০,০০০", earned: "৭,৫০০", rate: "১৫%", status: "চলমান", tone: "emerald" },
  { name: "আম বাগান প্রকল্প", location: "রাজশাহী", invested: "৭৫,০০০", earned: "৯,০০০", rate: "১২%", status: "চলমান", tone: "amber" },
  { name: "মাছ চাষ প্রকল্প", location: "খুলনা", invested: "৩০,০০০", earned: "৬,৬০০", rate: "২২%", status: "নিষ্পত্তি সম্পন্ন", tone: "orange" },
  { name: "গরু মোটাতাজাকরণ", location: "পাবনা", invested: "৪৫,০০০", earned: "৭,২৮০", rate: "১৬%", status: "নিষ্পত্তি সম্পন্ন", tone: "emerald" },
];

const payouts = [
  { project: "গরু মোটাতাজাকরণ", amount: "৭,২৮০", date: "১০ জানুয়ারি ২০২৬", method: "SSLCommerz · bKash" },
  { project: "মাছ চাষ প্রকল্প", amount: "৬,৬০০", date: "২০ আগস্ট ২০২৫", method: "SSLCommerz · নগদ" },
  { project: "আম বাগান প্রকল্প", amount: "৩,১০০", date: "৫ মে ২০২৫", method: "Stripe · কার্ড" },
  { project: "সবুজ ধানখেত", amount: "২,২০০", date: "১২ মার্চ ২০২৫", method: "SSLCommerz · bKash" },
];

export default function InvestorROITrackingPage() {
  const maxBar = Math.max(...chartBars);

  return (
    <div className="bg-white min-h-screen flex">

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8">
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="মোট অর্জিত রিটার্ন" value="৳২৯,৪৮০" sub="সব প্রকল্প মিলিয়ে" />
            <StatCard label="গড় রিটার্ন রেট" value="১৬.৩%" sub="এখন পর্যন্ত" />
            <StatCard label="সর্বোচ্চ পারফরমার" value="মাছ চাষ" sub="২২% রিটার্ন" />
            <StatCard label="সম্পন্ন পেআউট" value="৪টি" sub="সর্বশেষ ১০ জানুয়ারি ২০২৬" />
          </div>

          <div className="mt-2 text-xs text-stone-400">
            * এই পরিসংখ্যান এখন পর্যন্ত অর্জিত প্রকৃত মুনাফা বণ্টনের হিসাব —
            ভবিষ্যতের নিশ্চিত রিটার্নের প্রতিশ্রুতি নয়।
          </div>

          {/* CHART */}
          <div className="mt-8 border border-stone-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-stone-900">
                মাসভিত্তিক প্রাপ্ত রিটার্ন
              </h3>
              <span className="text-xs text-stone-400">গত ১২ মাস</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {chartBars.map((v, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full ${v === Math.max(...chartBars) ? "bg-amber-500" : v > 0 ? "bg-emerald-800" : "bg-stone-100"}`}
                    style={{ height: `${v > 0 ? (v / maxBar) * 100 : 3}%` }}
                  />
                  <span className="text-[10px] text-stone-400">{months[i]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-8">
            {/* PER-PROJECT RETURNS */}
            <div className="border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <h3 className="text-stone-900">
                  প্রকল্পভিত্তিক রিটার্ন
                </h3>
              </div>
              <div className="divide-y divide-stone-200">
                {projectReturns.map((p) => (
                  <div key={p.name} className="p-5 flex items-center gap-4 flex-wrap">
                    <div
                      className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                        p.tone === "emerald" ? "bg-emerald-900" : p.tone === "amber" ? "bg-amber-700" : "bg-orange-800"
                      }`}
                    >
                      <Sprout className="w-4.5 h-4.5 text-white/80" />
                    </div>
                    <div className="flex-1 min-w-[140px]">
                      <div className="text-sm text-stone-800">{p.name}</div>
                      <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {p.location}
                        <span className="mx-1">·</span>
                        {p.status}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm text-emerald-700">+৳{p.earned}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        বিনিয়োগ ৳{p.invested} · {p.rate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PAYOUT HISTORY */}
            <div className="border border-stone-200 h-fit">
              <div className="p-6 border-b border-stone-200">
                <h3 className="text-stone-900">
                  পেআউট হিস্টোরি
                </h3>
              </div>
              <div className="divide-y divide-stone-200">
                {payouts.map((p, i) => (
                  <div key={i} className="p-5 flex gap-3">
                    <Banknote className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm text-stone-700">
                        ৳{p.amount} — {p.project}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">
                        {p.date} · {p.method}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}