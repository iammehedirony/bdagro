"use client";

import { useEffect, useRef, useState } from "react";
import ProjectCard from "@/components/project/ProjectCard";
import { Sprout, ShieldCheck, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, animate } from "motion/react";
import { useFeaturedProjectsQuery } from "@/hooks/queries/useFeaturedProjects";
import { formatBnNumber } from "@/lib/utils/format";

// বাংলা সংখ্যায় রূপান্তর করার ফাংশন
const enToBn = (enNum: string | number) => {
  const bn = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return enNum.toString().replace(/\d/g, (d) => bn[parseInt(d)]);
};

// কাস্টম কাউন্টার অ্যানিমেশন কম্পোনেন্ট (বাংলা সাপোর্ট সহ)
const AnimatedStat = ({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  format = false,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  format?: boolean;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState(enToBn((0).toFixed(decimals)));

  useEffect(() => {
    if (isInView) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: "easeOut",
        onUpdate(v) {
          let strVal = v.toFixed(decimals);
          if (format) {
            strVal = Number(strVal).toLocaleString("en-US");
          }
          setDisplay(enToBn(strVal));
        },
      });
      return () => controls.stop();
    }
  }, [isInView, value, decimals, format]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

const riskMap: Record<string, "কম" | "মাঝারি" | "বেশি"> = {
  low: "কম",
  medium: "মাঝারি",
  high: "বেশি",
};

const toneMap: Record<string, "emerald" | "amber" | "orange"> = {
  low: "emerald",
  medium: "amber",
  high: "orange",
};

function FeaturedProjects() {
  const { data: projects, isLoading, isError, error } = useFeaturedProjectsQuery();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" role="status" aria-live="polite">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="border border-neutral-200 bg-white animate-pulse"
          >
            <div className="h-32 bg-neutral-200" />
            <div className="p-5 space-y-3">
              <div className="h-5 bg-neutral-200 rounded w-3/4" />
              <div className="h-4 bg-neutral-200 rounded w-1/2" />
              <div className="h-4 bg-neutral-200 rounded w-full" />
              <div className="h-4 bg-neutral-200 rounded w-full" />
              <div className="h-8 bg-neutral-200 rounded mt-4" />
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <AlertCircle className="w-10 h-10 mx-auto text-neutral-300 mb-3" />
        <p className="text-sm">প্রকল্প লোড করতে সমস্যা হয়েছে</p>
        <p className="text-xs text-neutral-400 mt-1">{error instanceof Error ? error.message : "Unknown error"}</p>
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="text-center py-12 text-neutral-500">
        <Sprout className="w-10 h-10 mx-auto text-neutral-300 mb-3" />
        <p className="text-sm">এই মুহূর্তে কোনো নির্বাচিত প্রকল্প নেই</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((proj, i) => (
        <motion.div
          key={proj._id}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: i * 0.2 }}
        >
          <ProjectCard
            id={proj._id}
            title={proj.title}
            location={proj.location}
            goal={formatBnNumber(proj.fundingGoal)}
            raised={formatBnNumber(proj.fundedAmount)}
            percent={proj.progressPercent}
            risk={riskMap[proj.riskLevel] ?? "মাঝারি"}
            roi={`${proj.expectedROIPercent}%`}
            tone={toneMap[proj.riskLevel] ?? "amber"}
            image={proj.farmImage}
          />
        </motion.div>
      ))}
    </div>
  );
}

function HomePage() {
 const heroImages = [
    {
      id: 1,
      src: "/hero-1.jpg",
      span: "col-span-2 row-span-2",
      delay: 0,
    },
    {
      id: 2,
      src: "/hero-2.jpg",
      span: "col-span-1 row-span-1",
      delay: 0.2,
    },
    {
      id: 3,
       src: "/hero-3.jpg",
      span: "col-span-1 row-span-1",
      delay: 0.4,
    },
    {
      id: 4,
      src: "/hero-4.jpg",
      span: "col-span-3 row-span-1",
      delay: 0.1,
    },
  ];

  const statsData = [
    { value: 500, suffix: "+", label: "যাচাইকৃত কৃষক" },
    { value: 1200, suffix: "+", label: "সক্রিয় বিনিয়োগকারী", format: true },
    { value: 2.8, prefix: "৳", suffix: " কোটি+", label: "মোট বিনিয়োগ", decimals: 1 },
    { value: 17.5, suffix: "%", label: "গড় প্রত্যাশিত ROI", decimals: 1 },
  ];

  return (
    <div className="bg-white w-full max-w-full overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="bg-primary-950 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20 grid grid-cols-1 md:grid-cols-2 gap-10 sm:gap-14 items-center">
<motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl leading-[1.15] text-neutral-50 break-words">
              কৃষক পান পুঁজি, বিনিয়োগকারী পান ফসলের ভাগ
            </h1>
            <p className="mt-4 sm:mt-6 text-primary-100/80 text-sm sm:text-base leading-relaxed max-w-full sm:max-w-md">
              Bdagroonline যাচাইকৃত কৃষকদের খামার প্রকল্পের সাথে
              বিনিয়োগকারীদের সরাসরি যুক্ত করে। NID ভেরিফিকেশন, রিয়েল-টাইম
              প্রজেক্ট স্ট্যাটাস আর নিরাপদ পেমেন্টের মাধ্যমে — মাটি থেকে মুনাফা,
              সবটাই স্বচ্ছ।
            </p>
            <div className="mt-6 sm:mt-8 flex flex-wrap gap-3">
              <Link
                href="/register/farmer"
                className="bg-accent-500 text-primary-950 px-5 sm:px-6 py-2.5 sm:py-3 text-sm font-medium hover:bg-accent-400 transition-colors"
              >
                কৃষক হিসেবে শুরু করুন
              </Link>
              <Link
                href="/register/investor"
                className="border border-primary-100/30 text-primary-50 px-5 sm:px-6 py-2.5 sm:py-3 text-sm hover:border-primary-100/70 transition-colors"
              >
                বিনিয়োগকারী হিসেবে যোগ দিন
              </Link>
            </div>
            <div className="mt-6 sm:mt-8 flex items-center gap-2 text-primary-100/60 text-xs sm:text-sm flex-wrap">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>SSLCommerz ও Stripe দ্বারা সুরক্ষিত পেমেন্ট</span>
            </div>
          </motion.div>

        {/* Animated Bento Box Image Grid */}
          {/* Animated Bento Box Image Grid */}
          <div className="relative mt-10 md:mt-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[120px] sm:auto-rows-[140px] md:auto-rows-[150px]">
              {heroImages.map((img) => (
                <motion.div
                  key={img.id}
                  className={`relative rounded-xl overflow-hidden ${img.span}`}
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: img.delay }}
                >
                  <motion.div
                    className="w-full h-full relative"
                    animate={{ y: [0, -8, 0] }}
                    transition={{
                      repeat: Infinity,
                      duration: 4 + img.delay,
                      ease: "easeInOut",
                      delay: img.delay,
                    }}
                  >
                    <Image
                      src={img.src}
                      alt="Farm Image"
                      fill
                      className="object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
            <motion.div 
              className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-primary-100/70 text-xs sm:text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <span>১২৪টি সক্রিয় খামার প্রকল্প</span>
              <span>৳২.৮ কোটি বিনিয়োগকৃত</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS SECTION (Animated Counter) */}
      <section className="border-b border-neutral-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {statsData.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="text-xl sm:text-2xl text-neutral-900 font-semibold">
                <AnimatedStat
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  decimals={stat.decimals}
                  format={stat.format}
                />
              </div>
              <div className="text-xs sm:text-sm text-neutral-500 mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl text-neutral-900 mb-8 sm:mb-12 text-center"
        >
          কীভাবে কাজ করে
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border border-neutral-200 rounded-lg overflow-hidden">
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
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`p-4 sm:p-6 border-b border-r border-neutral-200 last:border-b-0 lg:last:border-r-0 ${i >= 2 ? "md:border-t-0" : ""} ${i % 2 === 1 ? "lg:border-r-0" : ""}`}
            >
              <div className="text-2xl sm:text-3xl text-accent-600 font-bold">{step.n}</div>
              <h3 className="mt-2 sm:mt-3 text-neutral-900 font-medium text-sm sm:text-base">{step.title}</h3>
              <p className="mt-2 text-xs sm:text-sm text-neutral-500 leading-relaxed break-words">
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* PROJECTS SECTION */}
      <section id="projects" className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl text-neutral-900 mb-12"
          >
            চলমান খামার প্রকল্প
          </motion.h2>
          <FeaturedProjects />
        </div>
      </section>

      {/* ROLES SECTION */}
      <section id="roles" className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl text-neutral-900 mb-8 sm:mb-12 text-center"
        >
          কৃষক ও বিনিয়োগকারী উভয়ের জন্য
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="border border-neutral-200 p-6 sm:p-8"
          >
            <Sprout className="w-6 h-6 text-primary-800" />
            <h3 className="mt-4 text-lg sm:text-xl text-neutral-900">কৃষক</h3>
            <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-sm text-neutral-600">
              {[
                "NID ও ছবি দিয়ে সহজ ভেরিফিকেশন",
                "লক্ষ্যমাত্রা, বিবরণ ও ছবিসহ প্রকল্প পোস্ট করুন",
                "রিয়েল-টাইম স্ট্যাটাস — Pending, Processing, Approved",
                "নিরাপদে টাকা উত্তোলন করুন",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-primary-700 shrink-0" />
                  <span className="break-words">{t}</span>
                </li>
              ))}
            </ul>
            <button className="mt-5 sm:mt-6 w-full sm:w-auto bg-primary-900 text-white px-5 py-2.5 text-sm hover:bg-primary-800">
              কৃষক হিসেবে শুরু করুন
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border border-neutral-200 p-6 sm:p-8"
          >
            <TrendingUp className="w-6 h-6 text-accent-600" />
            <h3 className="mt-4 text-lg sm:text-xl text-neutral-900">বিনিয়োগকারী</h3>
            <ul className="mt-4 sm:mt-5 space-y-2 sm:space-y-3 text-sm text-neutral-600">
              {[
                "ঝুঁকির মাত্রা ও প্রত্যাশিত ROI দেখে প্রকল্প বাছাই করুন",
                "আংশিক অথবা পূর্ণ বিনিয়োগের সুযোগ",
                "লাইভ ড্যাশবোর্ডে রিটার্ন ট্র্যাক করুন",
                "প্রতিটি আপডেটে ইনস্ট্যান্ট নোটিফিকেশন পান",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5 text-accent-600 shrink-0" />
                  <span className="break-words">{t}</span>
                </li>
              ))}
            </ul>
            <button className="mt-5 sm:mt-6 w-full sm:w-auto border border-neutral-300 text-neutral-800 px-5 py-2.5 text-sm hover:border-primary-800 hover:text-primary-900 transition-colors">
              বিনিয়োগকারী হিসেবে যোগ দিন
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;