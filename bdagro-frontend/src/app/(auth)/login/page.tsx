"use client";

import { FormEvent, useState } from "react";
import { Sprout, Loader2 } from "lucide-react";
import { useSignIn } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";

function LoginPage() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");

  const isSubmitting = fetchStatus === "fetching";

  const finalizeSignIn = async () => {
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");

    const { error } = await signIn.password({
      emailAddress: emailAddress.trim(),
      password,
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
  };

  return (
    <div
      className="bg-white min-h-screen flex items-center justify-center px-6"
    >

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

      

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="text-sm text-neutral-700">ইমেইল</label>
            <div className="mt-1.5 flex items-center border border-neutral-300 focus-within:border-primary-700">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={emailAddress}
                onChange={(event) => setEmailAddress(event.target.value)}
                placeholder="আপনার ইমেইল লিখুন"
                className="flex-1 px-3 py-2.5 text-sm outline-none placeholder:text-neutral-300"
                required
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-neutral-700">পাসওয়ার্ড</label>
            <div className="mt-1.5 flex items-center border border-neutral-300 focus-within:border-primary-700">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="পাসওয়ার্ড লিখুন"
                className="flex-1 px-3 py-2.5 text-sm outline-none placeholder:text-neutral-300"
                required
              />
            </div>
          </div>

          {(formError || errors.fields.identifier || errors.fields.password) && (
            <p className="text-sm text-red-700" role="alert">
              {formError || errors.fields.identifier?.message || errors.fields.password?.message}
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
