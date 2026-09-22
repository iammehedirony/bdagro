"use client";

import {
  Sprout,
  MapPin,
  Banknote,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import StatCard from "@/components/ui/StatCard";
import { useInvestorROITrackingQuery } from "@/hooks/queries/useInvestorQueries";

const currency = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 });
const tones = ["emerald", "amber", "orange"] as const;

function formatCurrency(value: number) {
  return `৳${currency.format(Math.max(0, value))}`;
}

function formatDate(value: string | null) {
  if (!value) return "কোনো পেআউট নেই";
  return new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

function projectStatus(status: string) {
  return status === "closed" ? "নিষ্পত্তি সম্পন্ন" : "চলমান";
}

function ProjectThumbnail({ image, tone }: { image?: string | null; tone: "emerald" | "amber" | "orange" }) {
  const [showFallback, setShowFallback] = useState(!image);
  const bgColor = tone === "emerald" ? "bg-emerald-900" : tone === "amber" ? "bg-amber-700" : "bg-orange-800";

  return (
    <div className="relative w-8 h-8 sm:w-10 sm:h-10 shrink-0 overflow-hidden rounded-lg">
      {!showFallback && image && (
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          onError={() => setShowFallback(true)}
          sizes="40px"
        />
      )}
      {showFallback && (
        <div className={`h-full w-full flex items-center justify-center ${bgColor}`}>
          <Sprout className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-white/80" />
        </div>
      )}
    </div>
  );
}

export default function InvestorROITrackingPage() {
  const { data, isLoading, isError } = useInvestorROITrackingQuery();
  const summary = data?.summary;
  const projectReturns = data?.projectROIs ?? [];
  const payouts = data?.payouts ?? [];

  return (
    <div className="bg-white min-h-screen">
      <div className="p-4 lg:p-0">
        {/* STATS */}
        <div className="grid grid-cols-2 gap-3 lg:gap-4 sm:grid-cols-4 mb-6 lg:mb-8">
          <StatCard label="মোট অর্জিত রিটার্ন" value={formatCurrency(summary?.totalEarned ?? 0)} sub="সব প্রকল্প মিলিয়ে" />
          <StatCard label="গড় রিটার্ন রেট" value={`${(summary?.averageROI ?? 0).toFixed(1)}%`} sub="এখন পর্যন্ত" />
          <StatCard label="সর্বোচ্চ পারফরমার" value={summary?.topPerformer ?? "N/A"} sub={`${(summary?.topPerformerROI ?? 0).toFixed(1)}% রিটার্ন`} />
          <StatCard label="সম্পন্ন পেআউট" value={`${summary?.completedPayouts ?? 0}টি`} sub={`সর্বশেষ ${formatDate(summary?.latestPayoutAt ?? null)}`} />
        </div>

        <div className="mt-2 text-xs text-stone-400 mb-6 lg:mb-8">
          * এই পরিসংখ্যান এখন পর্যন্ত অর্জিত প্রকৃত মুনাফা বণ্টনের হিসাব —
          ভবিষ্যতের নিশ্চিত রিটার্নের প্রতিশ্রুতি নয়।
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_320px]">
          {/* PER-PROJECT RETURNS */}
          <div className="border border-stone-200">
            <div className="p-4 lg:p-6 border-b border-stone-200">
              <h3 className="text-stone-900">প্রকল্পভিত্তিক রিটার্ন</h3>
            </div>
            <div className="divide-y divide-stone-200">
              {isLoading && <div className="p-4 lg:p-6 text-sm text-stone-400">রিটার্নের তথ্য লোড হচ্ছে...</div>}
              {isError && <div className="p-4 lg:p-6 text-sm text-red-600">রিটার্নের তথ্য লোড করা যায়নি।</div>}
              {!isLoading && !isError && projectReturns.map((project, index) => {
                const tone = tones[index % tones.length] as "emerald" | "amber" | "orange";
                return (
                  <div key={project.projectId} className="p-4 lg:p-5 flex items-center gap-3 lg:gap-4 flex-wrap">
                    <ProjectThumbnail image={project.farmImage} tone={tone} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-stone-800 break-words">{project.projectTitle}</div>
                      <div className="flex flex-wrap items-center gap-1 text-xs text-stone-400 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        {project.location}
                        <span className="mx-1">·</span>
                        {projectStatus(project.status)}
                      </div>
                    </div>
                    <div className="text-right sm:text-left shrink-0">
                      <div className="text-sm text-emerald-700">+{formatCurrency(project.earned)}</div>
                      <div className="text-xs text-stone-400 mt-0.5 whitespace-nowrap">
                        বিনিয়োগ {formatCurrency(project.invested)} · {project.roi.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                );
              })}
              {!isLoading && !isError && projectReturns.length === 0 && <div className="p-4 lg:p-6 text-sm text-stone-400">কোনো প্রকল্পভিত্তিক রিটার্ন নেই।</div>}
            </div>
          </div>

          {/* PAYOUT HISTORY */}
          <div className="border border-stone-200 h-fit">
            <div className="p-4 lg:p-6 border-b border-stone-200">
              <h3 className="text-stone-900">পেআউট হিস্টোরি</h3>
            </div>
            <div className="w-full overflow-x-auto">
              <div className="divide-y divide-stone-200 min-w-[600px]">
                {!isLoading && !isError && payouts.map((payout) => (
                  <div key={payout.id} className="p-4 lg:p-5 flex gap-3 flex-wrap">
                    <Banknote className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-stone-700 break-words whitespace-normal">
                        {formatCurrency(payout.amount)} — {payout.project?.title ?? "অজানা প্রকল্প"}
                      </div>
                      <div className="text-xs text-stone-400 mt-1 truncate">
                        {formatDate(payout.paidAt)} · {payout.paymentMethod}
                      </div>
                    </div>
                  </div>
                ))}
                {!isLoading && !isError && payouts.length === 0 && <div className="p-4 lg:p-6 text-sm text-stone-400">কোনো পেআউট পাওয়া যায়নি।</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}