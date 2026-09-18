"use client";

import { FormEvent, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, ChevronRight, MapPin, Ruler, ShieldCheck, Sprout, User, Wheat } from "lucide-react";
import ProgressBar from "@/components/ui/ProgressBar";
import StatusStep from "@/components/ui/StatusStep";
import { useProjectDetailsQuery } from "@/hooks/queries/useProjectDetailsQuery";
import type { MarketplaceProject } from "@/lib/services/project.service";

const MIN_INVESTMENT = 5000;

type InvestmentMode = "partial" | "full";

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
}

function formatDate(value: string | null) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("bn-BD", { year: "numeric", month: "long", day: "numeric" });
}

function riskLabel(value: MarketplaceProject["riskLevel"]) {
  return value === "low" ? "কম" : value === "medium" ? "মাঝারি" : "বেশি";
}

function riskClasses(value: MarketplaceProject["riskLevel"]) {
  return value === "low" ? "border-emerald-600 bg-emerald-50 text-emerald-800" : value === "medium" ? "border-amber-600 bg-amber-50 text-amber-800" : "border-red-600 bg-red-50 text-red-800";
}

function statusIndex(status: string) {
  if (status === "closed") return 3;
  return 2;
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 border border-stone-200 p-4"><span>{icon}</span><div><div className="text-xs text-stone-400">{label}</div><div className="text-sm text-stone-800">{value}</div></div></div>;
}

export default function ProjectDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const query = useProjectDetailsQuery(projectId);
  const project = query.data;
  const [activeImage, setActiveImage] = useState(0);
  const [mode, setMode] = useState<InvestmentMode>("partial");
  const [amount, setAmount] = useState(10000);
  const [error, setError] = useState("");

  if (query.isLoading) return <div className="p-8 text-sm text-stone-500">প্রকল্পের তথ্য লোড হচ্ছে...</div>;
  if (query.isError || !project) return <div className="p-8"><div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">প্রকল্পের তথ্য লোড করা যায়নি। <button className="ml-3 underline" onClick={() => query.refetch()}>আবার চেষ্টা করুন</button></div></div>;

  const totalRaised = project.investmentSummary.totalRaised ?? project.fundedAmount;
  const remaining = Math.max(project.fundingGoal - totalRaised, 0);
  const progress = project.fundingGoal > 0 ? Math.min(Math.round((totalRaised / project.fundingGoal) * 100), 100) : 0;
  const isFundable = project.status === "open" || project.status === "partially_funded";
  const currentStatus = statusIndex(project.status);
  const images = project.imageUrls ?? [];

  const selectMode = (nextMode: InvestmentMode) => {
    setMode(nextMode);
    setError("");
    if (nextMode === "full") setAmount(remaining);
  };

  const submitInvestment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (amount < MIN_INVESTMENT) {
      setError(`সর্বনিম্ন বিনিয়োগ ${formatCurrency(MIN_INVESTMENT)}`);
      return;
    }
    if (amount > remaining) {
      setError(`সর্বোচ্চ বিনিয়োগ ${formatCurrency(remaining)}`);
      return;
    }
    if (mode === "full" && amount !== remaining) {
      setError("পূর্ণ বিনিয়োগের পরিমাণ পরিবর্তন করা যাবে না");
      return;
    }
    setError("");
    router.push(`/projects/${project._id}/checkout?amount=${amount}&type=${mode}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-1.5 text-xs text-stone-400"><span>হোম</span><ChevronRight className="h-3 w-3" /><span>প্রজেক্টসমূহ</span><ChevronRight className="h-3 w-3" /><span className="text-stone-600">{project.title}</span></div>

        <div className="mt-6 grid gap-10 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="flex h-72 items-center justify-center overflow-hidden bg-emerald-900">
              {images.length > 0 ? <img src={images[activeImage]} alt={project.title} className="h-full w-full object-cover" /> : <Sprout className="h-14 w-14 text-white/60" strokeWidth={1.5} />}
            </div>
            {images.length > 1 && <div className="mt-2 grid grid-cols-4 gap-2">{images.map((image, index) => <button type="button" key={image} onClick={() => setActiveImage(index)} className={`h-16 overflow-hidden border-2 ${activeImage === index ? "border-emerald-700" : "border-transparent"}`}><img src={image} alt="" className="h-full w-full object-cover" /></button>)}</div>}

            <div className="mt-8">
              <div className="mb-2 flex items-center gap-2 text-xs text-stone-400"><span className={`border px-2 py-0.5 ${riskClasses(project.riskLevel)}`}>ঝুঁকি: {riskLabel(project.riskLevel)}</span><span>·</span><span>{project.cropType}</span></div>
              <h1 className="text-3xl text-stone-900">{project.title}</h1>
              <div className="mt-2 flex items-center gap-1 text-sm text-stone-400"><MapPin className="h-3.5 w-3.5" /><span>{project.location}</span></div>
            </div>

            <div className="mt-6 flex items-center gap-4 border border-stone-200 p-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-emerald-900 text-white"><User className="h-5 w-5" /></div><div className="flex-1"><div className="flex items-center gap-1.5"><span className="text-sm text-stone-900">{project.farmer.name}</span><ShieldCheck className="h-3.5 w-3.5 text-emerald-700" /></div><div className="mt-0.5 text-xs text-stone-400">যাচাইকৃত কৃষক{project.farmer.createdAt ? ` · যুক্ত হয়েছেন ${new Date(project.farmer.createdAt).getFullYear()} সালে` : ""}</div></div></div>

            <div className="mt-10"><h2 className="mb-3 text-xl text-stone-900">প্রকল্পের বিবরণ</h2><p className="text-sm leading-relaxed text-stone-600">{project.description}</p></div>
            <div className="mt-10"><h2 className="mb-4 text-xl text-stone-900">খামারের বিবরণ</h2><div className="grid gap-5 sm:grid-cols-2"><DetailItem icon={<Ruler className="h-4 w-4 text-stone-400" />} label="জমির পরিমাণ" value={project.landAreaAcres ? `${project.landAreaAcres} একর` : "-"} /><DetailItem icon={<Wheat className="h-4 w-4 text-stone-400" />} label="ফসলের ধরন" value={project.cropType} /><DetailItem icon={<Calendar className="h-4 w-4 text-stone-400" />} label="মেয়াদ" value={project.durationMonths ? `${project.durationMonths} মাস` : "-"} /><DetailItem icon={<Calendar className="h-4 w-4 text-stone-400" />} label="প্রত্যাশিত ফসল কাটার তারিখ" value={formatDate(project.expectedHarvestDate)} /></div></div>
            <div className="mt-10"><h2 className="mb-4 text-xl text-stone-900">প্রকল্পের অবস্থা</h2><div className="flex flex-wrap gap-x-8 gap-y-3 border border-stone-200 p-6"><StatusStep label="Pending" done={currentStatus >= 1} /><StatusStep label="Processing" done={currentStatus >= 2} /><StatusStep label="Approved" done={currentStatus >= 2} current={currentStatus === 2} /><StatusStep label="ফসল সংগ্রহ ও রিটার্ন" done={currentStatus >= 3} current={currentStatus === 3} /></div></div>
          </div>

          <div className="h-fit lg:sticky lg:top-6"><div className="border border-stone-200 p-6"><div className="mb-1.5 flex items-center justify-between text-sm text-stone-700"><span className="text-stone-900">{formatCurrency(totalRaised)}</span><span className="text-stone-400">লক্ষ্য {formatCurrency(project.fundingGoal)}</span></div><ProgressBar percent={progress} /><div className="mt-2 flex items-center justify-between text-xs text-stone-400"><span>{progress}% পূর্ণ হয়েছে</span><span>{project.investmentSummary.daysLeft === null ? "-" : `${project.investmentSummary.daysLeft} দিন বাকি`}</span></div><div className="mt-5 grid grid-cols-2 gap-4 border-t border-stone-200 pt-5"><div><div className="text-xs text-stone-400">প্রত্যাশিত ROI</div><div className="text-lg text-emerald-800">{project.expectedROIPercent}%</div></div><div><div className="text-xs text-stone-400">বিনিয়োগকারী</div><div className="text-lg text-stone-900">{project.investmentSummary.investorCount.toLocaleString("bn-BD")} জন</div></div></div><div className="mt-2 text-xs leading-relaxed text-stone-400">এটি একটি প্রাক্কলন — চূড়ান্ত রিটার্ন ফসল বিক্রির প্রকৃত মুনাফার উপর নির্ভরশীল।</div>

            <form onSubmit={submitInvestment} className="mt-6 border-t border-stone-200 pt-6"><div className="mb-2 text-sm text-stone-700">বিনিয়োগের পরিমাণ</div><div className="mb-3 flex gap-2"><button type="button" onClick={() => selectMode("partial")} className={`flex-1 border py-2 text-sm ${mode === "partial" ? "border-emerald-800 bg-emerald-50 text-emerald-900" : "border-stone-300 text-stone-600"}`}>আংশিক</button><button type="button" onClick={() => selectMode("full")} className={`flex-1 border py-2 text-sm ${mode === "full" ? "border-emerald-800 bg-emerald-50 text-emerald-900" : "border-stone-300 text-stone-600"}`}>পূর্ণ ({formatCurrency(remaining)})</button></div><div className="flex items-center border border-stone-300"><span className="px-3 text-sm text-stone-400">৳</span><input type="number" min={MIN_INVESTMENT} max={remaining} step="1" value={amount} onChange={(event) => { setAmount(Number(event.target.value)); setMode("partial"); setError(""); }} className="flex-1 py-2.5 pr-3 text-sm outline-none" /></div><div className="mt-1.5 text-xs text-stone-400">সর্বনিম্ন বিনিয়োগ {formatCurrency(MIN_INVESTMENT)}</div>{error && <div className="mt-2 text-xs text-red-600">{error}</div>}<button type="submit" disabled={!isFundable || remaining < MIN_INVESTMENT} className="mt-4 w-full bg-amber-500 py-3 text-sm font-medium text-emerald-950 hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50">বিনিয়োগ করুন</button><div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-400"><ShieldCheck className="h-3.5 w-3.5" /><span>SSLCommerz ও Stripe দ্বারা সুরক্ষিত পেমেন্ট</span></div></form>
          </div></div>
        </div>
      </div>
    </div>
  );
}
