"use client";

import { useState } from "react";
import { Sprout, Loader2 } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { loginSchema, LoginSchema } from "@/lib/schemas/auth";
import Field from "@/components/ui/Field";
import { FieldError } from "@/components/ui/FieldError";
import axios from "axios";


function LoginPage() {
  // react-hook-form এর error এর সাথে conflict এড়াতে Clerk এর errors রিনেম করা হয়েছে
  const { signIn, errors: clerkErrors } = useSignIn(); 
  const router = useRouter();
  const [formError, setFormError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const finalizeSignIn = async () => {
    if (!signIn) return;
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          setFormError("আপনার অ্যাকাউন্টের অতিরিক্ত যাচাই প্রয়োজন।");
          return;
        }

        const url = decorateUrl("/");
        if (url.startsWith("http")) {
          window.location.href = url;
        } else {
          router.push(url);
        }
      },
    });
  };

  const onSubmit = async (data: LoginSchema) => {
    setFormError("");
    if (!signIn) return;

    try {
      const { error } = await signIn.password({
        emailAddress: data.email.trim(),
        password: data.password,
      });

      if (error) {
        setFormError(error.message || "ইমেইল অথবা পাসওয়ার্ড সঠিক নয়।");
        return;
      }

      if (signIn.status === "complete") {
        await finalizeSignIn();
        return;
      }

      setFormError("লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।");
    } catch (err) {
       if(axios.isAxiosError(err)) {
        setFormError(err.response?.data?.message || "লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।");
       } else {
        setFormError("লগইন সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।");
       }
       
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
              readOnly={isSubmitting}
              {...register("email")}
            />
            <FieldError error={errors.email} />
          </div>

          <div>
            <Field
              label="পাসওয়ার্ড"
              type="password"
              placeholder="পাসওয়ার্ড লিখুন"
              readOnly={isSubmitting}
              {...register("password")}
            />
            <FieldError error={errors.password} />
          </div>

          {(formError || clerkErrors?.fields?.identifier || clerkErrors?.fields?.password) && (
            <p className="text-sm text-red-700" role="alert">
              {formError || clerkErrors?.fields?.identifier?.message || clerkErrors?.fields?.password?.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-900 text-white py-3 text-sm hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : "লগইন করুন"}
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