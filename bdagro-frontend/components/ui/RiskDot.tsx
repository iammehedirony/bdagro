interface RiskDotProps {
  level: string;
}

export default function RiskDot({ level }: RiskDotProps) {
  const colors: Record<string, string> = {
    "কম": "bg-primary-600",
    "মাঝারি": "bg-accent-500",
    "বেশি": "bg-danger-500",
  };
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
      <span className={`w-1.5 h-1.5 rounded-full ${colors[level] ?? "bg-neutral-400"}`} />
      {level} ঝুঁকি
    </span>
  );
}