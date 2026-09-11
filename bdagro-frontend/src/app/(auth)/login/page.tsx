import { Sprout, Phone, KeyRound } from "lucide-react";
import Link from "next/link";

function LoginPage() {
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

        {/* LOGIN METHOD TOGGLE */}
        <div className="mt-8 flex border border-neutral-300">
          <button className="flex-1 py-2.5 text-sm bg-primary-900 text-white flex items-center justify-center gap-2">
            <Phone className="w-3.5 h-3.5" />
            ফোন / OTP
          </button>
          <button className="flex-1 py-2.5 text-sm text-neutral-500 flex items-center justify-center gap-2 hover:bg-neutral-50">
            <KeyRound className="w-3.5 h-3.5" />
            ইমেইল / পাসওয়ার্ড
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="text-sm text-neutral-700">ফোন নম্বর</label>
            <div className="mt-1.5 flex items-center border border-neutral-300 focus-within:border-primary-700">
              <input
                type="text"
                placeholder="+৮৮০ ১XXX-XXXXXX"
                className="flex-1 px-3 py-2.5 text-sm outline-none placeholder:text-neutral-300"
              />
              <button className="px-4 py-2.5 text-xs text-primary-800 border-l border-neutral-300 hover:bg-neutral-50 whitespace-nowrap">
                OTP পাঠান
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-neutral-700">OTP কোড</label>
            <div className="mt-1.5 grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-full aspect-square text-center border border-neutral-300 text-neutral-800 outline-none focus:border-primary-700"
                />
              ))}
            </div>
            <div className="mt-2 text-xs text-neutral-400">
              কোড আসেনি?{" "}
              <span className="text-primary-900">আবার পাঠান</span>
            </div>
          </div>

          <button className="w-full bg-primary-900 text-white py-3 text-sm hover:bg-primary-800">
            লগইন করুন
          </button>
        </div>

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
