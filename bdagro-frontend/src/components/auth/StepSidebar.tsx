import { STEPS } from "@/constants/auth";
import { CheckCircle2, Lock } from "lucide-react";

export function StepSidebar({ step }: { step: number }) {
  return (
    <div className="relative">
      <div className="absolute left-[15px] top-4 bottom-4 w-px bg-stone-200" />
      <div className="space-y-10 relative">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isDone = step > s.id;
          const isCurrent = step === s.id;
          const isLocked = step < s.id;

          return (
            <div className="flex gap-4" key={s.id}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  isDone
                    ? "bg-emerald-900"
                    : isCurrent
                    ? "bg-amber-500"
                    : "bg-stone-100 border border-stone-300"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                ) : (
                  <Icon className="w-4 h-4 text-emerald-950" />
                )}
              </div>
              <div>
                <div
                  className={`text-sm ${
                    isLocked ? "text-stone-400" : "text-stone-900"
                  }`}
                >
                  {s.label}
                </div>
                <div
                  className={`text-xs mt-0.5 ${
                    isDone
                      ? "text-stone-400"
                      : isCurrent
                      ? "text-amber-700"
                      : "text-stone-300"
                  }`}
                >
                  {isDone ? "সম্পন্ন" : isCurrent ? "এই ধাপে আছেন" : "লকড"}
                </div>
               
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}