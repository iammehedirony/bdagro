"use client";

import { useEffect, useState } from "react";
import { Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Controller, useForm, type FieldError as RHFFieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Field from "@/components/ui/Field";
import { FieldError } from "@/components/ui/FieldError";
import OtpInput from "@/components/ui/OtpInput";
import UploadBox from "@/components/ui/UploadBox";
import { adminSignupSchema, type AdminSignupFormValues } from "@/lib/schemas/auth";
import { useSendSignupOtpMutation, useSignupMutation } from "@/hooks/mutations/useAuthMutations";

export default function AdminSignupPage() {
  const router = useRouter();
  const signupMutation = useSignupMutation();
  const sendOtpMutation = useSendSignupOtpMutation();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    trigger,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<AdminSignupFormValues>({
    resolver: zodResolver(adminSignupSchema),
    mode: "onSubmit",
    defaultValues: {
      name: "",
      email: "",
      otp: ["", "", "", "", "", ""],
      password: "",
      avatar: null,
    },
  });

  const handleAvatarChange = (file: File | null) => {
    setAvatarFile(file);
    setValue("avatar", file, { shouldValidate: false });
  };

  useEffect(() => {
    if (countdown === null || countdown <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setCountdown((previous) => (previous !== null && previous > 1 ? previous - 1 : null));
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleSendOTP = async () => {
    const isValid = await trigger(["name", "email", "password"]);
    if (!isValid) return;

    try {
      await sendOtpMutation.mutateAsync(getValues());
      setCountdown(5);
    } catch {
      // The mutation error is rendered below.
    }
  };

  const onSubmit = async (data: AdminSignupFormValues) => {
    try {
      await signupMutation.mutateAsync({ 
        otp: data.otp.join(""), 
        role: "admin",
        avatar: data.avatar ?? null 
      });
      router.push("/admin");
    } catch {
      // The mutation error is rendered below.
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md py-16">
        <div className="flex items-center justify-center gap-2 mb-10">
          <ShieldCheck className="w-5 h-5 text-emerald-800" />
          <span className="text-stone-900 text-lg">Bdagroonline</span>
        </div>

        <h1 className="text-2xl text-stone-900 text-center">অ্যাডমিন হিসেবে যোগ দিন</h1>
        <p className="mt-2 text-stone-500 text-sm text-center">
          অ্যাডমিন অ্যাকাউন্ট তৈরি করে প্ল্যাটফর্ম পরিচালনা শুরু করুন।
        </p>

        {(sendOtpMutation.error || signupMutation.error) && (
          <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded" role="alert">
            {sendOtpMutation.error?.message || signupMutation.error?.message}
          </div>
        )}

        <form className="mt-8 space-y-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Field
              label="পূর্ণ নাম"
              placeholder="আপনার নাম লিখুন"
              readOnly={signupMutation.isPending || sendOtpMutation.isPending}
              {...register("name")}
            />
            <FieldError error={errors.name} />
          </div>

          <div>
            <Field
              label="ইমেইল"
              type="email"
              placeholder="আপনার ইমেইল লিখুন"
              readOnly={signupMutation.isPending || sendOtpMutation.isPending}
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
              {...register("email")}
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
            <div className="mt-2 text-xs text-stone-400">ইমেইলে পাঠানো ৬-ডিজিট কোডটি লিখুন</div>
          </div>

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

          <button
            type="submit"
            disabled={signupMutation.isPending || sendOtpMutation.isPending}
            className="w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800 disabled:opacity-70"
          >
            {signupMutation.isPending ? <Loader2 className="mx-auto w-4 h-4 animate-spin" /> : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>
      </div>
    </div>
  );
}
