import { MoreVertical } from "lucide-react";
import { RoleTag } from "@/components/ui/RoleTag";

const users = [
  { name: "আব্দুল করিম", phone: "+৮৮০ ১৭১২-৩৪৫৬৭৮", role: "Farmer" as const, status: "Verified", joined: "১২ জুন ২০২৬" },
  { name: "রাহাত করিম", phone: "+৮৮০ ১৮৯৮-৭৬৫৪৩২", role: "Investor" as const, status: "Active", joined: "৩ মে ২০২৬" },
  { name: "সালমা বেগম", phone: "+৮৮০ ১৯১১-১১২২৩৩", role: "Farmer" as const, status: "Pending", joined: "৯ সেপ্টেম্বর ২০২৬" },
  { name: "নাফিস আহমেদ", phone: "+৮৮০ ১৭৭৭-০০৯৯১১", role: "Admin" as const, status: "Active", joined: "১ জানুয়ারি ২০২৬" },
  { name: "মনির হোসেন", phone: "+৮৮০ ১৬৫৫-৪৪৩৩২২", role: "Farmer" as const, status: "Verified", joined: "২০ আগস্ট ২০২৬" },
  { name: "তানভীর আলম", phone: "+৮৮০ ১৩৩৪-৫৫৬৬৭৭", role: "Investor" as const, status: "Active", joined: "১৫ ফেব্রুয়ারি ২০২৬" },
  { name: "শিরিন আক্তার", phone: "+৮৮০ ১৯৮৮-৩৩২২১১", role: "Farmer" as const, status: "Rejected", joined: "২ সেপ্টেম্বর ২০২৬" },
];

export default function AdminUserManagementPage() {
  return (
    <div className="bg-white min-h-screen flex">

      {/* MAIN */}
      <div className="flex-1 min-w-0">

        <div className="p-8">
          {/* ROLE FILTER TABS */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
            <div className="flex gap-2">
              {["সব", "Farmer", "Investor", "Admin"].map((t, i) => (
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
            <span className="text-sm text-neutral-400">৭ জন ইউজার</span>
          </div>

          <div className="border border-neutral-200">
            <div className="grid grid-cols-[1fr_1fr_100px_110px_120px_40px] gap-4 px-5 py-3 border-b border-neutral-200 text-xs text-neutral-400">
              <span>নাম</span>
              <span>ফোন নম্বর</span>
              <span>রোল</span>
              <span>স্ট্যাটাস</span>
              <span>যোগদান</span>
              <span></span>
            </div>
            <div className="divide-y divide-neutral-100">
              {users.map((u) => (
                <div
                  key={u.name}
                  className="grid grid-cols-[1fr_1fr_100px_110px_120px_40px] gap-4 px-5 py-4 items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-sm shrink-0">
                      {u.name[0]}
                    </div>
                    <span className="text-sm text-neutral-800">{u.name}</span>
                  </div>
                  <span className="text-sm text-neutral-500">{u.phone}</span>
                  <RoleTag role={u.role} />
                  <span className="text-xs border border-neutral-300 text-neutral-600 bg-neutral-50 px-2 py-0.5">
                    {u.status}
                  </span>
                  <span className="text-xs text-neutral-400">{u.joined}</span>
                  <button className="text-neutral-400 hover:text-neutral-700">
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
