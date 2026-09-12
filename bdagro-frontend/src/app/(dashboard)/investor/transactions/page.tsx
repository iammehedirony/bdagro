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
  ArrowDownToLine,
  ArrowUpFromLine,
  RotateCcw,
  CheckCircle2,
  Clock,
  XCircle,
  Banknote,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusTag from "@/components/ui/StatusTag";

const transactions = [
  { type: "বিনিয়োগ", icon: ArrowUpFromLine, project: "সবুজ ধানখেত", amount: "৫০,০০০", method: "SSLCommerz · bKash", date: "১২ জুন ২০২৬", status: "সম্পন্ন" },
  { type: "পেআউট", icon: ArrowDownToLine, project: "মাছ চাষ প্রকল্প", amount: "৬,৬০০", method: "SSLCommerz · নগদ", date: "২০ আগস্ট ২০২৫", status: "সম্পন্ন" },
  { type: "বিনিয়োগ", icon: ArrowUpFromLine, project: "আম বাগান প্রকল্প", amount: "৭৫,০০০", method: "Stripe · কার্ড", date: "৩ জুলাই ২০২৬", status: "সম্পন্ন" },
  { type: "রিফান্ড", icon: RotateCcw, project: "পুকুরে মাছ চাষ", amount: "২০,০০০", method: "SSLCommerz · bKash", date: "৮ সেপ্টেম্বর ২০২৬", status: "প্রক্রিয়াধীন" },
  { type: "পেআউট", icon: ArrowDownToLine, project: "গরু মোটাতাজাকরণ", amount: "৭,২০০", method: "Stripe · কার্ড", date: "১০ জানুয়ারি ২০২৬", status: "সম্পন্ন" },
];

const refunds = [
  { project: "পুকুরে মাছ চাষ", amount: "২০,০০০", reason: "প্রকল্প অ্যাডমিন কর্তৃক প্রত্যাখ্যাত হয়েছে", date: "৮ সেপ্টেম্বর ২০২৬", status: "প্রক্রিয়াধীন" },
  { project: "শীতকালীন আলু চাষ", amount: "১০,০০০", reason: "নির্ধারিত সময়ে ফান্ডিং লক্ষ্যমাত্রা পূরণ হয়নি", date: "২ জুলাই ২০২৬", status: "সম্পন্ন" },
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
            <StatCard label="সর্বমোট লেনদেন" value="৫টি" sub="সব ধরনের মিলিয়ে" />
            <StatCard label="সর্বমোট বিনিয়োগ" value="৳১,২৫,০০০" sub="২টি লেনদেনে" />
            <StatCard label="সর্বমোট প্রাপ্ত রিটার্ন" value="৳১৬,৯০০" sub="৩টি পেআউট" />
            <StatCard label="রিফান্ড অনুরোধ" value="১টি" sub="প্রক্রিয়াধীন" />
          </div>

          {/* TABS (visual) */}
          <div className="mt-8 flex gap-2 border-b border-stone-200">
            <button className="px-4 py-2.5 text-sm border-b-2 border-emerald-800 text-emerald-900 -mb-px">
              সব লেনদেন
            </button>
            <button className="px-4 py-2.5 text-sm border-b-2 border-transparent text-stone-400 hover:text-stone-700 -mb-px">
              রিফান্ড স্ট্যাটাস
            </button>
            <button className="px-4 py-2.5 text-sm border-b-2 border-transparent text-stone-400 hover:text-stone-700 -mb-px">
              পেআউট / রিটার্ন প্রাপ্ত
            </button>
          </div>

          {/* TRANSACTION HISTORY */}
          <div className="mt-6 border border-stone-200">
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

          {/* REFUND STATUS */}
          <div className="mt-10">
            <h3 className="text-stone-900 mb-4">
              রিফান্ড স্ট্যাটাস
            </h3>
            <div className="border border-stone-200">
              <div className="divide-y divide-stone-200">
                {refunds.map((r) => (
                  <div key={r.project} className="p-5 flex items-center justify-between gap-4 flex-wrap">
                    <div>
                      <div className="text-sm text-stone-800">{r.project}</div>
                      <div className="text-xs text-stone-400 mt-1">
                        কারণ: {r.reason} · {r.date}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-sm text-stone-800">৳{r.amount}</span>
                      <StatusTag status={r.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PAYOUTS RECEIVED */}
          <div className="mt-10">
            <h3 className="text-stone-900 mb-4">
              পেআউট / রিটার্ন প্রাপ্ত
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
                    <StatusTag status="সম্পন্ন" />
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