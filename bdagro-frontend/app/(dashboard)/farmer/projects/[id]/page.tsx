"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { Calendar, HandCoins, MapPin, Pencil, Ruler, Sprout, Users, Wheat } from "lucide-react";
import Image from "next/image";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusStep from "@/components/ui/StatusStep";
import { useFarmerApplicationQuery, useFarmerApprovedProjectQuery } from "@/hooks/queries/useFarmerProjectDetailsQueries";
import type { FarmerProjectApplication } from "@/lib/services/farmer.service";

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
}

function statusClasses(status: FarmerProjectApplication["status"]) {
  if (status === "Approved") return "border-emerald-600 bg-emerald-50 text-emerald-800";
  if (status === "Rejected") return "border-red-600 bg-red-50 text-red-800";
  return "border-amber-600 bg-amber-50 text-amber-800";
}

function statusIndex(status: FarmerProjectApplication["status"]) {
  return ["Pending", "Processing", "Approved"].indexOf(status);
}

function ProjectBanner({ image, className }: { image?: string | null; className?: string }) {
  const [showFallback, setShowFallback] = useState(!image);

  return (
    <div className={`relative h-48 lg:h-64 w-full overflow-hidden ${className || ""}`}>
      {!showFallback && image && (
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          onError={() => setShowFallback(true)}
          sizes="100vw"
          priority
        />
      )}
      {showFallback && (
        <div className="h-full w-full flex items-center justify-center bg-emerald-900">
          <Sprout className="h-10 lg:h-12 w-10 lg:w-12 text-white/60" strokeWidth={1.5} />
        </div>
      )}
    </div>
  );
}

export default function FarmerProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const applicationQuery = useFarmerApplicationQuery(id);
  const application = applicationQuery.data;
  const approvedQuery = useFarmerApprovedProjectQuery(id, application?.status === "Approved");
  const marketplaceProject = approvedQuery.data?.marketplaceProject;
  const investments = approvedQuery.data?.investments ?? [];
  const fundingGoal = marketplaceProject?.fundingGoal ?? 0;
  const fundedAmount = marketplaceProject?.fundedAmount ?? 0;
  const fundingPercent = fundingGoal > 0 ? Math.min(Math.round((fundedAmount / fundingGoal) * 100), 100) : 0;

  if (applicationQuery.isLoading) return <div className="p-4 lg:p-0 text-sm text-stone-500">প্রকল্পের তথ্য লোড হচ্ছে...</div>;

  if (applicationQuery.isError || !application) {
    return <div className="p-4 lg:p-0"><div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">প্রকল্পের তথ্য লোড করা যায়নি। <button className="ml-3 underline" onClick={() => applicationQuery.refetch()}>আবার চেষ্টা করুন</button></div></div>;
  }

  if (application.status === "Approved" && approvedQuery.isError) {
    return <div className="p-4 lg:p-0"><div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">বিনিয়োগের তথ্য লোড করা যায়নি। <button className="ml-3 underline" onClick={() => approvedQuery.refetch()}>আবার চেষ্টা করুন</button></div></div>;
  }

  const currentStatusIndex = statusIndex(application.status);
  const statusSteps = ["Pending", "Processing", "Approved"] as const;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 lg:p-0">
        <div className="grid gap-6 lg:gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <ProjectBanner image={application.farmImage ?? null} className="rounded-lg" />

            <div className="mt-4 lg:mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-stone-400"><span className={`border px-2 py-0.5 ${statusClasses(application.status)}`}>{application.status}</span><span>·</span><span>{application.cropType || "-"}</span></div>
                <h1 className="text-2xl lg:text-3xl text-stone-900">{application.projectTitle}</h1>
                <div className="mt-2 flex items-center gap-1 text-sm text-stone-400"><MapPin className="h-3.5 w-3.5" /><span>কৃষকের আবেদন</span></div>
              </div>
              <button className="flex items-center gap-1.5 border border-stone-300 px-3 lg:px-4 py-2 text-sm text-stone-700 hover:border-emerald-800 hover:text-emerald-900"><Pencil className="h-3.5 w-3.5" />প্রকল্প এডিট করুন</button>
            </div>

            <div className="mt-6 lg:mt-10"><h2 className="mb-3 text-lg lg:text-xl text-stone-900">প্রকল্পের বিবরণ</h2><p className="text-sm leading-relaxed text-stone-600">{application.projectDescription}</p></div>

            <div className="mt-6 lg:mt-10"><h2 className="mb-3 lg:mb-4 text-lg lg:text-xl text-stone-900">খামারের বিবরণ</h2><div className="grid gap-4 lg:gap-5 sm:grid-cols-2">
              <DetailItem icon={<Wheat className="h-4 w-4 text-stone-400" />} label="ফসলের ধরন" value={application.cropType || "-"} />
              <DetailItem icon={<Ruler className="h-4 w-4 text-stone-400" />} label="আবেদনের পরিমাণ" value={formatCurrency(application.requestedAmount)} />
              <DetailItem icon={<Calendar className="h-4 w-4 text-stone-400" />} label="মেয়াদ" value={`${application.durationMonths} মাস`} />
              <DetailItem icon={<Calendar className="h-4 w-4 text-stone-400" />} label="আবেদনের তারিখ" value={formatDate(application.createdAt)} />
            </div></div>

            <div className="mt-6 lg:mt-10"><h2 className="mb-3 lg:mb-4 text-lg lg:text-xl text-stone-900">প্রকল্পের অবস্থা</h2><div className="flex flex-wrap gap-x-6 lg:gap-x-8 gap-y-3 border border-stone-200 p-4 lg:p-6">
              {statusSteps.map((status, index) => <StatusStep key={status} label={status} done={application.status !== "Rejected" && index < currentStatusIndex} current={application.status !== "Rejected" && index === currentStatusIndex} />)}
              {application.status === "Rejected" && <StatusStep label="Rejected" current />}
              {application.status === "Approved" && <StatusStep label="ফসল সংগ্রহ ও মুনাফা বণ্টন" />}
            </div>{application.status === "Rejected" && application.rejectionReason && <p className="mt-3 text-sm text-red-700">কারণ: {application.rejectionReason}</p>}</div>
          </div>

          <div className="h-fit space-y-4 lg:space-y-6 lg:sticky lg:top-6">
            <div className="border border-stone-200 p-4 lg:p-6">
              {approvedQuery.isLoading && application.status === "Approved" ? <div className="text-sm text-stone-500">বিনিয়োগের তথ্য লোড হচ্ছে...</div> : <>
                <div className="mb-1.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-sm text-stone-700"><span className="text-stone-900">{formatCurrency(fundedAmount)}</span><span className="text-stone-400">লক্ষ্য {formatCurrency(fundingGoal)}</span></div>
                <ProgressBar percent={fundingPercent} />
                <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 text-xs text-stone-400"><span>{fundingPercent}% পূর্ণ হয়েছে</span><span>{application.status === "Approved" && marketplaceProject?.fundingDeadline ? formatDate(marketplaceProject.fundingDeadline) : "-"}</span></div>
                <div className="mt-4 lg:mt-5 grid grid-cols-2 gap-3 lg:gap-4 border-t border-stone-200 pt-4 lg:pt-5"><div><div className="text-xs text-stone-400">মুনাফা বণ্টন</div><div className="text-lg text-emerald-800">{marketplaceProject?.expectedROIPercent ?? 0}%</div></div><div><div className="text-xs text-stone-400">বিনিয়োগকারী</div><div className="text-lg text-stone-900">{investments.length} জন</div></div></div>
                <button disabled={application.status !== "Approved"} className="mt-4 lg:mt-5 flex w-full items-center justify-center gap-2 bg-emerald-900 py-3 text-sm text-white enabled:hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"><HandCoins className="h-4 w-4" />মুনাফা রিপোর্ট জমা দিন</button>
              </>}
            </div>

            <div className="border border-stone-200"><div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-3 border-b border-stone-200 p-4 lg:p-5"><div className="flex items-center gap-2 text-stone-900"><Users className="h-4 w-4" /><span>বিনিয়োগকারীগণ</span></div><span className="text-xs text-stone-400">{investments.length} জন</span></div>
              {investments.length === 0 ? <div className="p-4 lg:p-5 text-sm text-stone-500">এখনো কোনো বিনিয়োগকারী নেই।</div> : <div className="divide-y divide-stone-100">{investments.map((investment) => <div key={investment._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 lg:gap-3 p-3 lg:p-4"><div className="flex items-center gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-stone-100 text-sm text-stone-500">{investment.investor?.name?.[0] || "-"}</div><div><div className="text-sm text-stone-800">{investment.investor?.name || "বিনিয়োগকারী"}</div><div className="mt-0.5 text-xs text-stone-400">{formatDate(investment.createdAt)}</div></div></div><div className="shrink-0 text-sm text-stone-800">{formatCurrency(investment.amount)}</div></div>)}</div>}
              <div className="border-t border-stone-200 p-4 text-center"><span className="text-sm text-emerald-900">সব বিনিয়োগকারী দেখুন</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 border border-stone-200 p-3 lg:p-4"><span className="shrink-0">{icon}</span><div className="min-w-0"><div className="text-xs text-stone-400">{label}</div><div className="text-sm text-stone-800 truncate">{value}</div></div></div>;
}
