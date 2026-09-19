import {
  Sprout,
  Upload,
  Info
} from "lucide-react";
import Field from "@/components/ui/Field";



export default function FarmerEditProjectPage() {
  return (
    <div className="bg-white min-h-screen flex">
      <div className="flex-1 min-w-0">
        <div className="p-8 max-w-3xl">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-3xl text-stone-900">
                প্রকল্প এডিট করুন
              </h1>
              <p className="mt-2 text-stone-500 text-sm">
                পরিবর্তন সংরক্ষণ করার পর এটি আবার অ্যাডমিন যাচাইয়ের জন্য
                পাঠানো হবে।
              </p>
            </div>
            <span className="text-xs border border-amber-600 text-amber-700 bg-amber-50 px-2.5 py-1">
              Pending
            </span>
          </div>

          <div className="mt-6 flex items-start gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3">
            <Info className="w-4 h-4 text-emerald-700 mt-0.5 shrink-0" />
            <p className="text-xs text-emerald-800 leading-relaxed">
              এই প্রকল্পে এখনো কোনো বিনিয়োগকারী যুক্ত হননি, তাই সব তথ্য
              স্বাধীনভাবে সম্পাদনা করা যাবে। বিনিয়োগ শুরু হওয়ার পর
              লক্ষ্যমাত্রা ও মেয়াদের মতো কিছু তথ্য লক হয়ে যাবে।
            </p>
          </div>

          {/* COVER IMAGE */}
          <div className="mt-8">
            <label className="text-sm text-stone-700 mb-2 block">
              প্রকল্পের কভার ছবি
            </label>
            <div className="h-48 bg-emerald-900 flex items-center justify-center relative group cursor-pointer">
              <Sprout className="w-10 h-10 text-white/60" strokeWidth={1.5} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                <span className="hidden group-hover:flex items-center gap-2 text-white text-sm">
                  <Upload className="w-4 h-4" />
                  ছবি পরিবর্তন করুন
                </span>
              </div>
            </div>
          </div>

          {/* BASIC INFO */}
          <div className="mt-8 space-y-5">
            <Field label="প্রকল্পের শিরোনাম" value="sess diboss" placeholder="প্রকল্পের নাম লিখুন" />

            <div>
              <label className="text-sm text-stone-700">প্রকল্পের বিবরণ</label>
              <textarea
                rows={4}
                defaultValue="njjhjj jhjjkkkk jjkkkkkkk"
                className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-700 resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="ফসল / প্রকল্পের ধরন" placeholder="যেমন: বোরো ধান" />
              <Field label="খামারের ঠিকানা" placeholder="জেলা, উপজেলা" />
            </div>
          </div>

          {/* FARM DETAILS */}
          <div className="mt-8">
            <h2 className="text-lg text-stone-900 mb-4">
              খামারের বিবরণ
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="জমির পরিমাণ" placeholder="যেমন: ৩ বিঘা" />
              <Field label="মেয়াদ (মাস)" placeholder="যেমন: ৬" />
              <Field label="প্রত্যাশিত ফসল কাটার তারিখ" placeholder="dd/mm/yyyy" />
              <Field label="ঝুঁকির মাত্রা" placeholder="কম / মাঝারি / বেশি" />
            </div>
          </div>

          {/* FUNDING */}
          <div className="mt-8">
            <h2 className="text-lg text-stone-900 mb-4">
              ফান্ডিংয়ের তথ্য
            </h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="লক্ষ্যমাত্রা (৳)" value="0" placeholder="যেমন: ৫,০০,০০০" />
              <Field label="মুনাফা বণ্টন হার (%)" placeholder="যেমন: ২৫" />
            </div>
          </div>

          {/* ACTIONS */}
          <div className="mt-10 pt-6 border-t border-stone-200 flex items-center gap-3">
            <button className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800">
              পরিবর্তন সংরক্ষণ করুন
            </button>
            <button className="text-sm text-stone-500 hover:text-stone-800">
              বাতিল করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}