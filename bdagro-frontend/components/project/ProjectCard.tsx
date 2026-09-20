import { useState } from "react";
import { MapPin, Sprout } from "lucide-react";
import Image from "next/image";
import ProgressBar from "@/components/ui/ProgressBar";
import RiskBadge from "@/components/ui/RiskBadge";
import Link from "next/link";

interface ProjectCardProps {
  id?: string;
  title: string;
  location: string;
  goal: string;
  raised: string;
  percent: number;
  risk: "কম" | "মাঝারি" | "বেশি";
  roi: string;
  tone: "emerald" | "amber" | "orange";
  image?: string | null;
}

function ProjectCard({ id, title, location, goal, raised, percent, risk, roi, tone, image }: ProjectCardProps) {
  const bgColor =
    tone === "emerald"
      ? "bg-primary-900"
      : tone === "amber"
      ? "bg-accent-700"
      : "bg-danger-800";

  const [showFallback, setShowFallback] = useState(!image);

  return (
    <div className="border border-neutral-200 bg-white">
      <div className="relative h-32 overflow-hidden">
        {!showFallback && image && (
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover w-full h-full"
            onError={() => setShowFallback(true)}
            sizes="100vw"
          />
        )}
        {showFallback && (
          <div className={`h-full w-full flex items-center justify-center ${bgColor}`}>
            <Sprout className="w-10 h-10 text-white/70" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg text-neutral-900 mb-1">
          {title}
        </h3>
        <div className="flex items-center gap-1 text-neutral-500 text-sm mb-4">
          <MapPin className="w-3.5 h-3.5" />
          <span>{location}</span>
        </div>

        <div className="flex items-center justify-between text-sm text-neutral-700 mb-1.5">
          <span>উত্তোলিত ৳{raised}</span>
          <span className="text-neutral-400">লক্ষ্য ৳{goal}</span>
        </div>
        <ProgressBar percent={percent} tone={tone === "orange" ? "orange" : tone === "emerald" ? "emerald" : "amber"} />
        <div className="flex items-center justify-between mt-4">
          <RiskBadge level={risk} />
          <span className="text-sm text-neutral-700">
            প্রত্যাশিত ROI <span className="text-primary-800">{roi}</span>
          </span>
        </div>
       <Link
  href={id ? `/projects/${id}` : "/projects"}
  className="mt-5 block text-center w-full border border-neutral-300 py-2 text-sm text-neutral-800 hover:border-primary-800 hover:text-primary-900 transition-colors"
>
  বিস্তারিত দেখুন
</Link>
      </div>
    </div>
  );
}

export default ProjectCard;