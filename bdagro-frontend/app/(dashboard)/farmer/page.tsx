"use client";

import { CheckCircle2, Clock3, MapPin, TrendingUp } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import ProgressBar from "@/components/ui/ProgressBar";
import { useFarmerDashboardQuery } from "@/hooks/queries/useFarmerQueries";

const currency = new Intl.NumberFormat("bn-BD", {
  style: "currency",
  currency: "BDT",
  maximumFractionDigits: 0,
});

function formatCurrency(value: number) {
  return currency.format(value).replace("BDT", "৳").trim();
}

function formatTime(value: string) {
  const days = Math.round((new Date(value).getTime() - Date.now()) / 86_400_000);
  return new Intl.RelativeTimeFormat("bn", { numeric: "auto" }).format(days, "day");
}

function statusClasses(status: string) {
  if (status === "Approved") return "border-emerald-600 bg-emerald-50 text-emerald-800";
  if (status === "Rejected") return "border-red-600 bg-red-50 text-red-800";
  return "border-amber-600 bg-amber-50 text-amber-800";
}

export default function FarmerOverviewPage() {
  const { data, isLoading, isError, refetch } = useFarmerDashboardQuery();

  if (isLoading) return <div className="p-8 text-sm text-stone-500">ড্যাশবোর্ড লোড হচ্ছে...</div>;

  if (isError || !data) {
    return (
      <div className="p-8">
        <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-800">
          ড্যাশবোর্ডের তথ্য লোড করা যায়নি।
          <button className="ml-3 underline" onClick={() => refetch()}>আবার চেষ্টা করুন</button>
        </div>
      </div>
    );
  }

  const { summary, projectSummaries, activityFeed } = data;

  return (
    <div className="p-8">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="সক্রিয় প্রকল্প" value={`${summary.activeProjectsCount}টি`} sub={`${summary.pendingApplicationsCount}টি অনুমোদনের অপেক্ষায়`} />
        <StatCard label="মোট সংগৃহীত ফান্ড" value={formatCurrency(summary.totalFundsRaised)} sub="সব প্রকল্প মিলিয়ে" />
        <StatCard label="মোট বিনিয়োগকারী" value={`${summary.totalInvestorsCount} জন`} sub="সব প্রকল্প মিলিয়ে" />
        <StatCard label="প্রত্যাশিত মুনাফা" value={formatCurrency(summary.expectedProfit)} sub="বর্তমান সংগৃহীত ফান্ডের ভিত্তিতে" />
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="border border-stone-200">
          <div className="flex items-center justify-between border-b border-stone-200 p-6">
            <h3 className="text-stone-900">আমার প্রকল্পের অবস্থা</h3>
            <span className="text-xs text-stone-400">{projectSummaries.length}টি প্রকল্প</span>
          </div>
          {projectSummaries.length === 0 ? (
            <div className="p-6 text-sm text-stone-500">এখনো কোনো প্রকল্পের আবেদন নেই।</div>
          ) : (
            <div className="divide-y divide-stone-200">
              {projectSummaries.map((project) => (
                <div key={project._id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-stone-900">{project.title}</div>
                      <div className="mt-1 flex items-center gap-1 text-xs text-stone-400">
                        <MapPin className="h-3 w-3" />
                        {project.cropType}
                      </div>
                    </div>
                    <span className={`border px-2 py-0.5 text-xs ${statusClasses(project.status)}`}>
                      {project.projectStatus ? project.projectStatus : project.status} 
                    </span>
                  </div>
                  {project.status === "Approved" ? (
                    <>
                      <div className="mt-4"><ProgressBar percent={Math.min(project.fundingPercent, 100)} /></div>
                      <div className="mt-2 flex items-center justify-between text-xs text-stone-400">
                        <span>{formatCurrency(project.fundedAmount)} সংগৃহীত · {project.investorCount} জন বিনিয়োগকারী</span>
                        <span>লক্ষ্য {formatCurrency(project.fundingGoal)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="mt-4 text-xs text-stone-400">
                      {project.status === "Rejected" ? "আবেদনটি প্রত্যাখ্যাত হয়েছে" : "আবেদনটি পর্যালোচনাধীন"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="h-fit border border-stone-200">
          <div className="border-b border-stone-200 p-6"><h3 className="text-stone-900">সাম্প্রতিক কার্যক্রম</h3></div>
          {activityFeed.length === 0 ? (
            <div className="p-5 text-sm text-stone-500">এখনো কোনো সাম্প্রতিক কার্যক্রম নেই।</div>
          ) : (
            <div className="divide-y divide-stone-200">
              {activityFeed.map((activity, index) => {
                const Icon = activity.type === "investment" ? TrendingUp : activity.type === "notification" ? CheckCircle2 : Clock3;
                return (
                  <div key={`${activity.time}-${index}`} className="flex gap-3 p-5">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
                    <div>
                      <div className="text-sm leading-snug text-stone-700">{activity.text}</div>
                      <div className="mt-1 text-xs text-stone-400">{formatTime(activity.time)}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
