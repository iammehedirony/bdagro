# Bdagroonline (Bao.com) — Agricultural Investment & Crowd-Funding Platform

**Bdagroonline** is a full-stack Agri-FinTech platform that connects **Farmers** seeking capital with **Investors** looking to fund agricultural projects. The platform facilitates loan applications, project marketplace listings, secure transactions, and real-time notifications — all managed through role-based access for Farmers, Investors, and Admins.

---

## 🛠 Tech Stack

### Backend

| Layer          | Technology                                                        |
| -------------- | ----------------------------------------------------------------- |
| Runtime / API  | Node.js, Express.js, **TypeScript**                               |
| Database       | MongoDB via Mongoose (typed models)                               |
| Authentication | Clerk (Phone+OTP for Farmers, Email/Social for Investors)         |
| Payments       | SSLCommerz, Stripe                                                |
| Real-time      | Socket.io                                                         |
| Cache / Queue  | Redis, BullMQ                                                     |
| Validation     | Zod (route-level validation on top of Mongoose schema validation) |
| File Storage   | Cloudinary                                                        |

### Frontend

| Layer            | Technology                      |
| ---------------- | ------------------------------- |
| Framework        | **Next.js 16** (App Router)     |
| UI Library       | **React 19**                    |
| Styling          | **Tailwind CSS 4**              |
| Language         | **TypeScript**                  |
| Authentication   | **Clerk Next.js SDK**           |
| State Management | TanStack Query (React Query)    |
| Real-time        | Socket.io Client                |
| Forms            | React Hook Form + Zod Resolvers |
| Animations       | Motion (Framer Motion)          |

---

## ✨ Key Features

### 🔔 Real-Time Notification System

- Socket.io + Redis powered live notifications
- Events for loan status updates, verification decisions, admin broadcasts, profit distribution reminders
- Frontend joins user-specific rooms (`user:<id>`) for instant updates

### 👨‍🌾 Farmer Dashboard & Loan Management

- Submit and track loan applications against predefined **Loan Products** (Seed Purchase, Tractor, Livestock, etc.)
- Profile verification workflow (NID + Land Documents) with Admin approval
- Real-time status tracking: `Pending → Processing → Approved/Rejected`
- Project dashboard showing active projects, funding percentage, and ROI

### 💰 Investment Marketplace

- Browse open/partially-funded projects with filters (crop type, risk level, min/max ROI)
- Secure investment flow: partial or full funding with transaction creation
- Portfolio tracking: total invested, total returned, active projects count
- Money receipt generation for completed transactions

### 🔐 Role-Based Access Control (RBAC)

| Role         | Capabilities                                                                                                                                            |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Admin**    | Platform dashboard, user management, verification queue, loan application processing, project creation, transaction monitoring, broadcast notifications |
| **Farmer**   | Profile submission, loan applications, project tracking, profit distribution schedule & payments                                                        |
| **Investor** | Marketplace browsing, investments, portfolio analytics, transaction history & receipts                                                                  |

### 💳 Payment Integration

- **SSLCommerz** (local BD gateway) — IPN validation, success/fail/cancel callbacks
- **Stripe** — Checkout Sessions, webhook verification
- Unified `Transaction` ledger for all money movements (disbursement, investment, profit distribution, refund)

### ⚙️ Background Jobs (BullMQ + Redis)

- Daily cron job (`0 6 * * *`) to:
    - Flip overdue profit distributions (`PENDING → OVERDUE`) + notify farmers
    - Send "due soon" reminders (3-day window)

---

## 📁 Project Structure

```
Bdagro/
├── bdagro-backend/                 # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/                 # DB connection, Redis, Clerk config
│   │   ├── controllers/            # Route handlers (auth, farmer, investor, admin, payment, notification)
│   │   ├── middlewares/            # Auth sync, RBAC, validation, upload, error handling
│   │   ├── models/                 # Mongoose schemas + TS interfaces
│   │   ├── routes/                 # Express routers per domain
│   │   ├── services/               # Business logic (user, loan, investment, payment, notification)
│   │   ├── jobs/                   # BullMQ queue/worker definitions
│   │   ├── utils/                  # Constants, pagination, seed script
│   │   ├── types/                  # Express request augmentation
│   │   └── validators/             # Zod schemas per domain
│   ├── uploads/                    # Local upload temp (gitignored)
│   ├── server.ts                   # Entry point: HTTP + Socket.io server
│   ├── tsconfig.json
│   ├── package.json
│   └── .env.example
│
├── bdagro-frontend/                # Next.js 16 + React 19 + Tailwind 4
│   ├── app/                        # App Router pages & layouts
│   │   ├── (auth)/                 # Clerk auth routes (sign-in, sign-up)
│   │   ├── (dashboard)/            # Protected dashboard layouts per role
│   │   │   ├── admin/              # Admin pages
│   │   │   ├── farmer/             # Farmer pages
│   │   │   └── investor/           # Investor pages
│   │   └── api/                    # Next.js API routes (proxy to backend)
│   ├── components/
│   │   ├── ui/                     # Reusable UI primitives
│   │   ├── project/                # Project marketplace components
│   │   ├── loan/                   # Loan application components
│   │   └── payment/                # Payment flow components
│   ├── hooks/
│   │   ├── queries/                # TanStack Query hooks per domain
│   │   └── mutations/              # Mutation hooks per domain
│   ├── context/                    # React context (Socket.io provider)
│   ├── lib/                        # Utilities (axios instance, helpers)
│   ├── types/                      # Shared TypeScript types
│   ├── constants/                  # Navigation, auth config
│   ├── actions/                    # Server actions
│   ├── public/                     # Static assets
│   ├── tsconfig.json
│   ├── package.json
│   └── .env
│
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 20.0.0
- **MongoDB** (local or Atlas)
- **Redis** (local or cloud — required for Socket.io scaling & BullMQ)
- **Clerk Account** — for authentication
- **Cloudinary Account** — for file uploads
- **SSLCommerz / Stripe Accounts** — for payments (optional for dev)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/Bdagro.git
cd Bdagro
```

---

### 2. Backend Setup

```bash
cd bdagro-backend

# Install dependencies
npm install

# Copy environment template and fill in values
cp .env.example .env
# Edit .env with your credentials (see Environment Variables below)

# Run in development mode (with hot reload via tsx)
npm run dev

# Backend runs on http://localhost:5000 (or PORT from .env)
```

#### Backend Scripts

| Command             | Description                                  |
| ------------------- | -------------------------------------------- |
| `npm run dev`       | Start dev server with `tsx watch`            |
| `npm run build`     | Compile TypeScript → `dist/`                 |
| `npm start`         | Run compiled production build                |
| `npm run typecheck` | Type-check without emitting (`tsc --noEmit`) |
| `npm run seed`      | Seed database with sample LoanProducts       |

---

### 3. Frontend Setup

```bash
cd ../bdagro-frontend

# Install dependencies
npm install

# Copy environment template and fill in values
# (Create .env.local or .env based on your setup)
cp .env.example .env.local  # if .env.example exists, otherwise create manually

# Run in development mode
npm run dev

# Frontend runs on http://localhost:3000
```

#### Frontend Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start Next.js dev server |
| `npm run build` | Production build         |
| `npm start`     | Run production server    |
| `npm run lint`  | Run ESLint               |

---

## 🔧 Environment Variables

### Backend (`.env` in `bdagro-backend/`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/bdagro
# Or MongoDB Atlas: mongodb+srv://user:pass@cluster.mongodb.net/bdagro

# Redis (for Socket.io adapter + BullMQ)
REDIS_URL=redis://localhost:6379

# Clerk Authentication
CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
CLERK_WEBHOOK_SIGNING_SECRET=whsec_xxx

# Frontend URL (for CORS & redirects)
FRONTEND_URL=http://localhost:3000

# Socket.io
SOCKET_URL=http://localhost:5000

# Cloudinary (file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SSLCommerz (Payment Gateway - Bangladesh)
SSLCOMMERZ_STORE_ID=your_store_id
SSLCOMMERZ_STORE_PASSWORD=your_store_password
SSLCOMMERZ_SANDBOX=true  # Set false for production

# Stripe (International Payments)
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx

# Email (Resend)
RESEND_API_KEY=re_xxx
EMAIL_FROM=noreply@yourdomain.com
```

### Frontend (`.env.local` in `bdagro-frontend/`)

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

> ⚠️ **Never commit real secrets to version control.** Use `.env.example` files as templates.

---

## 🏃 Running Locally (Full Stack)

Open **three terminal windows/tabs**:

```bash
# Terminal 1: Start MongoDB (if local)
mongod

# Terminal 2: Start Redis (if local)
redis-server

# Terminal 3: Start Backend
cd bdagro-backend
npm run dev

# Terminal 4: Start Frontend
cd bdagro-frontend
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api
- **Socket.io**: http://localhost:5000

---

## 👨‍💻 Author

**Md. Mehedi Hasan**  
Creator & Lead Developer of Bdagroonline

---

## 📄 License

This project is proprietary. All rights reserved.
