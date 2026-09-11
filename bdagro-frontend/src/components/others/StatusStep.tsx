import { CheckCircle2, Circle } from "lucide-react";

interface StatusStepProps {
  label: string;
  done?: boolean;
  current?: boolean;
}

function StatusStep({ label, done, current }: StatusStepProps) {
  return (
    <div className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 className="w-4 h-4 text-primary-700" />
      ) : (
        <Circle
          className={`w-4 h-4 ${current ? "text-accent-500" : "text-neutral-300"}`}
        />
      )}
      <span
        className={`text-sm ${
          done
            ? "text-neutral-700"
            : current
            ? "text-accent-700"
            : "text-neutral-300"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

export default StatusStep;
