
function StatusChip({ label, active, tone }) {
  const toneMap = {
    stone: "border-stone-300 text-stone-500",
    amber: "border-amber-600 text-amber-800 bg-amber-50",
    emerald: "border-emerald-600 text-emerald-800 bg-emerald-50",
    orange: "border-orange-600 text-orange-800 bg-orange-50",
  };
  return (
    <span
      className={`border px-2.5 py-1 text-xs ${
        active ? toneMap[tone] : "border-stone-200 text-stone-400"
      }`}
    >
      {label}
    </span>
  );
}

export default StatusChip;