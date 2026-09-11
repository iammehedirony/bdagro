import Stripe from "stripe";

let stripeClient: Stripe | null = null;

function getStripeClient(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

interface CreateCheckoutParams {
  transactionId: string;
  amount: number;
  description: string;
  customerEmail?: string;
}

/**
 * Stripe Checkout doesn't support BDT — settle in USD (or your actual
 * merchant currency) and convert `amount` upstream if it's collected in
 * BDT. Adjust `currency` here to match your Stripe account's settlement
 * currency before going live.
 */
export async function createStripeCheckoutSession(
  params: CreateCheckoutParams
): Promise<{ sessionId: string; url: string }> {
  const stripe = getStripeClient();
  const clientUrl = process.env.CLIENT_URL || "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: { name: params.description },
          unit_amount: Math.round(params.amount * 100),
        },
        quantity: 1,
      },
    ],
    client_reference_id: params.transactionId,
    customer_email: params.customerEmail,
    success_url: `${clientUrl}/payments/result?status=success&transactionId=${params.transactionId}`,
    cancel_url: `${clientUrl}/payments/result?status=cancelled&transactionId=${params.transactionId}`,
  });

  return { sessionId: session.id, url: session.url || "" };
}

export function verifyStripeWebhookSignature(rawBody: Buffer, signature: string): Stripe.Event {
  const stripe = getStripeClient();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured");
  }
  return stripe.webhooks.constructEvent(rawBody, signature, secret);
}
