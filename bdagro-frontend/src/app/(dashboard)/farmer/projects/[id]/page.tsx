import ProgressBar from "@/components/ui/ProgressBar";
import StatusStep from "@/components/ui/StatusStep";
import {
  Sprout,
  MapPin,
  Ruler,
  Wheat,
  Calendar,
  Users,
  HandCoins,
  Pencil,
} from "lucide-react";


const investors = [
  { name: "রাহাত ক.", amount: "১০,০০০", date: "১২ জুন ২০২৬", initial: "র" },
  { name: "তানভীর আ.", amount: "১৫,০০০", date: "১৫ জুন ২০২৬", initial: "ত" },
  { name: "সুমাইয়া হ.", amount: "৫,০০০", date: "১৮ জুন ২০২৬", initial: "সু" },
  { name: "কামরুল ই.", amount: "২০,০০০", date: "২২ জুন ২০২৬", initial: "কা" },
  { name: "নাজমুল হ.", amount: "৮,০০০", date: "২৮ জুন ২০২৬", initial: "না" },
];

export default function FarmerProjectDetailsPage() {
  return (
    <div className="bg-white min-h-screen flex">
      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8">
          <div className="grid lg:grid-cols-[1fr_340px] gap-10">
            {/* LEFT: PROJECT CONTENT */}
            <div>
              <div className="h-64 bg-emerald-900 flex items-center justify-center">
                <Sprout className="w-12 h-12 text-white/60" strokeWidth={1.5} />
              </div>

              <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                    <span className="border border-emerald-600 text-emerald-800 bg-emerald-50 px-2 py-0.5">
                      Approved
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
                <button className="border border-stone-300 text-stone-700 px-4 py-2 text-sm hover:border-emerald-800 hover:text-emerald-900 flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5" />
                  প্রকল্প এডিট করুন
                </button>
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
                  <StatusStep label="ফসল সংগ্রহ ও মুনাফা বণ্টন" />
                </div>
              </div>
            </div>

            {/* RIGHT: FUNDING & INVESTORS */}
            <div className="lg:sticky lg:top-6 h-fit space-y-6">
              {/* PROGRESS */}
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
                    <div className="text-xs text-stone-400">মুনাফা বণ্টন</div>
                    <div className="text-lg text-emerald-800">
                      ২৫%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-stone-400">বিনিয়োগকারী</div>
                    <div className="text-lg text-stone-900">
                      ৬২ জন
                    </div>
                  </div>
                </div>

                <button className="mt-5 w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800 flex items-center justify-center gap-2">
                  <HandCoins className="w-4 h-4" />
                  মুনাফা রিপোর্ট জমা দিন
                </button>
              </div>

              {/* INVESTORS LIST */}
              <div className="border border-stone-200">
                <div className="p-5 border-b border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-stone-900">
                    <Users className="w-4 h-4" />
                    <span>বিনিয়োগকারীগণ</span>
                  </div>
                  <span className="text-xs text-stone-400">৬২ জনের মধ্যে ৫টি</span>
                </div>
                <div className="divide-y divide-stone-100">
                  {investors.map((inv) => (
                    <div key={inv.name} className="p-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-500 text-sm shrink-0">
                          {inv.initial}
                        </div>
                        <div>
                          <div className="text-sm text-stone-800">{inv.name}</div>
                          <div className="text-xs text-stone-400 mt-0.5">{inv.date}</div>
                        </div>
                      </div>
                      <div className="text-sm text-stone-800 shrink-0">৳{inv.amount}</div>
                    </div>
                  ))}
                </div>
                <div className="p-4 text-center border-t border-stone-200">
                  <span className="text-sm text-emerald-900 cursor-pointer">
                    সব বিনিয়োগকারী দেখুন
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}