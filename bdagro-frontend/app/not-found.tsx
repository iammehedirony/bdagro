import React from "react";
import { Sprout, Home, Search, ArrowLeft } from "lucide-react";


export default function NotFoundPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center text-center">
        {/* PLOT-GRID MOTIF, ONE MISSING */}
        <div className="grid grid-cols-5 gap-1.5 w-40">
          {[1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1].map((filled, i) => (
            <div
              key={i}
              className={`aspect-square ${
                i === 3
                  ? "border border-dashed border-orange-400"
                  : filled
                  ? "bg-emerald-900"
                  : "border border-stone-200"
              }`}
            />
          ))}
        </div>

        <div className="mt-10 text-sm text-stone-400">ভুল ঠিকানা · ৪০৪</div>
        <h1 className="mt-3 text-3xl md:text-4xl text-stone-900">
          এই পেজটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="mt-3 text-stone-500 text-sm max-w-md">
          যে পেজটি খুঁজছেন সেটি সরিয়ে ফেলা হয়েছে, নাম বদলেছে, অথবা লিংকটি
          ভুল হতে পারে।
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800 flex items-center gap-2">
            <Home className="w-4 h-4" />
            হোমে ফিরে যান
          </button>
          <button className="border border-stone-300 text-stone-700 px-6 py-3 text-sm hover:border-emerald-800 flex items-center gap-2">
            <Search className="w-4 h-4" />
            প্রকল্প খুঁজুন
          </button>
        </div>

        <button className="mt-6 text-sm text-stone-400 hover:text-stone-700 flex items-center gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          আগের পেজে ফিরে যান
        </button>
      </div>
    </div>
  );
}