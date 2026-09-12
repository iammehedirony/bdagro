import { MapPin, CheckCircle2, TrendingUp, Clock } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import ProgressBar from "@/components/ui/ProgressBar";
import RiskDot from "@/components/ui/RiskDot";

const investments: Array<{
  name: string;
  location: string;
  invested: string;
  current: string;
  roi: string;
  risk: "কম" | "মাঝারি" | "বেশি";
  status: string;
  percent: number;
  tone: "emerald" | "amber" | "orange";
}> = [
  {
    name: "সবুজ ধানখেত",
    location: "কুমিল্লা",
    invested: "৫০,০০০",
    current: "৫৭,৫০০",
    roi: "+১৫%",
    risk: "কম",
    status: "Approved",
    percent: 75,
    tone: "emerald",
  },
  {
    name: "আম বাগান প্রকল্প",
    location: "রাজশাহী",
    invested: "৭৫,০০০",
    current: "৮৪,০০০",
    roi: "+১২%",
    risk: "মাঝারি",
    status: "Processing",
    percent: 50,
    tone: "amber",
  },
  {
    name: "মাছ চাষ প্রকল্প",
    location: "খুলনা",
    invested: "৩০,০০০",
    current: "৩৬,৬০০",
    roi: "+২২%",
    risk: "বেশি",
    status: "Approved",
    percent: 100,
    tone: "orange",
  },
];

const chartBars = [40, 55, 48, 62, 58, 70, 65, 78, 74, 85, 90, 96];

const notifications = [
  {
    icon: CheckCircle2,
    text: "সবুজ ধানখেত প্রকল্পে আপনার বিনিয়োগ অনুমোদিত হয়েছে",
    time: "২ ঘণ্টা আগে",
  },
  {
    icon: TrendingUp,
    text: "মাছ চাষ প্রকল্প থেকে ৳৬,৬০০ রিটার্ন জমা হয়েছে",
    time: "গতকাল",
  },
  {
    icon: Clock,
    text: "আম বাগান প্রকল্প এখনো Processing ধাপে আছে",
    time: "২ দিন আগে",
  },
];

export default function InvestorDashboard() {
  const maxBar = Math.max(...chartBars);

  return (
    <div className="bg-white min-h-screen flex">
      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8 grid lg:grid-cols-[1fr_300px] gap-8">
          <div>
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="মোট বিনিয়োগ" value="৳১,৫৫,০০০" />
              <StatCard label="বর্তমান মূল্য" value="৳১,৭৮,১০০" sub="+১৪.৯%" tone="up" />
              <StatCard label="সামগ্রিক ROI" value="১৪.৯%" sub="গত ৩ মাসে" />
              <StatCard label="সক্রিয় বিনিয়োগ" value="৩টি" sub="১টি সম্পূর্ণ ফান্ডেড" />
            </div>

            {/* CHART */}
            <div className="mt-8 border border-neutral-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-neutral-900">
                  পোর্টফোলিও মূল্য — গত ১২ মাস
                </h3>
                <span className="text-xs text-neutral-400">
                  জানুয়ারি – ডিসেম্বর
                </span>
              </div>
              <div className="flex items-end gap-2 h-32">
                {chartBars.map((v, i) => (
                  <div
                    key={i}
                    className={`flex-1 ${
                      i === chartBars.length - 1
                        ? "bg-accent-500"
                        : "bg-primary-800"
                    }`}
                    style={{ height: `${(v / maxBar) * 100}%` }}
                  />
                ))}
              </div>
            </div>

            {/* INVESTMENTS TABLE */}
            <div className="mt-8 border border-neutral-200">
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="text-neutral-900">
                  আমার বিনিয়োগসমূহ
                </h3>
                <span className="text-xs text-neutral-400">৩টি প্রকল্প</span>
              </div>
              <div className="divide-y divide-neutral-200">
                {investments.map((inv) => (
                  <div key={inv.name} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-neutral-900">{inv.name}</div>
                        <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                          <MapPin className="w-3 h-3" />
                          {inv.location}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-neutral-900">৳{inv.current}</div>
                        <div className="text-xs text-primary-700 mt-0.5">
                          {inv.roi}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <ProgressBar percent={inv.percent} tone={inv.tone as "emerald" | "amber" | "orange"} />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <span className="text-neutral-400">
                          বিনিয়োগ ৳{inv.invested}
                        </span>
                        <RiskDot level={inv.risk as "কম" | "মাঝারি" | "বেশি"} />
                      </div>
                      <span
                        className={`border px-2 py-0.5 ${
                          inv.status === "Approved"
                            ? "border-primary-600 text-primary-800 bg-primary-50"
                            : "border-accent-600 text-accent-800 bg-accent-50"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-8">
            {/* RISK BREAKDOWN */}
            <div className="border border-neutral-200 p-6">
              <h3 className="text-neutral-900 mb-4">
                ঝুঁকি অনুযায়ী বণ্টন
              </h3>
              <div className="h-2 w-full flex overflow-hidden">
                <div className="bg-primary-600" style={{ width: "40%" }} />
                <div className="bg-accent-500" style={{ width: "35%" }} />
                <div className="bg-danger-500" style={{ width: "25%" }} />
              </div>
              <div className="mt-4 space-y-2 text-xs text-neutral-500">
                <div className="flex items-center justify-between">
                  <RiskDot level="কম" />
                  <span>৪০%</span>
                </div>
                <div className="flex items-center justify-between">
                  <RiskDot level="মাঝারি" />
                  <span>৩৫%</span>
                </div>
                <div className="flex items-center justify-between">
                  <RiskDot level="বেশি" />
                  <span>২৫%</span>
                </div>
              </div>
            </div>

            {/* NOTIFICATIONS */}
            <div className="border border-neutral-200">
              <div className="p-6 border-b border-neutral-200">
                <h3 className="text-neutral-900">
                  সাম্প্রতিক আপডেট
                </h3>
              </div>
              <div className="divide-y divide-neutral-200">
                {notifications.map((n, i) => (
                  <div key={i} className="p-5 flex gap-3">
                    <n.icon className="w-4 h-4 text-primary-700 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm text-neutral-700 leading-snug">
                        {n.text}
                      </div>
                      <div className="text-xs text-neutral-400 mt-1">
                        {n.time}
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