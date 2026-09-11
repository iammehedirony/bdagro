import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Wallet,
  Bell,
  Settings,
  Plus,
  CheckCircle2,
  TrendingUp,
  Users,
  MapPin,
} from "lucide-react";
import StatCard from "@/components/others/StatCard";
import ProgressBar from "@/components/others/ProgressBar";


const activity = [
  { icon: CheckCircle2, tone: "emerald", text: "সবুজ ধানখেত প্রকল্পে নতুন বিনিয়োগ পেয়েছেন ৳১০,০০০", time: "১০ মিনিট আগে" },
  { icon: TrendingUp, tone: "amber", text: "আম বাগান প্রকল্প ৫০% ফান্ডিং সম্পন্ন করেছে", time: "২ ঘণ্টা আগে" },
  { icon: Users, tone: "emerald", text: "সবুজ ধানখেত প্রকল্পে মোট ৬২ জন বিনিয়োগকারী যুক্ত হয়েছেন", time: "গতকাল" },
];

function FarmerOverviewPage() {
  return (
    <div className="bg-white min-h-screen flex">
      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8">
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="সক্রিয় প্রকল্প" value="২টি" sub="১টি অনুমোদনের অপেক্ষায়" />
            <StatCard label="মোট সংগৃহীত ফান্ড" value="৳৪,৭৫,০০০" sub="সব প্রকল্প মিলিয়ে" />
            <StatCard label="মোট বিনিয়োগকারী" value="৬২ জন" sub="সবুজ ধানখেত প্রকল্পে" />
            <StatCard label="বকেয়া কিস্তি" value="৳৬,১৩৩" sub="১৫ সেপ্টেম্বরের মধ্যে" />
          </div>

          <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-8">
            {/* PROJECT SUMMARY */}
            <div className="border border-stone-200">
              <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                <h3 className="text-stone-900">
                  আমার প্রকল্পের অবস্থা
                </h3>
                <span className="text-xs text-stone-400">২টি প্রকল্প</span>
              </div>
              <div className="divide-y divide-stone-200">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-stone-900">সবুজ ধানখেত</div>
                      <div className="flex items-center gap-1 text-xs text-stone-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        কুমিল্লা
                      </div>
                    </div>
                    <span className="text-xs border border-emerald-600 text-emerald-800 bg-emerald-50 px-2 py-0.5">
                      Approved
                    </span>
                  </div>
                  <div className="mt-4">
                    <ProgressBar percent={75} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
                    <span>৳৩,৭৫,০০০ সংগৃহীত</span>
                    <span>লক্ষ্য ৳৫,০০,০০০</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-stone-900">নতুন সবজি খামার</div>
                      <div className="flex items-center gap-1 text-xs text-stone-400 mt-1">
                        <MapPin className="w-3 h-3" />
                        কুমিল্লা
                      </div>
                    </div>
                    <span className="text-xs border border-amber-600 text-amber-800 bg-amber-50 px-2 py-0.5">
                      Processing
                    </span>
                  </div>
                  <div className="mt-4">
                    <ProgressBar percent={0} tone="amber" />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
                    <span>ফান্ডিং এখনো শুরু হয়নি</span>
                    <span>লক্ষ্য ৳৩,৫০,০০০</span>
                  </div>
                </div>
              </div>
            </div>

            {/* RECENT ACTIVITY */}
            <div className="border border-stone-200 h-fit">
              <div className="p-6 border-b border-stone-200">
                <h3 className="text-stone-900">
                  সাম্প্রতিক কার্যক্রম
                </h3>
              </div>
              <div className="divide-y divide-stone-200">
                {activity.map((a, i) => (
                  <div key={i} className="p-5 flex gap-3">
                    <a.icon
                      className={`w-4 h-4 mt-0.5 shrink-0 ${
                        a.tone === "emerald" ? "text-emerald-700" : "text-amber-600"
                      }`}
                    />
                    <div>
                      <div className="text-sm text-stone-700 leading-snug">
                        {a.text}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">{a.time}</div>
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

export default FarmerOverviewPage;