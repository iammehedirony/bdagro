// Central place for all enum values used across models & controllers.
// Using real TS enums so route/controller code gets autocomplete +
// compile-time checks instead of raw strings.

export enum UserRole {
  FARMER = "farmer",
  INVESTOR = "investor",
  ADMIN = "admin",
}

export enum UserStatus {
  ACTIVE = "active",
  SUSPENDED = "suspended",
  BLOCKED = "blocked",
}

export enum VerificationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
}

// Farmer loan application lifecycle, named explicitly in the PRD
// (Pending, Processing, Approved, Rejected) for real-time status tracking.
export enum LoanApplicationStatus {
  PENDING = "Pending",
  PROCESSING = "Processing",
  APPROVED = "Approved",
  REJECTED = "Rejected",
}

export enum LoanCategory {
  SEED_PURCHASE = "seed_purchase", // বীজ কেনা
  TRACTOR_PURCHASE = "tractor_purchase", // ট্রাক্টর কেনা
  LIVESTOCK_FARMING = "livestock_farming", // গবাদিপশু পালন
  IRRIGATION = "irrigation",
  OTHER = "other",
}

export enum RiskLevel {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export enum ProjectStatus {
  OPEN = "open", // listed on marketplace, accepting investment
  PARTIALLY_FUNDED = "partially_funded",
  FULLY_FUNDED = "fully_funded",
  CLOSED = "closed", // funding period ended / loan disbursed
}

export enum InvestmentType {
  PARTIAL = "partial",
  FULL = "full",
}

export enum InvestmentStatus {
  PENDING = "pending",
  COMPLETED = "completed",
  RETURNED = "returned",
  FAILED = "failed",
  REFUNDED = "refunded",
}

export enum TransactionType {
  LOAN_DISBURSEMENT = "loan_disbursement",
  LOAN_REPAYMENT = "loan_repayment",
  PROFIT_DISTRIBUTION = "profit_distribution",
  PAYOUT = "payout",
  INVESTMENT = "investment",
  REFUND = "refund",
}

export enum TransactionStatus {
  PENDING = "pending",
  SUCCESS = "success",
  FAILED = "failed",
}

export enum PaymentMethod {
  SSLCOMMERZ = "sslcommerz",
  STRIPE = "stripe",
  MANUAL = "manual",
}

export enum ProfitDistributionStatus {
  PENDING = "pending",
  PAID = "paid",
  OVERDUE = "overdue",
}
