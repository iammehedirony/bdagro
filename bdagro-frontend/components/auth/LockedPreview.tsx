import {
  CreditCard,
  Lock
} from "lucide-react";

export function LockedPreview({ nextStep }: { nextStep?: 2 }) {
  if (!nextStep) return null;

  const fieldsByStep: Record<number, string[]> = {
    2: ["NID নম্বর", "পূর্ণ নাম (NID অনুযায়ী)", "NID এর ছবি", "সেলফি ভেরিফিকেশন"],
  };

  const titleByStep: Record<number, string> = {
    2: "NID ভেরিফিকেশন",
  };

  return (
    <div className="mt-6 border border-stone-200 bg-stone-50 p-8 opacity-60">
      <div className="flex items-center gap-2 text-stone-400">
        <Lock className="w-4 h-4" />
        <span className="text-xs">
          ধাপ {nextStep} / ২ · অ্যাকাউন্ট যাচাইয়ের পর আনলক হবে
        </span>
      </div>
      <h2 className="mt-2 text-xl text-stone-500">{titleByStep[nextStep]}</h2>
      <div className="mt-5 grid sm:grid-cols-2 gap-5">
        {fieldsByStep[nextStep].map((f) => (
          <div key={f}>
            <label className="text-sm text-stone-400">{f}</label>
            <div className="mt-1.5 w-full border border-stone-200 bg-white h-10 flex items-center px-3">
              <CreditCard className="w-3.5 h-3.5 text-stone-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}