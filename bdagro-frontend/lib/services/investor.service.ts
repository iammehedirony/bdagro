import type { AxiosInstance } from "axios";

export interface InvestorUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl: string | null;
}

export interface InvestorPreferences {
  preferredCropTypes: string[];
  maxRiskLevel: "কম" | "মাঝারি" | "বেশি" | null;
  monthlyInvestmentPlan: string;
}

export interface InvestorProfileData {
  _id: string;
  user: string;
  totalInvested: number;
  totalReturned: number;
  activeProjectsCount: number;
  preferences: InvestorPreferences;
  settings: {
    riskTolerance?: string;
    defaultPaymentGateway?: string;
    returnAccountNumber?: string;
    notifyNewProjects: boolean;
    notifyFundingUpdates: boolean;
    notifyPaymentConfirmation: boolean;
    notifyPromotional: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface InvestorProfileResponse {
  user: InvestorUser;
  profile: InvestorProfileData;
}

export interface InvestorProfilePayload {
  preferredCropTypes: string[];
  maxRiskLevel: string;
  monthlyInvestmentPlan: string;
}

export async function createInvestorProfile(
  api: AxiosInstance,
  payload: InvestorProfilePayload,
) {
  return api.post("/investors/profile", payload);
}

export interface InvestorPortfolioProject {
  _id: string;
  title: string;
  location: string;
  riskLevel: "low" | "medium" | "high";
  expectedROIPercent: number;
  fundingGoal: number;
  fundedAmount: number;
}

export interface InvestorInvestment {
  _id: string;
  transaction: string | null;
  amount: number;
  returnAmount: number;
  status: "pending" | "completed" | "returned" | "failed" | "refunded";
  createdAt: string;
  project: InvestorPortfolioProject;
}

export interface InvestorPortfolioResponse {
  portfolio: {
    totalInvested: number;
    currentValue: number;
    roiPercent: number;
    activeInvestmentsCount: number;
    completedProjectsCount: number;
  };
  investments: InvestorInvestment[];
}

export interface InvestorNotification {
  _id: string;
  title: string;
  message: string;
  type: string;
  createdAt: string;
}

export async function getInvestorPortfolio(api: AxiosInstance) {
  const response = await api.get<InvestorPortfolioResponse>("/investors/portfolio");
  return response.data;
}

export interface InvestorROIProject {
  projectId: string;
  projectTitle: string;
  location: string;
  invested: number;
  earned: number;
  roi: number;
  status: string;
}

export interface InvestorPayout {
  id: string;
  amount: number;
  paidAt: string;
  paymentMethod: string;
  gatewayTransactionId: string | null;
  project: { id: string; title: string; location: string } | null;
}

export interface InvestorROITrackingResponse {
  summary: {
    totalEarned: number;
    averageROI: number;
    topPerformer: string;
    topPerformerROI: number;
    completedPayouts: number;
    latestPayoutAt: string | null;
  };
  monthlyData: Array<{ month: string; year: number; amount: number; count: number }>;
  projectROIs: InvestorROIProject[];
  payouts: InvestorPayout[];
}

export async function getInvestorROITracking(api: AxiosInstance) {
  const response = await api.get<InvestorROITrackingResponse>("/investors/roi-tracking");
  return response.data;
}

export async function listInvestorNotifications(api: AxiosInstance) {
  const response = await api.get<{ notifications: InvestorNotification[] }>("/investors/notifications", {
    params: { limit: 5 },
  });
  return response.data;
}

export type InvestorTransactionType = "investment" | "profit_distribution" | "payout" | "refund";
export type InvestorTransactionStatus = "pending" | "success" | "failed";

export interface InvestorTransaction {
  _id: string;
  type: InvestorTransactionType;
  amount: number;
  paymentMethod: "sslcommerz" | "stripe" | "manual";
  status: InvestorTransactionStatus;
  createdAt: string;
  project: { _id: string; title: string; location: string } | null;
}

export interface InvestorTransactionsResponse {
  transactions: InvestorTransaction[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function listInvestorTransactions(api: AxiosInstance) {
  const response = await api.get<InvestorTransactionsResponse>("/investors/transactions", {
    params: { page: 1, limit: 50 },
  });
  const firstPage = response.data;
  if (firstPage.meta.totalPages <= 1) return firstPage;

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.meta.totalPages - 1 }, (_, index) =>
      api.get<InvestorTransactionsResponse>("/investors/transactions", {
        params: { page: index + 2, limit: 50 },
      }),
    ),
  );

  return {
    ...firstPage,
    transactions: [
      ...firstPage.transactions,
      ...remainingPages.flatMap((page) => page.data.transactions),
    ],
  };
}

export async function getInvestorProfile(api: AxiosInstance) {
  const response = await api.get<InvestorProfileResponse>("/investors/profile");
  return response.data;
}

export interface UpdateInvestorProfileInput {
  name?: string;
  phone?: string;
  maxRiskLevel?: "কম" | "মাঝারি" | "বেশি";
}

export async function updateInvestorProfile(api: AxiosInstance, data: UpdateInvestorProfileInput) {
  const response = await api.patch<InvestorProfileResponse>("/investors/profile", data);
  return response.data;
}