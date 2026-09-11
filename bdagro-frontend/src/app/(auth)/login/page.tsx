import React from "react";
import { Sprout, Phone, KeyRound } from "lucide-react";
import Link from "next/link";


function LoginPage() {
  return (
    <div
      className="bg-white min-h-screen flex items-center justify-center px-6"
    >

      <div className="w-full max-w-sm py-16">
        <div className="flex items-center justify-center gap-2 mb-10">
          <Sprout className="w-5 h-5 text-emerald-800" />
          <span className="text-stone-900 text-lg">
            Bdagroonline
          </span>
        </div>

        <h1 className="text-2xl text-stone-900 text-center">
          লগইন করুন
        </h1>
        <p className="mt-2 text-stone-500 text-sm text-center">
          আপনার অ্যাকাউন্টে প্রবেশ করে চালিয়ে যান
        </p>

        {/* LOGIN METHOD TOGGLE */}
        <div className="mt-8 flex border border-stone-300">
          <button className="flex-1 py-2.5 text-sm bg-emerald-900 text-white flex items-center justify-center gap-2">
            <Phone className="w-3.5 h-3.5" />
            ফোন / OTP
          </button>
          <button className="flex-1 py-2.5 text-sm text-stone-500 flex items-center justify-center gap-2 hover:bg-stone-50">
            <KeyRound className="w-3.5 h-3.5" />
            ইমেইল / পাসওয়ার্ড
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-stone-700">ফোন নম্বর</label>
            <div className="mt-1.5 flex items-center border border-stone-300 focus-within:border-emerald-700">
              <input
                type="text"
                placeholder="+৮৮০ ১XXX-XXXXXX"
                className="flex-1 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300"
              />
              <button className="px-4 py-2.5 text-xs text-emerald-800 border-l border-stone-300 hover:bg-stone-50 whitespace-nowrap">
                OTP পাঠান
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-stone-700">OTP কোড</label>
            <div className="mt-1.5 grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-full aspect-square text-center border border-stone-300 text-stone-800 outline-none focus:border-emerald-700"
                />
              ))}
            </div>
            <div className="mt-2 text-xs text-stone-400">
              কোড আসেনি?{" "}
              <span className="text-emerald-900">আবার পাঠান</span>
            </div>
          </div>

          <button className="w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800">
            লগইন করুন
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-stone-200 text-center text-sm text-stone-400 space-y-2">
          <div>
            নতুন এসেছেন?{" "}
            <Link href="/register/farmer" className="text-emerald-900">কৃষক হিসেবে যোগ দিন</Link>
            {" · "}
            <Link href="/register/investor" className="text-emerald-900">বিনিয়োগকারী হিসেবে যোগ দিন</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;