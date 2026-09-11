import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Sprout as CropIcon,
  Settings,
  Bell,
  MapPin,
  Check,
  X,
  Search,
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

const nidQueue = [
  { name: "আব্দুল করিম", location: "কুমিল্লা", nid: "৩৪৫৬ XXXX XXXX", submitted: "২ ঘণ্টা আগে" },
  { name: "সালমা বেগম", location: "রাজশাহী", nid: "৭৭২১ XXXX XXXX", submitted: "৫ ঘণ্টা আগে" },
  { name: "রফিকুল ইসলাম", location: "দিনাজপুর", nid: "৯০১২ XXXX XXXX", submitted: "গতকাল" },
  { name: "মনির হোসেন", location: "দিনাজপুর", nid: "৪৪৫৬ XXXX XXXX", submitted: "গতকাল" },
  { name: "শিরিন আক্তার", location: "গাজীপুর", nid: "৫৫৬৭ XXXX XXXX", submitted: "২ দিন আগে" },
];

const projectQueue = [
  { name: "লিচু বাগান সম্প্রসারণ", farmer: "মনির হোসেন", location: "দিনাজপুর", goal: "৪,৫০,০০০", risk: "মাঝারি" },
  { name: "পোল্ট্রি খামার", farmer: "শিরিন আক্তার", location: "গাজীপুর", goal: "৩,০০,০০০", risk: "কম" },
  { name: "তরমুজ চাষ", farmer: "কামাল হোসেন", location: "পটুয়াখালী", goal: "২,২০,০০০", risk: "বেশি" },
];

export default function AdminPendingVerificationsPage() {
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
          <NavItem icon={ShieldCheck} label="যাচাই অপেক্ষমাণ" active badge="৮" />
          <NavItem icon={Users} label="ইউজার ম্যানেজমেন্ট" />
          <NavItem icon={CropIcon} label="সব প্রকল্প" />
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
            যাচাই অপেক্ষমাণ
          </div>
          <div className="flex items-center gap-2 border border-stone-300 px-3 py-2 max-w-xs">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="নাম দিয়ে খুঁজুন"
              className="flex-1 text-sm outline-none placeholder:text-stone-300"
            />
          </div>
        </header>

        <div className="p-8">
          {/* TABS */}
          <div className="flex gap-2 border-b border-stone-200 mb-6">
            <button className="px-4 py-2.5 text-sm border-b-2 border-emerald-800 text-emerald-900 -mb-px">
              NID যাচাই ({nidQueue.length})
            </button>
            <button className="px-4 py-2.5 text-sm border-b-2 border-transparent text-stone-400 hover:text-stone-700 -mb-px">
              প্রকল্প অনুমোদন ({projectQueue.length})
            </button>
          </div>

          {/* NID VERIFICATION LIST */}
          <div className="border border-stone-200">
            <div className="divide-y divide-stone-200">
              {nidQueue.map((u) => (
                <div key={u.name} className="p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-sm shrink-0">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="text-sm text-stone-800">{u.name}</div>
                      <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {u.location}
                        <span className="mx-1">·</span>
                        NID: {u.nid}
                        <span className="mx-1">·</span>
                        {u.submitted}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button className="text-xs border border-stone-300 text-stone-600 px-3 py-1.5 hover:border-emerald-800 hover:text-emerald-900">
                      বিস্তারিত দেখুন
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-emerald-600 text-emerald-700 hover:bg-emerald-50">
                      <Check className="w-4 h-4" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center border border-orange-500 text-orange-600 hover:bg-orange-50">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PROJECT APPROVAL LIST (secondary, shown collapsed under tab context) */}
          <div className="mt-10">
            <h3 className="text-stone-900 mb-4" style={serif}>
              প্রকল্প অনুমোদন অপেক্ষমাণ
            </h3>
            <div className="border border-stone-200">
              <div className="divide-y divide-stone-200">
                {projectQueue.map((p) => (
                  <div key={p.name} className="p-5">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <div className="text-sm text-stone-800">{p.name}</div>
                        <div className="text-xs text-stone-400 mt-1">
                          কৃষক: {p.farmer} ·{" "}
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {p.location}
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm text-stone-800">৳{p.goal}</div>
                        <div className="text-xs text-stone-400 mt-0.5">ঝুঁকি: {p.risk}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <button className="flex-1 border border-emerald-800 bg-emerald-900 text-white py-2 text-sm hover:bg-emerald-800">
                        অনুমোদন করুন
                      </button>
                      <button className="flex-1 border border-stone-300 text-stone-600 py-2 text-sm hover:border-orange-500 hover:text-orange-600">
                        প্রত্যাখ্যান করুন
                      </button>
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