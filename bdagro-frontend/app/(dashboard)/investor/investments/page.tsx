"use client";

import {
  Sprout,
  MapPin,
  Download,
} from "lucide-react";
import { useState } from "react";
import StatusTag from "@/components/ui/StatusTag";
import ProgressBar from "@/components/ui/ProgressBar";
import RiskDot from "@/components/ui/RiskDot";
import { useInvestorPortfolioQuery } from "@/hooks/queries/useInvestorQueries";
import { useApi } from "@/lib/useApi";
import type { InvestorInvestment } from "@/lib/services/investor.service";
import { downloadReceipt, type PaymentReceipt } from "@/lib/receipt";

const tabs = ["সব", "সক্রিয়", "সম্পন্ন"] as const;
type InvestmentTab = (typeof tabs)[number];

const currency = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 });
const riskLabels = { low: "কম", medium: "মাঝারি", high: "বেশি" } as const;
const tones = { low: "emerald", medium: "amber", high: "orange" } as const;
const statusLabels = {
  pending: "Processing",
  completed: "Approved",
  returned: "সম্পন্ন",
  failed: "ব্যর্থ",
  refunded: "ফেরত",
} as const;

function formatCurrency(value: number) {
  return `৳${currency.format(Math.max(0, value))}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(value),
  );
}

export default function InvestorMyInvestmentsPage() {
  const [activeTab, setActiveTab] = useState<InvestmentTab>("সব");
  const { data, isLoading, isError } = useInvestorPortfolioQuery();
  const api = useApi();
  const investments = data?.investments ?? [];

  const filteredInvestments = investments.filter((investment) => {
    if (activeTab === "সক্রিয়") return investment.status === "pending" || investment.status === "completed";
    if (activeTab === "সম্পন্ন") return investment.status === "returned";
    return true;
  });

  async function handleDownloadReceipt(investment: InvestorInvestment) {
    if (!investment.transaction) return;

    const response = await api.get<{ receipt: PaymentReceipt }>(
      `/investors/transactions/${investment.transaction}/receipt`,
    );
    downloadReceipt(response.data.receipt);
  }

  return (
    <div className="bg-white min-h-screen flex">
      

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        

        <div className="p-8">
          {/* FILTER TABS */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
            <div className="flex gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm border ${
                    activeTab === tab
                      ? "bg-emerald-900 text-white border-emerald-900"
                      : "border-stone-300 text-stone-600 hover:border-emerald-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <span className="text-sm text-stone-400">{filteredInvestments.length}টি বিনিয়োগ</span>
          </div>

          <div className="border border-stone-200">
            <div className="divide-y divide-stone-200">
              {isLoading && <div className="p-6 text-sm text-stone-400">বিনিয়োগ লোড হচ্ছে...</div>}
              {isError && <div className="p-6 text-sm text-red-600">বিনিয়োগ তথ্য লোড করা যায়নি।</div>}
              {!isLoading && !isError && filteredInvestments.map((investment) => {
                const expectedReturn = investment.amount * (1 + investment.project.expectedROIPercent / 100);
                const progress = investment.project.fundingGoal > 0
                  ? Math.min(100, Math.round((investment.project.fundedAmount / investment.project.fundingGoal) * 100))
                  : 0;

                return (
                <div key={investment._id} className="p-6 flex items-center gap-6 flex-wrap">
                  <div
                    className={`w-14 h-14 flex items-center justify-center shrink-0 ${
                      tones[investment.project.riskLevel] === "emerald"
                        ? "bg-emerald-900"
                        : tones[investment.project.riskLevel] === "amber"
                        ? "bg-amber-700"
                        : "bg-orange-800"
                    }`}
                  >
                    <Sprout className="w-6 h-6 text-white/70" />
                  </div>

                  <div className="flex-1 min-w-45">
                    <div className="flex items-center gap-2">
                      <span className="text-stone-900">{investment.project.title}</span>
                      <StatusTag status={statusLabels[investment.status]} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-stone-400 mt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {investment.project.location}
                      </span>
                      <span>·</span>
                      <span>বিনিয়োগ {formatDate(investment.createdAt)}</span>
                    </div>
                  </div>

                  <div className="w-36">
                    <ProgressBar percent={progress} tone={tones[investment.project.riskLevel]} />
                    <div className="mt-1.5 flex items-center justify-between text-xs text-stone-400">
                      <RiskDot level={riskLabels[investment.project.riskLevel]} />
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-stone-900">{formatCurrency(investment.amount)}</div>
                    <div className="text-xs text-emerald-700 mt-0.5">+{investment.amount > 0 ? ((investment.returnAmount / investment.amount) * 100).toFixed(1) : "0.0"}% ROI</div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      প্রত্যাশিত {formatCurrency(expectedReturn)}
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={!investment.transaction}
                    onClick={() => void handleDownloadReceipt(investment)}
                    className="flex items-center gap-1.5 text-xs border border-stone-300 text-stone-600 px-3 py-2 hover:border-emerald-800 hover:text-emerald-900 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-3.5 h-3.5" />
                    মানি রিসিট
                  </button>
                </div>
                );
              })}
              {!isLoading && !isError && filteredInvestments.length === 0 && (
                <div className="p-6 text-sm text-stone-400">এই বিভাগে কোনো বিনিয়োগ নেই।</div>
              )}
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