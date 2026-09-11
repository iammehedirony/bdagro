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
  MoreVertical,
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

const users = [
  { name: "আব্দুল করিম", phone: "+৮৮০ ১৭১২-৩৪৫৬৭৮", role: "Farmer", status: "Verified", joined: "১২ জুন ২০২৬" },
  { name: "রাহাত করিম", phone: "+৮৮০ ১৮৯৮-৭৬৫৪৩২", role: "Investor", status: "Active", joined: "৩ মে ২০২৬" },
  { name: "সালমা বেগম", phone: "+৮৮০ ১৯১১-১১২২৩৩", role: "Farmer", status: "Pending", joined: "৯ সেপ্টেম্বর ২০২৬" },
  { name: "নাফিস আহমেদ", phone: "+৮৮০ ১৭৭৭-০০৯৯১১", role: "Admin", status: "Active", joined: "১ জানুয়ারি ২০২৬" },
  { name: "মনির হোসেন", phone: "+৮৮০ ১৬৫৫-৪৪৩৩২২", role: "Farmer", status: "Verified", joined: "২০ আগস্ট ২০২৬" },
  { name: "তানভীর আলম", phone: "+৮৮০ ১৩৩৪-৫৫৬৬৭৭", role: "Investor", status: "Active", joined: "১৫ ফেব্রুয়ারি ২০২৬" },
  { name: "শিরিন আক্তার", phone: "+৮৮০ ১৯৮৮-৩৩২২১১", role: "Farmer", status: "Rejected", joined: "২ সেপ্টেম্বর ২০২৬" },
];

function RoleTag({ role }) {
  const map = {
    Farmer: "border-emerald-600 text-emerald-800 bg-emerald-50",
    Investor: "border-amber-600 text-amber-800 bg-amber-50",
    Admin: "border-stone-400 text-stone-700 bg-stone-100",
  };
  return <span className={`text-xs border px-2 py-0.5 ${map[role]}`}>{role}</span>;
}

function StatusTag({ status }) {
  const map = {
    Verified: "border-emerald-600 text-emerald-800 bg-emerald-50",
    Active: "border-emerald-600 text-emerald-800 bg-emerald-50",
    Pending: "border-amber-600 text-amber-800 bg-amber-50",
    Rejected: "border-orange-600 text-orange-700 bg-orange-50",
  };
  return <span className={`text-xs border px-2 py-0.5 ${map[status]}`}>{status}</span>;
}

export default function AdminUserManagementPage() {
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
          <NavItem icon={Users} label="ইউজার ম্যানেজমেন্ট" active />
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
            ইউজার ম্যানেজমেন্ট
          </div>
          <div className="flex items-center gap-2 border border-stone-300 px-3 py-2 max-w-xs">
            <Search className="w-4 h-4 text-stone-400" />
            <input
              type="text"
              placeholder="নাম বা ফোন দিয়ে খুঁজুন"
              className="flex-1 text-sm outline-none placeholder:text-stone-300"
            />
          </div>
        </header>

        <div className="p-8">
          {/* ROLE FILTER TABS */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
            <div className="flex gap-2">
              {["সব", "Farmer", "Investor", "Admin"].map((t, i) => (
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
            <span className="text-sm text-stone-400">৭ জন ইউজার</span>
          </div>

          <div className="border border-stone-200">
            <div className="grid grid-cols-[1fr_1fr_100px_110px_120px_40px] gap-4 px-5 py-3 border-b border-stone-200 text-xs text-stone-400">
              <span>নাম</span>
              <span>ফোন নম্বর</span>
              <span>রোল</span>
              <span>স্ট্যাটাস</span>
              <span>যোগদান</span>
              <span></span>
            </div>
            <div className="divide-y divide-stone-100">
              {users.map((u) => (
                <div
                  key={u.name}
                  className="grid grid-cols-[1fr_1fr_100px_110px_120px_40px] gap-4 px-5 py-4 items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-sm shrink-0">
                      {u.name[0]}
                    </div>
                    <span className="text-sm text-stone-800">{u.name}</span>
                  </div>
                  <span className="text-sm text-stone-500">{u.phone}</span>
                  <RoleTag role={u.role} />
                  <StatusTag status={u.status} />
                  <span className="text-xs text-stone-400">{u.joined}</span>
                  <button className="text-stone-400 hover:text-stone-700">
                    <MoreVertical className="w-4 h-4" />
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