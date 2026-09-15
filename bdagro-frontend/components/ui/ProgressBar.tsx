interface ProgressBarProps {
  percent: number;
  tone?: string;
}

function ProgressBar({ percent, tone = "amber" }: ProgressBarProps) {
  const fill =
    tone === "amber"
      ? "bg-accent-500"
      : tone === "emerald"
      ? "bg-primary-600"
      : "bg-danger-500";
  return (
    <div className="h-1.5 w-full bg-neutral-200">
      <div className={`h-1.5 ${fill}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default ProgressBar;