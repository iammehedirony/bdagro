import ProgressBar from "@/components/others/ProgressBar";
import RiskDot from "@/components/others/RiskDot";
import Badge from "@/components/others/Badge";
import { Download, MapPin, Sprout } from "lucide-react";

const investments = [
  { name: "সবুজ ধানখেত", location: "কুমিল্লা", invested: "৫০,০০০", current: "৫৭,৫০০", roi: "+১৫%", risk: "কম" as const, status: "Approved", percent: 75, tone: "emerald" as const, date: "১২ জুন ২০২৬" },
  { name: "আম বাগান প্রকল্প", location: "রাজশাহী", invested: "৭৫,০০০", current: "৮৪,০০০", roi: "+১২%", risk: "মাঝারি" as const, status: "Processing", percent: 50, tone: "amber" as const, date: "৩ জুলাই ২০২৬" },
  { name: "মাছ চাষ প্রকল্প", location: "খুলনা", invested: "৩০,০০০", current: "৩৬,৬০০", roi: "+২২%", risk: "বেশি" as const, status: "Approved", percent: 100, tone: "orange" as const, date: "২০ মে ২০২৬" },
  { name: "গরু মোটাতাজাকরণ", location: "পাবনা", invested: "৪৫,০০০", current: "৫২,২০০", roi: "+১৬%", risk: "কম" as const, status: "সম্পন্ন", percent: 100, tone: "emerald" as const, date: "১০ জানুয়ারি ২০২৬" },
];

export default function InvestorMyInvestmentsPage() {
  return (
    <div className="bg-white min-h-screen flex">

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8">
          {/* FILTER TABS */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
            <div className="flex gap-2">
              {["সব", "সক্রিয়", "সম্পন্ন"].map((t, i) => (
                <button
                  key={t}
                  className={`px-4 py-2 text-sm border ${
                    i === 0
                      ? "bg-primary-900 text-white border-primary-900"
                      : "border-neutral-300 text-neutral-600 hover:border-primary-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <span className="text-sm text-neutral-400">৪টি বিনিয়োগ</span>
          </div>

          <div className="border border-neutral-200">
            <div className="divide-y divide-neutral-200">
              {investments.map((inv) => (
                <div key={inv.name} className="p-6 flex items-center gap-6 flex-wrap">
                  <div
                    className={`w-14 h-14 flex items-center justify-center shrink-0 ${
                      inv.tone === "emerald"
                        ? "bg-primary-900"
                        : inv.tone === "amber"
                        ? "bg-accent-700"
                        : "bg-danger-800"
                    }`}
                  >
                    <Sprout className="w-6 h-6 text-white/70" />
                  </div>

                  <div className="flex-1 min-w-45">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-900">{inv.name}</span>
                      <Badge variant={inv.status === "Approved" || inv.status === "সম্পন্ন" ? "success" : inv.status === "Processing" ? "warning" : "neutral"}>
                        {inv.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {inv.location}
                      </span>
                      <span>·</span>
                      <span>বিনিয়োগ {inv.date}</span>
                    </div>
                  </div>

                  <div className="w-36">
                    <ProgressBar percent={inv.percent} tone={inv.tone} />
                    <div className="mt-1.5 flex items-center justify-between text-xs text-neutral-400">
                      <RiskDot level={inv.risk} />
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-neutral-900">৳{inv.current}</div>
                    <div className="text-xs text-primary-700 mt-0.5">{inv.roi}</div>
                    <div className="text-xs text-neutral-400 mt-0.5">
                      বিনিয়োগ ৳{inv.invested}
                    </div>
                  </div>

                  <button className="flex items-center gap-1.5 text-xs border border-neutral-300 text-neutral-600 px-3 py-2 hover:border-primary-800 hover:text-primary-900 shrink-0">
                    <Download className="w-3.5 h-3.5" />
                    মানি রিসিট
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
