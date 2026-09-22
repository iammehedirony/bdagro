"use client";

import { Sprout, MapPin, Download } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
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
    return new Intl.DateTimeFormat("bn-BD", {
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(value));
}

function ProjectThumbnail({
    image,
    tone,
}: {
    image?: string | null;
    tone: "emerald" | "amber" | "orange";
}) {
    const [showFallback, setShowFallback] = useState(!image);
    const bgColor =
        tone === "emerald"
            ? "bg-emerald-900"
            : tone === "amber"
              ? "bg-amber-700"
              : "bg-orange-800";

    return (
        <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 overflow-hidden rounded-lg">
            {!showFallback && image && (
                <Image
                    src={image}
                    alt=""
                    fill
                    className="object-cover"
                    onError={() => setShowFallback(true)}
                    sizes="56px"
                />
            )}
            {showFallback && (
                <div
                    className={`h-full w-full flex items-center justify-center ${bgColor}`}
                >
                    <Sprout className="w-5 h-5 sm:w-6 sm:h-6 text-white/70" />
                </div>
            )}
        </div>
    );
}

export default function InvestorMyInvestmentsPage() {
    const [activeTab, setActiveTab] = useState<InvestmentTab>("সব");
    const { data, isLoading, isError } = useInvestorPortfolioQuery();
    const api = useApi();
    const investments = data?.investments ?? [];

    const filteredInvestments = investments.filter((investment) => {
        if (activeTab === "সক্রিয়")
            return (
                investment.status === "pending" ||
                investment.status === "completed"
            );
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
        <div className="bg-white min-h-screen">
            <div className="p-4 lg:p-0">
                {/* FILTER TABS */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-3 mb-4 lg:mb-5 flex-wrap">
                    <div className="flex gap-2 flex-wrap">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-3 lg:px-4 py-2 text-sm border ${
                                    activeTab === tab
                                        ? "bg-emerald-900 text-white border-emerald-900"
                                        : "border-stone-300 text-stone-600 hover:border-emerald-700"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <span className="text-sm text-stone-400 shrink-0 mt-1 sm:mt-0">
                        {filteredInvestments.length}টি বিনিয়োগ
                    </span>
                </div>

                <div className="border border-stone-200">
                    <div className="divide-y divide-stone-200">
                        {isLoading && (
                            <div className="p-4 lg:p-6 text-sm text-stone-400">
                                বিনিয়োগ লোড হচ্ছে...
                            </div>
                        )}
                        {isError && (
                            <div className="p-4 lg:p-6 text-sm text-red-600">
                                বিনিয়োগ তথ্য লোড করা যায়নি।
                            </div>
                        )}
                        {!isLoading &&
                            !isError &&
                            filteredInvestments.map((investment) => {
                                const expectedReturn =
                                    investment.amount *
                                    (1 +
                                        investment.project.expectedROIPercent /
                                            100);
                                const progress =
                                    investment.project.fundingGoal > 0
                                        ? Math.min(
                                              100,
                                              Math.round(
                                                  (investment.project
                                                      .fundedAmount /
                                                      investment.project
                                                          .fundingGoal) *
                                                      100,
                                              ),
                                          )
                                        : 0;
                                const tone =
                                    tones[investment.project.riskLevel];
                                const image = investment.project.farmImage;

                                return (
                                    <div
                                        key={investment._id}
                                        className="p-4 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 border-b border-stone-100 last:border-0 sm:border-0"
                                    >
                                        {/* ১. থাম্বনেইল ও প্রজেক্ট ইনফো (মোবাইল ও ডেস্কটপ উভয় স্ক্রিনেই পাশাপাশি থাকবে) */}
                                        <div className="flex flex-row items-start sm:items-center gap-3 flex-1 min-w-0 w-full">
                                            <div className="shrink-0">
                                                <ProjectThumbnail
                                                    image={image}
                                                    tone={tone}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-stone-900 font-medium break-words">
                                                        {
                                                            investment.project
                                                                .title
                                                        }
                                                    </span>
                                                    <StatusTag
                                                        status={
                                                            statusLabels[
                                                                investment
                                                                    .status
                                                            ]
                                                        }
                                                        className="shrink-0"
                                                    />
                                                </div>
                                                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-stone-500 mt-1">
                                                    <span className="flex items-center gap-1 whitespace-nowrap">
                                                        <MapPin className="w-3 h-3 shrink-0" />
                                                        {
                                                            investment.project
                                                                .location
                                                        }
                                                    </span>
                                                    <span className="hidden sm:inline">
                                                        ·
                                                    </span>
                                                    <span className="whitespace-nowrap">
                                                        বিনিয়োগ{" "}
                                                        {formatDate(
                                                            investment.createdAt,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ২. প্রগ্রেস বার ও ঝুঁকি সেকশন */}
                                        <div className="w-full sm:w-36 shrink-0 mt-1 sm:mt-0">
                                            <ProgressBar
                                                percent={progress}
                                                tone={
                                                    tones[
                                                        investment.project
                                                            .riskLevel
                                                    ]
                                                }
                                            />
                                            <div className="mt-1.5 flex items-center justify-between text-xs text-stone-500">
                                                <RiskDot
                                                    level={
                                                        riskLabels[
                                                            investment.project
                                                                .riskLevel
                                                        ]
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* ৩. আর্থিক হিসাব (মোবাইলে পাশাপাশি, ডেস্কটপে নিচে নিচে) */}
                                        <div className="flex flex-row sm:flex-col justify-between items-center sm:items-start w-full sm:w-auto shrink-0 border-t sm:border-0 border-stone-100 pt-3 sm:pt-0 mt-1 sm:mt-0">
                                            <div className="text-left">
                                                <div className="text-stone-900 font-medium">
                                                    {formatCurrency(
                                                        investment.amount,
                                                    )}
                                                </div>
                                                <div className="text-xs text-emerald-700 mt-0.5">
                                                    +
                                                    {investment.amount > 0
                                                        ? (
                                                              (investment.returnAmount /
                                                                  investment.amount) *
                                                              100
                                                          ).toFixed(1)
                                                        : "0.0"}
                                                    % ROI
                                                </div>
                                            </div>
                                            <div className="text-right sm:text-left">
                                                <div className="text-xs text-stone-500 mt-0.5">
                                                    প্রত্যাশিত{" "}
                                                    {formatCurrency(
                                                        expectedReturn,
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* ৪. মানি রিসিট বাটন (মোবাইলে ফুল-উইডথ) */}
                                        <button
                                            type="button"
                                            disabled={!investment.transaction}
                                            onClick={() =>
                                                void handleDownloadReceipt(
                                                    investment,
                                                )
                                            }
                                            className="w-full sm:w-auto flex items-center justify-center gap-1.5 text-xs border border-stone-300 text-stone-600 px-3 py-2 hover:border-emerald-800 hover:text-emerald-900 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed rounded"
                                        >
                                            <Download className="w-3.5 h-3.5 shrink-0" />
                                            মানি রিসিট
                                        </button>
                                    </div>
                                );
                            })}
                        {!isLoading &&
                            !isError &&
                            filteredInvestments.length === 0 && (
                                <div className="p-4 lg:p-6 text-sm text-stone-400">
                                    এই বিভাগে কোনো বিনিয়োগ নেই।
                                </div>
                            )}
                    </div>
                </div>

                <div className="mt-3 text-xs text-stone-400">
                    * উপরের মুনাফা/রিটার্ন এখন পর্যন্ত অর্জিত প্রকৃত হিসাব —
                    ভবিষ্যতের জন্য এটি কোনো নিশ্চিত বা গ্যারান্টিযুক্ত রিটার্ন
                    নয়।
                </div>
            </div>
        </div>
    );
}
