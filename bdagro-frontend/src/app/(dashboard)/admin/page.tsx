import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Sprout as CropIcon,
  MapPin,
  Check,
  X,
} from "lucide-react";
import StatCard from "@/components/others/StatCard";

const nidQueue = [
  { name: "আব্দুল করিম", location: "কুমিল্লা", submitted: "২ ঘণ্টা আগে" },
  { name: "সালমা বেগম", location: "রাজশাহী", submitted: "৫ ঘণ্টা আগে" },
  { name: "রফিকুল ইসলাম", location: "দিনাজপুর", submitted: "গতকাল" },
];

const projectQueue = [
  {
    name: "লিচু বাগান সম্প্রসারণ",
    farmer: "মনির হোসেন",
    location: "দিনাজপুর",
    goal: "৪,৫০,০০০",
    risk: "মাঝারি",
  },
  {
    name: "পোল্ট্রি খামার",
    farmer: "শিরিন আক্তার",
    location: "গাজীপুর",
    goal: "৩,০০,০০০",
    risk: "কম",
  },
];

const users = [
  { name: "আব্দুল করিম", role: "Farmer", status: "Verified" },
  { name: "রাহাত করিম", role: "Investor", status: "Active" },
  { name: "সালমা বেগম", role: "Farmer", status: "Pending" },
  { name: "নাফিস আহমেদ", role: "Admin", status: "Active" },
];

export default function AdminDashboard() {
  return (
    <div className="bg-white min-h-screen flex">

      {/* MAIN */}
      <div className="flex-1 min-w-0">

        <div className="p-8">
          {/* STAT CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="মোট কৃষক" value="৫২৭" sub="+১২ এই সপ্তাহে" />
            <StatCard label="মোট বিনিয়োগকারী" value="১,২৪৮" sub="+৩৮ এই সপ্তাহে" />
            <StatCard label="সক্রিয় প্রকল্প" value="৪৭" sub="৫টি যাচাই বাকি" />
            <StatCard label="মোট বিনিয়োগ" value="৳২.৮ কোটি" sub="সর্বমোট প্ল্যাটফর্মে" />
          </div>

          <div className="mt-8 grid xl:grid-cols-[1fr_320px] gap-8">
            <div className="space-y-8">
              {/* NID VERIFICATION QUEUE */}
              <div className="border border-stone-200">
                <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                  <h3 className="text-stone-900">
                    NID যাচাই অপেক্ষমাণ
                  </h3>
                  <span className="text-xs text-stone-400">৩টি অনুরোধ</span>
                </div>
                <div className="divide-y divide-stone-200">
                  {nidQueue.map((u) => (
                    <div
                      key={u.name}
                      className="p-5 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-sm shrink-0">
                          {u.name[0]}
                        </div>
                        <div>
                          <div className="text-sm text-stone-800">
                            {u.name}
                          </div>
                          <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {u.location}
                            <span className="mx-1">·</span>
                            {u.submitted}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
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

              {/* PROJECT APPROVAL QUEUE */}
              <div className="border border-stone-200">
                <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                  <h3 className="text-stone-900">
                    প্রকল্প অনুমোদন অপেক্ষমাণ
                  </h3>
                  <span className="text-xs text-stone-400">২টি অনুরোধ</span>
                </div>
                <div className="divide-y divide-stone-200">
                  {projectQueue.map((p) => (
                    <div key={p.name} className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="text-sm text-stone-800">
                            {p.name}
                          </div>
                          <div className="text-xs text-stone-400 mt-1">
                            কৃষক: {p.farmer} ·{" "}
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {p.location}
                            </span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-sm text-stone-800">
                            ৳{p.goal}
                          </div>
                          <div className="text-xs text-stone-400 mt-0.5">
                            ঝুঁকি: {p.risk}
                          </div>
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

            {/* USER MANAGEMENT / RBAC */}
            <div className="border border-stone-200 h-fit">
              <div className="p-6 border-b border-stone-200">
                <h3 className="text-stone-900">
                  ইউজার ও রোল
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  Role-Based Access Control
                </p>
              </div>
              <div className="divide-y divide-stone-200">
                {users.map((u) => (
                  <div
                    key={u.name}
                    className="p-4 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-sm text-stone-800">{u.name}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {u.role}
                      </div>
                    </div>
                    <span
                      className={`text-xs border px-2 py-0.5 ${
                        u.status === "Verified" || u.status === "Active"
                          ? "border-emerald-600 text-emerald-800 bg-emerald-50"
                          : "border-amber-600 text-amber-800 bg-amber-50"
                      }`}
                    >
                      {u.status}
                    </span>
                  </div>
                ))}
              </div>
              <div className="p-4">
                <button className="w-full text-sm text-emerald-900 border border-stone-300 py-2 hover:border-emerald-800">
                  সব ইউজার দেখুন
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}