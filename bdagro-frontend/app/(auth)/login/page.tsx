"use client";

import { Sprout, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchema } from "@/lib/schemas/auth";
import Field from "@/components/ui/Field";
import { FieldError } from "@/components/ui/FieldError";
import { useLoginMutation } from "@/hooks/mutations/useAuthMutations";


function LoginPage() {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await loginMutation.mutateAsync(data);
      router.push("/");
    } catch {
      // The mutation error is rendered below.
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm py-16">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Sprout className="w-5 h-5 text-primary-800" />
          <span className="text-neutral-900 text-lg">
            Bdagroonline
          </span>
        </div>

        <h1 className="text-2xl text-neutral-900 text-center">
          লগইন করুন
        </h1>
        <p className="mt-2 text-neutral-500 text-sm text-center">
          আপনার অ্যাকাউন্টে প্রবেশ করে চালিয়ে যান
        </p>

        {/* react-hook-form এর handleSubmit ব্যবহার করা হয়েছে */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <Field
              label="ইমেইল"
              type="email"
              placeholder="আপনার ইমেইল লিখুন"
              readOnly={loginMutation.isPending}
              {...register("email")}
            />
            <FieldError error={errors.email} />
          </div>

          <div>
            <Field
              label="পাসওয়ার্ড"
              type="password"
              placeholder="পাসওয়ার্ড লিখুন"
              readOnly={loginMutation.isPending}
              {...register("password")}
            />
            <FieldError error={errors.password} />
          </div>

          {loginMutation.error && (
            <p className="text-sm text-red-700" role="alert">
              {loginMutation.error.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full bg-primary-900 text-white py-3 text-sm hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loginMutation.isPending ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "লগইন করুন"}
          </button>
        </form>

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