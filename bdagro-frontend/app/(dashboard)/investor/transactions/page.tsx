"use client";

import {
  ArrowUpFromLine,
  ArrowDownToLine,
  Banknote,
} from "lucide-react";
import type { ComponentType } from "react";
import StatCard from "@/components/ui/StatCard";
import StatusTag from "@/components/ui/StatusTag";
import { useInvestorTransactionsQuery } from "@/hooks/queries/useInvestorQueries";
import type { InvestorTransaction } from "@/lib/services/investor.service";

const currency = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 });
const transactionTypes = new Set(["profit_distribution", "payout"]);

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

function paymentMethodLabel(method: InvestorTransaction["paymentMethod"]) {
  return method === "sslcommerz" ? "SSLCommerz" : method === "stripe" ? "Stripe" : "Manual";
}

function statusLabel(status: InvestorTransaction["status"]) {
  return status === "success" ? "সফল" : status === "failed" ? "ব্যর্থ" : "প্রক্রিয়াধীন";
}

function transactionLabel(transaction: InvestorTransaction) {
  return transactionTypes.has(transaction.type) ? "মুনাফা প্রাপ্তি" : "বিনিয়োগ";
}

function transactionIcon(transaction: InvestorTransaction): ComponentType<{ className?: string }> {
  return transactionTypes.has(transaction.type) ? ArrowDownToLine : ArrowUpFromLine;
}

export default function InvestorTransactionsPage() {
  const { data, isLoading, isError } = useInvestorTransactionsQuery();
  const transactions = data?.transactions ?? [];
  const investmentTransactions = transactions.filter((transaction) => transaction.type === "investment");
  const profitTransactions = transactions.filter((transaction) => transactionTypes.has(transaction.type));
  const failedTransactions = transactions.filter((transaction) => transaction.status === "failed" || (transaction.status as string) === "cancelled");

  const stats = {
    totalInvestment: investmentTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
    totalProfit: profitTransactions.reduce((sum, transaction) => sum + transaction.amount, 0),
  };

  return (
    <div className="bg-white min-h-screen flex">

      

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        
        <div className="p-8">

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="সর্বমোট লেনদেন" value={`${transactions.length}টি`} sub="সব ধরনের মিলিয়ে" />
            <StatCard label="সর্বমোট বিনিয়োগ" value={formatCurrency(stats.totalInvestment)} sub={`${investmentTransactions.length}টি লেনদেনে`} />
            <StatCard label="সর্বমোট মুনাফা প্রাপ্তি" value={formatCurrency(stats.totalProfit)} sub={`${profitTransactions.length}টি পরিশোধে`} />
            <StatCard label="ব্যর্থ লেনদেন" value={`${failedTransactions.length}টি`} sub="ব্যর্থ বা বাতিল" />
          </div>

          {/* TRANSACTION HISTORY */}
          <div className="mt-8 border border-stone-200">
            <div className="p-6 border-b border-stone-200">
              <h3 className="text-stone-900">
                লেনদেন হিস্টোরি
              </h3>
            </div>
            <div className="divide-y divide-stone-200">
              {isLoading && <div className="p-6 text-sm text-stone-400">লেনদেন লোড হচ্ছে...</div>}
              {isError && <div className="p-6 text-sm text-red-600">লেনদেনের তথ্য লোড করা যায়নি।</div>}
              {!isLoading && !isError && transactions.map((transaction) => {
                const Icon = transactionIcon(transaction);
                return (
                <div key={transaction._id} className="p-5 flex items-center gap-4 flex-wrap">
                  <div className="w-9 h-9 flex items-center justify-center bg-stone-100 text-stone-500 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-40">
                    <div className="text-sm text-stone-800">
                      {transactionLabel(transaction)} — {transaction.project?.title ?? "অজানা প্রকল্প"}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {paymentMethodLabel(transaction.paymentMethod)} · {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                  <div className="text-sm text-stone-800 shrink-0">{formatCurrency(transaction.amount)}</div>
                  <StatusTag status={statusLabel(transaction.status)} />
                </div>
                );
              })}
              {!isLoading && !isError && transactions.length === 0 && <div className="p-6 text-sm text-stone-400">কোনো লেনদেন পাওয়া যায়নি।</div>}
            </div>
          </div>

          {/* PAYOUTS RECEIVED */}
          <div className="mt-10">
            <h3 className="text-stone-900 mb-4">
              মুনাফা প্রাপ্তির তালিকা
            </h3>
            <div className="border border-stone-200">
              <div className="divide-y divide-stone-200">
                {!isLoading && !isError && profitTransactions.map((transaction) => (
                  <div key={transaction._id} className="p-5 flex items-center gap-3">
                    <Banknote className="w-4 h-4 text-emerald-700 shrink-0" />
                    <div className="flex-1">
                      <div className="text-sm text-stone-700">
                        {formatCurrency(transaction.amount)} — {transaction.project?.title ?? "অজানা প্রকল্প"}
                      </div>
                      <div className="text-xs text-stone-400 mt-1">
                        {formatDate(transaction.createdAt)} · {paymentMethodLabel(transaction.paymentMethod)}
                      </div>
                    </div>
                    <StatusTag status="সফল" />
                  </div>
                ))}
                {!isLoading && !isError && profitTransactions.length === 0 && <div className="p-6 text-sm text-stone-400">কোনো মুনাফা প্রাপ্তি পাওয়া যায়নি।</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}