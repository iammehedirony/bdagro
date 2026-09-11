import path from "path";
import express, { Express, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { clerkMiddleware } from "@clerk/express";
import { errorHandler, notFound } from "./middlewares/errorHandler";
import webhookRoutes from "./routes/webhook.routes";
import paymentRoutes from "./routes/payment.routes";
import authRoutes from "./routes/auth.routes";
import farmerRoutes from "./routes/farmer.routes";
import loanProductRoutes from "./routes/loanProduct.routes";
import projectRoutes from "./routes/project.routes";
import investorRoutes from "./routes/investor.routes";
import adminRoutes from "./routes/admin.routes";

const app: Express = express();

// --- Core security/middleware ---
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// --- Clerk session middleware: attaches req.auth on every request
// (does NOT block unauthenticated requests; routes opt into requireAuth()).
// Placed before the webhook/payment mounts below since it only reads
// headers (bearer token/cookies) — never the request body — so it's
// safe even for routes that later need the RAW body (Stripe webhook). ---
app.use(clerkMiddleware());

// --- Clerk webhooks: MUST be mounted before express.json(), because
// signature verification needs the raw request body. The route itself
// applies express.raw() only to this path (see webhook.routes.ts). ---
app.use("/api/webhooks", webhookRoutes);

// --- Payments: mixed router — SSLCommerz IPN/Stripe webhook endpoints
// need raw/form bodies untouched by the global parsers below, while
// POST /:transactionId/checkout needs an authenticated session (works
// here because clerkMiddleware() already ran, above). ---
app.use("/api/payments", paymentRoutes);

// --- Body parsers (everything after this point gets parsed JSON) ---
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

// Serves uploaded NID/land-document scans (dev-only local disk storage —
// see src/middlewares/upload.ts for the production Cloudinary/S3 note).
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// --- Health check ---
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", service: "bdagroonline-backend", time: new Date().toISOString() });
});

// --- Routes ---
app.use("/api/auth", authRoutes);
app.use("/api/farmers", farmerRoutes);
app.use("/api/loan-products", loanProductRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/investors", investorRoutes);
app.use("/api/admin", adminRoutes);

// --- 404 + error handling (must be last) ---
app.use(notFound);
app.use(errorHandler);

export default app;
