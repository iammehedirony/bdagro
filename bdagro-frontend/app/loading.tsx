import React from "react";
import { Sprout } from "lucide-react";


export default function LoadingPage() {
  const plots = [1, 0, 1, 1, 0, 1, 1, 1, 0, 1];

  return (
    <div
      className="bg-emerald-950 min-h-screen flex flex-col items-center justify-center px-6"
    >

      {/* SPINNER + LOGO */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-emerald-800 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-amber-500 rounded-full animate-spin" />
        <Sprout className="w-7 h-7 text-amber-400" />
      </div>

      <div className="mt-8 text-stone-50 text-lg">
        Bdagroonline
      </div>
      <div className="mt-2 text-emerald-100/60 text-sm">লোড হচ্ছে...</div>

      {/* PULSING PLOT GRID */}
      <div className="mt-10 grid grid-cols-5 gap-1.5 w-36">
        {plots.map((filled, i) => (
          <div
            key={i}
            className={`aspect-square animate-pulse ${
              filled ? "bg-amber-500/70" : "border border-emerald-100/20"
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
