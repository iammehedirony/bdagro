import { Request, Response } from "express";
import mongoose from "mongoose";
import { Transaction } from "../models/Transaction";
import { PaymentMethod, TransactionStatus } from "../utils/constants";
import { AppError } from "../middlewares/errorHandler";
import { initSslcommerzSession, validateSslcommerzPayment } from "../services/payment/sslcommerz.service";
import { createStripeCheckoutSession, verifyStripeWebhookSignature } from "../services/payment/stripe.service";
import { markTransactionSuccess, markTransactionFailed } from "../services/payment.service";

/**
 * POST /api/payments/:transactionId/checkout
 * Generates the actual gateway checkout session for a pending Transaction
 * already created by the farmer "pay installment" or investor "invest"
 * endpoints, and returns the URL the frontend should redirect the user to.
 */
export async function createCheckoutSession(req: Request, res: Response): Promise<void> {
  const { transactionId } = req.params;
  if (!mongoose.isValidObjectId(transactionId)) {
    throw new AppError("Invalid transaction id", 400);
  }

  const transaction = await Transaction.findOne({ _id: transactionId, user: req.user!._id });
  if (!transaction) {
    throw new AppError("Transaction not found", 404);
  }
  if (transaction.status !== TransactionStatus.PENDING) {
    throw new AppError(`Cannot checkout a transaction with status ${transaction.status}`, 409);
  }

  if (transaction.paymentMethod === PaymentMethod.SSLCOMMERZ) {
    const { redirectUrl } = await initSslcommerzSession({
      transactionId: transaction._id.toString(),
      amount: transaction.amount,
      customerName: req.user!.name,
      customerEmail: req.user!.email,
      customerPhone: req.user!.phone,
    });
    res.json({ redirectUrl });
    return;
  }

  if (transaction.paymentMethod === PaymentMethod.STRIPE) {
    const { url } = await createStripeCheckoutSession({
      transactionId: transaction._id.toString(),
      amount: transaction.amount,
      description: `Bdagroonline ${transaction.type}`,
      customerEmail: req.user!.email,
    });
    res.json({ redirectUrl: url });
    return;
  }

  throw new AppError("Unsupported payment method", 400);
}

/**
 * POST /api/payments/sslcommerz/ipn
 * SSLCommerz's Instant Payment Notification, posted server-to-server.
 * MUST be re-validated against SSLCommerz's validator API before being
 * trusted — the POST body itself isn't cryptographically signed.
 */
export async function handleSslcommerzIpn(req: Request, res: Response): Promise<void> {
  const { tran_id: tranId, val_id: valId, status } = req.body as {
    tran_id?: string;
    val_id?: string;
    status?: string;
  };

  if (!tranId || !mongoose.isValidObjectId(tranId)) {
    res.status(400).json({ message: "Invalid tran_id" });
    return;
  }

  const transaction = await Transaction.findById(tranId);
  if (!transaction) {
    res.status(404).json({ message: "Transaction not found" });
    return;
  }

  if (status === "VALID" && valId) {
    const isValid = await validateSslcommerzPayment(valId);
    if (isValid) {
      await markTransactionSuccess(transaction, valId);
      res.status(200).json({ received: true });
      return;
    }
  }

  await markTransactionFailed(transaction);
  res.status(200).json({ received: true });
}

/**
 * Browser-redirect endpoints SSLCommerz POSTs the customer back to after
 * checkout. These don't confirm payment by themselves — the IPN above is
 * the source of truth — they just bounce the user back to the frontend
 * with a status hint for the UI to show.
 */
export function sslcommerzSuccessRedirect(req: Request, res: Response): void {
  const tranId = (req.body as { tran_id?: string }).tran_id;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/payments/result?status=success&transactionId=${tranId ?? ""}`);
}

export function sslcommerzFailRedirect(req: Request, res: Response): void {
  const tranId = (req.body as { tran_id?: string }).tran_id;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/payments/result?status=failed&transactionId=${tranId ?? ""}`);
}

export function sslcommerzCancelRedirect(req: Request, res: Response): void {
  const tranId = (req.body as { tran_id?: string }).tran_id;
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";
  res.redirect(`${clientUrl}/payments/result?status=cancelled&transactionId=${tranId ?? ""}`);
}

/**
 * POST /api/payments/stripe/webhook
 * Requires the raw request body for signature verification — mounted
 * before the global JSON parser in app.ts, same pattern as the Clerk
 * webhook.
 */
export async function handleStripeWebhook(req: Request, res: Response): Promise<void> {
  const signature = req.headers["stripe-signature"];
  if (!signature || Array.isArray(signature)) {
    res.status(400).json({ message: "Missing Stripe signature" });
    return;
  }

  let event;
  try {
    event = verifyStripeWebhookSignature(req.body as Buffer, signature);
  } catch (err) {
    console.error("[Stripe Webhook] Signature verification failed:", err);
    res.status(400).json({ message: "Webhook verification failed" });
    return;
  }

  if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
    const session = event.data.object as { client_reference_id?: string | null; payment_intent?: string | null };
    const transactionId = session.client_reference_id;
    if (transactionId && mongoose.isValidObjectId(transactionId)) {
      const transaction = await Transaction.findById(transactionId);
      if (transaction) {
        await markTransactionSuccess(
          transaction,
          typeof session.payment_intent === "string" ? session.payment_intent : undefined
        );
      }
    }
  }

  if (event.type === "checkout.session.async_payment_failed" || event.type === "checkout.session.expired") {
    const session = event.data.object as { client_reference_id?: string | null };
    const transactionId = session.client_reference_id;
    if (transactionId && mongoose.isValidObjectId(transactionId)) {
      const transaction = await Transaction.findById(transactionId);
      if (transaction) {
        await markTransactionFailed(transaction);
      }
    }
  }

  res.status(200).json({ received: true });
}
