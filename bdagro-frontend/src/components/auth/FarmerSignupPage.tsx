"use client";

import React, { useState } from "react";
import {
  useForm,
  FormProvider,
  useFormContext,
  Controller,
  type FieldError as RHFFieldError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { useSignUp } from "@clerk/nextjs";
import Field from "../ui/Field";
import UploadBox from "../ui/UploadBox";
import StatusChip from "../ui/StatusChip";
import OtpInput from "../ui/OtpInput";
import {
  farmerAccountSchema,
  farmerNidSchema,
  type FarmerAccountFormValues,
  type FarmerNidFormValues,
} from "../../lib/schemas/auth";
import { StepSidebar } from "./StepSidebar";
import { FieldError } from "../ui/FieldError";
import { LockedPreview } from "./LockedPreview";
import { useApi } from "@/lib/useApi";
import axios from "axios";

function AccountStep() {
  const {
    register,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<FarmerAccountFormValues>();

const { signUp, fetchStatus } = useSignUp();
const loading = fetchStatus === "fetching";
const [clerkError, setClerkError] = useState("");

const handleSendOTP = async () => {
  const isValid = await trigger(["name", "email", "password", "terms", "phone"]);
  if (!isValid) return;

  const data = getValues();

  const { error } = await signUp.password({
    firstName: data.name,
    emailAddress: data.email,
    password: data.password,
  });

  if (error) {
    setClerkError(error.message || "OTP পাঠাতে সমস্যা হয়েছে। ইমেইলটি চেক করুন।");
    return;
  }

  await signUp.verifications.sendEmailCode();
};

  return (
    <>
      <div className="border border-stone-200">
        <div className="p-8 border-b border-stone-200">
          <div className="flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">ধাপ ১ / ২</span>
          </div>
          <h2 className="mt-2 text-xl text-stone-900">অ্যাকাউন্ট তৈরি করুন</h2>
          <p className="mt-2 text-sm text-stone-500 leading-relaxed max-w-md">
            আপনার নাম ও ফোন নম্বর দিয়ে অ্যাকাউন্ট খুলুন। ফোন নম্বর OTP দিয়ে যাচাই করা হবে।
          </p>
        </div>

        <div className="p-8 space-y-5">
          {clerkError && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {clerkError}
            </div>
          )}

          {/* পূর্ণ নাম (Custom Field Component) */}
          <div>
            <Field
              label="পূর্ণ নাম"
              placeholder="আপনার নাম লিখুন"
              readOnly={loading}
              {...register("name")}
            />
            <FieldError error={errors.name} />
          </div>

          {/* ফোন নম্বর (Custom Field Component) */}
          <div>
            <Field
              label="ফোন নম্বর"
              placeholder="০১৭XXXXXXXX"
              readOnly={loading}
              {...register("phone")}
            />
            <FieldError error={errors.phone} />
          </div>
          {/* ইমেইল (Custom Field Component) */}
          <div>
            <Field
              label="ইমেইল"
              placeholder="আপনার ইমেইল দিন"
              readOnly={loading}
              {...register("email")}
              suffix={
                <button
                  type="button"
                  onClick={handleSendOTP}
                  disabled={loading}
                  className="px-4 py-2.5 text-xs text-emerald-800 border-l border-stone-300 hover:bg-stone-50 whitespace-nowrap disabled:opacity-50"
                >
                  {loading ? "লোড হচ্ছে..." : "OTP পাঠান"}
                </button>
              }
            />
            <FieldError error={errors.email} />
          </div>

          {/* OTP কোড (Custom OtpInput Component with Controller) */}
          <div>
            <label className="text-sm text-neutral-700 block mb-1.5">OTP কোড</label>
            <Controller
              name="otp"
              control={control}
              render={({ field: { value, onChange } }) => (
                <OtpInput value={value} onChange={onChange} disabled={loading} />
              )}
            />
            <FieldError 
              error={
                errors.otp 
                  ? { message: errors.otp.message || "অনুগ্রহ করে ৬-ডিজিটের সম্পূর্ণ OTP কোডটি লিখুন" } as RHFFieldError 
                  : undefined
              } 
            />
            <div className="mt-2 text-xs text-stone-400">
              ফোনে পাঠানো ৬-ডিজিট কোডটি লিখুন ·{" "}
              <span className="text-emerald-900 cursor-pointer">আবার পাঠান</span>
            </div>
          </div>

          {/* পাসওয়ার্ড (Custom Field Component) */}
          <div>
            <Field
              label="পাসওয়ার্ড"
              type="password"
              placeholder="কমপক্ষে ৮ ক্যারেক্টার"
              readOnly={loading}
              {...register("password")}
            />
            <FieldError error={errors.password} />
          </div>

          <div id="clerk-captcha" />

          {/* Terms Checkbox */}
          <div>
            <label className="flex items-start gap-2 text-xs text-stone-500">
              <input
                type="checkbox"
                className="accent-emerald-800 mt-0.5"
                {...register("terms")}
                disabled={loading}
              />
              <span>
                আমি Bdagroonline-এর ব্যবহারের শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত
              </span>
            </label>
            <FieldError 
              error={
                errors.terms 
                  ? { ...errors.terms, message: "এগিয়ে যেতে আপনাকে শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত হতে হবে।" } as RHFFieldError
                  : undefined
              } 
            />
          </div>
        </div>

        <div className="p-8 pt-0 flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800 disabled:opacity-70"
          >
            {loading ? "যাচাই করা হচ্ছে..." : "পরবর্তী ধাপ: NID ভেরিফিকেশন"}
          </button>
        </div>
      </div>

      <LockedPreview nextStep={2} />
    </>
  );
}

function NidStep({ onBack }: { onBack: () => void }) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<FarmerNidFormValues>();

  return (
    <>
      <div className="border border-stone-200">
        <div className="p-8 border-b border-stone-200">
          <div className="flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">ধাপ ২ / ২</span>
          </div>
          <h2 className="mt-2 text-xl text-stone-900">
            জাতীয় পরিচয়পত্র (NID) ভেরিফিকেশন
          </h2>
          <p className="mt-2 text-sm text-stone-500 leading-relaxed max-w-md">
            বিনিয়োগকারীদের আস্থা নিশ্চিত করতে প্রতিটি কৃষকের পরিচয় যাচাই করা হয়। তথ্য শুধু ভেরিফিকেশনের জন্য ব্যবহৃত হবে।
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Field label="NID নম্বর" placeholder="১০ / ১৭ ডিজিট" {...register("nidNumber")} />
              <FieldError error={errors.nidNumber} />
            </div>
            <div>
              <Field label="পূর্ণ নাম (NID অনুযায়ী)" placeholder="নাম লিখুন" {...register("nidName")} />
              <FieldError error={errors.nidName} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <Field label="জন্ম তারিখ" placeholder="dd/mm/yyyy" {...register("dob")} />
              <FieldError error={errors.dob} />
            </div>
            <div>
              <Field label="খামারের ঠিকানা" placeholder="জেলা, উপজেলা" {...register("farmAddress")} />
              <FieldError error={errors.farmAddress} />
            </div>
          </div>

          <div>
            <div className="text-sm text-stone-700 mb-2">NID কার্ডের ছবি</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Controller
                  name="nidFront"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <UploadBox
                      label="সামনের অংশ"
                      hint="JPG, PNG · সর্বোচ্চ ৫MB"
                      file={value ?? null}
                      onChange={onChange}
                    />
                  )}
                />
                <FieldError error={errors.nidFront} />
              </div>
              <div>
                <Controller
                  name="nidBack"
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <UploadBox
                      label="পেছনের অংশ"
                      hint="JPG, PNG · সর্বোচ্চ ৫MB"
                      file={value ?? null}
                      onChange={onChange}
                    />
                  )}
                />
                <FieldError error={errors.nidBack} />
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 text-xs text-stone-400 pt-1">
            <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              যাচাইয়ে সাধারণত ২৪ ঘণ্টার মধ্যে সময় লাগে। অনুমোদনের পর প্রকল্প পোস্ট করার সুবিধা চালু হবে।
            </span>
          </div>
        </div>

        <div className="p-8 pt-0 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-stone-500 hover:text-stone-800"
          >
            পূর্ববর্তী ধাপ
          </button>
          <button
            type="submit"
            className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800"
          >
            যাচাইয়ের জন্য জমা দিন
          </button>
        </div>
      </div>

      <div className="mt-6 border border-stone-200 p-5 flex flex-wrap items-center gap-3">
        <span className="text-xs text-stone-400 mr-1">ভেরিফিকেশন স্ট্যাটাস:</span>
        <StatusChip label="Pending" tone="neutral" />
        <StatusChip label="Processing" tone="warning" active />
        <StatusChip label="Approved" tone="success" />
        <StatusChip label="Rejected" tone="danger" />
      </div>
    </>
  );
}

function DoneScreen() {
  return (
    <div className="border border-stone-200 p-10 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-emerald-900 flex items-center justify-center">
        <CheckCircle2 className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-xl text-stone-900">আপনার তথ্য যাচাইয়ের জন্য জমা দেওয়া হয়েছে</h2>
      <p className="text-sm text-stone-500 max-w-sm">
        NID ভেরিফিকেশন সম্পন্ন হওয়ার পর আপনি অ্যাকাউন্টে লগইন করে প্রকল্প পোস্ট করতে পারবেন।
      </p>
    </div>
  );
}

export default function FarmerSignupFlow() {
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);
  const api = useApi();

  const accountMethods = useForm<FarmerAccountFormValues>({
    resolver: zodResolver(farmerAccountSchema),
    mode: "onBlur",
    defaultValues: { name: "", email: "", phone: "", otp: ["", "", "", "", "", ""], password: "" }
  });

  const nidMethods = useForm<FarmerNidFormValues>({
    resolver: zodResolver(farmerNidSchema),
    mode: "onSubmit",
    defaultValues: { nidNumber: "", nidName: "", dob: "", farmAddress: "", nidFront: null, nidBack: null }
  });

  const phone = accountMethods.watch("phone");

  const goNext = () => setStep(2);
  const goBack = () => setStep(1);

 // FarmerSignupFlow এর ভিতরে
const { signUp } = useSignUp();

const onSubmitAccount = async (data: FarmerAccountFormValues) => {
  const otpCode = data.otp?.join("") || "";
  const { error } = await signUp.verifications.verifyEmailCode({ code: otpCode });
  if (error) {
    console.error(error);
    return;
  }

  if (signUp.status === "complete") {
    await signUp.finalize({
      navigate: async () => {
        try {
          const response = await api.post("/auth/select-role", { role: "farmer", phone: data.phone });
          if (response.data.success) {
            goNext();
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            console.log("Axios Error", error.message);
            if (error.response) console.log(error.response.status);
          }
        }
      },
    });
  }
};

  const onSubmitNid = async (data: FarmerNidFormValues) => {
    console.log("NID Data:", data);
    setSubmitted(true);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h1 className="text-3xl text-stone-900">কৃষক হিসেবে যোগ দিন</h1>
        <p className="mt-2 text-stone-500 text-sm max-w-lg">
          প্রথমে অ্যাকাউন্ট তৈরি করুন, তারপর NID যাচাই সম্পন্ন করুন।
        </p>

        <div className="mt-12 grid md:grid-cols-[220px_1fr] gap-12">
          <StepSidebar step={submitted ? 3 : step} phone={phone} />

          <div>
            {submitted ? (
              <DoneScreen />
            ) : (
              <>
                {step === 1 && (
                  <FormProvider {...accountMethods}>
                    <form onSubmit={accountMethods.handleSubmit(onSubmitAccount)} noValidate>
                      <AccountStep />
                    </form>
                  </FormProvider>
                )}

                {step === 2 && (
                  <FormProvider {...nidMethods}>
                    <form onSubmit={nidMethods.handleSubmit(onSubmitNid)} noValidate>
                      <NidStep onBack={goBack} />
                    </form>
                  </FormProvider>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}