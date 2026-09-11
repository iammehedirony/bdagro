import { AlertTriangle } from "lucide-react";
import StatCard from "@/components/others/StatCard";

const installments = [
  { no: "১", date: "১৫ জুলাই ২০২৬", amount: "৬,১৩৩", status: "পরিশোধিত" },
  { no: "২", date: "১৫ আগস্ট ২০২৬", amount: "৬,১৩৩", status: "পরিশোধিত" },
  { no: "৩", date: "১৫ সেপ্টেম্বর ২০২৬", amount: "৬,১৩৩", status: "বকেয়া" },
  { no: "৪", date: "১৫ অক্টোবর ২০২৬", amount: "৬,১৩৩", status: "আসন্ন" },
  { no: "৫", date: "১৫ নভেম্বর ২০২৬", amount: "৬,১৩৩", status: "আসন্ন" },
  { no: "৬", date: "১৫ ডিসেম্বর ২০২৬", amount: "৬,১৩৫", status: "আসন্ন" },
];

export default function FarmerInstallmentsPage() {
  return (
    <div className="bg-white min-h-screen flex">

      {/* MAIN */}
      <div className="flex-1 min-w-0">

        <div className="p-8">
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="মোট বকেয়া" value="৳১৮,৩৯৯" sub="৩টি কিস্তি বাকি" />
            <StatCard label="পরবর্তী কিস্তি" value="৳৬,১৩৩" sub="১৫ অক্টোবর ২০২৬" />
            <StatCard label="সম্পন্ন কিস্তি" value="২ / ৬" sub="বীজ ক্রয় ঋণ" />
            <StatCard label="সক্রিয় লোন" value="১টি" sub="মোট ৳৩৫,০০০" />
          </div>

          {/* ACTIVE LOAN CARD */}
          <div className="mt-8 border border-danger-200 bg-danger-50/40 p-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center gap-2 text-danger-700 text-xs">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>৩ নং কিস্তি বকেয়া — ১৫ সেপ্টেম্বর ২০২৬ থেকে</span>
                </div>
                <h2 className="mt-2 text-xl text-neutral-900">
                  বীজ ক্রয় ঋণ
                </h2>
                <div className="text-sm text-neutral-500 mt-1">
                  মোট ৳৩৫,০০০ · ৬ মাস মেয়াদ · সুদ ৮%
                </div>
              </div>
              <button className="bg-primary-900 text-white px-6 py-3 text-sm hover:bg-primary-800 shrink-0">
                ৳৬,১৩৩ এখনই পরিশোধ করুন
              </button>
            </div>

            <div className="mt-5 h-1.5 w-full bg-neutral-200">
              <div className="h-1.5 bg-primary-600" style={{ width: "33%" }} />
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              ২টি কিস্তি পরিশোধিত, ৪টি বাকি
            </div>
          </div>

          {/* INSTALLMENT SCHEDULE */}
          <div className="mt-8 border border-neutral-200">
            <div className="p-6 border-b border-neutral-200">
              <h3 className="text-neutral-900">
                কিস্তির সময়সূচি
              </h3>
            </div>
            <div className="divide-y divide-neutral-100">
              {installments.map((row) => (
                <div
                  key={row.no}
                  className="p-5 flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-7 h-7 flex items-center justify-center border border-neutral-300 text-xs text-neutral-500 shrink-0">
                      {row.no}
                    </span>
                    <div>
                      <div className="text-sm text-neutral-800">৳{row.amount}</div>
                      <div className="text-xs text-neutral-400 mt-0.5">
                        {row.date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs border border-neutral-300 text-neutral-600 bg-neutral-50 px-2 py-0.5">
                      {row.status}
                    </span>
                    {row.status === "বকেয়া" && (
                      <button className="text-xs border border-primary-800 text-primary-900 px-3 py-1.5 hover:bg-primary-50">
                        পরিশোধ করুন
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}