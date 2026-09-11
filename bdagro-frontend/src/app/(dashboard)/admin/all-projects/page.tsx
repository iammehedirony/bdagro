import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Sprout as CropIcon,
  Settings,
  Bell,
  Search,
  Eye,
  MapPin,
} from "lucide-react";
import StatusTag from "@/components/others/StatusTag";
import ProgressBar from "@/components/others/ProgressBar";


const projects = [
  { name: "সবুজ ধানখেত", farmer: "আব্দুল করিম", location: "কুমিল্লা", goal: "৫,০০,০০০", percent: 75, status: "Approved", tone: "emerald" },
  { name: "আম বাগান প্রকল্প", farmer: "সালমা বেগম", location: "রাজশাহী", goal: "৮,০০,০০০", percent: 50, status: "Approved", tone: "emerald" },
  { name: "মাছ চাষ প্রকল্প", farmer: "রফিকুল ইসলাম", location: "খুলনা", goal: "৬,৫০,০০০", percent: 74, status: "Approved", tone: "emerald" },
  { name: "লিচু বাগান সম্প্রসারণ", farmer: "মনির হোসেন", location: "দিনাজপুর", goal: "৪,৫০,০০০", percent: 0, status: "Pending", tone: "stone" },
  { name: "পোল্ট্রি খামার", farmer: "শিরিন আক্তার", location: "গাজীপুর", goal: "৩,০০,০০০", percent: 0, status: "Pending", tone: "stone" },
  { name: "নতুন সবজি খামার", farmer: "আব্দুল করিম", location: "কুমিল্লা", goal: "৩,৫০,০০০", percent: 0, status: "Processing", tone: "amber" },
  { name: "পুকুরে মাছ চাষ", farmer: "আব্দুল করিম", location: "কুমিল্লা", goal: "৩,০০,০০০", percent: 0, status: "Rejected", tone: "stone" },
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
                      ? "bg-emerald-900 text-white border-emerald-900"
                      : "border-stone-300 text-stone-600 hover:border-emerald-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <span className="text-sm text-stone-400">৭টি প্রকল্প</span>
          </div>

          <div className="border border-stone-200">
            <div className="divide-y divide-stone-200">
              {projects.map((p) => (
                <div key={p.name + p.farmer} className="p-5 flex items-center gap-6 flex-wrap">
                  <div
                    className={`w-11 h-11 flex items-center justify-center shrink-0 ${
                      p.tone === "emerald" ? "bg-emerald-900" : p.tone === "amber" ? "bg-amber-700" : "bg-stone-300"
                    }`}
                  >
                    <Sprout className="w-5 h-5 text-white/80" />
                  </div>

                  <div className="flex-1 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900 text-sm">{p.name}</span>
                      <StatusTag status={p.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
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
                    <div className="mt-1 text-xs text-stone-400">{p.percent}% ফান্ডেড</div>
                  </div>

                  <div className="text-right w-28 shrink-0">
                    <div className="text-sm text-stone-800">৳{p.goal}</div>
                    <div className="text-xs text-stone-400">লক্ষ্যমাত্রা</div>
                  </div>

                  <button className="w-9 h-9 flex items-center justify-center border border-stone-300 text-stone-500 hover:border-emerald-800 hover:text-emerald-900 shrink-0">
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