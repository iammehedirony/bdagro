"use client";

import React from "react";

interface OtpInputProps {
  value?: string[];
  onChange: (val: string[]) => void;
  disabled?: boolean;
}

export default function OtpInput({ value = ["", "", "", "", "", ""], onChange, disabled = false }: OtpInputProps) {
  const handleChange = (text: string, index: number) => {
    const numericValue = text.replace(/[^0-9]/g, "");
    const updatedOtp = [...value];
    updatedOtp[index] = numericValue;
    onChange(updatedOtp);

    // নাম্বার টাইপ হলে পরের বক্সে অটো ফোকাস যাবে
    if (numericValue && index < 5) {
      document.getElementById(`otp-input-${index + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // ব্যাকস্পেস চাপলে আগের বক্সে ফিরে যাবে
    if (e.key === "Backspace" && !value[index] && index > 0) {
      document.getElementById(`otp-input-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="grid grid-cols-6 gap-2 max-w-xs">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          id={`otp-input-${i}`}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          disabled={disabled}
          className="w-full aspect-square text-center border border-stone-300 text-stone-800 outline-none focus:border-emerald-700 disabled:bg-stone-100"
          onChange={(e) => handleChange(e.target.value, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}