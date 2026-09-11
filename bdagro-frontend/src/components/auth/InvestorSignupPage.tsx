
import {
  Sprout,
  ShieldCheck,
  TrendingUp,
  Bell,
  Wallet,
} from "lucide-react";
import Field from "@/components/form/Field";
import CropChip from "@/components/others/CropChip";
import RiskOption from "@/components/others/RiskOption";


function InvestorSignupPage() {
  return (
    <div className="bg-white min-h-screen">

      <div className="grid lg:grid-cols-[1fr_420px] min-h-screen">
        {/* LEFT: FORM */}
        <div className="px-6 sm:px-12 py-10 max-w-xl w-full mx-auto">
          <div className="flex items-center gap-2 mb-10">
            <Sprout className="w-5 h-5 text-emerald-800" />
            <span className="text-stone-900 text-lg">
              Bdagroonline
            </span>
          </div>

          <h1 className="text-3xl text-stone-900">
            বিনিয়োগকারী হিসেবে যোগ দিন
          </h1>
          <p className="mt-2 text-stone-500 text-sm">
            অ্যাকাউন্ট খুলুন এবং যাচাইকৃত খামার প্রকল্পে বিনিয়োগ শুরু করুন।
          </p>

          <div className="mt-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <Field label="পূর্ণ নাম" placeholder="আপনার নাম লিখুন" />
              <Field label="ইমেইল (ঐচ্ছিক)" placeholder="you@email.com" />
            </div>

            <Field
              label="ফোন নম্বর"
              placeholder="+৮৮০ ১XXX-XXXXXX"
              suffix={
                <button className="px-4 py-2.5 text-xs text-emerald-800 border-l border-stone-300 hover:bg-stone-50 whitespace-nowrap">
                  OTP পাঠান
                </button>
              }
            />

            <Field label="পাসওয়ার্ড" placeholder="কমপক্ষে ৮ ক্যারেক্টার" type="password" />

            {/* INVESTMENT INTEREST */}
            <div>
              <label className="text-sm text-stone-700">
                বিনিয়োগে আগ্রহের ক্ষেত্র
              </label>
              <div className="mt-2 flex flex-wrap gap-2">
                <CropChip label="ধান" selected />
                <CropChip label="ফল বাগান" selected />
                <CropChip label="সবজি" />
                <CropChip label="মৎস্য" />
                <CropChip label="প্রাণিসম্পদ" />
              </div>
            </div>

            {/* RISK TOLERANCE */}
            <div>
              <label className="text-sm text-stone-700">
                ঝুঁকি সহনশীলতা
              </label>
              <div className="mt-2 grid sm:grid-cols-3 gap-3">
                <RiskOption
                  label="কম"
                  desc="স্থিতিশীল, কম ROI"
                  selected
                />
                <RiskOption label="মাঝারি" desc="সুষম ঝুঁকি ও রিটার্ন" />
                <RiskOption label="বেশি" desc="উচ্চ ROI, বেশি ঝুঁকি" />
              </div>
            </div>

            <div>
              <label className="text-sm text-stone-700">
                মাসিক বিনিয়োগ পরিকল্পনা
              </label>
              <select className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm text-stone-600 focus:outline-none focus:border-emerald-700">
                <option>৳৫,০০০ – ২৫,০০০</option>
                <option>৳২৫,০০০ – ১,০০,০০০</option>
                <option>৳১,০০,০০০ – ৫,০০,০০০</option>
                <option>৳৫,০০,০০০ এর বেশি</option>
              </select>
            </div>

            <label className="flex items-start gap-2 text-xs text-stone-500">
              <input type="checkbox" className="accent-emerald-800 mt-0.5" defaultChecked />
              <span>
                আমি Bdagroonline-এর ব্যবহারের শর্তাবলী ও গোপনীয়তা নীতিতে সম্মত
              </span>
            </label>

            <button className="w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800">
              অ্যাকাউন্ট তৈরি করুন
            </button>

            <div className="text-center text-sm text-stone-400">
              আগে থেকে অ্যাকাউন্ট আছে?{" "}
              <span className="text-emerald-900">লগইন করুন</span>
            </div>
          </div>
        </div>

        {/* RIGHT: TRUST PANEL */}
        <div className="bg-emerald-950 px-10 py-14 flex flex-col justify-center">
          <h2 className="text-2xl text-stone-50 leading-snug">
            কেন Bdagroonline-এ বিনিয়োগ করবেন
          </h2>
          <div className="mt-8 space-y-6">
            {[
              {
                icon: ShieldCheck,
                title: "যাচাইকৃত কৃষক",
                body: "প্রতিটি কৃষকের NID ও প্রকল্প অ্যাডমিন কর্তৃক যাচাইকৃত।",
              },
              {
                icon: TrendingUp,
                title: "ঝুঁকি ও ROI স্বচ্ছতা",
                body: "প্রতিটি প্রকল্পে ঝুঁকির মাত্রা ও প্রত্যাশিত রিটার্ন আগে থেকেই দেখা যায়।",
              },
              {
                icon: Bell,
                title: "রিয়েল-টাইম আপডেট",
                body: "প্রকল্পের অগ্রগতি ও রিটার্নের প্রতিটি ধাপে নোটিফিকেশন পাবেন।",
              },
              {
                icon: Wallet,
                title: "নিরাপদ পেমেন্ট",
                body: "SSLCommerz ও Stripe এর মাধ্যমে বিনিয়োগ ও উত্তোলন সম্পন্ন হয়।",
              },
            ].map((f) => (
              <div key={f.title} className="flex gap-4">
                <f.icon className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-stone-100 text-sm">{f.title}</div>
                  <div className="text-emerald-100/60 text-xs mt-1 leading-relaxed">
                    {f.body}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t border-emerald-900 flex items-center justify-between text-emerald-100/70 text-sm">
            <div>
              <div className="text-stone-50 text-lg">
                ১,২০০+
              </div>
              <div className="text-xs mt-0.5">সক্রিয় বিনিয়োগকারী</div>
            </div>
            <div>
              <div className="text-stone-50 text-lg">
                ১৭.৫%
              </div>
              <div className="text-xs mt-0.5">গড় ROI</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestorSignupPage;