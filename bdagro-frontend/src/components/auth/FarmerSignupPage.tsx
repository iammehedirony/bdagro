import { Camera, CheckCircle2, Clock, CreditCard, Lock, ShieldCheck } from "lucide-react";
import UploadBox from "@/components/form/UploadBox";
import StatusChip from "@/components/others/StatusChip";

function FarmerSignupPage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h1 className="text-3xl text-stone-900">
          কৃষক হিসেবে যোগ দিন
        </h1>
        <p className="mt-2 text-stone-500 text-sm max-w-lg">
          অ্যাকাউন্ট খুলে NID যাচাই সম্পন্ন করুন, তারপর আপনার প্রথম খামার
          প্রকল্প পোস্ট করুন।
        </p>

        <div className="mt-12 grid md:grid-cols-[220px_1fr] gap-12">
          {/* STEPPER SIDEBAR */}
          <div className="relative">
            <div className="absolute left-[15px] top-4 bottom-4 w-px bg-stone-200" />
            <div className="space-y-10 relative">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-emerald-900 flex items-center justify-center shrink-0 z-10">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm text-stone-900">অ্যাকাউন্ট তৈরি</div>
                  <div className="text-xs text-stone-400 mt-0.5">সম্পন্ন</div>
                  <div className="text-xs text-stone-400 mt-1">
                    +৮৮০ ১৭XX-XXXXXX
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shrink-0 z-10">
                  <CreditCard className="w-4 h-4 text-emerald-950" />
                </div>
                <div>
                  <div className="text-sm text-stone-900">
                    NID ভেরিফিকেশন
                  </div>
                  <div className="text-xs text-amber-700 mt-0.5">
                    এই ধাপে আছেন
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0 z-10">
                  <Lock className="w-3.5 h-3.5 text-stone-400" />
                </div>
                <div>
                  <div className="text-sm text-stone-400">
                    প্রকল্পের বিবরণ
                  </div>
                  <div className="text-xs text-stone-300 mt-0.5">লকড</div>
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div>
            {/* NID VERIFICATION CARD */}
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
                  বিনিয়োগকারীদের আস্থা নিশ্চিত করতে প্রতিটি কৃষকের পরিচয়
                  যাচাই করা হয়। তথ্য শুধু ভেরিফিকেশনের জন্য ব্যবহৃত হবে।
                </p>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-stone-700">
                      NID নম্বর
                    </label>
                    <input
                      type="text"
                      placeholder="১০ / ১৭ ডিজিট"
                      className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm placeholder:text-stone-300 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-stone-700">
                      পূর্ণ নাম (NID অনুযায়ী)
                    </label>
                    <input
                      type="text"
                      placeholder="নাম লিখুন"
                      className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm placeholder:text-stone-300 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-sm text-stone-700">জন্ম তারিখ</label>
                    <input
                      type="text"
                      placeholder="dd/mm/yyyy"
                      className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm placeholder:text-stone-300 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-stone-700">
                      খামারের ঠিকানা
                    </label>
                    <input
                      type="text"
                      placeholder="জেলা, উপজেলা"
                      className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm placeholder:text-stone-300 focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <div className="text-sm text-stone-700 mb-2">
                    NID কার্ডের ছবি
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <UploadBox label="সামনের অংশ" hint="JPG, PNG · সর্বোচ্চ ৫MB" />
                    <UploadBox label="পেছনের অংশ" hint="JPG, PNG · সর্বোচ্চ ৫MB" />
                  </div>
                </div>

                <div>
                  <div className="text-sm text-stone-700 mb-2">
                    সেলফি ভেরিফিকেশন
                  </div>
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
                    যাচাইয়ে সাধারণত ২৪ ঘণ্টার মধ্যে সময় লাগে। অনুমোদনের পর
                    পরবর্তী ধাপ আনলক হবে।
                  </span>
                </div>
              </div>

              <div className="p-8 pt-0 flex items-center justify-between">
                <button className="text-sm text-stone-500 hover:text-stone-800">
                  পূর্ববর্তী ধাপ
                </button>
                <button className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800">
                  যাচাইয়ের জন্য জমা দিন
                </button>
              </div>
            </div>

            {/* STATUS LEGEND */}
            <div className="mt-6 border border-stone-200 p-5 flex flex-wrap items-center gap-3">
              <span className="text-xs text-stone-400 mr-1">
                ভেরিফিকেশন স্ট্যাটাস:
              </span>
              <StatusChip label="Pending" tone="stone" />
              <StatusChip label="Processing" tone="amber" active />
              <StatusChip label="Approved" tone="emerald" />
              <StatusChip label="Rejected" tone="orange" />
            </div>

            {/* LOCKED STEP PREVIEW */}
            <div className="mt-6 border border-stone-200 bg-stone-50 p-8 opacity-60">
              <div className="flex items-center gap-2 text-stone-400">
                <Lock className="w-4 h-4" />
                <span className="text-xs">ধাপ ৩ / ৩ · NID অনুমোদনের পর আনলক হবে</span>
              </div>
              <h2 className="mt-2 text-xl text-stone-500">
                প্রকল্পের বিবরণ
              </h2>
              <div className="mt-5 grid sm:grid-cols-2 gap-5">
                {[
                  "প্রকল্পের শিরোনাম",
                  "ফসল / প্রকল্পের ধরন",
                  "লক্ষ্যমাত্রা (৳)",
                  "মেয়াদ (মাস)",
                  "প্রকল্পের বিবরণ",
                  "খামারের ছবি",
                ].map((f) => (
                  <div key={f}>
                    <label className="text-sm text-stone-400">{f}</label>
                    <div className="mt-1.5 w-full border border-stone-200 bg-white h-10" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FarmerSignupPage;