"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  HandCoins,
  X
} from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusTag from "@/components/ui/StatusTag";
import Field from "@/components/ui/Field";
import { FieldError } from "@/components/ui/FieldError";
import { useFarmerProfitDistributionQuery } from "@/hooks/queries/useFarmerQueries";
import { useSaveFarmerProjectProfitReportMutation } from "@/hooks/mutations/useFarmerMutations";
import type { FarmerProfitDistributionProject } from "@/lib/services/farmer.service";
import { profitReportSchema, type ProfitReportFormValues } from "@/lib/schemas/farmer";

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
}

function formatDate(value: string | null) {
  if (!value) return "নির্ধারিত নয়";
  return new Intl.DateTimeFormat("bn-BD", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

export default function FarmerProfitSharingPage() {
  const { data, isLoading, isError, refetch } = useFarmerProfitDistributionQuery();
  const router = useRouter();
  const saveReportMutation = useSaveFarmerProjectProfitReportMutation();
  const stats = data?.stats;
  const settlements = data?.settlements ?? [];
  const readyProjects = data?.readyProjects ?? [];

  // State for Modal Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<FarmerProfitDistributionProject | null>(null);
  const { control, register, handleSubmit, reset, formState: { errors } } = useForm<ProfitReportFormValues>({
    resolver: zodResolver(profitReportSchema),
    mode: "onBlur",
    defaultValues: { totalSales: 0, productionCost: 0 },
  });
  const formValues = useWatch({ control });
  const totalSales = Number(formValues.totalSales) || 0;
  const productionCost = Number(formValues.productionCost) || 0;
  const netProfit = totalSales - productionCost;
  const investorShare = selectedProject && netProfit >= 0 ? (netProfit * selectedProject.profitShare) / 100 : 0;

  function getErrorMessage(error: unknown) {
    if (error && typeof error === "object" && "response" in error) {
      const response = (error as { response?: { data?: { message?: string } } }).response;
      if (response?.data?.message) return response.data.message;
    }
    return error instanceof Error ? error.message : "রিপোর্ট সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।";
  }

  const handleOpenModal = (project: FarmerProfitDistributionProject) => {
    setSelectedProject(project);
    reset({ totalSales: 0, productionCost: 0 });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    reset({ totalSales: 0, productionCost: 0 });
  };

  const onSubmit = (values: ProfitReportFormValues) => {
    if (!selectedProject) return;
    saveReportMutation.mutate(
      { projectId: selectedProject.id, data: values },
      { onSuccess: () => router.push(`/farmer/projects/${selectedProject.id}/payout`) },
    );
  };

  return (
    <div className="bg-white min-h-screen flex relative">
      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8">
          
          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="সক্রিয় ফান্ডিং" value={stats ? formatCurrency(stats.activeFundingAmount) : "..."} sub="সক্রিয় প্রকল্পসমূহ" />
            <StatCard label="মুনাফা বণ্টন হার" value={stats ? `${stats.profitDistributionRate}%` : "..."} tone="amber" sub="বিনিয়োগকারীর অংশ" />
            <StatCard label="প্রত্যাশিত ফসল সংগ্রহ" value={stats ? formatDate(stats.expectedHarvestDate) : "..."} sub="নিষ্পত্তির পূর্বে" />
            <StatCard label="সম্পন্ন নিষ্পত্তি" value={stats ? `${stats.completedSettlements}টি` : "..."} sub="সফল নিষ্পত্তি" />
          </div>

          {isError && (
            <div className="mt-4 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              মুনাফা বণ্টনের তথ্য লোড করা যায়নি।
              <button className="ml-3 underline" onClick={() => refetch()}>আবার চেষ্টা করুন</button>
            </div>
          )}

          {/* READY FOR REPORT PROJECTS LIST */}
          <div className="mt-10">
            <h3 className="text-lg text-stone-900 mb-4 font-medium">মুনাফা রিপোর্ট জমাদানের অপেক্ষায় থাকা প্রকল্পসমূহ</h3>
            
            <div className="grid grid-cols-1 gap-4">
              {isLoading ? (
                <div className="p-6 border border-stone-200 text-sm text-stone-500">প্রকল্পগুলো লোড হচ্ছে...</div>
              ) : readyProjects.map((project) => (
                <div key={project.id} className="border border-amber-200 bg-amber-50/40 p-6">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2 text-amber-700 text-xs">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>ফসল সংগ্রহ সম্পন্ন হলে মুনাফা রিপোর্ট জমা দিন</span>
                      </div>
                      <h2 className="mt-2 text-xl text-stone-900">
                        {project.title}
                      </h2>
                      <div className="text-sm text-stone-500 mt-1">
                        মোট ফান্ডিং {formatCurrency(project.fundingAmount)} · মেয়াদ {project.durationMonths} মাস · মুনাফা বণ্টন {project.profitShare}%
                      </div>
                    </div>
                    <button 
                      onClick={() => handleOpenModal(project)}
                      className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800 shrink-0 flex items-center gap-2"
                    >
                      <HandCoins className="w-4 h-4" />
                      মুনাফা রিপোর্ট জমা দিন
                    </button>
                  </div>
                </div>
              ))}
              
              {!isLoading && readyProjects.length === 0 && (
                <div className="p-6 border border-stone-200 text-center text-sm text-stone-500">
                  বর্তমানে কোনো প্রকল্পের রিপোর্ট জমাদানের অপেক্ষায় নেই।
                </div>
              )}
            </div>
          </div>

          {/* SETTLEMENT HISTORY */}
          <div className="mt-10 border border-stone-200">
            <div className="p-6 border-b border-stone-200">
              <h3 className="text-stone-900">
                নিষ্পত্তির ইতিহাস
              </h3>
            </div>
            <div className="divide-y divide-stone-100">
              {isLoading ? (
                <div className="p-6 text-sm text-stone-500">নিষ্পত্তির ইতিহাস লোড হচ্ছে...</div>
              ) : settlements.length === 0 ? (
                <div className="p-6 text-sm text-stone-500">এখনো কোনো নিষ্পত্তির ইতিহাস নেই।</div>
              ) : settlements.map((row) => (
                <div key={row.id} className="p-5 flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <div className="text-sm text-stone-800">{row.project}</div>
                    <div className="text-xs text-stone-400 mt-0.5">{formatDate(row.date)}</div>
                  </div>
                  <div className="text-xs text-stone-500">
                    বিক্রয় {formatCurrency(row.sales)} · নিট মুনাফা {formatCurrency(row.profit)}
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-stone-800">
                      {formatCurrency(row.share)} <span className="text-stone-400">({row.sharePercent}%)</span>
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">বিনিয়োগকারীর অংশ</div>
                  </div>
                  <StatusTag status={row.status === "success" ? "পরিশোধিত" : row.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* PROFIT REPORT MODAL */}
      {isModalOpen && selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-2xl shadow-xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-stone-200 flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-stone-900">
                  মুনাফা রিপোর্ট জমা দিন
                </h3>
                <p className="text-xs text-emerald-700 mt-1 font-medium bg-emerald-50 inline-block px-2 py-1 rounded">
                  প্রকল্প: {selectedProject.title}
                </p>
                <p className="text-xs text-stone-400 mt-2">
                  ফসল বা উৎপাদন বিক্রির পর প্রকৃত হিসাব দিয়ে এই ফর্মটি পূরণ করুন
                </p>
              </div>
              <button 
                onClick={closeModal}
                className="text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="p-6 grid sm:grid-cols-2 gap-5">
              <div>
                <Field
                  label="মোট বিক্রয় (৳)"
                  type="number"
                  min="0"
                  placeholder="যেমন: ৭৫,০০০"
                  {...register("totalSales", { valueAsNumber: true })}
                />
                <FieldError error={errors.totalSales} />
              </div>
              <div>
                <Field
                  label="উৎপাদন খরচ (৳)"
                  type="number"
                  min="0"
                  placeholder="যেমন: ৪০,০০০"
                  {...register("productionCost", { valueAsNumber: true })}
                />
                <FieldError error={errors.productionCost} />
              </div>

              <div className="sm:col-span-2 border-t border-stone-200 pt-5 flex items-center justify-between">
                <span className="text-sm text-stone-500">নিট মুনাফা</span>
                <span className="text-stone-900 font-medium">
                  {formatCurrency(netProfit)}
                </span>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between">
                <span className="text-sm text-stone-500">
                  বিনিয়োগকারীর প্রাপ্য অংশ ({selectedProject.profitShare}%)
                </span>
                <span className="text-xl text-emerald-800 font-medium">
                  {formatCurrency(investorShare)}
                </span>
              </div>

              {/* Action Buttons inside Modal */}
              <div className="sm:col-span-2 mt-4 flex gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-full bg-stone-100 text-stone-700 py-3 text-sm font-medium hover:bg-stone-200 transition-colors"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  disabled={saveReportMutation.isPending || netProfit < 0}
                  className="w-full bg-amber-500 text-emerald-950 py-3 text-sm font-medium hover:bg-amber-400 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saveReportMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "পরবর্তী ধাপ (পেমেন্ট)"}
                </button>
              </div>
              {saveReportMutation.isError && (
                <p className="sm:col-span-2 text-sm text-red-700" role="alert">
                  {getErrorMessage(saveReportMutation.error)}
                </p>
              )}
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
}