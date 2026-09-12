import React from "react";
import {
  Sprout,
  Wheat,
  ChevronRight,
  Upload,
  HandCoins,
  CalendarClock,
  Banknote,
  Info,
} from "lucide-react";
import { TenureOption } from "@/components/ui/TenureOption";
import UploadBox from "@/components/ui/UploadBox";


export default function LoanApplicationPage() {
  return (
    <div className="bg-white min-h-screen">

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <span>হোম</span>
          <ChevronRight className="w-3 h-3" />
          <span>ফান্ডিং এক্সপ্লোরার</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600">বীজ ক্রয় ফান্ডিং · আবেদন</span>
        </div>

        <h1 className="mt-4 text-3xl text-stone-900">
          ফান্ডিং আবেদন করুন
        </h1>
        <p className="mt-2 text-stone-500 text-sm">
          প্রয়োজনীয় তথ্য পূরণ করুন, অ্যাডমিন যাচাইয়ের পর সিদ্ধান্ত জানানো হবে।
        </p>

        <div className="mt-4 flex items-start gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 max-w-2xl">
          <Info className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-800 leading-relaxed">
            এটি সুদভিত্তিক ঋণ নয়। ফসল বা প্রকল্প থেকে লাভ হলে তার একটি
            নির্দিষ্ট অংশ বিনিয়োগকারীকে দিতে হবে। লোকসান হলে কোনো সুদ বা
            জরিমানা প্রযোজ্য নয় — ঝুঁকি উভয়পক্ষ ভাগ করে নেয়।
          </p>
        </div>

        <div className="mt-8 grid lg:grid-cols-[1fr_340px] gap-10">
          {/* LEFT: FORM */}
          <div className="space-y-8">
            {/* PROJECT LINK */}
            <div>
              <label className="text-sm text-stone-700">
                কোন প্রকল্পের জন্য আবেদন করছেন
              </label>
              <select className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-emerald-700">
                <option>সবুজ ধানখেত — কুমিল্লা</option>
                <option>নতুন প্রকল্প যোগ করুন</option>
              </select>
              <div className="mt-1.5 text-xs text-stone-400">
                বিদ্যমান প্রকল্প নির্বাচন করলে ভেরিফিকেশন দ্রুত সম্পন্ন হয়
              </div>
            </div>

            {/* AMOUNT */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm text-stone-700">ফান্ডিংয়ের পরিমাণ</label>
                <span className="text-sm text-stone-900">৳৩৫,০০০</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                defaultValue="35000"
                className="mt-3 w-full accent-emerald-800"
              />
              <div className="flex items-center justify-between text-xs text-stone-400 mt-1">
                <span>সর্বনিম্ন ৳৫,০০০</span>
                <span>সর্বোচ্চ ৳৫০,০০০</span>
              </div>
            </div>

            {/* TENURE */}
            <div>
              <label className="text-sm text-stone-700">প্রকল্পের মেয়াদ</label>
              <div className="mt-2 grid grid-cols-4 gap-3">
                <TenureOption label="৩ মাস" />
                <TenureOption label="৬ মাস" selected />
                <TenureOption label="৯ মাস" />
                <TenureOption label="১২ মাস" />
              </div>
            </div>

            {/* PURPOSE */}
            <div>
              <label className="text-sm text-stone-700">ফান্ডিংয়ের উদ্দেশ্য</label>
              <textarea
                rows={4}
                placeholder="যেমন: ৩ বিঘা জমিতে বোরো ধানের জন্য উচ্চ ফলনশীল বীজ ক্রয়"
                className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700 resize-none"
              />
            </div>

            {/* GUARANTOR */}
            <div>
              <label className="text-sm text-stone-700 mb-2 block">
                জামিনদারের তথ্য (ঐচ্ছিক)
              </label>
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  type="text"
                  placeholder="জামিনদারের নাম"
                  className="border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700"
                />
                <input
                  type="text"
                  placeholder="ফোন নম্বর"
                  className="border border-stone-300 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 focus:border-emerald-700"
                />
              </div>
            </div>

            {/* DOCUMENTS */}
            <div>
              <label className="text-sm text-stone-700 mb-2 block">
                সংযুক্তি
              </label>
              <div className="grid sm:grid-cols-2 gap-4">
                <UploadBox label="জমির দলিল / লিজ কাগজ" hint="PDF, JPG · সর্বোচ্চ ৫MB" />
                <UploadBox label="আয়ের প্রমাণ (ঐচ্ছিক)" hint="PDF, JPG · সর্বোচ্চ ৫MB" />
              </div>
              <div className="mt-2 text-xs text-stone-400">
                NID ইতিমধ্যে যাচাইকৃত থাকায় আলাদা করে জমা দিতে হবে না
              </div>
            </div>

            <label className="flex items-start gap-2 text-xs text-stone-500">
              <input
                type="checkbox"
                className="accent-emerald-800 mt-0.5"
                defaultChecked
              />
              <span>
                আমি নিশ্চিত করছি প্রদত্ত সকল তথ্য সঠিক এবং মুনাফা বণ্টনের
                শর্তাবলীতে সম্মত
              </span>
            </label>

            <div className="flex items-center gap-3">
              <button className="text-sm text-stone-500 hover:text-stone-800">
                পরে সম্পন্ন করুন
              </button>
              <button className="ml-auto bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800">
                আবেদন জমা দিন
              </button>
            </div>
          </div>

          {/* RIGHT: SUMMARY */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="border border-stone-200">
              <div className="p-5 flex items-start gap-4 border-b border-stone-200">
                <div className="w-11 h-11 bg-emerald-900 flex items-center justify-center shrink-0">
                  <Wheat className="w-5 h-5 text-white/80" />
                </div>
                <div>
                  <div className="text-xs text-stone-400">বীজ ফান্ডিং</div>
                  <div className="text-stone-900">
                    বীজ ক্রয় ফান্ডিং
                  </div>
                </div>
              </div>

              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-stone-400">
                    <HandCoins className="w-3.5 h-3.5" />
                    মুনাফা বণ্টন
                  </span>
                  <span className="text-stone-800">২৫% বিনিয়োগকারীর অংশ</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-stone-400">
                    <Banknote className="w-3.5 h-3.5" />
                    আবেদনকৃত পরিমাণ
                  </span>
                  <span className="text-stone-800">৳৩৫,০০০</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1.5 text-stone-400">
                    <CalendarClock className="w-3.5 h-3.5" />
                    মেয়াদ
                  </span>
                  <span className="text-stone-800">৬ মাস</span>
                </div>

                <div className="pt-4 border-t border-stone-200 text-xs text-stone-500 leading-relaxed">
                  ফসল বিক্রির পর লাভ হলে তার <span className="text-stone-800">২৫%</span> বিনিয়োগকারীকে
                  দিতে হবে। লোকসান হলে কোনো নির্দিষ্ট অর্থ পরিশোধের বাধ্যবাধকতা
                  নেই — কোনো সুদ বা জরিমানা প্রযোজ্য নয়।
                </div>

                <div className="text-xs text-stone-400 pt-2 border-t border-stone-200">
                  আবেদন পর্যালোচনায় সাধারণত ২–৩ কার্যদিবস সময় লাগে
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}