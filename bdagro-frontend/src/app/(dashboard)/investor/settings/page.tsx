import { Lock } from "lucide-react";
import Field from "@/components/form/Field";
import RiskOption from "@/components/others/RiskOption";
import { Toggle } from "@/components/form/Toggle";

export default function InvestorSettingsPage() {
  return (
    <div className="bg-white min-h-screen flex">

      {/* MAIN */}
      <div className="flex-1 min-w-0">

        <div className="p-8 max-w-2xl space-y-10">
          {/* PROFILE */}
          <div>
            <h2 className="text-xl text-neutral-900 mb-4">
              প্রোফাইল তথ্য
            </h2>
            <div className="border border-neutral-200 p-6 grid sm:grid-cols-2 gap-5">
              <Field label="পূর্ণ নাম" value="রাহাত করিম" />
              <Field label="ফোন নম্বর" value="+৮৮০ ১৮৯৮-৭৬৫৪৩২" />
              <Field label="ইমেইল" value="rahat.karim@email.com" />
              <Field label="ঠিকানা" placeholder="শহর, জেলা" />
            </div>
          </div>

          {/* INVESTMENT PREFERENCES */}
          <div>
            <h2 className="text-xl text-neutral-900 mb-4">
              বিনিয়োগ পছন্দ
            </h2>
            <div className="border border-neutral-200 p-6">
              <label className="text-sm text-neutral-700 mb-2 block">
                ঝুঁকি সহনশীলতা
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                <RiskOption label="কম" desc="স্থিতিশীল, কম ROI" />
                <RiskOption label="মাঝারি" desc="সুষম ঝুঁকি ও রিটার্ন" selected />
                <RiskOption label="বেশি" desc="উচ্চ ROI, বেশি ঝুঁকি" />
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div>
            <h2 className="text-xl text-neutral-900 mb-4">
              পেমেন্ট মাধ্যম
            </h2>
            <div className="border border-neutral-200 p-6 grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-neutral-700">ডিফল্ট পেমেন্ট গেটওয়ে</label>
                <select className="mt-1.5 w-full border border-neutral-300 px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:border-primary-700">
                  <option>SSLCommerz (বিকাশ/নগদ/কার্ড)</option>
                  <option>Stripe (আন্তর্জাতিক কার্ড)</option>
                </select>
              </div>
              <Field label="রিটার্নের জন্য অ্যাকাউন্ট নম্বর" placeholder="০১XXXXXXXXX" />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <h2 className="text-xl text-neutral-900 mb-4">
              পাসওয়ার্ড পরিবর্তন
            </h2>
            <div className="border border-neutral-200 p-6 grid sm:grid-cols-2 gap-5">
              <Field label="বর্তমান পাসওয়ার্ড" type="password" placeholder="••••••••" />
              <Field label="নতুন পাসওয়ার্ড" type="password" placeholder="••••••••" />
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div>
            <h2 className="text-xl text-neutral-900 mb-4">
              নোটিফিকেশন পছন্দ
            </h2>
            <div className="border border-neutral-200 px-6 divide-y divide-neutral-100">
              <Toggle label="নতুন প্রকল্প সুপারিশ" sub="আপনার আগ্রহ অনুযায়ী নতুন প্রকল্প এলে জানানো হবে" defaultOn />
              <Toggle label="ফান্ডিং ও রিটার্ন আপডেট" sub="প্রকল্পের অগ্রগতি ও রিটার্ন জমা হলে জানানো হবে" defaultOn />
              <Toggle label="পেমেন্ট নিশ্চিতকরণ" sub="প্রতিটি লেনদেনের নোটিফিকেশন" defaultOn />
              <Toggle label="প্রোমোশনাল আপডেট" sub="নতুন ফিচার ও অফার সম্পর্কে তথ্য" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-primary-900 text-white px-6 py-3 text-sm hover:bg-primary-800">
              পরিবর্তন সংরক্ষণ করুন
            </button>
            <button className="text-sm text-neutral-500 hover:text-neutral-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              অ্যাকাউন্ট নিষ্ক্রিয় করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}