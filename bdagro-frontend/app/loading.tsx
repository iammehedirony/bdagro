import React from "react";
import { Sprout } from "lucide-react";

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
`;

const serif = { fontFamily: "'Fraunces', serif" };
const sans = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

export default function LoadingPage() {
  const plots = [1, 0, 1, 1, 0, 1, 1, 1, 0, 1];

  return (
    <div
      className="bg-white min-h-screen w-full flex flex-col items-center justify-center px-6"
      style={sans}
    >
      <style>{fontImport}</style>

      {/* SPINNER + LOGO */}
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 border-2 border-emerald-100 rounded-full" />
        <div className="absolute inset-0 border-2 border-transparent border-t-emerald-800 rounded-full animate-spin" />
        <Sprout className="w-7 h-7 text-emerald-800" />
      </div>

      <div className="mt-8 text-stone-900 text-lg" style={serif}>
        Bdagroonline
      </div>
      <div className="mt-2 text-stone-400 text-sm">লোড হচ্ছে...</div>

      {/* PULSING PLOT GRID */}
      <div className="mt-10 grid grid-cols-5 gap-1.5 w-36">
        {plots.map((filled, i) => (
          <div
            key={i}
            className={`aspect-square animate-pulse ${
              filled ? "bg-emerald-800" : "border border-stone-200"
            }`}
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}