
function ProgressBar({ percent, tone = "amber" }) {
  const fill =
    tone === "amber"
      ? "bg-amber-500"
      : tone === "emerald"
      ? "bg-emerald-600"
      : "bg-orange-500";
  return (
    <div className="h-1.5 w-full bg-stone-200">
      <div className={`h-1.5 ${fill}`} style={{ width: `${percent}%` }} />
    </div>
  );
}

export default ProgressBar;