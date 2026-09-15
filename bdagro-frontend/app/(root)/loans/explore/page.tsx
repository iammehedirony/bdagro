import { LoanCard, LoanCardProps } from "@/components/loan/LoanCard";
import {
  Sprout,
  Wheat,
  Truck,
  PawPrint,
  Droplets,
  Leaf,
  Info,
} from "lucide-react";

const categories = [
  { label: "সব ক্যাটাগরি", icon: Sprout, active: true },
  { label: "বীজ ঋণ", icon: Wheat },
  { label: "ট্রাক্টর ও যন্ত্রপাতি", icon: Truck },
  { label: "গবাদিপশু পালন", icon: PawPrint },
  { label: "সেচ", icon: Droplets },
  { label: "সার ও কীটনাশক", icon: Leaf },
];

const loans: LoanCardProps["loan"][] = [
  {
    name: "বীজ ক্রয় ফান্ডিং",
    category: "বীজ ঋণ",
    icon: Wheat,
    tone: "emerald",
    share: "২৫% মুনাফা",
    max: "৳৫০,০০০",
    tenure: "৬ মাস",
    note: "উচ্চ ফলনশীল জাতের বীজ ক্রয়ের জন্য মূলধন। ফসল বিক্রির পর লাভ হলে তার ২৫% বিনিয়োগকারীকে দেওয়া হবে, লোকসান হলে কোনো সুদ বা জরিমানা নেই।",
  },
  {
    name: "ট্রাক্টর ক্রয় ফান্ডিং",
    category: "ট্রাক্টর ও যন্ত্রপাতি",
    icon: Truck,
    tone: "amber",
    share: "৩০% মুনাফা",
    max: "৳৮,০০,০০০",
    tenure: "৩৬ মাস",
    note: "নতুন বা পুনর্ব্যবহৃত কৃষি যন্ত্রপাতি ক্রয়ের জন্য মূলধন। যন্ত্র ব্যবহার করে অর্জিত অতিরিক্ত আয়ের ৩০% বিনিয়োগকারীর সাথে ভাগ করা হবে।",
  },
  {
    name: "গবাদিপশু পালন ফান্ডিং",
    category: "গবাদিপশু পালন",
    icon: PawPrint,
    tone: "orange",
    share: "৩৫% মুনাফা",
    max: "৳৩,০০,০০০",
    tenure: "১২ মাস",
    note: "গরু, ছাগল ইত্যাদি ক্রয় ও পালন খরচের জন্য মূলধন। বিক্রয়ের পর লাভের ৩৫% বিনিয়োগকারীকে প্রদান করতে হবে।",
  },
  {
    name: "সেচ যন্ত্র ফান্ডিং",
    category: "সেচ",
    icon: Droplets,
    tone: "emerald",
    share: "২০% মুনাফা",
    max: "৳১,৫০,০০০",
    tenure: "১৮ মাস",
    note: "শ্যালো মেশিন ও সেচ ব্যবস্থা স্থাপনের জন্য মূলধন। সেচ থেকে অতিরিক্ত ফলনের লাভের ২০% বিনিয়োগকারীর সাথে ভাগ হবে।",
  },
  {
    name: "সার ও কীটনাশক ফান্ডিং",
    category: "সার ও কীটনাশক",
    icon: Leaf,
    tone: "amber",
    share: "২২% মুনাফা",
    max: "৳৪০,০০০",
    tenure: "৪ মাস",
    note: "মৌসুমভিত্তিক সার ও কীটনাশক ক্রয়ের জন্য মূলধন। ফসল বিক্রির লাভের ২২% বিনিয়োগকারীকে দেওয়া হবে।",
  },
  {
    name: "পোল্ট্রি খামার ফান্ডিং",
    category: "গবাদিপশু পালন",
    icon: PawPrint,
    tone: "orange",
    share: "৩৩% মুনাফা",
    max: "৳২,৫০,০০০",
    tenure: "১০ মাস",
    note: "মুরগি খামার স্থাপন ও সম্প্রসারণের জন্য মূলধন। খামারের লাভের ৩৩% বিনিয়োগকারীর সাথে ভাগ করা হবে।",
  },
];


export default function LoanExplorerPage() {
  return (
    <div className="bg-white min-h-screen">

      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl text-stone-900">
          ফান্ডিং প্রোডাক্ট এক্সপ্লোরার
        </h1>
        <p className="mt-2 text-stone-500 text-sm max-w-lg">
          বীজ, যন্ত্রপাতি, গবাদিপশু বা সেচ — প্রয়োজন অনুযায়ী উপযুক্ত ফান্ডিং
          প্রোডাক্ট খুঁজে নিন এবং শর্তাবলী দেখুন।
        </p>

        <div className="mt-5 flex items-start gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 max-w-xl">
          <Info className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
          <p className="text-xs text-emerald-800 leading-relaxed">
            এই ফান্ডিং সুদভিত্তিক নয় — মুনাফা বণ্টন মডেলে কাজ করে। কৃষক
            লাভবান হলে তার একটি নির্দিষ্ট অংশ বিনিয়োগকারীকে দেওয়া হয়; কোনো
            নির্দিষ্ট সুদ বা জরিমানা প্রযোজ্য নয়।
          </p>
        </div>

        {/* CATEGORY SELECTOR */}
        <div className="mt-8 flex gap-3 overflow-x-auto pb-1">
          {categories.map((c) => (
            <button
              key={c.label}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap border ${
                c.active
                  ? "bg-emerald-900 text-white border-emerald-900"
                  : "border-stone-300 text-stone-600 hover:border-emerald-700"
              }`}
            >
              <c.icon className="w-4 h-4" />
              {c.label}
            </button>
          ))}
        </div>

        {/* RESULTS INFO */}
        <div className="mt-8 flex items-center justify-between">
          <span className="text-sm text-stone-400">৬টি ফান্ডিং প্রোডাক্ট পাওয়া গেছে</span>
          <div className="flex items-center gap-2 text-sm text-stone-600 border border-stone-300 px-3 py-2 w-fit">
            <span className="text-stone-400">সাজান:</span>
            <span>সর্বনিম্ন মুনাফা বণ্টন</span>
          </div>
        </div>

        {/* LOAN GRID */}
        <div className="mt-6 grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {loans.map((loan) => (
            <LoanCard key={loan.name} loan={loan} />
          ))}
        </div>

        {/* HELP BANNER */}
        <div className="mt-12 border border-stone-200 bg-stone-50 p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="text-stone-900">
              কোন ফান্ডিং প্রোডাক্টটি আপনার জন্য উপযুক্ত বুঝতে পারছেন না?
            </div>
            <div className="text-sm text-stone-500 mt-1">
              আপনার খামারের ধরন ও প্রয়োজন অনুযায়ী পরামর্শ নিন।
            </div>
          </div>
          <button className="bg-amber-500 text-emerald-950 px-5 py-2.5 text-sm hover:bg-amber-400 whitespace-nowrap">
            পরামর্শ নিন
          </button>
        </div>
      </div>
    </div>
  );
}