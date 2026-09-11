import { CheckCircle2, Circle } from "lucide-react";

function StatusStep({ label, done, current }) {
  return (
    <div className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
      ) : (
        <Circle
          className={`w-4 h-4 ${current ? "text-amber-500" : "text-stone-300"}`}
        />
      )}
      <span
        className={`text-sm ${
          done
            ? "text-stone-700"
            : current
            ? "text-amber-700"
            : "text-stone-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default StatusStep;