"use client";

import {
  Sprout,
  MapPin,
  Banknote,
} from "lucide-react";
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

export default function InvestorROITrackingPage() {
  const { data, isLoading, isError } = useInvestorROITrackingQuery();
  const summary = data?.summary;
  const projectReturns = data?.projectROIs ?? [];
  const payouts = data?.payouts ?? [];

  return (
    <div className="bg-white min-h-screen flex">

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8">
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="মোট অর্জিত রিটার্ন" value={formatCurrency(summary?.totalEarned ?? 0)} sub="সব প্রকল্প মিলিয়ে" />
            <StatCard label="গড় রিটার্ন রেট" value={`${(summary?.averageROI ?? 0).toFixed(1)}%`} sub="এখন পর্যন্ত" />
            <StatCard label="সর্বোচ্চ পারফরমার" value={summary?.topPerformer ?? "N/A"} sub={`${(summary?.topPerformerROI ?? 0).toFixed(1)}% রিটার্ন`} />
            <StatCard label="সম্পন্ন পেআউট" value={`${summary?.completedPayouts ?? 0}টি`} sub={`সর্বশেষ ${formatDate(summary?.latestPayoutAt ?? null)}`} />
          </div>

          <div className="mt-2 text-xs text-stone-400">
            * এই পরিসংখ্যান এখন পর্যন্ত অর্জিত প্রকৃত মুনাফা বণ্টনের হিসাব —
            ভবিষ্যতের নিশ্চিত রিটার্নের প্রতিশ্রুতি নয়।
          </div>

          <div className="mt-8 grid lg:grid-cols-[1fr_320px] gap-8">
            {/* PER-PROJECT RETURNS */}
            <div className="border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <h3 className="text-stone-900">
                  প্রকল্পভিত্তিক রিটার্ন
                </h3>
              </div>
              <div className="divide-y divide-stone-200">
                {isLoading && <div className="p-6 text-sm text-stone-400">রিটার্নের তথ্য লোড হচ্ছে...</div>}
                {isError && <div className="p-6 text-sm text-red-600">রিটার্নের তথ্য লোড করা যায়নি।</div>}
                {!isLoading && !isError && projectReturns.map((project, index) => (
                  <div key={project.projectId} className="p-5 flex items-center gap-4 flex-wrap">
                    <div
                      className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                        tones[index % tones.length] === "emerald" ? "bg-emerald-900" : tones[index % tones.length] === "amber" ? "bg-amber-700" : "bg-orange-800"
                      }`}
                    >
                      <Sprout className="w-4.5 h-4.5 text-white/80" />
                    </div>
                    <div className="flex-1 min-w-35">
                      <div className="text-sm text-stone-800">{project.projectTitle}</div>
                      <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {project.location}
                        <span className="mx-1">·</span>
                        {projectStatus(project.status)}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm text-emerald-700">+{formatCurrency(project.earned)}</div>
                      <div className="text-xs text-stone-400 mt-0.5">
                        বিনিয়োগ {formatCurrency(project.invested)} · {project.roi.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
                {!isLoading && !isError && projectReturns.length === 0 && <div className="p-6 text-sm text-stone-400">কোনো প্রকল্পভিত্তিক রিটার্ন নেই।</div>}
              </div>
            </div>

            {/* PAYOUT HISTORY */}
            <div className="border border-stone-200 h-fit">
              <div className="p-6 border-b border-stone-200">
                <h3 className="text-stone-900">
                  পেআউট হিস্টোরি
                </h3>
              </div>
              <div className="divide-y divide-stone-200">
                {!isLoading && !isError && payouts.map((payout) => (
                  <div key={payout.id} className="p-5 flex gap-3">
                    <Banknote className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm text-stone-700">
                        {formatCurrency(payout.amount)} — {payout.project?.title ?? "অজানা প্রকল্প"}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">
                        {formatDate(payout.paidAt)} · {payout.paymentMethod}
                      </div>
                    </div>
                  </div>
                ))}
                {!isLoading && !isError && payouts.length === 0 && <div className="p-6 text-sm text-stone-400">কোনো পেআউট পাওয়া যায়নি।</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}