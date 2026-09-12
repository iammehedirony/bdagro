import React from "react";
import {
  Sprout,
  HandCoins,
  ShieldCheck,
  Users,
  Target,
  Heart,
} from "lucide-react";


const values = [
  {
    icon: HandCoins,
    title: "সুদ নয়, ভাগাভাগি",
    body: "আমরা বিশ্বাস করি কৃষকের ঝুঁকি আর বিনিয়োগকারীর ঝুঁকি একসাথে বহন করা উচিত। তাই ফিক্সড সুদের বদলে লাভ-ভিত্তিক বণ্টন মডেলে কাজ করি।",
  },
  {
    icon: ShieldCheck,
    title: "স্বচ্ছতা সবার আগে",
    body: "প্রতিটি কৃষকের পরিচয় যাচাই করা হয়, প্রতিটি প্রকল্পের অগ্রগতি রিয়েল-টাইমে দেখা যায়। কোনো লুকোচুরি নেই।",
  },
  {
    icon: Users,
    title: "দুই পক্ষই মূল",
    body: "কৃষক শুধু ঋণগ্রহীতা নন, আর বিনিয়োগকারী শুধু পুঁজিদাতা নন — দুজনেই একই ফসলের অংশীদার।",
  },
];

const team = [
  { name: "MD Mehedi Hasan", role: "প্রতিষ্ঠাতা ও প্রোডাক্ট" },
  { name: "সহ-প্রতিষ্ঠাতা", role: "কৃষি ও ফিল্ড অপারেশনস" },
  { name: "সহ-প্রতিষ্ঠাতা", role: "প্রযুক্তি ও প্ল্যাটফর্ম" },
];

export default function AboutPage() {
  return (
    <div className="bg-white">

    

      {/* HERO */}
      <section className="bg-emerald-950">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-5xl leading-[1.15] text-stone-50">
            মাটির সাথে পুঁজির সেতুবন্ধন
          </h1>
          <p className="mt-6 text-emerald-100/80 text-base leading-relaxed max-w-xl mx-auto">
            Bdagroonline শুরু হয়েছিল একটা সহজ প্রশ্ন থেকে — একজন কৃষকের
            ভালো ফসলের পরিকল্পনা থাকলেও যদি পুঁজির অভাবে সেটা বাস্তবায়ন করতে
            না পারেন, আর একজন মানুষের বিনিয়োগ করার ইচ্ছা থাকলেও যদি সরাসরি
            মাটির সাথে যুক্ত হওয়ার সুযোগ না থাকে — তাহলে দুই পক্ষকে
            নিরাপদে এক জায়গায় আনা যায় কীভাবে?
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-[auto_1fr] gap-6 items-start">
          <Target className="w-7 h-7 text-emerald-800 shrink-0" />
          <div>
            <h2 className="text-2xl text-stone-900">
              আমাদের লক্ষ্য
            </h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              বাংলাদেশের যাচাইকৃত কৃষকদের সরাসরি বিনিয়োগকারীদের সাথে যুক্ত
              করা, যাতে কৃষক ন্যায্য শর্তে মূলধন পান আর বিনিয়োগকারী সরাসরি
              কৃষি অর্থনীতিতে অংশ নিতে পারেন — কোনো মধ্যস্বত্বভোগী বা
              সুদভিত্তিক জটিলতা ছাড়াই।
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-stone-50 border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="text-2xl md:text-3xl text-stone-900 mb-12 text-center">
            আমরা যেভাবে কাজ করি
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="border border-stone-200 bg-white p-6">
                <v.icon className="w-6 h-6 text-emerald-800" />
                <h3 className="mt-4 text-stone-900">
                  {v.title}
                </h3>
                <p className="mt-2 text-sm text-stone-500 leading-relaxed">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            ["৫০০+", "যাচাইকৃত কৃষক"],
            ["১,২০০+", "সক্রিয় বিনিয়োগকারী"],
            ["৳২.৮ কোটি+", "মোট বিনিয়োগ"],
            ["৬৪টি", "জেলায় উপস্থিতি"],
          ].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-2xl text-stone-900">
                {num}
              </div>
              <div className="text-sm text-stone-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section className="border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-6 py-20">
          <div className="flex items-center gap-2 mb-12">
            <Heart className="w-5 h-5 text-emerald-800" />
            <h2 className="text-2xl md:text-3xl text-stone-900">
              যারা তৈরি করছেন
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {team.map((m) => (
              <div key={m.role} className="border border-stone-200 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-900 mx-auto flex items-center justify-center text-white text-lg">
                  {m.name[0]}
                </div>
                <div className="mt-4 text-stone-900">
                  {m.name}
                </div>
                <div className="text-sm text-stone-400 mt-1">{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-emerald-950">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-2xl md:text-3xl text-stone-50">
            আপনিও এই যাত্রার অংশ হতে পারেন
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button className="bg-amber-500 text-emerald-950 px-6 py-3 text-sm font-medium hover:bg-amber-400">
              কৃষক হিসেবে শুরু করুন
            </button>
            <button className="border border-emerald-100/30 text-emerald-50 px-6 py-3 text-sm hover:border-emerald-100/70">
              বিনিয়োগকারী হিসেবে যোগ দিন
            </button>
          </div>
        </div>
      </section>

    
    </div>
  );
}