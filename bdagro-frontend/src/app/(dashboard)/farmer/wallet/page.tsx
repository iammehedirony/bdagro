import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Wallet,
  BarChart3,
  Bell,
  Settings,
  ArrowDownToLine,
  Smartphone,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusTag from "@/components/ui/StatusTag";


const payouts = [
  { id: "WD-8821", amount: "১৫,০০০", method: "বিকাশ", date: "৫ সেপ্টেম্বর ২০২৬", status: "সম্পন্ন" },
  { id: "WD-8790", amount: "৮,৭৫০", method: "নগদ", date: "২০ আগস্ট ২০২৬", status: "সম্পন্ন" },
  { id: "WD-8754", amount: "১০,০০০", method: "ব্যাংক অ্যাকাউন্ট", date: "১ আগস্ট ২০২৬", status: "প্রক্রিয়াধীন" },
  { id: "WD-8701", amount: "৫,০০০", method: "বিকাশ", date: "১৫ জুলাই ২০২৬", status: "ব্যর্থ" },
];

export default function FarmerWalletPage() {
  return (
    <div className="bg-white min-h-screen flex">

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8">
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="বর্তমান ব্যালেন্স" value="৳১২,৭৫০" sub="উত্তোলনযোগ্য" />
            <StatCard label="মোট উত্তোলিত" value="৳২৩,৭৫০" sub="সর্বমোট" />
            <StatCard label="অপেক্ষমাণ উত্তোলন" value="৳১০,০০০" sub="প্রক্রিয়াধীন" />
            <StatCard label="সর্বশেষ পেআউট" value="৳১৫,০০০" sub="৫ সেপ্টেম্বর ২০২৬" />
          </div>

          <div className="mt-8 grid lg:grid-cols-[1fr_360px] gap-8">
            {/* PAYOUT HISTORY */}
            <div className="border border-stone-200">
              <div className="p-6 border-b border-stone-200 flex items-center justify-between">
                <h3 className="text-stone-900">
                  পেআউট হিস্টোরি
                </h3>
                <span className="text-xs text-stone-400">৪টি লেনদেন</span>
              </div>
              <div className="divide-y divide-stone-200">
                {payouts.map((p) => (
                  <div key={p.id} className="p-5 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="text-sm text-stone-800">৳{p.amount}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        {p.id} · {p.method} · {p.date}
                      </div>
                    </div>
                    <StatusTag status={p.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* WITHDRAWAL REQUEST */}
            <div className="border border-stone-200 h-fit">
              <div className="p-6 border-b border-stone-200">
                <h3 className="text-stone-900">
                  উত্তোলনের অনুরোধ করুন
                </h3>
                <p className="text-xs text-stone-400 mt-1">
                  উত্তোলনযোগ্য ব্যালেন্স ৳১২,৭৫০
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-sm text-stone-700">উত্তোলনের পরিমাণ</label>
                  <div className="mt-1.5 flex items-center border border-stone-300 focus-within:border-emerald-700">
                    <span className="px-3 text-stone-400 text-sm">৳</span>
                    <input
                      type="text"
                      placeholder="যেমন: ১০,০০০"
                      className="flex-1 py-2.5 pr-3 text-sm outline-none placeholder:text-stone-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-stone-700">উত্তোলনের মাধ্যম</label>
                  <select className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-emerald-700">
                    <option>বিকাশ</option>
                    <option>নগদ</option>
                    <option>ব্যাংক অ্যাকাউন্ট</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-400 border border-stone-200 px-3 py-2.5">
                  <Smartphone className="w-3.5 h-3.5" />
                  ০১৭১২-৩৪৫৬৭৮ (বিকাশ) — সেটিংসে সংরক্ষিত অ্যাকাউন্ট
                </div>

                <button className="w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800">
                  উত্তোলনের অনুরোধ পাঠান
                </button>
                <div className="text-xs text-stone-400 text-center">
                  অনুমোদনে সাধারণত ১–২ কার্যদিবস সময় লাগে
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}