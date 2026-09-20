"use client";

import React, { useEffect, useState } from "react";
import { useForm, Controller, type FieldError as RHFFieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Bell,
  Wallet,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import Field from "../ui/Field";
import OtpInput from "../ui/OtpInput";
import CropChip from "../ui/CropChip";
import RiskOption from "../ui/RiskOption";
import { FieldError } from "../ui/FieldError";
import UploadBox from "../ui/UploadBox";
import { investorSignupSchema, type InvestorSignupFormValues } from "../../lib/schemas/auth";
import { useRouter } from "next/navigation";
import { useSendSignupOtpMutation, useSignupMutation } from "@/hooks/mutations/useAuthMutations";

export default function InvestorSignupPage() {
  const { user } = useUser();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const signupMutation = useSignupMutation();
  const sendOtpMutation = useSendSignupOtpMutation();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InvestorSignupFormValues>({
    resolver: zodResolver(investorSignupSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      otp: ["", "", "", "", "", ""],
      password: "",
      interests: ["ধান", "ফল বাগান"],
      riskTolerance: "কম",
      monthlyPlan: "৳৫,০০০ – ২৫,০০০",
      terms: true,
      avatar: null,
    },
  });

  const selectedInterests = watch("interests");
  const selectedRisk = watch("riskTolerance");

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    setValue("avatar", file, { shouldValidate: false });
  };

  useEffect(() => {
    if (countdown === null || countdown <= 0) {
      if (countdown === 0) setCountdown(null);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((previous) => (previous !== null && previous > 0 ? previous - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOTP = async () => {
    const isValid = await trigger(["name", "email", "password", "terms", "phone"]);
    if (!isValid) return;

    const data = getValues();

    try {
      await sendOtpMutation.mutateAsync(data);
      setCountdown(5);
    } catch {
      // The mutation error is rendered below.
      console.log(sendOtpMutation.error);
    }
  };

  const onSubmit = async (data: InvestorSignupFormValues) => {
    try {
      await signupMutation.mutateAsync({
        otp: data.otp.join(""),
        role: "investor",
        phone: data.phone,
        avatar: data.avatar ?? null,
        profile: {
          preferredCropTypes: data.interests,
          maxRiskLevel: data.riskTolerance,
          monthlyInvestmentPlan: data.monthlyPlan,
        },
      });
      await user?.reload();
      router.push("/investor/dashboard");
    } catch {
      // The mutation error is rendered below.
        console.log(signupMutation.error);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="grid lg:grid-cols-[1fr_420px] min-h-screen">
        {/* LEFT: FORM */}
        <div className="px-6 sm:px-12 py-10 max-w-xl w-full mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <Sprout className="w-5 h-5 text-emerald-800" />
            <span className="text-stone-900 text-lg">Bdagroonline</span>
          </div>

          <h1 className="text-3xl text-stone-900">বিনিয়োগকারী হিসেবে যোগ দিন</h1>
          <p className="mt-2 text-stone-500 text-sm">
            অ্যাকাউন্ট খুলুন এবং যাচাইকৃত খামার প্রকল্পে বিনিয়োগ শুরু করুন।
          </p>

          {(sendOtpMutation.error || signupMutation.error) && (
            <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {sendOtpMutation.error?.message || signupMutation.error?.message}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Field label="পূর্ণ নাম" placeholder="আপনার নাম লিখুন" readOnly={signupMutation.isPending || sendOtpMutation.isPending} {...register("name")} />
                <FieldError error={errors.name} />
              </div>
              <div>
                <Field label="ফোন নম্বর" placeholder="+880 1XXXXXXXX" readOnly={signupMutation.isPending || sendOtpMutation.isPending} {...register("phone")} />
                <FieldError error={errors.phone} />
              </div>
            </div>

            {/* ফোন নম্বর (Custom Field with Suffix Button) */}
            <div>
              <Field
                label="ইমেইল"
                placeholder="আপনার ইমেইল লিখুন"
                readOnly={signupMutation.isPending || sendOtpMutation.isPending}
                {...register("email")}
                suffix={
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={signupMutation.isPending || sendOtpMutation.isPending || countdown !== null}
                    className="px-4 py-2.5 text-xs text-emerald-800 border-l border-stone-300 hover:bg-stone-50 whitespace-nowrap disabled:opacity-50"
                  >
                    {sendOtpMutation.isPending ? "লোড হচ্ছে..." : countdown !== null ? `OTP পাঠানো হয়েছে (${countdown}s)` : "OTP পাঠান"}
                  </button>
                }
              />
              <FieldError error={errors.email} />
            </div>

            {/* প্রোফাইল ছবি (ঐচ্ছিক) */}
            <div>
              <label className="text-sm text-stone-700 block mb-1.5">প্রোফাইল ছবি (ঐচ্ছিক)</label>
              <UploadBox
                label="প্রোফাইল ছবি আপলোড করুন"
                hint="JPG, PNG, WEBP · সর্বোচ্চ ৫MB"
                file={avatarFile}
                onChange={handleAvatarChange}
                accept="image/*"
              />
            </div>

            {/* OTP কোড (Custom OtpInput Component with Controller) */}
            <div>
              <label className="text-sm text-neutral-700 block mb-1.5">OTP কোড</label>
              <Controller
                name="otp"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <OtpInput value={value} onChange={onChange} disabled={signupMutation.isPending || sendOtpMutation.isPending} />
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
                ইমেইলে পাঠানো ৬-ডিজিট কোডটি লিখুন ·{" "}
                <span className="text-emerald-900 cursor-pointer">আবার পাঠান</span>
              </div>
            </div>

            {/* পাসওয়ার্ড */}
            <div>
              <Field
                label="পাসওয়ার্ড"
                type="password"
                placeholder="কমপক্ষে ৮ ক্যারেক্টার"
                readOnly={signupMutation.isPending || sendOtpMutation.isPending}
                {...register("password")}
              />
              <FieldError error={errors.password} />
            </div>

            {/* INVESTMENT INTEREST */}
            <div>
              <label className="text-sm text-stone-700">বিনিয়োগে আগ্রহের ক্ষেত্র</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["ধান", "ফল বাগান", "সবজি", "মৎস্য", "প্রাণিসম্পদ"].map((crop) => {
                  const isSelected = selectedInterests.includes(crop);
                  return (
                    <div
                      key={crop}
                      onClick={() => {
                        const updated = isSelected
                          ? selectedInterests.filter((item) => item !== crop)
                          : [...selectedInterests, crop];
                        setValue("interests", updated, { shouldValidate: true });
                      }}
                      className="cursor-pointer"
                    >
                      <CropChip label={crop} selected={isSelected} />
                    </div>
                  );
                })}
              </div>
              <FieldError error={errors.interests as RHFFieldError | undefined} />
            </div>

            {/* RISK TOLERANCE */}
            <div>
              <label className="text-sm text-stone-700">ঝুঁকি সহনশীলতা</label>
              <div className="mt-2 grid sm:grid-cols-3 gap-3">
                {[
                  { label: "কম", desc: "স্থিতিশীল, কম ROI" },
                  { label: "মাঝারি", desc: "সুষম ঝুঁকি ও রিটার্ন" },
                  { label: "বেশি", desc: "উচ্চ ROI, বেশি ঝুঁকি" },
                ].map((risk) => (
                  <div
                    key={risk.label}
                    onClick={() => setValue("riskTolerance", risk.label, { shouldValidate: true })}
                    className="cursor-pointer"
                  >
                    <RiskOption label={risk.label} desc={risk.desc} value={risk.label} checked={selectedRisk === risk.label} />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm text-stone-700">মাসিক বিনিয়োগ পরিকল্পনা</label>
              <select
                {...register("monthlyPlan")}
                className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-emerald-700"
              >
                <option value="৳৫,০০০ – ২৫,০০০">৳৫,০০০ – ২৫,০০০</option>
                <option value="৳২৫,০০০ – ১,০০,০০০">৳২৫,০০০ – ১,০০,০০০</option>
                <option value="৳১,০০,০০০ – ৫,০০,০০০">৳১,০০,০০০ – ৫,০০,০০০</option>
                <option value="৳৫,০০,০০০ এর বেশি">৳৫,০০,০০০ এর বেশি</option>
              </select>
            </div>

            <div>
              <label className="flex items-start gap-2 text-xs text-stone-500">
                <input type="checkbox" className="accent-emerald-800 mt-0.5" {...register("terms")} />
                <span>আমি Bdagroonline-এর ব্যবহারের শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত</span>
              </label>
              <FieldError error={errors.terms as RHFFieldError | undefined} />
            </div>

            <button
              type="submit"
              disabled={signupMutation.isPending || sendOtpMutation.isPending}
              className="w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800 disabled:opacity-70"
            >
              {signupMutation.isPending ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
            </button>

            <div className="text-center text-sm text-stone-400">
              আগে থেকে অ্যাকাউন্ট আছে? <span className="text-emerald-900 cursor-pointer">লগইন করুন</span>
            </div>
          </form>
        </div>

        {/* RIGHT: TRUST PANEL */}
        <div className="bg-emerald-950 px-10 py-14 flex flex-col justify-center">
          <h2 className="text-2xl text-stone-50 leading-snug">কেন Bdagroonline-এ বিনিয়োগ করবেন</h2>
          <div className="mt-8 space-y-6">
            {[
              { icon: ShieldCheck, title: "যাচাইকৃত কৃষক", body: "প্রতিটি কৃষকের NID ও প্রকল্প অ্যাডমিন কর্তৃক যাচাইকৃত।" },
              { icon: TrendingUp, title: "ঝুঁকি ও ROI স্বচ্ছতা", body: "প্রতিটি প্রকল্পে ঝুঁকির মাত্রা ও প্রত্যাশিত রিটার্ন আগে থেকেই দেখা যায়।" },
              { icon: Bell, title: "রিয়েল-টাইম আপডেট", body: "প্রকল্পের অগ্রগতি ও রিটার্নের প্রতিটি ধাপে নোটিফিকেশন পাবেন।" },
              { icon: Wallet, title: "নিরাপদ পেমেন্ট", body: "SSLCommerz ও Stripe এর মাধ্যমে বিনিয়োগ ও উত্তোলন সম্পন্ন হয়।" },
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <f.icon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-stone-100 text-sm">{f.title}</div>
                  <div className="text-emerald-100/60 text-xs mt-1 leading-relaxed">{f.body}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-emerald-900 flex items-center justify-between text-emerald-100/70 text-sm">
            <div>
              <div className="text-stone-50 text-lg">১,২০০+</div>
              <div className="text-xs mt-0.5">সক্রিয় বিনিয়োগকারী</div>
            </div>
            <div>
              <div className="text-stone-50 text-lg">১৭.৫%</div>
              <div className="text-xs mt-0.5">গড় ROI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
