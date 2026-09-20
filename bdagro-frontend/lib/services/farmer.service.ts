import type { AxiosInstance } from "axios";
import type { FarmerNidFormValues } from "@/lib/schemas/auth";

export interface FarmerUser {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  avatarUrl: string | null;
}

export interface FarmerProfileData {
  _id: string;
  user: string;
  nidNumber: string;
  nidImageUrl: [string, string];
  landDocumentUrl?: string;
  address: {
    district?: string;
    upazila?: string;
    village?: string;
    fullAddress?: string;
  };
  farmSizeAcres?: number | null;
  verificationStatus: string;
  verifiedBy?: string | null;
  verifiedAt?: string | null;
  rejectionReason?: string | null;
  settings?: {
    bkashNumber?: string;
    nagadNumber?: string;
    bankAccount?: string;
    defaultPaymentGateway?: string;
    notifyInvestmentUpdates?: boolean;
    notifyProfitReportReminders?: boolean;
    notifyProjectStatusChanges?: boolean;
    notifyPromotional?: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FarmerProfileResponse {
  user: FarmerUser;
  profile: FarmerProfileData;
}

export interface FarmerDashboardProject {
  _id: string;
  title: string;
  cropType: string;
  fundingGoal: number;
  fundedAmount: number;
  fundingPercent: number;
  status: string;
  investorCount: number;
}

export interface FarmerDashboardActivity {
  type: string;
  text: string;
  time: string;
}

export interface FarmerDashboardData {
  summary: {
    activeProjectsCount: number;
    pendingApplicationsCount: number;
    totalFundsRaised: number;
    totalInvestorsCount: number;
    expectedProfit: number;
  };
  projectSummaries: FarmerDashboardProject[];
  activityFeed: FarmerDashboardActivity[];
}

export async function getFarmerDashboard(api: AxiosInstance) {
  const response = await api.get<FarmerDashboardData>("/farmers/dashboard");
  return response.data;
}

export interface FarmerProfitDistributionSettlement {
  id: string;
  project: string;
  date: string;
  sales: number;
  profit: number;
  share: number;
  sharePercent: number;
  status: string;
}

export interface FarmerProfitDistributionData {
  stats: {
    activeFundingAmount: number;
    profitDistributionRate: number;
    expectedHarvestDate: string | null;
    completedSettlements: number;
    completedSettlementAmount: number;
  };
  readyProjects: FarmerProfitDistributionProject[];
  settlements: FarmerProfitDistributionSettlement[];
}

export interface FarmerProfitDistributionProject {
  id: string;
  title: string;
  fundingAmount: number;
  durationMonths: number;
  profitShare: number;
  expectedHarvestDate: string;
}

export async function getFarmerProfitDistribution(api: AxiosInstance) {
  const response = await api.get<FarmerProfitDistributionData>("/farmers/profit-distribution");
  return response.data;
}

export async function submitFarmerNid(api: AxiosInstance, data: FarmerNidFormValues) {
  const formData = new FormData();

  formData.append("nidNumber", data.nidNumber);
  formData.append("nidName", data.nidName);
  formData.append("dob", data.dob);
  formData.append("address[district]", data.address.district);
  formData.append("address[upazila]", data.address.upazila);
  formData.append("address[village]", data.address.village);
  formData.append("address[fullAddress]", data.address.fullAddress);

  if (data.nidFront) formData.append("nidFront", data.nidFront);
  if (data.nidBack) formData.append("nidBack", data.nidBack);

  return api.put("/farmers/profile", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export interface FarmerProjectApplication {
  _id: string;
  projectTitle: string;
  projectDescription: string;
  location: string;
  cropType?: string;
  requestedAmount: number;
  durationMonths: number;
  status: "Pending" | "Processing" | "Approved" | "Rejected";
  rejectionReason?: string | null;
  createdAt: string;
  farmImage: string | null;
  marketplaceProject: {
    _id: string;
    cropType: string;
    fundingGoal: number;
    fundedAmount: number;
    status: string;
    farmImage: string | null;
  } | null;
}

export interface FarmerProjectsResponse {
  projects: FarmerProjectApplication[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function listFarmerProjects(api: AxiosInstance) {
  const response = await api.get<FarmerProjectsResponse>("/farmers/projects", {
    params: { limit: 100 },
  });
  return response.data;
}

export interface FarmerApplicationDetails {
  _id: string;
  projectTitle: string;
  projectDescription: string;
  location: string;
  cropType?: string;
  requestedAmount: number;
  durationMonths: number;
  landArea?: number;
  expectedHarvestDate?: string;
  farmImage?: string | null;
  status: FarmerProjectApplication["status"];
  rejectionReason?: string | null;
  createdAt: string;
  updatedAt: string;
  loanProduct?: {
    name: string;
    category: string;
    interestRatePercent?: number;
    maxDurationMonths?: number;
  };
}

export interface FarmerProjectInvestor {
  _id: string;
  amount: number;
  createdAt: string;
  investor?: { _id: string; name?: string };
}

export interface FarmerApprovedProjectDetails {
  _id: string;
  fundingGoal: number;
  fundedAmount: number;
  expectedROIPercent: number;
  status: string;
  fundingDeadline: string | null;
  investments: FarmerProjectInvestor[];
}

export async function getFarmerApplication(api: AxiosInstance, id: string) {
  const response = await api.get<{ application: FarmerApplicationDetails }>(`/farmers/loan-applications/${id}`);
  return response.data.application;
}

export async function getFarmerProjectDetails(api: AxiosInstance, id: string) {
  const response = await api.get<{ project: FarmerApplicationDetails & { marketplaceProject: FarmerApprovedProjectDetails | null; investments: FarmerProjectInvestor[] } }>(`/farmers/projects/${id}`);
  return response.data.project;
}

export interface SaveFarmerProfitReportInput {
  totalSales: number;
  productionCost: number;
}

export async function saveFarmerProjectProfitReport(
  api: AxiosInstance,
  projectId: string,
  data: SaveFarmerProfitReportInput,
) {
  const response = await api.post(`/farmers/projects/${projectId}/profit-report`, data);
  return response.data;
}

export interface FarmerPayoutInvestment {
  _id: string;
  amount: number;
  status: string;
  returnAmount: number;
  returnedAt: string | null;
  investor: { _id: string; name?: string };
  paymentMethod: string;
}

export interface FarmerProjectPayoutData {
  project: {
    _id: string;
    title: string;
    fundingGoal: number;
    profitReport: {
      netProfit: number;
      profitSharePercent: number;
      investorShareAmount: number;
    };
  };
  investments: FarmerPayoutInvestment[];
}

export async function getFarmerProjectPayouts(api: AxiosInstance, projectId: string) {
  const response = await api.get<FarmerProjectPayoutData>(`/projects/${projectId}/payouts`);
  return response.data;
}

export async function markFarmerInvestmentPayout(
  api: AxiosInstance,
  projectId: string,
  investmentId: string,
  transactionId: string,
) {
  const response = await api.patch(`/projects/${projectId}/payouts/${investmentId}`, { transactionId });
  return response.data;
}

export async function completeFarmerProjectPayout(api: AxiosInstance, projectId: string) {
  const response = await api.put(`/projects/${projectId}/complete-payout`, { confirmPaid: true });
  return response.data;
}

export type FarmerTransactionType = "investment" | "profit_distribution" | "payout" | "refund";
export type FarmerTransactionStatus = "pending" | "success" | "failed";

export interface FarmerTransaction {
  _id: string;
  type: FarmerTransactionType;
  amount: number;
  paymentMethod: "sslcommerz" | "stripe" | "manual";
  status: FarmerTransactionStatus;
  createdAt: string;
  project: { _id: string; title: string; location: string } | null;
  counterparty: { _id: string; name: string } | null;
}

export interface FarmerTransactionsResponse {
  transactions: FarmerTransaction[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

export async function listFarmerTransactions(api: AxiosInstance) {
  const response = await api.get<FarmerTransactionsResponse>("/farmers/transactions", {
    params: { page: 1, limit: 50 },
  });
  const firstPage = response.data;
  if (firstPage.meta.totalPages <= 1) return firstPage;

  const remainingPages = await Promise.all(
    Array.from({ length: firstPage.meta.totalPages - 1 }, (_, index) =>
      api.get<FarmerTransactionsResponse>("/farmers/transactions", {
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

export async function getFarmerProfile(api: AxiosInstance) {
  const response = await api.get<FarmerProfileResponse>("/farmers/profile");
  return response.data;
}

export interface UpdateFarmerProfileInput {
  name?: string;
  phone?: string;
  address?: string;
}

export async function updateFarmerProfile(api: AxiosInstance, data: UpdateFarmerProfileInput) {
  const response = await api.patch<FarmerProfileResponse>("/farmers/profile", data);
  return response.data;
}

export interface UpdateFarmerProjectInput {
  projectTitle?: string;
  projectDescription?: string;
  location?: string;
  cropType?: string;
  requestedAmount?: number;
  durationMonths?: number;
  landArea?: number;
  expectedHarvestDate?: string;
  farmImage?: string | null;
}

export interface UpdateFarmerProjectResponse {
  project: FarmerApplicationDetails;
}

export async function updateFarmerProject(
  api: AxiosInstance,
  id: string,
  data: UpdateFarmerProjectInput,
) {
  const response = await api.patch<UpdateFarmerProjectResponse>(`/farmers/projects/${id}`, data);
  return response.data;
}