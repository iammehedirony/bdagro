"use client";

import { useState } from "react";
import {
  Droplets,
  Leaf,
  PawPrint,
  Sprout,
  Tractor,
  Wheat,
  type LucideIcon,
} from "lucide-react";
import { LoanCard, type LoanCardProps } from "@/components/loan/LoanCard";
import { useLoanProductsQuery } from "@/hooks/queries/useLoanQueries";
import type { LoanProduct } from "@/lib/services/loan.service";

const categoryConfig: Record<string, { label: string; icon: LucideIcon; tone: LoanCardProps["loan"]["tone"] }> = {
  seed_purchase: { label: "বীজ ঋণ", icon: Wheat, tone: "emerald" },
  tractor_purchase: { label: "ট্রাক্টর ও যন্ত্রপাতি", icon: Tractor, tone: "amber" },
  livestock_farming: { label: "গবাদিপশু পালন", icon: PawPrint, tone: "orange" },
  irrigation: { label: "সেচ", icon: Droplets, tone: "emerald" },
  other: { label: "অন্যান্য", icon: Leaf, tone: "amber" },
};

const fallbackCategory = { label: "অন্যান্য", icon: Sprout, tone: "orange" as const };

function getCategoryConfig(category: string) {
  return categoryConfig[category] ?? fallbackCategory;
}

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
}

function toLoanCard(product: LoanProduct): LoanCardProps["loan"] {
  const category = getCategoryConfig(product.category);

  return {
    name: product.name,
    category: category.label,
    icon: category.icon,
    tone: category.tone,
    share: `${product.profitSharePercent}%`,
    max: formatCurrency(product.maxAmount),
    tenure: `${product.maxDurationMonths} মাস`,
    note: product.description ?? "কৃষি প্রকল্পের জন্য উপযুক্ত ফান্ডিং প্রোডাক্ট।",
  };
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "ফান্ডিং প্রোডাক্ট লোড করা যায়নি। আবার চেষ্টা করুন।";
}

export default function LoanExplorerPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { data: products = [], isLoading, error, refetch } = useLoanProductsQuery();
  const categories = Array.from(new Set(products.map((product) => product.category)));
  const filteredProducts = selectedCategory === "all"
    ? products
    : products.filter((product) => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl text-stone-900">ফান্ডিং প্রোডাক্ট এক্সপ্লোরার</h1>
        <p className="mt-2 max-w-lg text-sm text-stone-500">
          বীজ, যন্ত্রপাতি, গবাদিপশু বা সেচ — প্রয়োজন অনুযায়ী উপযুক্ত ফান্ডিং
          প্রোডাক্ট খুঁজে নিন এবং শর্তাবলী দেখুন।
        </p>


        <div className="mt-8 flex gap-3 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`flex items-center gap-2 whitespace-nowrap border px-4 py-2.5 text-sm ${selectedCategory === "all" ? "border-emerald-900 bg-emerald-900 text-white" : "border-stone-300 text-stone-600 hover:border-emerald-700"}`}
          >
            <Sprout className="h-4 w-4" /> সব ক্যাটাগরি
          </button>
          {categories.map((category) => {
            const config = getCategoryConfig(category);
            const Icon = config.icon;
            return (
              <button
                type="button"
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 whitespace-nowrap border px-4 py-2.5 text-sm ${selectedCategory === category ? "border-emerald-900 bg-emerald-900 text-white" : "border-stone-300 text-stone-600 hover:border-emerald-700"}`}
              >
                <Icon className="h-4 w-4" /> {config.label}
              </button>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm text-stone-400">
            {isLoading ? "প্রোডাক্ট লোড হচ্ছে..." : `${filteredProducts.length}টি ফান্ডিং প্রোডাক্ট পাওয়া গেছে`}
          </span>
        </div>

        {error && (
          <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            <p>{getErrorMessage(error)}</p>
            <button type="button" onClick={() => refetch()} className="mt-2 underline">আবার চেষ্টা করুন</button>
          </div>
        )}

        {isLoading && !error && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => <div key={item} className="h-64 animate-pulse border border-stone-200 bg-stone-50" />)}
          </div>
        )}

        {!isLoading && !error && filteredProducts.length > 0 && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => <LoanCard key={product._id} loan={toLoanCard(product)} />)}
          </div>
        )}

        {!isLoading && !error && filteredProducts.length === 0 && (
          <div className="mt-6 border border-stone-200 bg-stone-50 p-8 text-center text-sm text-stone-500">এই ক্যাটাগরিতে কোনো ফান্ডিং প্রোডাক্ট পাওয়া যায়নি।</div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border border-stone-200 bg-stone-50 p-6">
          <div>
            <div className="text-stone-900">কোন ফান্ডিং প্রোডাক্টটি আপনার জন্য উপযুক্ত বুঝতে পারছেন না?</div>
            <div className="mt-1 text-sm text-stone-500">আপনার খামারের ধরন ও প্রয়োজন অনুযায়ী পরামর্শ নিন।</div>
          </div>
          <button type="button" className="whitespace-nowrap bg-amber-500 px-5 py-2.5 text-sm text-emerald-950 hover:bg-amber-400">পরামর্শ নিন</button>
        </div>
      </div>
    </div>
  );
}
