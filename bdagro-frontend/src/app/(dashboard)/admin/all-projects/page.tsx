import { Sprout, Eye, MapPin } from "lucide-react";
import StatusTag from "@/components/ui/StatusTag";
import ProgressBar from "@/components/ui/ProgressBar";

const projects = [
  { name: "সবুজ ধানখেত", farmer: "আব্দুল করিম", location: "কুমিল্লা", goal: "৫,০০,০০০", percent: 75, status: "Approved" as const, tone: "emerald" as const },
  { name: "আম বাগান প্রকল্প", farmer: "সালমা বেগম", location: "রাজশাহী", goal: "৮,০০,০০০", percent: 50, status: "Approved" as const, tone: "emerald" as const },
  { name: "মাছ চাষ প্রকল্প", farmer: "রফিকুল ইসলাম", location: "খুলনা", goal: "৬,৫০,০০০", percent: 74, status: "Approved" as const, tone: "emerald" as const },
  { name: "লিচু বাগান সম্প্রসারণ", farmer: "মনির হোসেন", location: "দিনাজপুর", goal: "৪,৫০,০০০", percent: 0, status: "Pending" as const, tone: "amber" as const },
  { name: "পোল্ট্রি খামার", farmer: "শিরিন আক্তার", location: "গাজীপুর", goal: "৩,০০,০০০", percent: 0, status: "Pending" as const, tone: "amber" as const },
  { name: "নতুন সবজি খামার", farmer: "আব্দুল করিম", location: "কুমিল্লা", goal: "৩,৫০,০০০", percent: 0, status: "Processing" as const, tone: "amber" as const },
  { name: "পুকুরে মাছ চাষ", farmer: "আব্দুল করিম", location: "কুমিল্লা", goal: "৩,০০,০০০", percent: 0, status: "Rejected" as const, tone: "amber" as const },
];

export default function AdminAllProjectsPage() {
  return (
    <div className="bg-white min-h-screen flex">

      {/* MAIN */}
      <div className="flex-1 min-w-0">

        <div className="p-8">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
            <div className="flex gap-2">
              {["সব", "Approved", "Processing", "Pending", "Rejected"].map((t, i) => (
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
            <span className="text-sm text-neutral-400">৭টি প্রকল্প</span>
          </div>

          <div className="border border-neutral-200">
            <div className="divide-y divide-neutral-200">
              {projects.map((p) => (
                <div key={p.name + p.farmer} className="p-5 flex items-center gap-6 flex-wrap">
                  <div
                    className={`w-11 h-11 flex items-center justify-center shrink-0 ${
                      p.tone === "emerald" ? "bg-primary-900" : p.tone === "amber" ? "bg-accent-700" : "bg-neutral-300"
                    }`}
                  >
                    <Sprout className="w-5 h-5 text-white/80" />
                  </div>

                  <div className="flex-1 min-w-45">
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-900 text-sm">{p.name}</span>
                      <StatusTag status={p.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-neutral-400 mt-1">
                      <span>কৃষক: {p.farmer}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {p.location}
                      </span>
                    </div>
                  </div>

                  <div>
                    <ProgressBar percent={p.percent} tone={p.tone} />
                    <div className="mt-1 text-xs text-neutral-400">{p.percent}% ফান্ডেড</div>
                  </div>

                  <div className="text-right w-28 shrink-0">
                    <div className="text-sm text-neutral-800">৳{p.goal}</div>
                    <div className="text-xs text-neutral-400">লক্ষ্যমাত্রা</div>
                  </div>

                  <button className="w-9 h-9 flex items-center justify-center border border-neutral-300 text-neutral-500 hover:border-primary-800 hover:text-primary-900 shrink-0">
                    <Eye className="w-4 h-4" />
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
