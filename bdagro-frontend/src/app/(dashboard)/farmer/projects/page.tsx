import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Wallet,
  Bell,
  Settings,
  Plus,
  MapPin,
  Pencil,
  Eye,
} from "lucide-react";
import StatusTag from "@/components/others/StatusTag";
import ProgressBar from "@/components/others/ProgressBar";


const projects = [
  {
    name: "সবুজ ধানখেত",
    location: "কুমিল্লা",
    crop: "ধান",
    goal: "৫,০০,০০০",
    raised: "৩,৭৫,০০০",
    percent: 75,
    status: "Approved",
    tone: "emerald",
  },
  {
    name: "নতুন সবজি খামার",
    location: "কুমিল্লা",
    crop: "সবজি",
    goal: "৩,৫০,০০০",
    raised: "০",
    percent: 0,
    status: "Processing",
    tone: "amber",
  },
  {
    name: "শীতকালীন আলু চাষ",
    location: "কুমিল্লা",
    crop: "আলু",
    goal: "২,৮০,০০০",
    raised: "০",
    percent: 0,
    status: "Pending",
    tone: "stone",
  },
  {
    name: "পুকুরে মাছ চাষ",
    location: "কুমিল্লা",
    crop: "মৎস্য",
    goal: "৩,০০,০০০",
    raised: "০",
    percent: 0,
    status: "Rejected",
    tone: "stone",
  },
];

export default function FarmerMyProjectsPage() {
  return (
    <div className="bg-white min-h-screen flex">

      {/* MAIN */}
      <div className="flex-1 min-w-0">

        <div className="p-8">
          <div className="flex items-center justify-between mb-5">
            <span className="text-sm text-stone-400">৪টি প্রকল্প</span>
          </div>

          <div className="border border-stone-200">
            <div className="divide-y divide-stone-200">
              {projects.map((p) => (
                <div key={p.name} className="p-6 flex items-center gap-6 flex-wrap">
                  <div className="w-14 h-14 bg-emerald-900 flex items-center justify-center shrink-0">
                    <Sprout className="w-6 h-6 text-white/70" />
                  </div>

                  <div className="flex-1 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900">{p.name}</span>
                      <StatusTag status={p.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {p.location}
                      </span>
                      <span>·</span>
                      <span>{p.crop}</span>
                    </div>
                  </div>

                  <div className="w-40">
                    <ProgressBar percent={p.percent} tone={p.tone} />
                    <div className="mt-1.5 text-xs text-stone-400">
                      ৳{p.raised} / ৳{p.goal}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button className="w-9 h-9 flex items-center justify-center border border-stone-300 text-stone-500 hover:border-emerald-800 hover:text-emerald-900">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="w-9 h-9 flex items-center justify-center border border-stone-300 text-stone-500 hover:border-emerald-800 hover:text-emerald-900">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}