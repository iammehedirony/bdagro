import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Wallet,
  TrendingUp,
  ArrowLeftRight,
  Search,
  Bell,
  Settings,
  MapPin,
  Download,
  FileText,
  X,
  ShieldCheck,
} from "lucide-react";
import StatusTag from "@/components/ui/StatusTag";
import ProgressBar from "@/components/ui/ProgressBar";
import RiskDot from "@/components/ui/RiskDot";


const investments = [
  { name: "সবুজ ধানখেত", location: "কুমিল্লা", invested: "৫০,০০০", current: "৫৭,৫০০", roi: "+১৫%", risk: "কম", status: "Approved", percent: 75, tone: "emerald", date: "১২ জুন ২০২৬", txn: "BAO-TXN-778201", method: "SSLCommerz · bKash" },
  { name: "আম বাগান প্রকল্প", location: "রাজশাহী", invested: "৭৫,০০০", current: "৮৪,০০০", roi: "+১২%", risk: "মাঝারি", status: "Processing", percent: 50, tone: "amber", date: "৩ জুলাই ২০২৬", txn: "BAO-TXN-781190", method: "SSLCommerz · কার্ড" },
  { name: "মাছ চাষ প্রকল্প", location: "খুলনা", invested: "৩০,০০০", current: "৩৬,৬০০", roi: "+২২%", risk: "বেশি", status: "Approved", percent: 100, tone: "orange", date: "২০ মে ২০২৬", txn: "BAO-TXN-764552", method: "Stripe · কার্ড" },
  { name: "গরু মোটাতাজাকরণ", location: "পাবনা", invested: "৪৫,০০০", current: "৫২,২০০", roi: "+১৬%", risk: "কম", status: "সম্পন্ন", percent: 100, tone: "emerald", date: "১০ জানুয়ারি ২০২৬", txn: "BAO-TXN-702318", method: "SSLCommerz · নগদ" },
];


export default function InvestorMyInvestmentsPage() {
  return (
    <div className="bg-white min-h-screen flex">
      

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        

        <div className="p-8">
          {/* FILTER TABS */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
            <div className="flex gap-2">
              {["সব", "সক্রিয়", "সম্পন্ন"].map((t, i) => (
                <button
                  key={t}
                  className={`px-4 py-2 text-sm border ${
                    i === 0
                      ? "bg-emerald-900 text-white border-emerald-900"
                      : "border-stone-300 text-stone-600 hover:border-emerald-700"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <span className="text-sm text-stone-400">৪টি বিনিয়োগ</span>
          </div>

          <div className="border border-stone-200">
            <div className="divide-y divide-stone-200">
              {investments.map((inv) => (
                <div key={inv.name} className="p-6 flex items-center gap-6 flex-wrap">
                  <div
                    className={`w-14 h-14 flex items-center justify-center shrink-0 ${
                      inv.tone === "emerald"
                        ? "bg-emerald-900"
                        : inv.tone === "amber"
                        ? "bg-amber-700"
                        : "bg-orange-800"
                    }`}
                  >
                    <Sprout className="w-6 h-6 text-white/70" />
                  </div>

                  <div className="flex-1 min-w-[180px]">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900">{inv.name}</span>
                      <StatusTag status={inv.status} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {inv.location}
                      </span>
                      <span>·</span>
                      <span>বিনিয়োগ {inv.date}</span>
                    </div>
                  </div>

                  <div className="w-36">
                    <ProgressBar percent={inv.percent} tone={inv.tone} />
                    <div className="mt-1.5 flex items-center justify-between text-xs text-stone-400">
                      <RiskDot level={inv.risk} />
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-stone-900">৳{inv.current}</div>
                    <div className="text-xs text-emerald-700 mt-0.5">{inv.roi} এখন পর্যন্ত</div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      বিনিয়োগ ৳{inv.invested}
                    </div>
                  </div>

                  <button className="flex items-center gap-1.5 text-xs border border-stone-300 text-stone-600 px-3 py-2 hover:border-emerald-800 hover:text-emerald-900 shrink-0">
                    <Download className="w-3.5 h-3.5" />
                    মানি রিসিট
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 text-xs text-stone-400">
            * উপরের মুনাফা/রিটার্ন এখন পর্যন্ত অর্জিত প্রকৃত হিসাব — ভবিষ্যতের
            জন্য এটি কোনো নিশ্চিত বা গ্যারান্টিযুক্ত রিটার্ন নয়।
          </div>
        </div>
      </div>

      {/* RECEIPT PREVIEW MODAL */}
      {/* <div className="fixed inset-0 bg-stone-900/40 flex items-center justify-center p-6 z-20">
        <div className="w-full max-w-md bg-white">
          <div className="p-5 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-800" />
              <span className="text-sm text-stone-900">মানি রিসিট প্রিভিউ</span>
            </div>
            <button className="text-stone-400 hover:text-stone-700">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-800" />
                <span className="text-stone-900">
                  Bdagroonline
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-stone-400">রিসিট নং</div>
                <div className="text-sm text-stone-800">BAO-RCP-778201</div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 text-emerald-800 text-xs border border-emerald-600 bg-emerald-50 w-fit px-2 py-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              পেমেন্ট সফল
            </div>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-stone-400">বিনিয়োগকারী</span>
                <span className="text-stone-800">রাহাত করিম</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">প্রকল্প</span>
                <span className="text-stone-800">সবুজ ধানখেত, কুমিল্লা</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">তারিখ</span>
                <span className="text-stone-800">১২ জুন ২০২৬</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">পেমেন্ট পদ্ধতি</span>
                <span className="text-stone-800">SSLCommerz · bKash</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-400">ট্রানজেকশন আইডি</span>
                <span className="text-stone-800">BAO-TXN-778201</span>
              </div>
            </div>

            <div className="mt-5 pt-5 border-t border-stone-200 flex items-center justify-between">
              <span className="text-stone-700">মোট বিনিয়োগ</span>
              <span className="text-xl text-stone-900">
                ৳৫০,০০০
              </span>
            </div>
          </div>

          <div className="p-5 pt-0 flex gap-3">
            <button className="flex-1 bg-emerald-900 text-white py-2.5 text-sm hover:bg-emerald-800 flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              PDF ডাউনলোড করুন
            </button>
            <button className="border border-stone-300 text-stone-600 px-4 py-2.5 text-sm hover:border-emerald-800">
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}