export function NotificationRow({ icon: Icon, tone, text, time, unread }) {
  const toneMap = {
    emerald: "text-emerald-700 bg-emerald-50",
    amber: "text-amber-700 bg-amber-50",
    orange: "text-orange-600 bg-orange-50",
  };
  
  return (
    <div className={`flex gap-3 p-5 transition-colors ${unread ? "bg-stone-50" : "bg-white hover:bg-stone-50/50"}`}>
      <div className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 ${toneMap[tone]}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1">
        <div className="text-sm text-stone-700 leading-snug">{text}</div>
        <div className="text-xs text-stone-400 mt-1">{time}</div>
      </div>
      {unread && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />}
    </div>
  );
}