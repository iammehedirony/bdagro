"use client";

import ProjectCard from "@/components/project/ProjectCard";
import { useUser } from "@clerk/nextjs";
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

 function HomePage() {
  const {user} = useUser();
  console.log(user,"home")
  const plots = [
    1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1,
  ];

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-primary-950">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <h1
              className="text-4xl md:text-5xl leading-[1.15] text-neutral-50"
            >
              কৃষক পান পুঁজি, বিনিয়োগকারী পান ফসলের ভাগ
            </h1>
            <p className="mt-6 text-primary-100/80 text-base leading-relaxed max-w-md">
              Bdagroonline যাচাইকৃত কৃষকদের খামার প্রকল্পের সাথে
              বিনিয়োগকারীদের সরাসরি যুক্ত করে। NID ভেরিফিকেশন, রিয়েল-টাইম
              প্রজেক্ট স্ট্যাটাস আর নিরাপদ পেমেন্টের মাধ্যমে — মাটি থেকে
              মুনাফা, সবটাই স্বচ্ছ।
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register/farmer" className="bg-accent-500 text-primary-950 px-6 py-3 text-sm font-medium hover:bg-accent-400">
                কৃষক হিসেবে শুরু করুন
              </Link>
              <Link href="/register/investor" className="border border-primary-100/30 text-primary-50 px-6 py-3 text-sm hover:border-primary-100/70">
                বিনিয়োগকারী হিসেবে যোগ দিন
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-2 text-primary-100/60 text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>SSLCommerz ও Stripe দ্বারা সুরক্ষিত পেমেন্ট</span>
            </div>
          </div>

          <div>
            <div className="grid grid-cols-5 gap-1.5">
              {plots.map((filled, i) => (
                <div
                  key={i}
                  className={`aspect-square ${
                    filled
                      ? "bg-accent-500"
                      : "border border-primary-100/25"
                  }`}
                />
              ))}
            </div>
            <div className="mt-5 flex items-center justify-between text-primary-100/70 text-sm">
              <span>১২৪টি সক্রিয় খামার প্রকল্প</span>
              <span>৳২.৮ কোটি বিনিয়োগকৃত</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["৫০০+", "যাচাইকৃত কৃষক"],
            ["১,২০০+", "সক্রিয় বিনিয়োগকারী"],
            ["৳২.৮ কোটি+", "মোট বিনিয়োগ"],
            ["১৭.৫%", "গড় প্রত্যাশিত ROI"],
          ].map(([num, label]) => (
            <div key={label}>
              <div className="text-2xl text-neutral-900">
                {num}
              </div>
              <div className="text-sm text-neutral-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl text-neutral-900 mb-12">
          কীভাবে কাজ করে
        </h2>
        <div className="grid md:grid-cols-4 gap-0 border-t border-neutral-200">
          {[
            {
              n: "১",
              title: "কৃষক প্রজেক্ট পোস্ট করেন",
              body: "NID ও প্রয়োজনীয় কাগজপত্র দিয়ে ভেরিফাই হয়ে খামারের বিবরণ, ছবি ও লক্ষ্যমাত্রা সহ প্রকল্প জমা দেন।",
            },
            {
              n: "২",
              title: "অ্যাডমিন যাচাই করেন",
              body: "প্ল্যাটফর্ম টিম কৃষকের তথ্য ও প্রকল্প যাচাই করে অনুমোদন বা প্রত্যাখ্যান করেন।",
            },
            {
              n: "৩",
              title: "বিনিয়োগকারী বিনিয়োগ করেন",
              body: "ঝুঁকির মাত্রা ও প্রত্যাশিত ROI দেখে আংশিক বা পূর্ণ বিনিয়োগ করা যায়।",
            },
            {
              n: "৪",
              title: "ফসল থেকে রিটার্ন",
              body: "ফসল বিক্রির পর মুনাফা বণ্টন হয়, প্রতিটি ধাপের আপডেট রিয়েল-টাইমে পৌঁছায়।",
            },
          ].map((step, i) => (
            <div
              key={step.n}
              className={`p-6 border-b border-r border-neutral-200 ${
                i === 3 ? "border-r-0 md:border-r-0" : ""
              }`}
            >
              <div className="text-3xl text-accent-600">
                {step.n}
              </div>
              <h3 className="mt-3 text-neutral-900 font-medium">{step.title}</h3>
              <p className="mt-2 text-sm text-neutral-500 leading-relaxed">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl md:text-3xl text-neutral-900 mb-12">
            চলমান খামার প্রকল্প
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ProjectCard
              title="সবুজ ধানখেত"
              location="কুমিল্লা"
              goal="৫,০০,০০০"
              raised="৩,৭৫,০০০"
              percent={75}
              risk="কম"
              roi="১৫%"
              tone="emerald"
            />
            <ProjectCard
              title="আম বাগান প্রকল্প"
              location="রাজশাহী"
              goal="৮,০০,০০০"
              raised="৪,০০,০০০"
              percent={50}
              risk="মাঝারি"
              roi="২০%"
              tone="amber"
            />
            <ProjectCard
              title="মাছ চাষ প্রকল্প"
              location="খুলনা"
              goal="৬,৫০,০০০"
              raised="৪,৮০,০০০"
              percent={74}
              risk="বেশি"
              roi="২২%"
              tone="orange"
            />
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section id="roles" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-2xl md:text-3xl text-neutral-900 mb-12">
          কৃষক ও বিনিয়োগকারী উভয়ের জন্য
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-neutral-200 p-8">
            <Sprout className="w-6 h-6 text-primary-800" />
            <h3 className="mt-4 text-xl text-neutral-900">
              কৃষক
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-neutral-600">
              {[
                "NID ও ছবি দিয়ে সহজ ভেরিফিকেশন",
                "লক্ষ্যমাত্রা, বিবরণ ও ছবিসহ প্রকল্প পোস্ট করুন",
                "রিয়েল-টাইম স্ট্যাটাস — Pending, Processing, Approved",
                "নিরাপদে টাকা উত্তোলন করুন",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary-700 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <button className="mt-6 bg-primary-900 text-white px-5 py-2.5 text-sm hover:bg-primary-800">
              কৃষক হিসেবে শুরু করুন
            </button>
          </div>

          <div className="border border-neutral-200 p-8">
            <TrendingUp className="w-6 h-6 text-accent-600" />
            <h3 className="mt-4 text-xl text-neutral-900">
              বিনিয়োগকারী
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-neutral-600">
              {[
                "ঝুঁকির মাত্রা ও প্রত্যাশিত ROI দেখে প্রকল্প বাছাই করুন",
                "আংশিক অথবা পূর্ণ বিনিয়োগের সুযোগ",
                "লাইভ ড্যাশবোর্ডে রিটার্ন ট্র্যাক করুন",
                "প্রতিটি আপডেটে ইনস্ট্যান্ট নোটিফিকেশন পান",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent-600 shrink-0" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <button className="mt-6 border border-neutral-300 text-neutral-800 px-5 py-2.5 text-sm hover:border-primary-800 hover:text-primary-900">
              বিনিয়োগকারী হিসেবে যোগ দিন
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
