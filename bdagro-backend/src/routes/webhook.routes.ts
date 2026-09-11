import { Router, raw } from "express";
import { verifyWebhook } from "@clerk/express/webhooks";
import { upsertUser, markUserDeletedInClerk, normalizeFromWebhook } from "../services/user.service";

const router = Router();

/**
 * Clerk webhook receiver. Must use the raw request body (not the globally
 * mounted express.json()) so the Svix signature can be verified — that's
 * why `raw()` is applied here, scoped to just this route, and this router
 * is mounted in app.ts BEFORE the global JSON body parser.
 *
 * Configure this URL (https://your-domain/api/webhooks/clerk) in the
 * Clerk Dashboard -> Webhooks, subscribed to: user.created, user.updated,
 * user.deleted. CLERK_WEBHOOK_SIGNING_SECRET must match the signing
 * secret shown there.
 */
router.post("/clerk", raw({ type: "application/json" }), async (req, res) => {
  let evt;
  try {
    evt = await verifyWebhook(req);
  } catch (err) {
    console.error("[Clerk Webhook] Signature verification failed:", err);
    res.status(400).json({ message: "Webhook verification failed" });
    return;
  }

  try {
    switch (evt.type) {
      case "user.created":
      case "user.updated":
        await upsertUser(normalizeFromWebhook(evt.data));
        break;
      case "user.deleted":
        if (evt.data.id) await markUserDeletedInClerk(evt.data.id);
        break;
      default:
        // Ignore event types we don't care about (sessions, orgs, billing, ...)
        break;
    }
    res.status(200).json({ received: true });
  } catch (err) {
    console.error(`[Clerk Webhook] Failed to process "${evt.type}":`, err);
    // Non-2xx makes Clerk retry the delivery.
    res.status(500).json({ message: "Failed to process webhook" });
  }
});

export default router;
