/**
 * SSLCommerz REST API integration. Docs: https://developer.sslcommerz.com
 *
 * Two calls matter here:
 * 1. Session init (`/gwprocess/v4/api.php`) — server-to-server, returns a
 *    `GatewayPageURL` the frontend redirects the customer to.
 * 2. Validation (`/validator/api/validationserverAPI.php`) — SSLCommerz
 *    recommends re-validating every IPN server-to-server before trusting
 *    it, since the IPN POST body itself isn't cryptographically signed.
 */

const SSLCOMMERZ_BASE_URL =
  process.env.SSLCOMMERZ_IS_LIVE === "true"
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";

interface InitSessionParams {
  transactionId: string;
  amount: number;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
}

interface InitSessionResult {
  redirectUrl: string;
  sessionKey: string;
}

function getCredentials(): { storeId: string; storePassword: string } {
  const storeId = process.env.SSLCOMMERZ_STORE_ID;
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
  if (!storeId || !storePassword) {
    throw new Error("SSLCommerz store credentials are not configured (SSLCOMMERZ_STORE_ID / SSLCOMMERZ_STORE_PASSWORD)");
  }
  return { storeId, storePassword };
}

export async function initSslcommerzSession(params: InitSessionParams): Promise<InitSessionResult> {
  const { storeId, storePassword } = getCredentials();
  const serverUrl = process.env.SERVER_URL || "http://localhost:5000";

  const body = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: params.amount.toString(),
    currency: "BDT",
    tran_id: params.transactionId,
    success_url: `${serverUrl}/api/payments/sslcommerz/success`,
    fail_url: `${serverUrl}/api/payments/sslcommerz/fail`,
    cancel_url: `${serverUrl}/api/payments/sslcommerz/cancel`,
    ipn_url: `${serverUrl}/api/payments/sslcommerz/ipn`,
    cus_name: params.customerName,
    cus_email: params.customerEmail || "no-reply@bdagroonline.com",
    cus_phone: params.customerPhone || "01700000000",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_country: "Bangladesh",
    shipping_method: "NO",
    product_name: "Bdagroonline Payment",
    product_category: "Agri-Finance",
    product_profile: "general",
  });

  const response = await fetch(`${SSLCOMMERZ_BASE_URL}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: body.toString(),
  });

  const data = (await response.json()) as {
    status?: string;
    GatewayPageURL?: string;
    sessionkey?: string;
    failedreason?: string;
  };

  if (data.status !== "SUCCESS" || !data.GatewayPageURL) {
    throw new Error(`SSLCommerz session init failed: ${data.failedreason || "unknown error"}`);
  }

  return { redirectUrl: data.GatewayPageURL, sessionKey: data.sessionkey || "" };
}

export async function validateSslcommerzPayment(valId: string): Promise<boolean> {
  const { storeId, storePassword } = getCredentials();

  const url = new URL(`${SSLCOMMERZ_BASE_URL}/validator/api/validationserverAPI.php`);
  url.searchParams.set("val_id", valId);
  url.searchParams.set("store_id", storeId);
  url.searchParams.set("store_passwd", storePassword);
  url.searchParams.set("format", "json");

  const response = await fetch(url.toString());
  const data = (await response.json()) as { status?: string };

  return data.status === "VALID" || data.status === "VALIDATED";
}
