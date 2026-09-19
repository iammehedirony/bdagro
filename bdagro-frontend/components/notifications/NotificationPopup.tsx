import React from "react";
import {
  Sprout,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Banknote,
  X,
} from "lucide-react";


function NotificationToast({ icon: Icon, tone, title, message, time }) {
  const toneMap = {
    emerald: { bar: "bg-emerald-700", iconBg: "bg-emerald-50", iconColor: "text-emerald-700" },
    amber: { bar: "bg-amber-500", iconBg: "bg-amber-50", iconColor: "text-amber-700" },
    orange: { bar: "bg-orange-500", iconBg: "bg-orange-50", iconColor: "text-orange-600" },
  };
  const t = toneMap[tone];

  return (
    <div className="flex overflow-hidden">
      <div className={`w-1 ${t.bar} shrink-0`} />
      <div className="flex-1 p-4">
        <div className="flex items-start gap-3">
          <div className={`w-8 h-8 flex items-center justify-center shrink-0 ${t.iconBg}`}>
            <Icon className={`w-4 h-4 ${t.iconColor}`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm text-stone-900">{title}</div>
            <div className="text-xs text-stone-500 mt-0.5 leading-relaxed">
              {message}
            </div>
            <div className="text-[11px] text-stone-400 mt-1.5">{time}</div>
          </div>
          <button className="text-stone-300 hover:text-stone-600 shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function ToastWithTimer({ icon, tone, title, message, time, percent }) {
  const barTone = tone === "emerald" ? "bg-emerald-700" : tone === "amber" ? "bg-amber-500" : "bg-orange-500";
  return (
    <div className="w-80 bg-white border border-stone-200 shadow-sm">
      <NotificationToast icon={icon} tone={tone} title={title} message={message} time={time} />
      <div className="h-0.5 w-full bg-stone-100 -mt-[1px]">
        <div className={`h-0.5 ${barTone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

export default function NotificationToastPreview() {
  return (
    <div className="bg-stone-50 min-h-screen relative">
      {/* TOAST STACK — bottom-right */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <ToastWithTimer
          icon={CheckCircle2}
          tone="emerald"
          title="বিনিয়োগ অনুমোদিত হয়েছে"
          message="সবুজ ধানখেত প্রকল্পে আপনার ৳১০,০০০ বিনিয়োগ সফলভাবে সম্পন্ন হয়েছে।"
          time="এইমাত্র"
          percent={72}
        />
        <ToastWithTimer
          icon={Banknote}
          tone="emerald"
          title="মুনাফা জমা হয়েছে"
          message="মাছ চাষ প্রকল্প থেকে ৳৬,৬০০ আপনার অ্যাকাউন্টে জমা হয়েছে।"
          time="২ মিনিট আগে"
          percent={40}
        />
        <ToastWithTimer
          icon={TrendingUp}
          tone="amber"
          title="ফান্ডিং অগ্রগতি"
          message="আম বাগান প্রকল্প এইমাত্র ৫০% ফান্ডিং সম্পন্ন করেছে।"
          time="৫ মিনিট আগে"
          percent={90}
        />
        <ToastWithTimer
          icon={AlertTriangle}
          tone="orange"
          title="পেমেন্ট ব্যর্থ হয়েছে"
          message="আপনার সর্বশেষ লেনদেনটি সম্পন্ন হয়নি, আবার চেষ্টা করুন।"
          time="৭ মিনিট আগে"
          percent={15}
        />
      </div>
    </div>
  );
}