# Bdagroonline (Bao.com) — Backend

Agri-FinTech platform connecting **Farmers** (loan seekers) with **Investors**,
managed by an **Admin**. This repo covers the backend only (Node.js, Express,
TypeScript, MongoDB/Mongoose), per the PRD.

## Stack

| Layer | Tech |
|---|---|
| Runtime / API | Node.js, Express.js, **TypeScript** |
| Database | MongoDB via Mongoose (typed models) |
| Auth | Clerk (phone+OTP for farmers, email/social for investors) |
| Payments | SSLCommerz / Stripe |
| Real-time | Socket.io |
| Cache / Queue | Redis, BullMQ |
| Validation | Zod (at the route layer, on top of Mongoose schema validation) |

## Setup

```bash
cp .env.example .env      # fill in real values
npm install
npm run dev                # tsx watch, requires local MongoDB + Redis running
npm run build               # compiles TypeScript -> dist/
npm start                   # runs the compiled build (production)
npm run typecheck           # tsc --noEmit, CI-friendly type check
```

## Project structure

```
src/
  config/         # db.ts (Mongoose connection), future: redis.ts, clerk.ts
  models/         # Mongoose schemas + TS interfaces (see ER overview below)
  routes/         # Express routers (to be built next)
  controllers/    # Route handlers (to be built next)
  middlewares/    # rbac.ts, errorHandler.ts, (auth.ts to be added w/ Clerk)
  jobs/           # BullMQ queue/worker definitions (installments, notifications)
  utils/          # constants.ts (shared enums), seed.ts
  types/          # express.d.ts (augments Request with typed req.user)
server.ts          # entry point: connects DB, starts HTTP + Socket.io server
tsconfig.json      # strict mode on; "@/*" path alias -> "src/*"
```

## Data model overview

```
User (role: farmer | investor | admin, status: active | suspended | blocked)
 ├── 1:1 FarmerProfile   (NID, land document, verificationStatus)
 ├── 1:1 InvestorProfile (totalInvested, totalReturned, preferences)
 │
 ├── (as farmer) 1:N LoanApplication --(on Approved)--> 1:1 Project
 │                                                          │
 │                                                          └── 1:N Investment <── (as investor) User
 │
 ├── 1:N Installment (repayment schedule, linked to a LoanApplication)
 ├── 1:N Transaction (unified payment ledger: disbursement, repayment, investment, refund)
 └── 1:N Notification

LoanProduct  — catalog (Seed Purchase, Tractor Purchase, Livestock Farming, ...)
               referenced by LoanApplication
```

**Lifecycle in one line:** Farmer applies (`LoanApplication`, status
`Pending → Processing → Approved/Rejected`, pushed live via Socket.io) →
Admin approves → Admin/system opens a `Project` on the marketplace →
Investors fund it (`Investment`, partial or full) → funds disburse
(`Transaction`) → farmer repays via `Installment`s → returns flow back
to investors (ROI fields on `Investment`).

Every money movement — disbursement, repayment, investment, refund —
goes through the single `Transaction` collection, which is what powers
the Admin's transaction monitoring screen and the Investor's receipt
generation.

## RBAC

`User.role` is the source of truth. `src/middlewares/rbac.ts` exports
`requireRole(...roles: UserRole[])`, meant to be chained after an auth
middleware (added in the next step) that resolves the Clerk session
into a Mongoose `req.user` (typed via `src/types/express.d.ts`).

## Dependency versions

Every dependency is pinned to its latest major version as of this
writing (checked directly against the npm registry, not from memory).
Several of these are recent major releases with real breaking changes
that required code changes here — worth knowing if you add more code
around them:

| Package | Version | What changed here |
|---|---|---|
| **TypeScript** | 7.0.2 | Native Go compiler (`tsgo`), 8–12x faster `tsc`. Its programmatic compiler API isn't stable yet (expected in 7.1), which **breaks `ts-node`/`ts-node-dev`** — so `npm run dev` now uses **`tsx`** instead (esbuild-based, doesn't depend on TypeScript's internal API). `tsc` itself (typecheck/build) is unaffected. Also required removing `baseUrl`/`paths` from `tsconfig.json` (removed in TS7) and setting `moduleResolution`/`module` to `"node16"` (the old `"node"` value was removed). |
| **Express** | 5.2.1 | `req.query` is now a getter-only property — `src/middlewares/validate.ts` shadows it with `Object.defineProperty` instead of a plain assignment for query validation. Rejected promises in async handlers are now **forwarded to error middleware automatically**, so the `express-async-errors` package was removed entirely. |
| **Zod** | 4.6.1 | `ZodError.errors` → `.issues` (updated in `validate.ts` and `auth.controller.ts`). `z.nativeEnum()` deprecated in favor of `z.enum()` accepting a TS enum directly — all validators updated. |
| **Mongoose** | 9.9.5 | Stricter TS typing on `.create()`/queries surfaced one real bug: a validator used a raw string-literal union instead of the `PaymentMethod` enum, which Mongoose 8 silently accepted — fixed in `farmer.validator.ts`. |
| **BullMQ** | 6.3.4 | `Queue.add(..., { repeat })` was removed in favor of Job Schedulers — `src/jobs/installment.queue.ts` now uses `queue.upsertJobScheduler(...)`. |
| **Helmet** | 8.3.0 | No code changes needed (Node 18+ requirement only; we already require Node 20+). |
| **ioredis** | 6.0.0 | No code changes needed for our usage. |
| **@clerk/express, stripe, multer, socket.io, cors, morgan, dotenv, express-rate-limit** | latest | No breaking changes affecting this codebase. |

If you pull this repo down later and packages have moved on again, `npm outdated` plus each package's own migration guide is the reliable way to check — don't assume versions from memory (that's exactly the mistake this table is here to correct).



**Packages:** `@clerk/express` (session middleware, `requireAuth`, `getAuth`,
`clerkClient`) + `@clerk/express/webhooks` (`verifyWebhook`, Svix-based).

**Flow:**
1. Frontend handles actual sign-up/sign-in UI via Clerk (phone+OTP for
   farmers, email/social for investors, per the PRD). On the Farmer vs
   Investor sign-up form, the frontend should set
   `unsafeMetadata: { role: "farmer" }` (or `"investor"`) at sign-up time.
2. Clerk fires a `user.created` webhook → `POST /api/webhooks/clerk` →
   `src/routes/webhook.routes.ts` verifies the Svix signature and upserts
   a local `User` document (`src/services/user.service.ts`), reading the
   role from that metadata.
3. If the webhook hasn't landed yet (local dev without a tunnel, or a
   race right after sign-up), `src/middlewares/auth.ts`'s `syncClerkUser`
   self-heals: it fetches the user from Clerk directly and upserts.
4. If no role can be resolved at all (e.g. metadata wasn't set at
   sign-up), the client calls `POST /api/auth/select-role` once
   (`{ "role": "farmer" | "investor" }`) to create the local account.
5. **Admin accounts are never self-service.** `select-role` only accepts
   `farmer`/`investor`. Admins are provisioned by setting
   `publicMetadata.role = "admin"` on a Clerk user directly (via
   `clerkClient`, a seed script, or the Clerk Dashboard) — `publicMetadata`
   can only be written from the backend, so it's the only metadata field
   trusted for the admin role.

**Protecting a route**, once controllers exist for it:
```ts
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middlewares/auth";
import { requireRole } from "../middlewares/rbac";
import { UserRole } from "../utils/constants";

router.get(
  "/admin/stats",
  requireAuth(),      // 401 if no valid Clerk session
  syncClerkUser,       // resolves + attaches typed req.user, 403 if suspended/blocked
  requireRole(UserRole.ADMIN), // 403 if wrong role
  adminController.getStats
);
```

**Local development webhook tunnel:** Clerk needs a public URL to POST
to. Use the Clerk CLI (`clerk listen`) or `ngrok http 5000`, then set that
URL + `/api/webhooks/clerk` as the endpoint in the Clerk Dashboard →
Webhooks, subscribed to `user.created`, `user.updated`, `user.deleted`.
Copy the signing secret into `CLERK_WEBHOOK_SIGNING_SECRET`.

## Farmer routes — fully wired

All under `/api/farmers`, protected by `requireAuth() + syncClerkUser +
requireRole(UserRole.FARMER)` (see `src/routes/farmer.routes.ts`).

| Method & path | Purpose |
|---|---|
| `GET /profile/me` | Own farmer profile + verification status |
| `PUT /profile` | Submit/resubmit NID documents (multipart: `nidFront`, `nidBack` files + text fields). Locked once Admin approves it. |
| `POST /loan-applications` | Apply for a loan against a `LoanProduct` (requires an Approved profile) |
| `GET /loan-applications` | List own applications, `?status=&page=&limit=` |
| `GET /loan-applications/:id` | One application's detail |
| `GET /installments` | Own repayment schedule, `?status=&page=&limit=` |
| `POST /installments/:id/pay` | Opens a repayment — creates a pending `Transaction`; actual gateway checkout is roadmap item #5 |

Also added: `GET /api/loan-products` (`?category=&page=&limit=`) — the
"লোন এক্সপ্লোরার" catalog browse, open to any authenticated role.

**File uploads:** `src/middlewares/upload.ts` uses multer memory storage and
streams validated NID and loan documents to Cloudinary. Set
`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in
the backend environment. Controllers persist the returned HTTPS
`secure_url`; files are no longer served from local `/uploads` paths.

**Validation:** `src/middlewares/validate.ts` is a reusable Zod
middleware — `validate(schema)` parses/coerces `req.body` and 400s with a
readable message on failure. Used across the farmer routes; reuse it for
Investor/Admin routes too.

## Investor & marketplace routes — fully wired

**`/api/projects`** (shared browse, any authenticated role):

| Method & path | Purpose |
|---|---|
| `GET /` | Marketplace list, `?cropType=&riskLevel=&minROI=&maxROI=&page=&limit=` — only OPEN/PARTIALLY_FUNDED projects |
| `GET /:id` | One project's detail (farmer info populated) |

**`/api/investors`**, protected by `requireAuth() + syncClerkUser +
requireRole(UserRole.INVESTOR)`:

| Method & path | Purpose |
|---|---|
| `POST /investments` | Fund a project — partial (≤ remaining) or full (exact remaining amount). Creates pending `Transaction` + `Investment`. |
| `GET /investments` | Own investments, `?status=&page=&limit=` |
| `GET /investments/:id` | One investment's detail |
| `GET /portfolio` | Total invested, total returned, distinct active projects — computed live via aggregation over completed `Investment`s, plus the 5 most recent investments |
| `GET /transactions` | Own transaction history, `?type=&status=&page=&limit=` |
| `GET /transactions/:id/receipt` | Structured "money receipt" JSON for a SUCCESS transaction (PDF export is a natural next step once needed) |

**Funding confirmation is intentionally not automatic.**
`src/services/investment.service.ts#confirmInvestment` — which marks an
`Investment` COMPLETED, bumps the `Project.fundedAmount`/status, and
updates `InvestorProfile` totals — exists but is only ever meant to be
called from a **verified payment gateway webhook** (roadmap item #5).
Calling it from client input would let someone claim a funded project
without paying.

## Admin routes — fully wired

All under `/api/admin`, protected by `requireAuth() + syncClerkUser +
requireRole(UserRole.ADMIN)` (see `src/routes/admin.routes.ts`).

| Method & path | Purpose |
|---|---|
| `GET /dashboard` | Platform-wide totals: users by role, pending queues, total loan disbursed, total invested |
| `GET /verifications` | Pending-Verifications queue (defaults to `status=pending`), `?status=&page=&limit=` |
| `GET /verifications/:id` | One farmer profile's detail |
| `POST /verifications/:id/approve` | Approve NID/land documents — notifies the farmer live |
| `POST /verifications/:id/reject` | Reject with `{ rejectionReason }` — notifies the farmer live |
| `GET /loan-applications` | All applications, `?status=&page=&limit=` |
| `GET /loan-applications/:id` | One application's detail |
| `POST /loan-applications/:id/process` | Pending → Processing |
| `POST /loan-applications/:id/approve` | Approves **and creates the marketplace `Project`** in the same step — this is the only place Projects get created. Body: `{ riskLevel, expectedROIPercent, fundingGoal?, cropType?, fundingDeadline? }` |
| `POST /loan-applications/:id/reject` | Reject with `{ rejectionReason }` |
| `GET /users` | All users, `?role=&status=&search=&page=&limit=` |
| `GET /users/:id` | One user's detail |
| `PATCH /users/:id/status` | Suspend/block/reactivate `{ status, reason? }` (can't target yourself) |
| `PATCH /users/:id/role` | Assign a new role, including promoting to `admin` `{ role }` — also syncs Clerk's `publicMetadata` |
| `GET /transactions` | Every transaction on the platform, `?type=&status=&userId=&page=&limit=` |
| `POST /notifications` | Broadcast a notification to `{ userIds? , role?, title, message, type? }` |

**Real-time is actually wired now, not just a TODO:** approving/rejecting
a verification or loan application, changing a user's status/role, and
admin broadcasts all call `src/services/notification.service.ts#notifyUser`,
which persists a `Notification` and emits `notification:new` over the
Socket.io room the frontend joins (`user:<id>`, set up in `server.ts`).
Loan status changes also emit a dedicated `loan:status_updated` event.

This closes the core platform loop: **Farmer submits docs → Admin
approves → Farmer applies for a loan → Admin approves (creates Project)
→ Investor sees it on the marketplace and funds it.** The only thing
missing from making that loop fully live end-to-end is real payment
gateway confirmation (next item).

## Payment integration — SSLCommerz + Stripe, fully wired

**`/api/payments`** — a mixed router (some routes public/webhook, one
authenticated), mounted **before** the global JSON body parser in
`app.ts` since the Stripe webhook needs the raw body for signature
verification (`clerkMiddleware()` is intentionally placed even earlier,
since it only reads headers and never touches the body — see the
comments in `app.ts`).

| Method & path | Purpose |
|---|---|
| `POST /:transactionId/checkout` | Auth required. Generates the actual SSLCommerz session or Stripe Checkout Session for a `Transaction` already created by the farmer `pay` or investor `investments` endpoints, and returns `{ redirectUrl }` |
| `POST /sslcommerz/ipn` | SSLCommerz's server-to-server payment notification — re-validated against SSLCommerz's validator API before being trusted |
| `POST /sslcommerz/success` `/fail` `/cancel` | Browser-redirect endpoints SSLCommerz POSTs the customer back to; just bounce to the frontend with a status hint (the IPN above is the actual source of truth) |
| `POST /stripe/webhook` | Stripe webhook, Svix-style signature-verified via the raw body; handles `checkout.session.completed`/`async_payment_succeeded`/`async_payment_failed`/`expired` |

Both webhook paths funnel into `src/services/payment.service.ts`
(`markTransactionSuccess` / `markTransactionFailed`) — one idempotent
place that applies the actual effect of a payment: for an `INVESTMENT`
transaction it calls `confirmInvestment()` (bumping the project's funded
amount); for a `LOAN_REPAYMENT` it marks the `Installment` `PAID`.

**Gateway code lives in `src/services/payment/`** — `sslcommerz.service.ts`
and `stripe.service.ts` — kept separate from the controller so the
gateway-specific HTTP/SDK details don't leak into request handling.
Stripe Checkout settles in USD by default (Stripe doesn't support BDT
directly); adjust the `currency` in `stripe.service.ts` to your actual
settlement currency before going live.

## Loan disbursement + installment generation

**`POST /api/admin/projects/:id/disburse`** (and `GET /api/admin/projects`
to find FULLY_FUNDED ones) — `src/services/loan.service.ts#disburseLoan`:
1. Records a SUCCESS `Transaction` (`LOAN_DISBURSEMENT`) for the farmer.
2. Generates the `Installment` schedule: flat simple interest (the loan
   product's annual rate, prorated by the application's chosen duration
   in months), split evenly across the months with any rounding
   remainder rolled into the final installment.
3. Closes the `Project` (`status: closed`).

## Background jobs (BullMQ + Redis)

`src/jobs/` — a repeatable daily job (`0 6 * * *`, scheduled idempotently
via a fixed `jobId`) that:
- Flips any `Installment` past its `dueDate` from `DUE` → `OVERDUE` and
  notifies the farmer.
- Sends a "due soon" reminder for installments due within the next 3
  days (see the in-code note about adding a `lastReminderAt` field to
  dedupe repeat reminders as a production hardening step).

Started from `server.ts` via `startBackgroundJobs()` — **non-blocking**:
if Redis isn't running locally, the API still serves requests fine, only
the scheduled checks log an error instead of running.

**Real-time notifications now work from anywhere, not just requests:**
`src/realtime/io.ts` holds the live Socket.io server in a small
singleton (`setIo()`/`getIo()`), set once in `server.ts`. This lets
`notifyUser()` (`src/services/notification.service.ts`) push
`notification:new` events from both HTTP request handlers *and* the
BullMQ worker, which has no `req.app` to reach into.

## Not yet built (optional polish, not required for a working backend)

The core backend roadmap is complete: auth, all three roles' routes, the
full Farmer→Admin→Investor loop, payments, disbursement, and background
jobs are all wired and type-checked. Remaining items are refinements,
not missing pieces:

- **Rate limiting** — `express-rate-limit` is already a dependency but
  not yet applied to any route (worth adding to `/api/auth`,
  `/api/payments/:id/checkout`, and the webhook endpoints).
- **Automated tests** — no test suite exists yet.
- **Reminder deduping** — see the note in `installment.worker.ts`.
- **PDF receipts** — `GET /api/investors/transactions/:id/receipt`
  currently returns structured JSON; rendering that as a downloadable
  PDF is a natural frontend/export-layer addition.
- **Seed script** — `npm run seed` is wired in `package.json` but
  `src/utils/seed.ts` doesn't exist yet; useful for local dev to
  populate sample `LoanProduct`s without going through the Admin UI.
