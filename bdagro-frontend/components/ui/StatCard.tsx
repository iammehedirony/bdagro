import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  tone?: "up" | "down" | "amber" | "neutral";
}

function StatCard({ label, value, sub, tone }: StatCardProps) {
  return (
    <div className="border border-neutral-200 p-5">
      <div className="text-sm text-neutral-500">{label}</div>
      <div className="mt-2 text-2xl text-neutral-900">
        {value}
      </div>
      {sub && (
        <div className={`mt-1.5 text-xs flex items-center gap-1 ${
          tone === "up" ? "text-primary-700" : "text-neutral-400"
        }`}>
          {tone === "up" && <ArrowUpRight className="w-3 h-3" />}
          <span>{sub}</span>
        </div>
      )}
    </div>
  );
}

export default StatCard;