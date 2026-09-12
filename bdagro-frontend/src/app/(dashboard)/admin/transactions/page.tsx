import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Users,
  ShieldCheck,
  Sprout as CropIcon,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Bell,
  ArrowUpFromLine,
  ArrowDownToLine,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusTag from "@/components/ui/StatusTag";



const transactions = [
  { type: "বিনিয়োগ", icon: ArrowUpFromLine, from: "রাহাত করিম", to: "আব্দুল করিম (কৃষক)", project: "সবুজ ধানখেত", amount: "৫০,০০০", date: "১২ জুন ২০২৬", status: "সফল" },
  { type: "মুনাফা পরিশোধ", icon: ArrowDownToLine, from: "আব্দুল করিম (কৃষক)", to: "রাহাত করিম", project: "গরু মোটাতাজাকরণ", amount: "৭,২৮০", date: "১০ জানুয়ারি ২০২৬", status: "সফল" },
  { type: "বিনিয়োগ", icon: ArrowUpFromLine, from: "সুমাইয়া হক", to: "মনির হোসেন (কৃষক)", project: "আম বাগান প্রকল্প", amount: "৭৫,০০০", date: "৩ জুলাই ২০২৬", status: "ব্যর্থ" },
  { type: "মুনাফা পরিশোধ", icon: ArrowDownToLine, from: "রফিকুল ইসলাম (কৃষক)", to: "তানভীর আলম", project: "মাছ চাষ প্রকল্প", amount: "৬,৬০০", date: "২০ আগস্ট ২০২৫", status: "সফল" },
];

export default function AdminTransactionsPage() {
  return (
    <div className="bg-white min-h-screen flex">


      {/* MAIN */}
      <div className="flex-1 min-w-0">


        <div className="p-8">
          {/* MODEL NOTE */}
          <div className="flex items-start gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 max-w-2xl mb-8">
            <Info className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-800 leading-relaxed">
              বিনিয়োগ ও মুনাফা পরিশোধ সরাসরি বিনিয়োগকারী ও কৃষকের মধ্যে
              সম্পন্ন হয় — কোনো অর্থ প্ল্যাটফর্মে আটকে থাকে না, তাই এখানে
              কোনো অনুমোদনের প্রয়োজন নেই। এই তালিকা শুধু পর্যবেক্ষণ ও
              রিপোর্টিংয়ের জন্য।
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="সর্বমোট লেনদেন" value="৪টি" sub="সব ধরনের মিলিয়ে" />
            <StatCard label="সর্বমোট বিনিয়োগ প্রবাহ" value="৳১,২৫,০০০" sub="সরাসরি কৃষকদের কাছে" />
            <StatCard label="সর্বমোট মুনাফা পরিশোধ" value="৳১৩,৮৮০" sub="সরাসরি বিনিয়োগকারীদের কাছে" />
            <StatCard label="ব্যর্থ লেনদেন" value="১টি" sub="এই সপ্তাহে" />
          </div>

          {/* TRANSACTION LOG */}
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
                      {t.type}: {t.from} → {t.to}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {t.project} · {t.date}
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