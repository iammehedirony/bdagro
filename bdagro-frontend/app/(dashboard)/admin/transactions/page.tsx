"use client";

import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import StatusTag from "@/components/ui/StatusTag";
import { useAdminTransactionsQuery } from "@/hooks/queries/useAdminQueries";
import type { AdminTransaction } from "@/lib/services/admin.service";

const payoutTypes = new Set(["profit_distribution", "payout"]);
const currency = new Intl.NumberFormat("bn-BD", { maximumFractionDigits: 0 });

function formatCurrency(value: number) {
  return `৳${currency.format(Math.max(0, value))}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("bn-BD", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

function statusLabel(status: AdminTransaction["status"]) {
  if (status === "success") return "সফল";
  if (status === "failed") return "ব্যর্থ";
  if (status === "cancelled") return "বাতিল";
  return "প্রক্রিয়াধীন";
}

function transactionTitle(transaction: AdminTransaction) {
  const investorName = transaction.investor?.name ?? "অজানা বিনিয়োগকারী";
  const farmerName = transaction.farmer?.name ?? "অজানা কৃষক";
  if (transaction.type === "investment") return `বিনিয়োগ: ${investorName} → ${farmerName} (কৃষক)`;
  if (payoutTypes.has(transaction.type)) return `মুনাফা পরিশোধ: ${farmerName} (কৃষক) → ${investorName}`;
  return `লেনদেন: ${investorName} → ${farmerName} (কৃষক)`;
}

export default function AdminTransactionsPage() {
  const { data, isLoading, isError } = useAdminTransactionsQuery();
  const transactions = data?.transactions ?? [];
  const investmentTransactions = transactions.filter((transaction) => transaction.type === "investment");
  const payoutTransactions = transactions.filter((transaction) => payoutTypes.has(transaction.type));
  const failedTransactions = transactions.filter((transaction) => transaction.status === "failed" || transaction.status === "cancelled");

  return (
    <div className="bg-white min-h-screen flex">


      {/* MAIN */}
      <div className="flex-1 min-w-0">


        <div className="p-8">
          

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="সর্বমোট লেনদেন" value={`${transactions.length.toLocaleString("bn-BD")}টি`} sub="সব ধরনের মিলিয়ে" />
            <StatCard label="সর্বমোট বিনিয়োগ প্রবাহ" value={formatCurrency(investmentTransactions.reduce((sum, transaction) => sum + transaction.amount, 0))} sub="সরাসরি কৃষকদের কাছে" />
            <StatCard label="সর্বমোট মুনাফা পরিশোধ" value={formatCurrency(payoutTransactions.reduce((sum, transaction) => sum + transaction.amount, 0))} sub="সরাসরি বিনিয়োগকারীদের কাছে" />
            <StatCard label="ব্যর্থ লেনদেন" value={`${failedTransactions.length.toLocaleString("bn-BD")}টি`} sub="ব্যর্থ বা বাতিল" />
          </div>

          {/* TRANSACTION LOG */}
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
                const Icon = payoutTypes.has(transaction.type) ? ArrowDownToLine : ArrowUpFromLine;
                return <div key={transaction._id} className="p-5 flex items-center gap-4 flex-wrap">
                  <div className="w-9 h-9 flex items-center justify-center bg-stone-100 text-stone-500 shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-55">
                    <div className="text-sm text-stone-800">
                      {transactionTitle(transaction)}
                    </div>
                    <div className="text-xs text-stone-400 mt-0.5">
                      {transaction.project?.title ?? "অজানা প্রকল্প"} · {formatDate(transaction.createdAt)}
                    </div>
                  </div>
                  <div className="text-sm text-stone-800 shrink-0">{formatCurrency(transaction.amount)}</div>
                  <StatusTag status={statusLabel(transaction.status)} />
                </div>
              })}
              {!isLoading && !isError && transactions.length === 0 && <div className="p-6 text-sm text-stone-400">কোনো লেনদেন পাওয়া যায়নি।</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}