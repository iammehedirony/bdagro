"use client"

import React, { useState } from "react";
import {
  Sprout,
  Phone,
  CreditCard,
  Lock,
  ShieldCheck,
  User,
  Camera,
  CheckCircle2,
  Clock,
  Sprout as CropIcon,
  Wallet,
  CalendarDays,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import UploadBox from "../ui/UploadBox";
import StatusChip from "../ui/StatusChip";




/* step definitions used for the sidebar */
const STEPS = [
  { id: 1, label: "অ্যাকাউন্ট তৈরি", icon: Phone },
  { id: 2, label: "NID ভেরিফিকেশন", icon: CreditCard },
  { id: 3, label: "প্রকল্পের বিবরণ", icon: FileText },
];

function StepSidebar({ step, phone }) {
  return (
    <div className="relative">
      <div className="absolute left-[15px] top-4 bottom-4 w-px bg-stone-200" />
      <div className="space-y-10 relative">
        {STEPS.map((s) => {
          const Icon = s.icon;
          const isDone = step > s.id;
          const isCurrent = step === s.id;
          const isLocked = step < s.id;

          return (
            <div className="flex gap-4" key={s.id}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                  isDone
                    ? "bg-emerald-900"
                    : isCurrent
                    ? "bg-amber-500"
                    : "bg-stone-100 border border-stone-300"
                }`}
              >
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-white" />
                ) : isLocked ? (
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                ) : (
                  <Icon className="w-4 h-4 text-emerald-950" />
                )}
              </div>
              <div>
                <div
                  className={`text-sm ${
                    isLocked ? "text-stone-400" : "text-stone-900"
                  }`}
                >
                  {s.label}
                </div>
                <div
                  className={`text-xs mt-0.5 ${
                    isDone
                      ? "text-stone-400"
                      : isCurrent
                      ? "text-amber-700"
                      : "text-stone-300"
                  }`}
                >
                  {isDone ? "সম্পন্ন" : isCurrent ? "এই ধাপে আছেন" : "লকড"}
                </div>
                {isDone && s.id === 1 && phone && (
                  <div className="text-xs text-stone-400 mt-1">{phone}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* locked preview of whichever step comes right after the active one */
function LockedPreview({ nextStep }) {
  if (!nextStep) return null;

  const fieldsByStep = {
    2: ["NID নম্বর", "পূর্ণ নাম (NID অনুযায়ী)", "NID এর ছবি", "সেলফি ভেরিফিকেশন"],
    3: [
      "প্রকল্পের শিরোনাম",
      "ফসল / প্রকল্পের ধরন",
      "লক্ষ্যমাত্রা (৳)",
      "মেয়াদ (মাস)",
      "প্রকল্পের বিবরণ",
      "খামারের ছবি",
    ],
  };

  const titleByStep = {
    2: "NID ভেরিফিকেশন",
    3: "প্রকল্পের বিবরণ",
  };

  return (
    <div className="mt-6 border border-stone-200 bg-stone-50 p-8 opacity-60">
      <div className="flex items-center gap-2 text-stone-400">
        <Lock className="w-4 h-4" />
        <span className="text-xs">
          ধাপ {nextStep} / ৩ ·{" "}
          {nextStep === 2
            ? "অ্যাকাউন্ট যাচাইয়ের পর আনলক হবে"
            : "NID অনুমোদনের পর আনলক হবে"}
        </span>
      </div>
      <h2 className="mt-2 text-xl text-stone-500">
        {titleByStep[nextStep]}
      </h2>
      <div className="mt-5 grid sm:grid-cols-2 gap-5">
        {fieldsByStep[nextStep].map((f) => (
          <div key={f}>
            <label className="text-sm text-stone-400">{f}</label>
            <div className="mt-1.5 w-full border border-stone-200 bg-white h-10 flex items-center px-3">
              <CreditCard className="w-3.5 h-3.5 text-stone-300" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- step 1: account creation ---------- */

function AccountStep({ data, setData, onNext }) {
  return (
    <>
      <div className="border border-stone-200">
        <div className="p-8 border-b border-stone-200">
          <div className="flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">ধাপ ১ / ৩</span>
          </div>
          <h2 className="mt-2 text-xl text-stone-900">
            অ্যাকাউন্ট তৈরি করুন
          </h2>
          <p className="mt-2 text-sm text-stone-500 leading-relaxed max-w-md">
            আপনার নাম ও ফোন নম্বর দিয়ে অ্যাকাউন্ট খুলুন। ফোন নম্বর OTP দিয়ে
            যাচাই করা হবে।
          </p>
        </div>

        <div className="p-8 space-y-5">
          <div>
            <label className="text-sm text-stone-700">পূর্ণ নাম</label>
            <div className="mt-1.5 flex items-center border border-stone-300 focus-within:border-emerald-700">
              <span className="px-3 text-stone-400">
                <User className="w-4 h-4" />
              </span>
              <input
                type="text"
                value={data.name}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                placeholder="আপনার নাম লিখুন"
                className="flex-1 py-2.5 pr-3 text-sm outline-none placeholder:text-stone-300"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-stone-700">ফোন নম্বর</label>
            <div className="mt-1.5 flex items-center border border-stone-300 focus-within:border-emerald-700">
              <input
                type="text"
                value={data.phone}
                onChange={(e) => setData({ ...data, phone: e.target.value })}
                placeholder="+৮৮০ ১XXX-XXXXXX"
                className="flex-1 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300"
              />
              <button
                type="button"
                className="px-4 py-2.5 text-xs text-emerald-800 border-l border-stone-300 hover:bg-stone-50 whitespace-nowrap"
              >
                OTP পাঠান
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-stone-700">OTP কোড</label>
            <div className="mt-1.5 grid grid-cols-6 gap-2 max-w-xs">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  className="w-full aspect-square text-center border border-stone-300 text-stone-800 outline-none focus:border-emerald-700"
                />
              ))}
            </div>
            <div className="mt-2 text-xs text-stone-400">
              ফোনে পাঠানো ৬-ডিজিট কোডটি লিখুন ·{" "}
              <span className="text-emerald-900">আবার পাঠান</span>
            </div>
          </div>

          <div>
            <label className="text-sm text-stone-700">পাসওয়ার্ড</label>
            <input
              type="password"
              placeholder="কমপক্ষে ৮ ক্যারেক্টার"
              className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700"
            />
          </div>

          <label className="flex items-start gap-2 text-xs text-stone-500">
            <input type="checkbox" className="accent-emerald-800 mt-0.5" defaultChecked />
            <span>
              আমি Bdagroonline-এর ব্যবহারের শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত
            </span>
          </label>
        </div>

        <div className="p-8 pt-0 flex items-center justify-end">
          <button
            onClick={onNext}
            className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800"
          >
            পরবর্তী ধাপ: NID ভেরিফিকেশন
          </button>
        </div>
      </div>

      <LockedPreview nextStep={2} />
    </>
  );
}

/* ---------- step 2: NID verification ---------- */

function NidStep({ data, setData, onBack, onNext }) {
  return (
    <>
      <div className="border border-stone-200">
        <div className="p-8 border-b border-stone-200">
          <div className="flex items-center gap-2 text-emerald-800">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">ধাপ ২ / ৩</span>
          </div>
          <h2 className="mt-2 text-xl text-stone-900">
            জাতীয় পরিচয়পত্র (NID) ভেরিফিকেশন
          </h2>
          <p className="mt-2 text-sm text-stone-500 leading-relaxed max-w-md">
            বিনিয়োগকারীদের আস্থা নিশ্চিত করতে প্রতিটি কৃষকের পরিচয় যাচাই করা
            হয়। তথ্য শুধু ভেরিফিকেশনের জন্য ব্যবহৃত হবে।
          </p>
        </div>

        <div className="p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-stone-700">NID নম্বর</label>
              <input
                type="text"
                value={data.nidNumber}
                onChange={(e) =>
                  setData({ ...data, nidNumber: e.target.value })
                }
                placeholder="১০ / ১৭ ডিজিট"
                className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm placeholder:text-stone-300 outline-none focus:border-emerald-700"
              />
            </div>
            <div>
              <label className="text-sm text-stone-700">
                পূর্ণ নাম (NID অনুযায়ী)
              </label>
              <input
                type="text"
                value={data.nidName}
                onChange={(e) => setData({ ...data, nidName: e.target.value })}
                placeholder="নাম লিখুন"
                className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm placeholder:text-stone-300 outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm text-stone-700">জন্ম তারিখ</label>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm placeholder:text-stone-300 outline-none focus:border-emerald-700"
              />
            </div>
            <div>
              <label className="text-sm text-stone-700">খামারের ঠিকানা</label>
              <input
                type="text"
                placeholder="জেলা, উপজেলা"
                className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm placeholder:text-stone-300 outline-none focus:border-emerald-700"
              />
            </div>
          </div>

          <div>
            <div className="text-sm text-stone-700 mb-2">NID কার্ডের ছবি</div>
            <div className="grid sm:grid-cols-2 gap-4">
              <UploadBox label="সামনের অংশ" hint="JPG, PNG · সর্বোচ্চ ৫MB" />
              <UploadBox label="পেছনের অংশ" hint="JPG, PNG · সর্বোচ্চ ৫MB" />
            </div>
          </div>

          <div>
            <div className="text-sm text-stone-700 mb-2">সেলফি ভেরিফিকেশন</div>
            <div className="border border-dashed border-stone-300 p-6 flex items-center gap-4 hover:border-emerald-700 transition-colors cursor-pointer">
              <Camera className="w-5 h-5 text-stone-400 shrink-0" />
              <div>
                <div className="text-sm text-stone-700">
                  NID হাতে ধরে একটি সেলফি তুলুন
                </div>
                <div className="text-xs text-stone-400 mt-0.5">
                  মুখ ও NID এর তথ্য স্পষ্ট দেখা যেতে হবে
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2 text-xs text-stone-400 pt-1">
            <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <span>
              যাচাইয়ে সাধারণত ২৪ ঘণ্টার মধ্যে সময় লাগে। অনুমোদনের পর পরবর্তী
              ধাপ আনলক হবে।
            </span>
          </div>
        </div>

        <div className="p-8 pt-0 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-sm text-stone-500 hover:text-stone-800"
          >
            পূর্ববর্তী ধাপ
          </button>
          <button
            onClick={onNext}
            className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800"
          >
            যাচাইয়ের জন্য জমা দিন
          </button>
        </div>
      </div>

      <div className="mt-6 border border-stone-200 p-5 flex flex-wrap items-center gap-3">
        <span className="text-xs text-stone-400 mr-1">ভেরিফিকেশন স্ট্যাটাস:</span>
        <StatusChip label="Pending" tone="neutral" />
        <StatusChip label="Processing" tone="warning" active />
        <StatusChip label="Approved" tone="success" />
        <StatusChip label="Rejected" tone="danger" />
      </div>

      <LockedPreview nextStep={3} />
    </>
  );
}

/* ---------- step 3: project details ---------- */

function ProjectStep({ data, setData, onBack, onSubmit }) {
  return (
    <div className="border border-stone-200">
      <div className="p-8 border-b border-stone-200">
        <div className="flex items-center gap-2 text-emerald-800">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-xs">ধাপ ৩ / ৩</span>
        </div>
        <h2 className="mt-2 text-xl text-stone-900">
          প্রকল্পের বিবরণ দিন
        </h2>
        <p className="mt-2 text-sm text-stone-500 leading-relaxed max-w-md">
          আপনার প্রথম খামার প্রকল্প পোস্ট করুন যাতে বিনিয়োগকারীরা এটি দেখতে
          পারেন।
        </p>
      </div>

      <div className="p-8 space-y-5">
        <div>
          <label className="text-sm text-stone-700">প্রকল্পের শিরোনাম</label>
          <div className="mt-1.5 flex items-center border border-stone-300 focus-within:border-emerald-700">
            <span className="px-3 text-stone-400">
              <FileText className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={data.title}
              onChange={(e) => setData({ ...data, title: e.target.value })}
              placeholder="যেমন: বোরো ধান চাষ প্রকল্প, ২০২৬"
              className="flex-1 py-2.5 pr-3 text-sm outline-none placeholder:text-stone-300"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="text-sm text-stone-700">
              ফসল / প্রকল্পের ধরন
            </label>
            <div className="mt-1.5 flex items-center border border-stone-300 focus-within:border-emerald-700">
              <span className="px-3 text-stone-400">
                <CropIcon className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="যেমন: ধান, মাছ চাষ, সবজি"
                className="flex-1 py-2.5 pr-3 text-sm outline-none placeholder:text-stone-300"
              />
            </div>
          </div>
          <div>
            <label className="text-sm text-stone-700">লক্ষ্যমাত্রা (৳)</label>
            <div className="mt-1.5 flex items-center border border-stone-300 focus-within:border-emerald-700">
              <span className="px-3 text-stone-400">
                <Wallet className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="যেমন: ৫০,০০০"
                className="flex-1 py-2.5 pr-3 text-sm outline-none placeholder:text-stone-300"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="text-sm text-stone-700">মেয়াদ (মাস)</label>
          <div className="mt-1.5 flex items-center border border-stone-300 focus-within:border-emerald-700 max-w-[200px]">
            <span className="px-3 text-stone-400">
              <CalendarDays className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="যেমন: ৪"
              className="flex-1 py-2.5 pr-3 text-sm outline-none placeholder:text-stone-300"
            />
          </div>
        </div>

        <div>
          <label className="text-sm text-stone-700">প্রকল্পের বিবরণ</label>
          <textarea
            rows={4}
            placeholder="প্রকল্পটি সম্পর্কে বিস্তারিত লিখুন — জমির পরিমাণ, প্রত্যাশিত ফলন, খরচের খাত ইত্যাদি"
            className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700 resize-none"
          />
        </div>

        <div>
          <div className="text-sm text-stone-700 mb-2">খামারের ছবি</div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="border border-dashed border-stone-300 p-4 flex flex-col items-center justify-center text-center gap-1.5 hover:border-emerald-700 transition-colors cursor-pointer min-h-[92px]">
              <ImageIcon className="w-4 h-4 text-stone-400" />
              <div className="text-xs text-stone-600">ছবি যোগ করুন</div>
              <div className="text-[11px] text-stone-400">JPG, PNG · সর্বোচ্চ ৫MB</div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 pt-0 flex items-center justify-between">
        <button
          onClick={onBack}
          className="text-sm text-stone-500 hover:text-stone-800"
        >
          পূর্ববর্তী ধাপ
        </button>
        <button
          onClick={onSubmit}
          className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800"
        >
          প্রকল্প পোস্ট করুন
        </button>
      </div>
    </div>
  );
}

/* ---------- success screen ---------- */

function DoneScreen() {
  return (
    <div className="border border-stone-200 p-10 flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-emerald-900 flex items-center justify-center">
        <CheckCircle2 className="w-6 h-6 text-white" />
      </div>
      <h2 className="text-xl text-stone-900">
        প্রকল্প জমা দেওয়া হয়েছে
      </h2>
      <p className="text-sm text-stone-500 max-w-sm">
        আপনার প্রকল্পটি পর্যালোচনার জন্য পাঠানো হয়েছে। অনুমোদনের পর এটি
        বিনিয়োগকারীদের কাছে দৃশ্যমান হবে।
      </p>
    </div>
  );
}

/* ---------- top-level flow ---------- */

export default function FarmerSignupFlow() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [account, setAccount] = useState({ name: "", phone: "" });
  const [nid, setNid] = useState({ nidNumber: "", nidName: "" });
  const [project, setProject] = useState({ title: "" });

  return (
    <div className="bg-white min-h-screen">

      <div className="max-w-5xl mx-auto px-6 py-14">
        <h1 className="text-3xl text-stone-900">
          কৃষক হিসেবে যোগ দিন
        </h1>
        <p className="mt-2 text-stone-500 text-sm max-w-lg">
          প্রথমে অ্যাকাউন্ট তৈরি করুন, তারপর NID যাচাই ও প্রকল্প পোস্ট করার
          ধাপে যাবেন।
        </p>

        <div className="mt-12 grid md:grid-cols-[220px_1fr] gap-12">
          <StepSidebar step={submitted ? 4 : step} phone={account.phone} />

          <div>
            {submitted ? (
              <DoneScreen />
            ) : step === 1 ? (
              <AccountStep
                data={account}
                setData={setAccount}
                onNext={() => setStep(2)}
              />
            ) : step === 2 ? (
              <NidStep
                data={nid}
                setData={setNid}
                onBack={() => setStep(1)}
                onNext={() => setStep(3)}
              />
            ) : (
              <ProjectStep
                data={project}
                setData={setProject}
                onBack={() => setStep(2)}
                onSubmit={() => setSubmitted(true)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}