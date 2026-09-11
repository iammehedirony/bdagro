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

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
`;

const serif = { fontFamily: "'Fraunces', serif" };
const sans = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

function NavItem({ icon: Icon, label, active, badge }) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2.5 text-sm cursor-pointer ${
        active
          ? "bg-emerald-900 text-white"
          : "text-emerald-100/60 hover:bg-emerald-900/40 hover:text-emerald-50"
      }`}
    >
      <span className="flex items-center gap-3">
        <Icon className="w-4 h-4" />
        {label}
      </span>
      {badge && (
        <span className="bg-amber-500 text-emerald-950 text-[10px] px-1.5 py-0.5">
          {badge}
        </span>
      )}
    </div>
  );
}

function ProgressBar({ percent, tone = "emerald" }) {
  const fill =
    tone === "emerald" ? "bg-emerald-600" : tone === "amber" ? "bg-amber-500" : "bg-stone-300";
  return (
    <div className="h-1.5 w-24 bg-stone-200">
      <div className={`h-1.5 ${fill}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

function StatusTag({ status }) {
  const map = {
    Approved: "border-emerald-600 text-emerald-800 bg-emerald-50",
    Processing: "border-amber-600 text-amber-800 bg-amber-50",
    Pending: "border-stone-300 text-stone-500 bg-stone-50",
    Rejected: "border-orange-600 text-orange-700 bg-orange-50",
  };
  return <span className={`text-xs border px-2 py-0.5 ${map[status]}`}>{status}</span>;
}

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
    <div className="bg-white min-h-screen flex" style={sans}>
      <style>{fontImport}</style>

      {/* SIDEBAR */}
      <aside className="w-60 bg-emerald-950 min-h-screen flex flex-col shrink-0">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-emerald-900">
          <Sprout className="w-5 h-5 text-amber-400" />
          <span className="text-stone-50 text-base" style={serif}>
            Bdagroonline
          </span>
        </div>
        <nav className="py-4 space-y-1">
          <NavItem icon={LayoutDashboard} label="ওভারভিউ" />
          <NavItem icon={ShieldCheck} label="যাচাই অপেক্ষমাণ" badge="৮" />
          <NavItem icon={Users} label="ইউজার ম্যানেজমেন্ট" />
          <NavItem icon={CropIcon} label="সব প্রকল্প" active />
          <NavItem icon={Bell} label="নোটিফিকেশন" />
          <NavItem icon={Settings} label="সেটিংস" />
        </nav>
        <div className="mt-auto p-5 border-t border-emerald-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-emerald-950 text-sm">
            ন
          </div>
          <div>
            <div className="text-sm text-stone-100">নাফিস আহমেদ</div>
            <div className="text-xs text-emerald-100/50">অ্যাডমিন</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-stone-200 flex items-center justify-between px-8">
          <div className="text-stone-900 text-base" style={serif}>
            সব প্রকল্প
          </div>
          <div className="flex items-center gap-2 border border-stone-300 px-3 py-2 max-w-xs">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="প্রকল্পের নাম দিয়ে খুঁজুন"
              className="flex-1 text-sm outline-none placeholder:text-stone-300"
            />
          </div>
        </header>

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