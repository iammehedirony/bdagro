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
import { useAuth, useSignUp, useUser } from "@clerk/nextjs";
import axios from "axios";
import Field from "../ui/Field";
import OtpInput from "../ui/OtpInput";
import CropChip from "../ui/CropChip";
import RiskOption from "../ui/RiskOption";
import { FieldError } from "../ui/FieldError";
import { investorSignupSchema, type InvestorSignupFormValues } from "../../lib/schemas/auth";

export default function InvestorSignupPage() {
  const { signUp } = useSignUp();
  const { getToken } = useAuth();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [clerkError, setClerkError] = useState("");

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
    },
  });

  const selectedInterests = watch("interests");
  const selectedRisk = watch("riskTolerance");

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
    setClerkError("");
    setIsOtpSending(true);

    const isValid = await trigger(["name", "email", "password", "terms", "phone"]);
    if (!isValid) {
      setIsOtpSending(false);
      return;
    }

    const data = getValues();

    try {
      const { error } = await signUp.password({
        firstName: data.name,
        emailAddress: data.email,
        password: data.password,
      });

      if (error) {
        setClerkError(error.message || "OTP পাঠাতে সমস্যা হয়েছে। ইমেইলটি চেক করুন।");
        return;
      }

      const verificationResult = await signUp.verifications.sendEmailCode();
      if (verificationResult) setCountdown(5);
    } catch (error) {
      setClerkError(error instanceof Error ? error.message : "OTP পাঠাতে সমস্যা হয়েছে।");
    } finally {
      setIsOtpSending(false);
    }
  };

  const onSubmit = async (data: InvestorSignupFormValues) => {
    setLoading(true);
    setClerkError("");

    try {
      const otpCode = data.otp.join("");
      const verification = await signUp.verifications.verifyEmailCode({ code: otpCode });
      if (verification.error) {
        setClerkError(verification.error.message || "OTP যাচাই করা যায়নি।");
        return;
      }

      if (signUp.status !== "complete") {
        setClerkError("OTP যাচাইয়ের পরেও অ্যাকাউন্ট সম্পন্ন হয়নি।");
        return;
      }

      const finalizeResult = await signUp.finalize();
      if (finalizeResult.error) {
        setClerkError(finalizeResult.error.message || "অ্যাকাউন্ট সক্রিয় করা যায়নি।");
        return;
      }

      const token = await getToken({ skipCache: true });
      if (!token) {
        setClerkError("অ্যাকাউন্ট তৈরি হয়েছে, কিন্তু সক্রিয় সেশন পাওয়া যায়নি।");
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/auth/select-role",
        { role: "investor", phone: data.phone },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (response.status === 201) {
        await user?.reload();
        await getToken({ skipCache: true });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setClerkError(error.response?.data?.message || error.message || "অ্যাকাউন্ট তৈরি করা যায়নি।");
      } else {
        setClerkError(error instanceof Error ? error.message : "অ্যাকাউন্ট তৈরি করা যায়নি।");
      }
    } finally {
      setLoading(false);
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

          {clerkError && (
            <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded">
              {clerkError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5" noValidate>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Field label="পূর্ণ নাম" placeholder="আপনার নাম লিখুন" readOnly={loading || isOtpSending} {...register("name")} />
                <FieldError error={errors.name} />
              </div>
              <div>
                <Field label="ফোন নম্বর" placeholder="+880 1XXXXXXXX" readOnly={loading || isOtpSending} {...register("phone")} />
                <FieldError error={errors.phone} />
              </div>
            </div>

            {/* ফোন নম্বর (Custom Field with Suffix Button) */}
            <div>
              <Field
                label="ইমেইল"
                placeholder="আপনার ইমেইল লিখুন"
                readOnly={loading || isOtpSending}
                {...register("email")}
                suffix={
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading || isOtpSending || countdown !== null}
                    className="px-4 py-2.5 text-xs text-emerald-800 border-l border-stone-300 hover:bg-stone-50 whitespace-nowrap disabled:opacity-50"
                  >
                    {isOtpSending ? "লোড হচ্ছে..." : countdown !== null ? `OTP পাঠানো হয়েছে (${countdown}s)` : "OTP পাঠান"}
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
                  <OtpInput value={value} onChange={onChange} disabled={loading || isOtpSending} />
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
                readOnly={loading || isOtpSending}
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
                    <RiskOption label={risk.label} desc={risk.desc} selected={selectedRisk === risk.label} />
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
              disabled={loading || isOtpSending}
              className="w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800 disabled:opacity-70"
            >
              {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
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