import {
  Sprout,
  MapPin,
  ShieldCheck,
  Calendar,
  Ruler,
  Wheat,
  User,
  ChevronRight,
} from "lucide-react";
import StatusStep from "@/components/ui/StatusStep";
import ProgressBar from "@/components/ui/ProgressBar";
import Link from 'next/link';




export default async function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* BREADCRUMB */}
        <div className="flex items-center gap-1.5 text-xs text-stone-400">
          <span>হোম</span>
          <ChevronRight className="w-3 h-3" />
          <span>প্রজেক্টসমূহ</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-stone-600">সবুজ ধানখেত</span>
        </div>

        <div className="mt-6 grid lg:grid-cols-[1fr_340px] gap-10">
          {/* LEFT: MAIN CONTENT */}
          <div>
            {/* GALLERY */}
            <div className="h-72 bg-emerald-900 flex items-center justify-center">
              <Sprout className="w-14 h-14 text-white/60" strokeWidth={1.5} />
            </div>
            <div className="mt-2 grid grid-cols-4 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-16 flex items-center justify-center ${
                    i === 0 ? "bg-emerald-800" : "bg-stone-100"
                  }`}
                >
                  <Sprout
                    className={`w-4 h-4 ${
                      i === 0 ? "text-white/60" : "text-stone-300"
                    }`}
                  />
                </div>
              ))}
            </div>

            {/* TITLE */}
            <div className="mt-8">
              <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                <span className="border border-emerald-600 text-emerald-800 bg-emerald-50 px-2 py-0.5">
                  ঝুঁকি: কম
                </span>
                <span>·</span>
                <span>ধান</span>
              </div>
              <h1 className="text-3xl text-stone-900">
                সবুজ ধানখেত
              </h1>
              <div className="flex items-center gap-1 text-sm text-stone-400 mt-2">
                <MapPin className="w-3.5 h-3.5" />
                <span>বুড়িচং, কুমিল্লা</span>
              </div>
            </div>

            {/* FARMER CARD */}
            <div className="mt-6 border border-stone-200 p-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-emerald-900 flex items-center justify-center text-white shrink-0">
                <User className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm text-stone-900">আব্দুল করিম</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div className="text-xs text-stone-400 mt-0.5">
                  NID যাচাইকৃত কৃষক · যুক্ত হয়েছেন ২০২৪ সালে · ৩টি প্রকল্প সম্পন্ন
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="mt-10">
              <h2 className="text-xl text-stone-900 mb-3">
                প্রকল্পের বিবরণ
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                বুড়িচং উপজেলার ৩ বিঘা জমিতে উচ্চ ফলনশীল বোরো ধান চাষের
                পরিকল্পনা। বীজ, সার, সেচ ও শ্রমিক খরচের জন্য মূলধন প্রয়োজন।
                গত মৌসুমে একই জমিতে বিঘাপ্রতি ২২ মণ ফলন পাওয়া গিয়েছিল।
                ফসল কাটার পর স্থানীয় পাইকারি বাজারে বিক্রি করে বিনিয়োগকারীদের
                রিটার্ন পরিশোধ করা হবে।
              </p>
            </div>

            {/* FARM DETAILS */}
            <div className="mt-10">
              <h2 className="text-xl text-stone-900 mb-4">
                খামারের বিবরণ
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="border border-stone-200 p-4 flex items-center gap-3">
                  <Ruler className="w-4 h-4 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-400">জমির পরিমাণ</div>
                    <div className="text-sm text-stone-800">৩ বিঘা</div>
                  </div>
                </div>
                <div className="border border-stone-200 p-4 flex items-center gap-3">
                  <Wheat className="w-4 h-4 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-400">ফসলের ধরন</div>
                    <div className="text-sm text-stone-800">বোরো ধান</div>
                  </div>
                </div>
                <div className="border border-stone-200 p-4 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-400">মেয়াদ</div>
                    <div className="text-sm text-stone-800">৪ মাস</div>
                  </div>
                </div>
                <div className="border border-stone-200 p-4 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-stone-400" />
                  <div>
                    <div className="text-xs text-stone-400">
                      প্রত্যাশিত ফসল কাটার তারিখ
                    </div>
                    <div className="text-sm text-stone-800">মার্চ ২০২৭</div>
                  </div>
                </div>
              </div>
            </div>

            {/* STATUS TIMELINE */}
            <div className="mt-10">
              <h2 className="text-xl text-stone-900 mb-4">
                প্রকল্পের অবস্থা
              </h2>
              <div className="border border-stone-200 p-6 flex flex-wrap gap-x-8 gap-y-3">
                <StatusStep label="Pending" done />
                <StatusStep label="Processing" done />
                <StatusStep label="Approved" done current />
                <StatusStep label="ফসল সংগ্রহ ও রিটার্ন" />
              </div>
            </div>
          </div>

          {/* RIGHT: INVESTMENT PANEL */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="border border-stone-200 p-6">
              <div className="flex items-center justify-between text-sm text-stone-700 mb-1.5">
                <span className="text-stone-900">৳৩,৭৫,০০০</span>
                <span className="text-stone-400">লক্ষ্য ৳৫,০০,০০০</span>
              </div>
              <ProgressBar percent={75} />
              <div className="flex items-center justify-between text-xs text-stone-400 mt-2">
                <span>৭৫% পূর্ণ হয়েছে</span>
                <span>১৮ দিন বাকি</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-stone-200">
                <div>
                  <div className="text-xs text-stone-400">প্রত্যাশিত ROI</div>
                  <div className="text-lg text-emerald-800">
                    ১৫%
                  </div>
                </div>
                <div>
                  <div className="text-xs text-stone-400">বিনিয়োগকারী</div>
                  <div className="text-lg text-stone-900">
                    ৬২ জন
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-stone-400 leading-relaxed">
                এটি একটি প্রাক্কলন — চূড়ান্ত রিটার্ন ফসল বিক্রির প্রকৃত
                মুনাফার উপর নির্ভরশীল, কোনো নির্দিষ্ট সুদ প্রযোজ্য নয়।
              </div>

              <div className="mt-6 pt-6 border-t border-stone-200">
                <div className="text-sm text-stone-700 mb-2">
                  বিনিয়োগের পরিমাণ
                </div>
                <div className="flex gap-2 mb-3">
                  <button className="flex-1 border border-emerald-800 bg-emerald-50 text-emerald-900 py-2 text-sm">
                    আংশিক
                  </button>
                  <button className="flex-1 border border-stone-300 text-stone-600 py-2 text-sm hover:border-emerald-800">
                    পূর্ণ (৳১,২৫,০০০)
                  </button>
                </div>
                <div className="flex items-center border border-stone-300">
                  <span className="px-3 text-stone-400 text-sm">৳</span>
                  <input
                    type="text"
                    defaultValue="১০,০০০"
                    className="flex-1 py-2.5 pr-3 text-sm outline-none"
                  />
                </div>
                <div className="text-xs text-stone-400 mt-1.5">
                  সর্বনিম্ন বিনিয়োগ ৳৫,০০০
                </div>

                <Link 
  href={`/projects/${id}/checkout`} 
  className="mt-4 w-full block text-center bg-amber-500 text-emerald-950 py-3 text-sm font-medium hover:bg-amber-400"
>
  বিনিয়োগ করুন
</Link>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-stone-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>SSLCommerz ও Stripe দ্বারা সুরক্ষিত পেমেন্ট</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}