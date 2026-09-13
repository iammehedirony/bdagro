import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Wallet,
  BarChart3,
  ArrowDownToLine,
  ArrowLeftRight,
  Bell,
  Settings,
  ArrowUpFromLine,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusTag from "@/components/ui/StatusTag";


const transactions = [
  { type: "বিনিয়োগ প্রাপ্তি", icon: ArrowDownToLine, project: "সবুজ ধানখেত", from: "রাহাত করিম", amount: "৫০,০০০", method: "SSLCommerz · bKash", date: "১২ জুন ২০২৬", status: "সফল" },
  { type: "মুনাফা পরিশোধ", icon: ArrowUpFromLine, project: "গরু মোটাতাজাকরণ", from: "তানভীর আলম", amount: "৭,২৮০", method: "বিকাশ", date: "১০ জানুয়ারি ২০২৬", status: "সফল" },
  { type: "বিনিয়োগ প্রাপ্তি", icon: ArrowDownToLine, project: "সবুজ ধানখেত", from: "সুমাইয়া হক", amount: "১৫,০০০", method: "SSLCommerz · নগদ", date: "১৮ জুন ২০২৬", status: "সফল" },
  { type: "মুনাফা পরিশোধ", icon: ArrowUpFromLine, project: "সেচ যন্ত্র ফান্ডিং", from: "কামরুল ইসলাম", amount: "৬,৩০০", method: "ব্যাংক ট্রান্সফার", date: "৫ আগস্ট ২০২৫", status: "সফল" },
  { type: "মুনাফা পরিশোধ", icon: ArrowUpFromLine, project: "সবুজ ধানখেত", from: "নাজমুল হক", amount: "৮,০০০", method: "নগদ", date: "৮ সেপ্টেম্বর ২০২৬", status: "ব্যর্থ" },
];

export default function FarmerTransactionsPage() {
  return (
    <div className="bg-white min-h-screen flex">
     

     
      {/* MAIN */}
      <div className="flex-1 min-w-0">
     

        <div className="p-8">
         

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="সর্বমোট লেনদেন" value="৫টি" sub="সব ধরনের মিলিয়ে" />
            <StatCard label="সর্বমোট প্রাপ্ত বিনিয়োগ" value="৳৬৫,০০০" sub="২টি লেনদেনে" />
            <StatCard label="সর্বমোট পরিশোধিত মুনাফা" value="৳১৩,৫৮০" sub="২টি সফল পরিশোধে" />
            <StatCard label="ব্যর্থ লেনদেন" value="১টি" sub="এই সপ্তাহে" />
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
                  <div className="flex-1 min-w-[220px]">
                    <div className="text-sm text-stone-800">
                      {t.type} — {t.project}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {t.type === "বিনিয়োগ প্রাপ্তি" ? `থেকে: ${t.from}` : `প্রতি: ${t.from}`} · {t.method} · {t.date}
                    </div>
                  </div>
                  <div className="text-sm text-stone-800 shrink-0">৳{t.amount}</div>
                  <StatusTag status={t.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}