import type { AxiosInstance } from "axios";
import type { FarmerNidFormValues } from "@/lib/schemas/auth";

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
  cropType?: string;
  requestedAmount: number;
  durationMonths: number;
  status: "Pending" | "Processing" | "Approved" | "Rejected";
  rejectionReason?: string | null;
  createdAt: string;
  marketplaceProject: {
    _id: string;
    cropType: string;
    fundingGoal: number;
    fundedAmount: number;
    status: string;
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
  cropType?: string;
  requestedAmount: number;
  durationMonths: number;
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