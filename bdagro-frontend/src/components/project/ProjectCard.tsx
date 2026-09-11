import { MapPin, Sprout } from "lucide-react";
import ProgressBar from "@/components/others/ProgressBar";
import RiskBadge from "@/components/others/RiskBadge";
import Link from "next/link";

function ProjectCard({ title, location, goal, raised, percent, risk, roi, tone }) {
  return (
    <div className="border border-stone-200 bg-white">
      <div
        className={`h-32 flex items-center justify-center ${
          tone === "emerald"
            ? "bg-emerald-900"
            : tone === "amber"
            ? "bg-amber-700"
            : "bg-orange-800"
        }`}
      >
        <Sprout className="w-10 h-10 text-white/70" strokeWidth={1.5} />
      </div>
      <div className="p-5">
        <h3 className="text-lg text-stone-900 mb-1">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-stone-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-stone-700 mb-1.5">
          <span>উত্তোলিত ৳{raised}</span>
          <span className="text-stone-400">লক্ষ্য ৳{goal}</span>
        </div>
        <ProgressBar percent={percent} tone={tone === "orange" ? "orange" : tone === "emerald" ? "emerald" : "amber"} />
        <div className="flex items-center justify-between mt-4">
          <RiskBadge level={risk} />
          <span className="text-sm text-stone-700">
            প্রত্যাশিত ROI <span className="text-emerald-800">{roi}</span>
          </span>
        </div>
       <Link 
  href="/projects/1" 
  className="mt-5 block text-center w-full border border-stone-300 py-2 text-sm text-stone-800 hover:border-emerald-800 hover:text-emerald-900 transition-colors"
>
  বিস্তারিত দেখুন
</Link>
      </div>
    </div>
  );
}

export default ProjectCard;