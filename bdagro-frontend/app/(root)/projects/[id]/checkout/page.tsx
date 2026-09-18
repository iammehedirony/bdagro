"use client";

import React, { useEffect, useState } from "react";
import {
  Sprout,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  CreditCard,
  MapPin,
} from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "next/navigation";
import { useProjectDetailsQuery } from "@/hooks/queries/useProjectDetailsQuery";
import { useApi } from "@/lib/useApi";

const MIN_INVESTMENT = 5000;
const MAX_INVESTMENT = 125000;
const PLATFORM_FEE = 0;

const checkoutSchema = z.object({
  investmentType: z.enum(["partial", "full"]),
  amount: z.coerce.number().int().min(MIN_INVESTMENT).max(MAX_INVESTMENT),
  paymentMethod: z.enum(["sslcommerz", "stripe"]),
  fullName: z.string().trim().min(1, "পূর্ণ নাম লিখুন"),
  email: z.string().trim().email("সঠিক ইমেইল লিখুন"),
  phone: z.string().trim().min(7, "সঠিক ফোন নম্বর লিখুন"),
  agreement: z.boolean().refine((value) => value, "শর্তে সম্মতি দিন"),
}).strict();

type CheckoutValues = z.infer<typeof checkoutSchema>;

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
}

export default function InvestmentCheckoutPage() {
  const params = useParams<{ id: string }>();
  const projectId = Array.isArray(params.id) ? params.id[0] : params.id;
  const api = useApi();
  const projectQuery = useProjectDetailsQuery(projectId);
  const project = projectQuery.data;
  const [initialised, setInitialised] = useState(false);
  const remaining = project ? Math.max(project.fundingGoal - (project.investmentSummary.totalRaised ?? project.fundedAmount), 0) : MAX_INVESTMENT;
  const fullAmount = Math.min(remaining, MAX_INVESTMENT);
  const form = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { investmentType: "partial", amount: 10000, paymentMethod: "sslcommerz", fullName: "", email: "", phone: "", agreement: false },
  });
  const selectedType = form.watch("investmentType");
  const selectedMethod = form.watch("paymentMethod");
  const amount = Number(form.watch("amount")) || 0;
  const total = amount + PLATFORM_FEE;

  useEffect(() => {
    if (!project || initialised) return;
    const search = new URLSearchParams(window.location.search);
    const requestedAmount = Number(search.get("amount"));
    const type = search.get("type") === "full" ? "full" : "partial";
    form.reset({ ...form.getValues(), investmentType: type, amount: type === "full" ? fullAmount : requestedAmount || 10000 });
    setInitialised(true);
  }, [form, fullAmount, initialised, project]);

  const paymentMutation = useMutation({
    mutationFn: async (values: CheckoutValues) => {
      if (values.amount > remaining) throw new Error(`সর্বোচ্চ বিনিয়োগ ${formatCurrency(remaining)}`);
      if (values.investmentType === "full" && values.amount !== remaining) throw new Error("পূর্ণ বিনিয়োগের পরিমাণ প্রকল্পের অবশিষ্ট অর্থের সমান হতে হবে");
      const investmentResponse = await api.post<{ transaction: { _id: string } }>("/investors/investments", { project: projectId, amount: values.amount, investmentType: values.investmentType, paymentMethod: values.paymentMethod, billing: { fullName: values.fullName, email: values.email, phone: values.phone } });
      const checkoutResponse = await api.post<{ redirectUrl: string }>(`/payments/${investmentResponse.data.transaction._id}/checkout`);
      return checkoutResponse.data;
    },
    onSuccess: ({ redirectUrl }) => window.location.assign(redirectUrl),
  });

  if (projectQuery.isLoading) return <div className="p-8 text-sm text-stone-500">প্রকল্পের তথ্য লোড হচ্ছে...</div>;
  if (projectQuery.isError || !project) return <div className="p-8 text-sm text-red-700">প্রকল্পের তথ্য লোড করা যায়নি।</div>;
  const fieldClass = "border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700";

  return (
    <form onSubmit={form.handleSubmit((values) => paymentMutation.mutate(values))} className="bg-white min-h-screen">

    
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <span>হোম</span>
          <ChevronRight className="w-3 h-3" />
          <span>{project.title}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600">চেকআউট</span>
        </div>

        <h1 className="mt-4 text-3xl text-stone-900">
          বিনিয়োগ নিশ্চিত করুন
        </h1>

        <div className="mt-8 grid lg:grid-cols-[1fr_340px] gap-10">
          {/* LEFT: CHECKOUT FLOW */}
          <div className="space-y-8">
            {/* AMOUNT */}
            <div className="border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <span className="text-xs text-emerald-800">১</span>
                <h2 className="text-lg text-stone-900">
                  বিনিয়োগের পরিমাণ
                </h2>
              </div>
              <div className="p-6">
                <div className="flex gap-2 mb-4">
                  <button type="button" onClick={() => form.setValue("investmentType", "partial")} className={`flex-1 border py-2.5 text-sm ${selectedType === "partial" ? "border-emerald-800 bg-emerald-50 text-emerald-900" : "border-stone-300 text-stone-600"}`}>
                    আংশিক বিনিয়োগ
                  </button>
                  <button type="button" onClick={() => { form.setValue("investmentType", "full"); form.setValue("amount", fullAmount); }} className={`flex-1 border py-2.5 text-sm ${selectedType === "full" ? "border-emerald-800 bg-emerald-50 text-emerald-900" : "border-stone-300 text-stone-600"}`}>
                    পূর্ণ বিনিয়োগ ({formatCurrency(fullAmount)})
                  </button>
                </div>
                <div className="flex items-center border border-stone-300 max-w-xs">
                  <span className="px-3 text-stone-400 text-sm">৳</span>
                  <input
                    type="number"
                    min={MIN_INVESTMENT}
                    max={remaining}
                    {...form.register("amount", { valueAsNumber: true, onChange: () => form.setValue("investmentType", "partial") })}
                    className="flex-1 py-2.5 pr-3 text-sm outline-none"
                  />
                </div>
                <div className="text-xs text-stone-400 mt-1.5">
                  সর্বনিম্ন বিনিয়োগ {formatCurrency(MIN_INVESTMENT)} · সর্বোচ্চ {formatCurrency(remaining)}
                </div>
                {form.formState.errors.amount && <div className="mt-1 text-xs text-red-600">{form.formState.errors.amount.message}</div>}
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <span className="text-xs text-emerald-800">২</span>
                <h2 className="text-lg text-stone-900">
                  পেমেন্ট পদ্ধতি
                </h2>
              </div>
              <div className="p-6 space-y-3">
                {[["sslcommerz", Smartphone, "SSLCommerz", "বিকাশ, নগদ, রকেট, লোকাল কার্ড ও ব্যাংক"], ["stripe", CreditCard, "Stripe", "আন্তর্জাতিক ভিসা / মাস্টারকার্ড"]].map(([method, Icon, title, sub]) => <label key={method as string} className={`flex items-center gap-4 border p-4 cursor-pointer ${selectedMethod === method ? "border-emerald-800 bg-emerald-50" : "border-stone-300"}`}><input type="radio" value={method as string} {...form.register("paymentMethod")} className="accent-emerald-800" /><Icon className="w-5 h-5 text-stone-500 shrink-0" /><div><div className="text-sm text-stone-800">{title as string}</div><div className="text-xs text-stone-400 mt-0.5">{sub as string}</div></div></label>)}
              </div>
            </div>

            {/* BILLING INFO */}
            <div className="border border-stone-200">
              <div className="p-6 border-b border-stone-200">
                <span className="text-xs text-emerald-800">৩</span>
                <h2 className="text-lg text-stone-900">
                  বিলিং তথ্য
                </h2>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="পূর্ণ নাম"
                  {...form.register("fullName")}
                  className={fieldClass}
                />
                <input
                  type="email"
                  placeholder="ইমেইল"
                  {...form.register("email")}
                  className={fieldClass}
                />
                <input
                  type="tel"
                  placeholder="ফোন নম্বর"
                  {...form.register("phone")}
                  className={`${fieldClass} sm:col-span-2`}
                />
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-stone-500">
              <input type="checkbox" {...form.register("agreement")} className="accent-emerald-800 mt-0.5" />
              {form.formState.errors.agreement && <span className="text-red-600">শর্তে সম্মতি দিন</span>}
              <span>
                আমি বুঝতে পেরেছি এই বিনিয়োগ ঝুঁকিমুক্ত নয় এবং রিটার্ন ফসল
                বিক্রির উপর নির্ভরশীল
              </span>
            </label>
          </div>

          {/* RIGHT: ORDER SUMMARY */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="border border-stone-200">
              <div className="p-5 flex items-center gap-4 border-b border-stone-200">
                <div className="w-12 h-12 bg-emerald-900 flex items-center justify-center shrink-0">
                  <Sprout className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <div className="text-stone-900">
                    {project.title}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-stone-400 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {project.location}
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-3 border-b border-stone-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">ঝুঁকির মাত্রা</span>
                  <span className="text-stone-800">{project.riskLevel === "low" ? "কম" : project.riskLevel === "medium" ? "মাঝারি" : "বেশি"}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">প্রত্যাশিত ROI</span>
                  <span className="text-emerald-800">{project.expectedROIPercent}%</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">মেয়াদ</span>
                  <span className="text-stone-800">{project.durationMonths ?? "-"} মাস</span>
                </div>
              </div>

              <div className="p-5 space-y-3 border-b border-stone-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">বিনিয়োগের পরিমাণ</span>
                  <span className="text-stone-800">{formatCurrency(amount)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-stone-400">প্ল্যাটফর্ম ফি</span>
                  <span className="text-stone-800">৳০</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-stone-700">সর্বমোট</span>
                  <span className="text-xl text-stone-900">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="p-5">
                <button type="submit" disabled={paymentMutation.isPending} className="w-full bg-amber-500 text-emerald-950 py-3 text-sm font-medium hover:bg-amber-400 disabled:opacity-60">
                  {paymentMutation.isPending ? "পেমেন্ট প্রস্তুত হচ্ছে..." : `${formatCurrency(total)} পেমেন্ট করুন`}
                </button>
                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{selectedMethod === "sslcommerz" ? "SSLCommerz" : "Stripe"} দ্বারা সুরক্ষিত পেমেন্ট</span>
                </div>
                {paymentMutation.isError && <div className="mt-3 text-xs text-red-600">{paymentMutation.error instanceof Error ? paymentMutation.error.message : "পেমেন্ট শুরু করা যায়নি"}</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}