interface RiskDotProps {
  level: "কম" | "মাঝারি" | "বেশি";
}

export default function RiskDot({ level }: RiskDotProps) {
  const colors = {
    "কম": "bg-primary-600",
    "মাঝারি": "bg-accent-500",
    "বেশি": "bg-danger-500",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
      <span className={`w-1.5 h-1.5 rounded-full ${colors[level]}`} />
      {level} ঝুঁকি
    </span>
  );
}