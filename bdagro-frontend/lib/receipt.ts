export interface PaymentReceipt {
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
    '"': "&quot;",
  })[character] ?? character);
}

export function downloadReceipt(receipt: PaymentReceipt) {
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
