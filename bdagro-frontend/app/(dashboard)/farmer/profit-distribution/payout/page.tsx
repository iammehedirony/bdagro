"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChevronRight,
  HandCoins,
  Smartphone,
  Landmark,
  X,
} from "lucide-react";
import StatusTag from "@/components/ui/StatusTag";
import Field from "@/components/ui/Field";
import { FieldError } from "@/components/ui/FieldError";
import { useFarmerProjectPayoutsQuery } from "@/hooks/queries/useFarmerProjectDetailsQueries";
import {
  useCompleteFarmerProjectPayoutMutation,
  useMarkFarmerInvestmentPayoutMutation,
} from "@/hooks/mutations/useFarmerMutations";
import { manualPayoutSchema, type ManualPayoutFormValues } from "@/lib/schemas/farmer";

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return error instanceof Error ? error.message : "অনুরোধটি সম্পন্ন করা যায়নি।";
}

export default function FarmerPayoutCheckoutPage() {
  const params = useParams<{ id: string }>();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();
  const payoutQuery = useFarmerProjectPayoutsQuery(projectId);
  const payoutMutation = useMarkFarmerInvestmentPayoutMutation();
  const completeMutation = useCompleteFarmerProjectPayoutMutation();
  const [selectedInvestmentId, setSelectedInvestmentId] = useState<string | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ManualPayoutFormValues>({
    resolver: zodResolver(manualPayoutSchema),
    mode: "onBlur",
    defaultValues: { transactionId: "" },
  });
  const data = payoutQuery.data;
  const investments = data?.investments ?? [];
  const paidInvestments = investments.filter((investment) => investment.status === "returned");
  const allPaid = investments.length > 0 && paidInvestments.length === investments.length;
  const selectedInvestment = investments.find((investment) => investment._id === selectedInvestmentId);

  const closeModal = () => {
    setSelectedInvestmentId(null);
    reset({ transactionId: "" });
    payoutMutation.reset();
  };

  const onSubmitPayout = (values: ManualPayoutFormValues) => {
    if (!selectedInvestmentId) return;
    payoutMutation.mutate(
      { projectId, investmentId: selectedInvestmentId, transactionId: values.transactionId },
      { onSuccess: closeModal },
    );
  };

  const completePayout = () => {
    completeMutation.mutate(projectId, { onSuccess: () => router.push("/farmer") });
  };

  if (payoutQuery.isLoading) return <div className="p-4 lg:p-0 text-sm text-stone-500">পেআউটের তথ্য লোড হচ্ছে...</div>;
  if (payoutQuery.isError || !data) {
    return (
      <div className="p-4 lg:p-0">
        <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          পেআউটের তথ্য লোড করা যায়নি।
          <button className="ml-3 underline" onClick={() => payoutQuery.refetch()}>আবার চেষ্টা করুন</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen relative w-full max-w-full overflow-x-hidden box-border px-4 md:px-6">

      <div className="max-w-5xl mx-auto py-6 lg:py-10 w-full max-w-full">
        {/* BREADCRUMB */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-400">
          <span>মুনাফা বণ্টন</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="truncate max-w-[200px]">{data.project.title}</span>
          <ChevronRight className="w-3 h-3 shrink-0" />
          <span className="text-stone-600">পরিশোধ</span>
        </div>

        <h1 className="mt-3 lg:mt-4 text-2xl lg:text-3xl text-stone-900">
          মুনাফা পরিশোধ নিশ্চিত করুন
        </h1>
        <p className="mt-2 text-stone-500 text-sm">
          প্রতিটি বিনিয়োগকারীকে তার অংশ অনুযায়ী সরাসরি পরিশোধ করুন।
        </p>

        <div className="mt-6 lg:mt-8 grid gap-6 lg:gap-10 lg:grid-cols-[1fr_320px]">
          {/* LEFT: PROFIT SUMMARY + RECIPIENTS */}
          <div>
            {/* PROFIT SUMMARY */}
            <div className="border border-stone-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <div className="text-xs text-stone-400">মোট নিট মুনাফা</div>
                  <div className="text-lg text-stone-900 break-words">
                    {formatCurrency(data.project.profitReport.netProfit)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-400">মুনাফা বণ্টন হার</div>
                  <div className="text-lg text-stone-900 break-words">
                    {data.project.profitReport.profitSharePercent}%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-400">বিনিয়োগকারীদের মোট প্রাপ্য</div>
                  <div className="text-lg text-emerald-800 break-words">
                    {formatCurrency(data.project.profitReport.investorShareAmount)}
                  </div>
                </div>
              </div>
            </div>

            {/* RECIPIENTS LIST */}
            <div className="mt-4 lg:mt-6 border border-stone-200">
              <div className="border-b border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <h3 className="text-stone-900">
                  প্রাপক বিনিয়োগকারীগণ
                </h3>
                <span className="text-xs text-stone-400">{investments.length.toLocaleString("bn-BD")} জন</span>
              </div>
              <div className="w-full overflow-x-auto">
                <div className="divide-y divide-stone-100">
                  {investments.map((investment) => {
                    const name = investment.investor?.name || "বিনিয়োগকারী";
                    const isPaid = investment.status === "returned";
                    return (
                      <div key={investment._id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 lg:gap-4 w-full flex-wrap">
                        <div className="w-9 h-9 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-sm shrink-0">
                          {name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-stone-800 break-words">{name}</div>
                          <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5 flex-wrap">
                            {investment.paymentMethod === "sslcommerz" ? (
                              <Landmark className="w-3 h-3 shrink-0" />
                            ) : (
                              <Smartphone className="w-3 h-3 shrink-0" />
                            )}
                            {investment.paymentMethod === "sslcommerz" ? "SSLCommerz" : investment.paymentMethod}
                          </div>
                        </div>
                        <div className="text-right sm:text-left shrink-0 w-full sm:w-auto">
                          <div className="text-sm text-stone-800 whitespace-nowrap break-words">{formatCurrency(investment.returnAmount)}</div>
                          <div className="text-xs text-stone-400 mt-0.5 break-words">
                            বিনিয়োগ {formatCurrency(investment.amount)}
                          </div>
                        </div>
                        <div className="shrink-0 flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                          <StatusTag status={isPaid ? "পরিশোধিত" : "বাকি"} />
                          {!isPaid && (
                            <button
                              onClick={() => { setSelectedInvestmentId(investment._id); reset({ transactionId: "" }); }}
                              className="text-xs border border-emerald-800 text-emerald-900 px-3 py-1.5 hover:bg-emerald-50 whitespace-nowrap"
                            >
                              পরিশোধিত হিসেবে চিহ্নিত করুন
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <label className="mt-4 lg:mt-6 flex flex-col sm:flex-row sm:items-start gap-2 text-xs text-stone-500">
              <input type="checkbox" checked={isConfirmed} onChange={(event) => setIsConfirmed(event.target.checked)} className="accent-emerald-800 mt-0.5 shrink-0" />
              <span className="break-words whitespace-normal">
                আমি নিশ্চিত করছি উপরের প্রতিটি বিনিয়োগকারীকে সঠিক পরিমাণ
                সরাসরি পরিশোধ করেছি
              </span>
            </label>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:sticky lg:top-6 h-fit w-full max-w-full">
            <div className="border border-stone-200 w-full max-w-full">
              <div className="flex flex-col sm:flex-row items-start gap-3 lg:gap-4 border-b border-stone-200">
                <div className="w-10 lg:w-11 h-10 lg:h-11 bg-emerald-900 flex items-center justify-center shrink-0">
                  <HandCoins className="w-4 lg:w-5 h-4 lg:h-5 text-white/80" />
                </div>
                <div className="min-w-0 w-full">
                  <div className="text-xs text-stone-400 truncate">{data.project.title}</div>
                  <div className="text-sm lg:text-base text-stone-900">
                    মুনাফা পরিশোধ
                  </div>
                </div>
              </div>

              <div className="space-y-2 lg:space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-stone-400">মোট প্রাপক</span>
                  <span className="text-stone-800 whitespace-nowrap">{investments.length} জন বিনিয়োগকারী</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-stone-400">পরিশোধিত</span>
                  <span className="text-stone-800 whitespace-nowrap">{paidInvestments.length} জন</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <span className="text-stone-400">বাকি</span>
                  <span className="text-amber-700 whitespace-nowrap">{investments.length - paidInvestments.length} জন</span>
                </div>
              </div>

              <div className="pt-0">
                <div className="pt-3 lg:pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-stone-700">সর্বমোট মুনাফা বণ্টন</span>
                  <span className="text-lg lg:text-xl text-stone-900 break-words">
                    {formatCurrency(data.project.profitReport.investorShareAmount)}
                  </span>
                </div>
                <button onClick={completePayout} disabled={!isConfirmed || !allPaid || completeMutation.isPending} className="mt-4 lg:mt-5 w-full bg-amber-500 text-emerald-950 py-3 text-sm font-medium hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-50">
                  {completeMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "সব পরিশোধ সম্পন্ন হিসেবে চিহ্নিত করুন"}
                </button>
                {completeMutation.isError && <p className="mt-3 text-xs text-red-700 break-words">{getErrorMessage(completeMutation.error)}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      {selectedInvestment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60">
          <div className="w-full max-w-md border border-stone-200 bg-white shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 border-b border-stone-200 p-4 lg:p-6">
              <div className="min-w-0">
                <h2 className="text-lg text-stone-900">পেমেন্ট নিশ্চিত করুন</h2>
                <p className="mt-1 text-xs text-stone-500 truncate">{selectedInvestment.investor?.name || "বিনিয়োগকারী"} · {formatCurrency(selectedInvestment.returnAmount)}</p>
              </div>
              <button type="button" onClick={closeModal} className="text-stone-400 hover:text-stone-700 shrink-0"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit(onSubmitPayout)} noValidate className="space-y-4 lg:space-y-5 p-4 lg:p-6">
              <div>
                <Field label="ট্রানজেকশন আইডি" placeholder="ম্যানুয়াল পেমেন্টের TXN ID" {...register("transactionId")} />
                <FieldError error={errors.transactionId} />
              </div>
              {payoutMutation.isError && <p className="text-sm text-red-700" role="alert">{getErrorMessage(payoutMutation.error)}</p>}
              <div className="flex flex-col sm:flex-row gap-3">
                <button type="button" onClick={closeModal} className="w-full bg-stone-100 py-3 text-sm text-stone-700">বাতিল করুন</button>
                <button type="submit" disabled={payoutMutation.isPending} className="w-full bg-emerald-900 py-3 text-sm text-white disabled:opacity-60">{payoutMutation.isPending ? "সংরক্ষণ হচ্ছে..." : "পরিশোধিত হিসেবে চিহ্নিত করুন"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}