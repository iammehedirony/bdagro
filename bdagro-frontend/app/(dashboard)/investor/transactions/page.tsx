import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  Search,
  Bell,
  Settings,
  ArrowLeftRight,
  ArrowUpFromLine,
  ArrowDownToLine,
  CheckCircle2,
  XCircle,
  Info,
  Banknote,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusTag from "@/components/ui/StatusTag";


const transactions = [
  { type: "বিনিয়োগ", icon: ArrowUpFromLine, project: "সবুজ ধানখেত", amount: "৫০,০০০", method: "SSLCommerz · bKash", date: "১২ জুন ২০২৬", status: "সফল" },
  { type: "মুনাফা প্রাপ্তি", icon: ArrowDownToLine, project: "মাছ চাষ প্রকল্প", amount: "৬,৬০০", method: "SSLCommerz · নগদ", date: "২০ আগস্ট ২০২৫", status: "সফল" },
  { type: "বিনিয়োগ", icon: ArrowUpFromLine, project: "আম বাগান প্রকল্প", amount: "৭৫,০০০", method: "Stripe · কার্ড", date: "৩ জুলাই ২০২৬", status: "সফল" },
  { type: "মুনাফা প্রাপ্তি", icon: ArrowDownToLine, project: "গরু মোটাতাজাকরণ", amount: "৭,২০০", method: "Stripe · কার্ড", date: "১০ জানুয়ারি ২০২৬", status: "সফল" },
];

const payouts = [
  { project: "গরু মোটাতাজাকরণ", amount: "৭,২৮০", date: "১০ জানুয়ারি ২০২৬", method: "SSLCommerz · bKash" },
  { project: "মাছ চাষ প্রকল্প", amount: "৬,৬০০", date: "২০ আগস্ট ২০২৫", method: "SSLCommerz · নগদ" },
  { project: "আম বাগান প্রকল্প", amount: "৩,১০০", date: "৫ মে ২০২৫", method: "Stripe · কার্ড" },
];

export default function InvestorTransactionsPage() {
  return (
    <div className="bg-white min-h-screen flex">

      

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        
        <div className="p-8">

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="সর্বমোট লেনদেন" value="৪টি" sub="সব ধরনের মিলিয়ে" />
            <StatCard label="সর্বমোট বিনিয়োগ" value="৳১,২৫,০০০" sub="২টি লেনদেনে" />
            <StatCard label="সর্বমোট মুনাফা প্রাপ্তি" value="৳১৩,৮০০" sub="২টি পরিশোধে" />
            <StatCard label="ব্যর্থ লেনদেন" value="০টি" sub="এই মাসে" />
          </div>

          {/* TRANSACTION HISTORY */}
          <div className="mt-8 border border-stone-200">
            <div className="p-6 border-b border-stone-200">
              <h3 className="text-stone-900">
                লেনদেন হিস্টোরি
              </h3>
            </div>
            <div className="divide-y divide-stone-200">
              {transactions.map((t, i) => (
                <div key={i} className="p-5 flex items-center gap-4 flex-wrap">
                  <div className="w-9 h-9 flex items-center justify-center bg-stone-100 text-stone-500 shrink-0">
                    <t.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-[160px]">
                    <div className="text-sm text-stone-800">
                      {t.type} — {t.project}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {t.method} · {t.date}
                    </div>
                  </div>
                  <div className="text-sm text-stone-800 shrink-0">৳{t.amount}</div>
                  <StatusTag status={t.status} />
                </div>
              ))}
            </div>
          </div>

          {/* PAYOUTS RECEIVED */}
          <div className="mt-10">
            <h3 className="text-stone-900 mb-4">
              মুনাফা প্রাপ্তির তালিকা
            </h3>
            <div className="border border-stone-200">
              <div className="divide-y divide-stone-200">
                {payouts.map((p, i) => (
                  <div key={i} className="p-5 flex items-center gap-3">
                    <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-stone-700">
                        ৳{p.amount} — {p.project}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">
                        {p.date} · {p.method}
                      </div>
                    </div>
                    <StatusTag status="সফল" />
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