"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { Sprout, CheckCircle2, Download, ArrowRight } from "lucide-react";
import { useApi } from "@/lib/useApi";

interface PaymentReceipt {
  receiptNumber: string;
  issuedAt: string;
  amount: number;
  paymentMethod: "sslcommerz" | "stripe";
  gatewayTransactionId: string | null;
  relatedInvestment?: { project?: { title?: string } } | null;
}

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("bn-BD", { dateStyle: "long", timeStyle: "short" });
}

function paymentMethodLabel(method: PaymentReceipt["paymentMethod"]) {
  return method === "stripe" ? "Stripe" : "SSLCommerz";
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    "\"": "&quot;",
  })[character] ?? character);
}

function downloadReceipt(receipt: PaymentReceipt) {
  const projectName = receipt.relatedInvestment?.project?.title ?? "Bdagroonline Project";
  const method = paymentMethodLabel(receipt.paymentMethod);
  const html = `<!doctype html><html lang="bn"><head><meta charset="utf-8"><title>Bdagroonline Receipt</title><style>body{font-family:Arial,sans-serif;color:#292524;max-width:680px;margin:48px auto;padding:0 24px}h1{color:#065f46}table{width:100%;border-collapse:collapse;margin-top:28px}td{padding:12px 0;border-bottom:1px solid #e7e5e4}td:last-child{text-align:right;font-weight:600}</style></head><body><h1>Bdagroonline</h1><h2>Payment Receipt</h2><table><tr><td>Project</td><td>${escapeHtml(projectName)}</td></tr><tr><td>Investment amount</td><td>${escapeHtml(formatCurrency(receipt.amount))}</td></tr><tr><td>Payment method</td><td>${escapeHtml(method)}</td></tr><tr><td>Transaction ID</td><td>${escapeHtml(receipt.receiptNumber)}</td></tr><tr><td>Gateway reference</td><td>${escapeHtml(receipt.gatewayTransactionId ?? "-")}</td></tr><tr><td>Date and time</td><td>${escapeHtml(formatDate(receipt.issuedAt))}</td></tr></table></body></html>`;
  const url = URL.createObjectURL(new Blob([html], { type: "text/html;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `bdagro-receipt-${receipt.receiptNumber}.html`;
  link.click();
  URL.revokeObjectURL(url);
}

export default function PaymentSuccessPage() {
  const api = useApi();
  const transactionId = useSearchParams().get("transactionId");
  const receiptQuery = useQuery({
    queryKey: ["payment-receipt", transactionId],
    queryFn: async () => {
      const response = await api.get<{ receipt: PaymentReceipt }>(`/investors/transactions/${transactionId}/receipt`);
      return response.data.receipt;
    },
    enabled: Boolean(transactionId),
    retry: 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 4000),
  });
  const receipt = receiptQuery.data;

  return (
    <div className="bg-white min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md py-16">
        <div className="flex items-center justify-center gap-2 mb-10"><Sprout className="w-5 h-5 text-emerald-800" /><span className="text-stone-900 text-lg">Bdagroonline</span></div>
        <div className="border border-stone-200">
          <div className="p-8 text-center border-b border-stone-200"><div className="w-14 h-14 bg-emerald-50 border border-emerald-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle2 className="w-7 h-7 text-emerald-700" /></div><h1 className="mt-5 text-2xl text-stone-900">পেমেন্ট সফল হয়েছে</h1><p className="mt-2 text-sm text-stone-500">আপনার বিনিয়োগ সফলভাবে সম্পন্ন হয়েছে। কৃষককে জানানো হয়েছে।</p></div>
          {!transactionId && <div className="p-6 text-sm text-red-600">লেনদেনের তথ্য পাওয়া যায়নি।</div>}
          {transactionId && receiptQuery.isLoading && <div className="p-6 text-sm text-stone-500">রসিদের তথ্য লোড হচ্ছে...</div>}
          {transactionId && receiptQuery.isError && <div className="p-6 text-sm text-red-600">রসিদের তথ্য এখনো প্রস্তুত নয়। কিছুক্ষণ পর আবার চেষ্টা করুন।</div>}
          {receipt && <div className="p-6 space-y-3"><div className="flex items-center justify-between text-sm"><span className="text-stone-400">প্রকল্প</span><span className="text-stone-800">{receipt.relatedInvestment?.project?.title ?? "-"}</span></div><div className="flex items-center justify-between text-sm"><span className="text-stone-400">বিনিয়োগের পরিমাণ</span><span className="text-stone-800">{formatCurrency(receipt.amount)}</span></div><div className="flex items-center justify-between text-sm"><span className="text-stone-400">পেমেন্ট পদ্ধতি</span><span className="text-stone-800">{paymentMethodLabel(receipt.paymentMethod)}</span></div><div className="flex items-center justify-between text-sm"><span className="text-stone-400">ট্রানজেকশন আইডি</span><span className="text-stone-800 break-all text-right ml-4">{receipt.receiptNumber}</span></div><div className="flex items-center justify-between text-sm"><span className="text-stone-400">তারিখ ও সময়</span><span className="text-stone-800 text-right ml-4">{formatDate(receipt.issuedAt)}</span></div></div>}
          <div className="p-6 pt-0 flex flex-col gap-3"><button type="button" className="w-full bg-emerald-900 text-white py-3 text-sm hover:bg-emerald-800 flex items-center justify-center gap-2">ড্যাশবোর্ডে যান <ArrowRight className="w-4 h-4" /></button><button type="button" disabled={!receipt} onClick={() => receipt && downloadReceipt(receipt)} className="w-full border border-stone-300 text-stone-700 py-3 text-sm hover:border-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"><Download className="w-4 h-4" /> রসিদ ডাউনলোড করুন</button></div>
        </div>
      </div>
    </div>
  );
}
