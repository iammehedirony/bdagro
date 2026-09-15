import { Banknote, CalendarClock, ChevronRight, HandCoins, LucideIcon } from "lucide-react";

export interface LoanCardProps {
  loan: {
    name: string;
    category: string;
    icon: LucideIcon;
    tone: "emerald" | "amber" | "orange";
    share: string;
    max: string;
    tenure: string;
    note: string;
  };
}

export function LoanCard({ loan }: LoanCardProps) {
  const bg =
    loan.tone === "emerald"
      ? "bg-emerald-900"
      : loan.tone === "amber"
      ? "bg-amber-700"
      : "bg-orange-800";
  return (
    <div className="border border-stone-200 bg-white">
      <div className="p-5 flex items-start gap-4">
        <div className={`w-11 h-11 ${bg} flex items-center justify-center shrink-0`}>
          <loan.icon className="w-5 h-5 text-white/80" />
        </div>
        <div>
          <div className="text-xs text-stone-400">{loan.category}</div>
          <h3 className="text-stone-900">
            {loan.name}
          </h3>
        </div>
      </div>

      <div className="px-5 pb-5">
        <p className="text-xs text-stone-500 leading-relaxed mb-4">
          {loan.note}
        </p>

        <div className="grid grid-cols-3 border-t border-stone-200 pt-4">
          <div>
            <div className="flex items-center gap-1 text-xs text-stone-400">
              <HandCoins className="w-3 h-3" />
              মুনাফা বণ্টন
            </div>
            <div className="text-sm text-stone-800 mt-1">{loan.share}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs text-stone-400">
              <Banknote className="w-3 h-3" />
              সর্বোচ্চ
            </div>
            <div className="text-sm text-stone-800 mt-1">{loan.max}</div>
          </div>
          <div>
            <div className="flex items-center gap-1 text-xs text-stone-400">
              <CalendarClock className="w-3 h-3" />
              মেয়াদ
            </div>
            <div className="text-sm text-stone-800 mt-1">{loan.tenure}</div>
          </div>
        </div>

        <button className="mt-5 w-full border border-stone-300 py-2 text-sm text-stone-800 hover:border-emerald-800 hover:text-emerald-900 transition-colors flex items-center justify-center gap-1">
          বিস্তারিত দেখুন
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}