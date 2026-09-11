import { Router, raw, urlencoded } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middlewares/auth";
import * as paymentCtrl from "../controllers/payment.controller";

const router = Router();

// --- Authenticated: generate a checkout session for one's own pending transaction ---
router.post("/:transactionId/checkout", requireAuth(), syncClerkUser, paymentCtrl.createCheckoutSession);

// --- SSLCommerz: server-to-server IPN + browser redirect endpoints (public, form-encoded).
// Scoped urlencoded() here (not the global one) since this router is
// mounted before the global body parsers — see app.ts. ---
router.post("/sslcommerz/ipn", urlencoded({ extended: false }), paymentCtrl.handleSslcommerzIpn);
router.post("/sslcommerz/success", urlencoded({ extended: false }), paymentCtrl.sslcommerzSuccessRedirect);
router.post("/sslcommerz/fail", urlencoded({ extended: false }), paymentCtrl.sslcommerzFailRedirect);
router.post("/sslcommerz/cancel", urlencoded({ extended: false }), paymentCtrl.sslcommerzCancelRedirect);

// --- Stripe: webhook (public, needs the raw body for signature verification) ---
router.post("/stripe/webhook", raw({ type: "application/json" }), paymentCtrl.handleStripeWebhook);

export default router;
