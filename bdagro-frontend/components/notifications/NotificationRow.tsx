import { CheckCircle2, TrendingUp, Clock, Banknote } from "lucide-react";

interface NotificationRowProps {
  icon: string;
  tone: "emerald" | "amber" | "orange";
  text: string;
  time: string;
  unread?: boolean;
}

const iconMap = {
  "check-circle": CheckCircle2,
  "trending-up": TrendingUp,
  "clock": Clock,
  "banknote": Banknote,
};

export function NotificationRow({ icon, tone, text, time, unread }: NotificationRowProps) {
  const Icon = iconMap[icon as keyof typeof iconMap] || CheckCircle2;

  const toneMap = {
    emerald: "text-primary-700 bg-primary-50",
    amber: "text-accent-700 bg-accent-50",
    orange: "text-danger-600 bg-danger-50",
  };

  return (
    <div className={`flex gap-3 p-5 transition-colors ${unread ? "bg-neutral-50" : "bg-white hover:bg-neutral-50/50"}`}>
      <div className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 ${toneMap[tone]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-neutral-700 leading-snug">{text}</div>
        <div className="text-xs text-neutral-400 mt-1">{time}</div>
      </div>
      {unread && <span className="w-1.5 h-1.5 rounded-full bg-accent-500 mt-1.5 shrink-0" />}
    </div>
  );
}
