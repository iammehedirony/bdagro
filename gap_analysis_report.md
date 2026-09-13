# Bao.com (Bdagroonline) - Frontend & Backend Gap Analysis Report

## Overview
This document contains a comprehensive gap analysis between the frontend and backend codebases of the Bao.com (Bdagroonline) platform. 

Currently, the frontend is fully designed with all pages and dashboards using hardcoded Bengali mock data (no fetch/axios calls implemented yet). The backend is partially production-ready. This report highlights the existing backend endpoints and identifies the missing logic required to fully support the frontend features.

---

## ✅ Existing Backend Endpoints

| Area | Endpoints |
| :--- | :--- |
| **Auth** | `GET /api/auth/me`, `POST /api/auth/select-role` |
| **Farmer Profile** | `GET /api/farmers/profile/me`, `PUT /api/farmers/profile` |
| **Loan Apps** | `POST /api/farmers/loan-applications`, `GET /api/farmers/loan-applications`, `GET /api/farmers/loan-applications/:id` |
| **Installments** | `GET /api/farmers/installments`, `POST /api/farmers/installments/:id/pay` |
| **Investments** | `POST /api/investors/investments`, `GET /api/investors/investments`, `GET /api/investors/investments/:id` |
| **Portfolio** | `GET /api/investors/portfolio` |
| **Investor Transactions** | `GET /api/investors/transactions`, `GET /api/investors/transactions/:id/receipt` |
| **Projects (Public)** | `GET /api/projects`, `GET /api/projects/:id` |
| **Loan Products** | `GET /api/loan-products` |
| **Payments** | `POST /api/payments/:transactionId/checkout`, SSLCommerz/Stripe webhooks |
| **Admin** | Dashboard, verifications, loan apps, users, transactions, projects, notifications |

---

## ❌ Missing Backend Endpoints & Logic (Gap Analysis)

### 1. Farmer Features
- **Dashboard Summary (`/farmer`)**
  - *Missing:* No endpoint for dashboard summary (active project count, total funds raised, investor count, recent activity feed).
- **My Projects (`/farmer/projects`)**
  - *Missing:* No `GET /api/farmers/projects` — farmers cannot list their own projects.
- **Project Detail (`/farmer/projects/[id]`)**
  - *Missing:* No `GET /api/farmers/projects/:id` — farmers cannot view/edit their own project details or see the investor list.
- **Create/Edit Project**
  - *Missing:* No `POST /api/farmers/projects` or `PUT /api/farmers/projects/:id` — farmers cannot submit or update projects.
- **Profit Report Submission (`/farmer/installments`)**
  - *Missing:* No `POST /api/farmers/installments/:id/profit-report` (or equivalent) to submit harvest sales and cost figures ("মুনাফা রিপোর্ট জমা দিন").
- **Settlement/Payout Checkout (`/farmer/installments/checkout`)**
  - *Missing:* No `POST /api/farmers/installments/:id/mark-paid` or payout settlement endpoint ("পরিশোধিত হিসেবে চিহ্নিত করুন").
- **Transactions (`/farmer/transactions`)**
  - *Missing:* No `GET /api/farmers/transactions`.
- **Notifications (`/farmer/notifications`)**
  - *Missing:* No `GET /api/farmers/notifications`.
- **Settings**
  - *Missing:* No `PUT /api/farmers/profile/settings` for payment methods (bKash/nagad/bank) and notification preferences.

### 2. Investor Features
- **Dashboard Summary (`/investor`)**
  - *Missing:* No dashboard summary endpoint for portfolio value, overall ROI, and risk breakdown chart data.
- **ROI Tracking (`/investor/roi-tracking`)**
  - *Missing:* No endpoint returning per-project ROI history or monthly payout chart data.
- **Notifications (`/investor/notifications`)**
  - *Missing:* No `GET /api/investors/notifications`.
- **Settings**
  - *Missing:* No `PUT /api/investors/settings` for risk tolerance, default payment gateway, and notification preferences.

### 3. Admin Features
- **Dashboard (`/admin`)**
  - *Missing:* Endpoint exists (`GET /api/admin/dashboard`), but the frontend needs to be wired up.
- **Notifications (`/admin/notifications`)**
  - *Missing:* No `GET /api/admin/notifications` to list sent/received notifications (POST exists).
- **Settings**
  - *Missing:* No `PUT /api/admin/settings` for platform configuration (min investment, NID timeout, payment gateways).

### 4. General / System Features
- **Loan Application (`/loans/application`)**
  - *Missing:* No multipart upload handling for document fields (land deed, income proof) in the loan application route.
- **Investment Checkout (`/projects/[id]/checkout`)**
  - *Missing:* Need to confirm the flow linking `createInvestment` (generating a transactionId) to the checkout endpoint.

---

## 📋 Implementation Priority List

### 🔴 High Priority
- `GET /api/farmers/projects`, `POST /api/farmers/projects`, `PUT /api/farmers/projects/:id` (Core project management for farmers)
- `GET /api/farmers/transactions` (Farmer transaction history)
- `GET /api/farmers/notifications` & `GET /api/investors/notifications`

### 🟡 Medium Priority
- Farmer dashboard summary endpoint
- Profit report submission and payout (mark-as-paid) endpoints
- `GET /api/admin/notifications` (Read-back for sent notifications)
- Fix multipart upload for Loan Applications.

### 🟠 Low Priority
- Settings save endpoints for all 3 roles (Farmer, Investor, Admin)
- Monthly ROI chart data for Investor ROI tracking

