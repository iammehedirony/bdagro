"use client";

import { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Banknote, CalendarClock, ChevronRight, HandCoins, Info, Loader2, Sprout, Wheat } from "lucide-react";
import UploadBox from "@/components/ui/UploadBox";
import Field from "@/components/ui/Field";
import { FieldError } from "@/components/ui/FieldError";
import { useCreateLoanApplicationMutation } from "@/hooks/mutations/useLoanMutations";
import { useLoanProductsQuery } from "@/hooks/queries/useLoanQueries";
import { loanApplicationSchema, type LoanApplicationFormValues } from "@/lib/schemas/loan";
import { StepSidebar } from "@/components/auth/StepSidebar";

const defaultValues: LoanApplicationFormValues = {
  loanProduct: "",
  requestedAmount: 5000,
  durationMonths: 6,
  projectTitle: "",
  projectDescription: "",
  location: "",
  cropType: "",
  landArea: 0,
  expectedHarvestDate: "",
  farmImages: [],
  landDeed: null,
  incomeProof: null,
  terms: true,
};

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return error instanceof Error ? error.message : "আবেদন জমা দেওয়া যায়নি। আবার চেষ্টা করুন।";
}

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
}

export default function LoanApplicationPage() {
  const [step, setStep] = useState(1);
  const productsQuery = useLoanProductsQuery();
  const applicationMutation = useCreateLoanApplicationMutation();
  const products = productsQuery.data ?? [];
  const { register, control, trigger, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<LoanApplicationFormValues>({
    resolver: zodResolver(loanApplicationSchema),
    mode: "onBlur",
    defaultValues,
  });
  const selectedProductId = useWatch({ control, name: "loanProduct" });
  const amount = useWatch({ control, name: "requestedAmount" });
  const duration = useWatch({ control, name: "durationMonths" });
  const selectedProduct = products.find((product) => product._id === selectedProductId);
  const isPending = applicationMutation.isPending;

  useEffect(() => {
    if (!selectedProduct) return;
    if (Number(amount) < selectedProduct.minAmount || Number(amount) > selectedProduct.maxAmount) {
      setValue("requestedAmount", selectedProduct.minAmount, { shouldValidate: true });
    }
    if (Number(duration) > selectedProduct.maxDurationMonths) {
      setValue("durationMonths", selectedProduct.maxDurationMonths, { shouldValidate: true });
    }
  }, [amount, duration, selectedProduct, setValue]);

  const onSubmit = async (data: LoanApplicationFormValues) => {
    await applicationMutation.mutateAsync(data);
    reset({ ...defaultValues, loanProduct: data.loanProduct });
    setStep(1);
  };

  const goToStepTwo = async () => {
    const valid = await trigger(["loanProduct", "requestedAmount", "durationMonths", "projectTitle", "location", "projectDescription"]);
    if (valid) setStep(2);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <span>হোম</span><ChevronRight className="h-3 w-3" /><span>ফান্ডিং এক্সপ্লোরার</span>
          <ChevronRight className="h-3 w-3" /><span className="text-stone-600">ফান্ডিং আবেদন</span>
        </div>
        <h1 className="mt-4 text-3xl text-stone-900">ফান্ডিং আবেদন করুন</h1>
        <p className="mt-2 text-sm text-stone-500">প্রয়োজনীয় তথ্য পূরণ করুন, অ্যাডমিন যাচাইয়ের পর সিদ্ধান্ত জানানো হবে।</p>

        <div className="mt-4 flex max-w-2xl items-start gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
          <p className="text-xs leading-relaxed text-emerald-800">এটি সুদভিত্তিক ঋণ নয়। ফসল বা প্রকল্প থেকে লাভ হলে তার একটি নির্দিষ্ট অংশ বিনিয়োগকারীকে দিতে হবে।</p>
        </div>

        {applicationMutation.error && <div className="mt-6 max-w-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{getErrorMessage(applicationMutation.error)}</div>}
        {applicationMutation.isSuccess && <div className="mt-6 max-w-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">আপনার আবেদন সফলভাবে জমা হয়েছে।</div>}
        {productsQuery.error && <div className="mt-6 max-w-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{getErrorMessage(productsQuery.error)}</div>}

        <div className="mt-8 grid gap-10 md:grid-cols-[220px_1fr] lg:grid-cols-[220px_1fr_340px]">
          <StepSidebar step={step} steps={[{ id: 1, label: "বেসিক প্রকল্প তথ্য", icon: Sprout }, { id: 2, label: "খামারের তথ্য ও সংযুক্তি", icon: Wheat }]} />
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-7">
          {step === 1 ? <>
            <div>
              <label className="text-sm text-stone-700">কোন ফান্ডিং প্রোডাক্টের জন্য আবেদন করছেন</label>
              <select {...register("loanProduct")} disabled={isPending || productsQuery.isLoading} className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm text-stone-700 focus:border-emerald-700 focus:outline-none">
                <option value="">প্রোডাক্ট নির্বাচন করুন</option>
                {products.map((product) => <option key={product._id} value={product._id}>{product.name}</option>)}
              </select>
              <FieldError error={errors.loanProduct} />
            </div>

            <div>
              <div className="flex items-center justify-between"><label className="text-sm text-stone-700">ফান্ডিংয়ের পরিমাণ</label><span className="text-sm text-stone-900">{formatCurrency(Number(amount) || 0)}</span></div>
              <input {...register("requestedAmount", { valueAsNumber: true })} type="range" min={selectedProduct?.minAmount ?? 5000} max={selectedProduct?.maxAmount ?? 50000} step="1000" disabled={isPending || !selectedProduct} className="mt-3 w-full accent-emerald-800" />
              <div className="mt-1 flex justify-between text-xs text-stone-400"><span>সর্বনিম্ন {formatCurrency(selectedProduct?.minAmount ?? 5000)}</span><span>সর্বোচ্চ {formatCurrency(selectedProduct?.maxAmount ?? 50000)}</span></div>
              <FieldError error={errors.requestedAmount} />
            </div>

            <div>
              <label className="text-sm text-stone-700">প্রকল্পের মেয়াদ</label>
              <select {...register("durationMonths", { valueAsNumber: true })} disabled={isPending} className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm text-stone-700 focus:border-emerald-700 focus:outline-none">
                {[3, 6, 9, 12, 18, 24, 36].filter((months) => months <= (selectedProduct?.maxDurationMonths ?? 36)).map((months) => <option key={months} value={months}>{months} মাস</option>)}
              </select>
              <FieldError error={errors.durationMonths} />
            </div>

            <div><Field label="প্রকল্পের নাম" placeholder="যেমন: কুমিল্লায় বোরো ধান চাষ" readOnly={isPending} {...register("projectTitle")} /><FieldError error={errors.projectTitle} /></div>
            <div><Field label="এলাকা" placeholder="যেমন: কুমিল্লা সদর" readOnly={isPending} {...register("location")} /><FieldError error={errors.location} /></div>
            <div><label className="text-sm text-stone-700">ফান্ডিংয়ের উদ্দেশ্য</label><textarea {...register("projectDescription")} rows={4} disabled={isPending} placeholder="যেমন: ৩ বিঘা জমিতে বোরো ধানের জন্য উচ্চ ফলনশীল বীজ ক্রয়" className="mt-1.5 w-full resize-none border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700" /><FieldError error={errors.projectDescription} /></div>
            <button type="button" onClick={goToStepTwo} disabled={isPending || isSubmitting} className="bg-emerald-900 px-6 py-3 text-sm text-white hover:bg-emerald-800 disabled:opacity-70">পরবর্তী ধাপ</button>
          </> : <>
            <div><Field label="ফসলের ধরন (ঐচ্ছিক)" placeholder="যেমন: বোরো ধান" readOnly={isPending} {...register("cropType")} /><FieldError error={errors.cropType} /></div>
            <div className="grid gap-5 sm:grid-cols-2"><div><Field label="জমির পরিমাণ" type="number" placeholder="যেমন: ৩" readOnly={isPending} {...register("landArea", { valueAsNumber: true })} /><FieldError error={errors.landArea} /></div><div><label className="text-sm text-stone-700">প্রত্যাশিত ফসল কাটার তারিখ</label><input type="date" {...register("expectedHarvestDate")} disabled={isPending} className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-700" /><FieldError error={errors.expectedHarvestDate} /></div></div>
            <div><label className="mb-2 block text-sm text-stone-700">খামারের ছবি</label><Controller name="farmImages" control={control} render={({ field }) => <UploadBox label="খামারের ছবি নির্বাচন করুন" hint="JPG, PNG, WEBP · সর্বোচ্চ ৬টি ছবি" accept="image/jpeg,image/png,image/webp" multiple files={field.value} onFilesChange={field.onChange} />} /><FieldError error={errors.farmImages} /></div>

            <div>
              <label className="mb-2 block text-sm text-stone-700">সংযুক্তি</label>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Controller name="landDeed" control={control} render={({ field }) => <UploadBox label="জমির দলিল / লিজ কাগজ" hint="PDF, JPG · সর্বোচ্চ ৫MB" accept="image/*,.pdf" file={field.value} onChange={field.onChange} />} /><FieldError error={errors.landDeed} /></div>
                <div><Controller name="incomeProof" control={control} render={({ field }) => <UploadBox label="আয়ের প্রমাণ (ঐচ্ছিক)" hint="PDF, JPG · সর্বোচ্চ ৫MB" accept="image/*,.pdf" file={field.value} onChange={field.onChange} />} /><FieldError error={errors.incomeProof} /></div>
              </div>
            </div>

            <div><label className="flex items-start gap-2 text-xs text-stone-500"><input {...register("terms")} type="checkbox" disabled={isPending} className="mt-0.5 accent-emerald-800" /><span>আমি নিশ্চিত করছি প্রদত্ত সকল তথ্য সঠিক এবং মুনাফা বণ্টনের শর্তাবলীতে সম্মত</span></label><FieldError error={errors.terms} /></div>
            <div className="flex items-center justify-between gap-3"><button type="button" onClick={() => setStep(1)} className="border border-stone-300 px-6 py-3 text-sm text-stone-700">পূর্ববর্তী ধাপ</button><button type="submit" disabled={isPending || productsQuery.isLoading || products.length === 0} className="flex items-center gap-2 bg-emerald-900 px-6 py-3 text-sm text-white hover:bg-emerald-800 disabled:opacity-70">{isPending && <Loader2 className="h-4 w-4 animate-spin" />}আবেদন জমা দিন</button></div>
          </>}
          </form>

          <div className="h-fit lg:sticky lg:top-6"><div className="border border-stone-200"><div className="flex items-start gap-4 border-b border-stone-200 p-5"><div className="flex h-11 w-11 shrink-0 items-center justify-center bg-emerald-900"><Wheat className="h-5 w-5 text-white/80" /></div><div><div className="text-xs text-stone-400">ফান্ডিং প্রোডাক্ট</div><div className="text-stone-900">{selectedProduct?.name ?? "প্রোডাক্ট নির্বাচন করুন"}</div></div></div><div className="space-y-4 p-5"><div className="flex items-center justify-between text-sm"><span className="flex items-center gap-1.5 text-stone-400"><HandCoins className="h-3.5 w-3.5" />মুনাফা/সুদের হার</span><span className="text-stone-800">{selectedProduct ? `${selectedProduct.profitSharePercent}%` : "-"}</span></div><div className="flex items-center justify-between text-sm"><span className="flex items-center gap-1.5 text-stone-400"><Banknote className="h-3.5 w-3.5" />আবেদনকৃত পরিমাণ</span><span className="text-stone-800">{formatCurrency(Number(amount) || 0)}</span></div><div className="flex items-center justify-between text-sm"><span className="flex items-center gap-1.5 text-stone-400"><CalendarClock className="h-3.5 w-3.5" />মেয়াদ</span><span className="text-stone-800">{duration || 0} মাস</span></div><div className="border-t border-stone-200 pt-4 text-xs leading-relaxed text-stone-500">{selectedProduct?.description ?? "প্রোডাক্ট নির্বাচন করলে তার শর্তাবলী এখানে দেখা যাবে।"}</div></div></div></div>
        </div>
      </div>
    </div>
  );
}