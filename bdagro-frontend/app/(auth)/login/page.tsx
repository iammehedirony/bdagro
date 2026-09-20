"use client";

import { useState } from "react";
import { Sprout, Loader2, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSignIn } from "@clerk/nextjs";
import { useUser } from "@clerk/nextjs";
import Field from "@/components/ui/Field";
import OtpInput from "@/components/ui/OtpInput";
import { FieldError } from "@/components/ui/FieldError";
import { loginSchema, LoginSchema } from "@/lib/schemas/auth";
import { z } from "zod";

const loginWithOtpSchema = loginSchema.extend({
  otp: z.array(z.string()).length(6).optional(),
});

type LoginWithOtpSchema = z.infer<typeof loginWithOtpSchema>;

function LoginPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { signIn, fetchStatus, errors: signInErrors } = useSignIn();
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isTrustFlow, setIsTrustFlow] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm<LoginWithOtpSchema>({
    resolver: zodResolver(loginWithOtpSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
      otp: ["", "", "", "", "", ""],
    },
  });

  if (!isLoaded || fetchStatus === "fetching") {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-6">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary-800" />
      </div>
    );
  }

  const onSubmit = async (data: LoginSchema) => {
    setError(null);
    setIsPending(true);

    try {
      const result = await signIn.password({
        emailAddress: data.email.trim(),
        password: data.password,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      // কেস ১: নতুন/অচেনা ডিভাইস — Device Trust ফ্লো
      if (signIn.status === "needs_client_trust") {
        const emailCodeFactor = signIn.supportedSecondFactors?.find(
          (factor) => factor.strategy === "email_code"
        );

        if (!emailCodeFactor) {
          throw new Error("এই মুহূর্তে ডিভাইস যাচাই করা যাচ্ছে না। অনুগ্রহ করে সাপোর্টে যোগাযোগ করুন।");
        }

        const sendResult = await signIn.mfa.sendEmailCode();
        if (sendResult.error) {
          throw new Error(sendResult.error.message);
        }

        setIsTrustFlow(true);
        setIsVerifying(true);
        return;
      }

      // কেস ২: অ্যাকাউন্টে MFA চালু আছে — সাধারণ MFA ফ্লো
      if (signIn.status === "needs_first_factor" || signIn.status === "needs_second_factor") {
        const sendResult = await signIn.emailCode.sendCode();
        if (sendResult.error) {
          throw new Error(sendResult.error.message);
        }

        setIsTrustFlow(false);
        setIsVerifying(true);
        return;
      }

      if (signIn.status !== "complete") {
        throw new Error("লগইন সম্পন্ন করা যায়নি।");
      }

      await signIn.finalize();
      redirectBasedOnRole();
    } catch (err) {
      setError(err instanceof Error ? err.message : "লগইন ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsPending(false);
    }
  };

  const onVerifyOtp = async (otpCode: string) => {
    setError(null);
    setIsPending(true);

    try {
      // কোন ফ্লো ছিল তার উপর ভিত্তি করে সঠিক ভেরিফাই মেথড কল হবে
      const result = isTrustFlow
        ? await signIn.mfa.verifyEmailCode({ code: otpCode })
        : await signIn.emailCode.verifyCode({ code: otpCode });

      if (result.error) {
        throw new Error(result.error.message);
      }

      if (signIn.status !== "complete") {
        throw new Error("যাচাইকরণ সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }

      await signIn.finalize();
      redirectBasedOnRole();
    } catch (err) {
      setError(err instanceof Error ? err.message : "OTP যাচাইকরণ ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
    } finally {
      setIsPending(false);
    }
  };


  const redirectBasedOnRole = async () => {
    await user?.reload();
    const role = user?.publicMetadata?.role as string;
    
    switch (role) {
      case "farmer":
        router.push("/farmer/dashboard");
        break;
      case "investor":
        router.push("/investor/dashboard");
        break;
      case "admin":
        router.push("/admin/dashboard");
        break;
      default:
        router.push("/");
    }
  };

  const handleOtpChange = (otp: string[]) => {
    setValue("otp", otp, { shouldValidate: true });
  };

  const getSignInError = () => {
    if (error) return error;
    const globalErrors = signInErrors?.global;
    if (globalErrors && globalErrors.length > 0) return globalErrors[0].message;
    if (signInErrors?.fields?.identifier) return signInErrors.fields.identifier.message;
    if (signInErrors?.fields?.password) return signInErrors.fields.password.message;
    if (signInErrors?.fields?.code) return signInErrors.fields.code.message;
    return null;
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm py-16">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Sprout className="w-5 h-5 text-primary-800" />
          <span className="text-neutral-900 text-lg">Bdagroonline</span>
        </div>

        <h1 className="text-2xl text-neutral-900 text-center">
          {isVerifying ? "OTP যাচাই করুন" : "লগইন করুন"}
        </h1>
        <p className="mt-2 text-neutral-500 text-sm text-center">
          {isVerifying
            ? "আপনার ইমেইলে পাঠানো ৬-ডিজিট কোডটি লিখুন"
            : "আপনার অ্যাকাউন্টে প্রবেশ করে চালিয়ে যান"}
        </p>

        {getSignInError() && (
          <p className="mt-4 text-sm text-red-700" role="alert">
            {getSignInError()}
          </p>
        )}

        {!isVerifying ? (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <Field
                label="ইমেইল"
                type="email"
                placeholder="আপনার ইমেইল লিখুন"
                readOnly={isPending}
                {...register("email")}
              />
              <FieldError error={errors.email} />
            </div>

            <div>
              <Field
                label="পাসওয়ার্ড"
                type="password"
                placeholder="পাসওয়ার্ড লিখুন"
                readOnly={isPending}
                {...register("password")}
              />
              <FieldError error={errors.password} />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary-900 text-white py-3 text-sm hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "লগইন করুন"}
            </button>
          </form>
        ) : (
          <form
            className="mt-6 space-y-4"
            onSubmit={handleSubmit((data: LoginWithOtpSchema) => onVerifyOtp(data.otp?.join("") || ""))}
            noValidate
          >
            <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
              <Mail className="w-4 h-4" />
              <span>আপনার ইমেইলে পাঠানো ৬-ডিজিট কোডটি লিখুন</span>
            </div>

            <div>
              <label className="text-sm text-neutral-700 block mb-1.5">OTP কোড</label>
              <Controller
                name="otp"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <OtpInput
                    value={value}
                    onChange={(val) => {
                      onChange(val);
                      handleOtpChange(val);
                    }}
                    disabled={isPending}
                  />
                )}
              />
              <FieldError
                error={
                  errors.otp
                    ? { message: errors.otp.message || "অনুগ্রহ করে ৬-ডিজিটের সম্পূর্ণ OTP কোডটি লিখুন" }
                    : undefined
                }
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-primary-900 text-white py-3 text-sm hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isPending ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "যাচাই করুন"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-neutral-200 text-center text-sm text-neutral-400 space-y-2">
          <div>
            নতুন এসেছেন?{" "}
            <Link href="/register/farmer" className="text-primary-900">কৃষক হিসেবে যোগ দিন</Link>
            {" · "}
            <Link href="/register/investor" className="text-primary-900">বিনিয়োগকারী হিসেবে যোগ দিন</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;