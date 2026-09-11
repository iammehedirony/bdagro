export default function RiskDot({ level }) {
  const colors = {
    কম: "bg-emerald-600",
    মাঝারি: "bg-amber-500",
    বেশি: "bg-orange-500",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-stone-500">
      <span className={`w-1.5 h-1.5 rounded-full ${colors[level]}`} />
      {level} ঝুঁকি
    </span>
  );
}