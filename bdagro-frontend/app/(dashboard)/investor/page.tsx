"use client";

import { MapPin, CheckCircle2, TrendingUp, Clock, Bell } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import ProgressBar from "@/components/ui/ProgressBar";
import RiskDot from "@/components/ui/RiskDot";
import { useInvestorNotificationsQuery, useInvestorPortfolioQuery } from "@/hooks/queries/useInvestorQueries";

const currency = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 });

function formatCurrency(value: number) {
  return `৳${currency.format(Math.max(0, value))}`;
}

function formatDate(value: string) {
  return new Intl.RelativeTimeFormat("bn", { numeric: "auto" }).format(
    Math.round((new Date(value).getTime() - Date.now()) / 86_400_000),
    "day",
  );
}

const riskLabels = { low: "কম", medium: "মাঝারি", high: "বেশি" } as const;
const tones = { low: "emerald", medium: "amber", high: "orange" } as const;
const statusLabels = {
  pending: "Processing",
  completed: "Approved",
  returned: "সম্পন্ন",
  failed: "ব্যর্থ",
  refunded: "ফেরত",
} as const;

function notificationIcon(type: string) {
  if (type.includes("return") || type.includes("payment")) return TrendingUp;
  if (type.includes("process")) return Clock;
  if (type.includes("investment") || type.includes("approv")) return CheckCircle2;
  return Bell;
}

export default function InvestorDashboard() {
  const portfolioQuery = useInvestorPortfolioQuery();
  const notificationsQuery = useInvestorNotificationsQuery();
  const portfolio = portfolioQuery.data?.portfolio;
  const investments = portfolioQuery.data?.investments ?? [];
  const notifications = notificationsQuery.data?.notifications ?? [];

  return (
    <div className="bg-white min-h-screen flex">
      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <div className="p-8">

          {/* 1. STAT CARDS (FULL WIDTH AT TOP) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <StatCard label="মোট বিনিয়োগ" value={formatCurrency(portfolio?.totalInvested ?? 0)} />
            <StatCard label="বর্তমান মূল্য" value={formatCurrency(portfolio?.currentValue ?? 0)} sub={`+${(portfolio?.roiPercent ?? 0).toFixed(1)}%`} tone="up" />
            <StatCard label="সামগ্রিক ROI" value={`${(portfolio?.roiPercent ?? 0).toFixed(1)}%`} sub="এখন পর্যন্ত" />
            <StatCard label="সক্রিয় বিনিয়োগ" value={`${portfolio?.activeInvestmentsCount ?? 0}টি`} sub={`${portfolio?.completedProjectsCount ?? 0}টি সম্পূর্ণ`} />
          </div>

          {/* 2. MAIN CONTENT GRID (INVESTMENTS & NOTIFICATIONS) */}
          <div className="grid lg:grid-cols-[1fr_300px] gap-8">

            {/* LEFT COLUMN: INVESTMENTS TABLE */}
            <div className="border border-neutral-200">
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="text-neutral-900 font-medium">আমার বিনিয়োগসমূহ</h3>
                <span className="text-xs text-neutral-400">{investments.length}টি প্রকল্প</span>
              </div>
              <div className="divide-y divide-neutral-200">
                {investments.map((inv) => (
                    <div key={inv._id} className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-neutral-900 font-medium">{inv.project.title}</div>
                        <div className="flex items-center gap-1 text-xs text-neutral-400 mt-1">
                          <MapPin className="w-3 h-3" />
                          {inv.project.location}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-neutral-900 font-medium">{formatCurrency(inv.amount + inv.returnAmount)}</div>
                        <div className="text-xs text-primary-700 mt-0.5 font-medium">
                          +{inv.amount > 0 ? ((inv.returnAmount / inv.amount) * 100).toFixed(1) : "0.0"}%
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <ProgressBar percent={Math.min(100, Math.round((inv.project.fundedAmount / inv.project.fundingGoal) * 100))} tone={tones[inv.project.riskLevel]} />
                    </div>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-4">
                        <span className="text-neutral-400">
                          বিনিয়োগ {formatCurrency(inv.amount)}
                        </span>
                        <RiskDot level={riskLabels[inv.project.riskLevel]} />
                      </div>
                      <span
                        className={`border px-2 py-0.5 rounded-sm ${
                          inv.status === "completed"
                            ? "border-primary-600 text-primary-800 bg-primary-50"
                            : "border-accent-600 text-accent-800 bg-accent-50"
                        }`}
                      >
                        {statusLabels[inv.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT COLUMN: NOTIFICATIONS */}
            <div className="space-y-8">
              <div className="border border-neutral-200">
                <div className="p-6 border-b border-neutral-200">
                  <h3 className="text-neutral-900 font-medium">সাম্প্রতিক আপডেট</h3>
                </div>
                <div className="divide-y divide-neutral-200">
                  {notifications.map((notification) => {
                    const Icon = notificationIcon(notification.type);
                    return (
                    <div key={notification._id} className="p-5 flex gap-3">
                      <Icon className="w-4 h-4 text-primary-700 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-sm text-neutral-700 leading-snug">
                          {notification.message || notification.title}
                        </div>
                        <div className="text-xs text-neutral-400 mt-1">
                          {formatDate(notification.createdAt)}
                        </div>
                      </div>
                    </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}