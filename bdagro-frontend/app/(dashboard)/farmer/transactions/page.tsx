"use client";

import {
  ArrowDownToLine,
  ArrowUpFromLine,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusTag from "@/components/ui/StatusTag";
import { useFarmerTransactionsQuery } from "@/hooks/queries/useFarmerQueries";
import type { FarmerTransaction } from "@/lib/services/farmer.service";

const currency = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 });
const payoutTypes = new Set(["profit_distribution", "payout"]);

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

function paymentMethodLabel(method: FarmerTransaction["paymentMethod"]) {
  return method === "sslcommerz" ? "SSLCommerz" : method === "stripe" ? "Stripe" : "Manual";
}

function statusLabel(status: FarmerTransaction["status"]) {
  return status === "success" ? "সফল" : status === "failed" ? "ব্যর্থ" : "প্রক্রিয়াধীন";
}

function isPayout(transaction: FarmerTransaction) {
  return payoutTypes.has(transaction.type);
}

export default function FarmerTransactionsPage() {
  const { data, isLoading, isError } = useFarmerTransactionsQuery();
  const transactions = data?.transactions ?? [];
  const investmentTransactions = transactions.filter((transaction) => transaction.type === "investment");
  const successfulPayouts = transactions.filter((transaction) => isPayout(transaction) && transaction.status === "success");

  const totalReceivedInvestment = investmentTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  const totalPaidProfit = successfulPayouts.reduce((sum, transaction) => sum + transaction.amount, 0);
  const failedTransactions = transactions.filter((transaction) => transaction.status === "failed" || (transaction.status as string) === "cancelled");

  return (
    <div className="w-full">
      
      {/* STATS */}
      <div className="grid grid-cols-2 gap-3 lg:gap-4 sm:grid-cols-4 mb-6 lg:mb-8">
        <StatCard label="সর্বমোট লেনদেন" value={`${transactions.length}টি`} sub="সব ধরনের মিলিয়ে" />
        <StatCard label="সর্বমোট প্রাপ্ত বিনিয়োগ" value={formatCurrency(totalReceivedInvestment)} sub={`${investmentTransactions.length}টি লেনদেনে`} />
        <StatCard label="সর্বমোট পরিশোধিত মুনাফা" value={formatCurrency(totalPaidProfit)} sub={`${successfulPayouts.length}টি সফল পরিশোধে`} />
        <StatCard label="ব্যর্থ লেনদেন" value={`${failedTransactions.length}টি`} sub="ব্যর্থ বা বাতিল" />
      </div>

      {/* TRANSACTION HISTORY */}
      <div className="border border-stone-200">
        <div className="p-4 lg:p-6 border-b border-stone-200">
          <h3 className="text-stone-900">
            লেনদেন হিস্টোরি
          </h3>
        </div>
        <div className="w-full overflow-x-auto">
          <div className="divide-y divide-stone-200 min-w-[600px]">
            {isLoading && <div className="p-4 lg:p-0 text-sm text-stone-400">লেনদেন লোড হচ্ছে...</div>}
            {isError && <div className="p-4 lg:p-0 text-sm text-red-600">লেনদেনের তথ্য লোড করা যায়নি।</div>}
            {!isLoading && !isError && transactions.map((transaction) => {
              const payout = isPayout(transaction);
              const Icon: LucideIcon = payout ? ArrowUpFromLine : ArrowDownToLine;

              return (
              <div key={transaction._id} className="p-4 lg:p-5 flex items-center gap-3 lg:gap-4 flex-wrap">
                <div className="w-9 h-9 flex items-center justify-center bg-stone-100 text-stone-500 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-stone-800 truncate">
                    {payout ? "মুনাফা পরিশোধ" : "বিনিয়োগ প্রাপ্তি"} — {transaction.project?.title ?? "অজানা প্রকল্প"}
                  </div>
                  <div className="text-xs text-stone-400 mt-0.5 truncate">
                    {payout ? "প্রতি" : "থেকে"}: {transaction.counterparty?.name ?? "অজানা ব্যবহারকারী"} · {paymentMethodLabel(transaction.paymentMethod)} · {formatDate(transaction.createdAt)}
                  </div>
                </div>
                <div className="text-sm text-stone-800 shrink-0 whitespace-nowrap">{formatCurrency(transaction.amount)}</div>
                <StatusTag status={statusLabel(transaction.status)} className="shrink-0" />
              </div>
              );
            })}
            {!isLoading && !isError && transactions.length === 0 && <div className="p-4 lg:p-0 text-sm text-stone-400">কোনো লেনদেন পাওয়া যায়নি।</div>}
          </div>
        </div>
      </div>
    </div>
  );
}