// components/AuthLoaderWrapper.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import LoadingPage from "@/app/loading"; // আপনার তৈরি করা কাস্টম লোডিং কম্পোনেন্ট

export default function AuthLoaderWrapper({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useUser();

  // Clerk পুরোপুরি লোড না হওয়া পর্যন্ত আপনার কাস্টম লোডারটি ফুল-স্ক্রিন ফিক্সড থাকবে
  if (!isLoaded) return <LoadingPage />;
  return <>{children}</>;
}