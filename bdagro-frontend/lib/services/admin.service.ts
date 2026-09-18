import type { AxiosInstance } from "axios";

export type AdminVerificationStatus = "pending" | "approved" | "rejected";
export type AdminLoanStatus = "Pending" | "Processing" | "Approved" | "Rejected";
export type AdminUserRole = "farmer" | "investor" | "admin";
export type AdminUserStatus = "active" | "suspended" | "blocked";

export interface AdminDashboardData {
  stats: { totalFarmers: number; totalInvestors: number; pendingVerifications: number; pendingLoanApplications: number; openProjects: number; totalInvested: number };
}
export interface AdminVerification {
  _id: string;
  nidNumber: string;
  verificationStatus: AdminVerificationStatus;
  createdAt: string;
  address?: { district?: string };
  user: { _id: string; name: string; email?: string; phone?: string };
}
export interface AdminVerificationResponse { profiles: AdminVerification[]; meta: { total: number } }
export interface AdminLoanApplication {
  _id: string;
  projectTitle: string;
  cropType?: string;
  requestedAmount: number;
  status: AdminLoanStatus;
  createdAt: string;
  farmer: { _id: string; name: string; email?: string; phone?: string };
  loanProduct?: { name: string; category: string };
}
export interface AdminLoanApplicationResponse { applications: AdminLoanApplication[]; meta: { total: number } }
export interface AdminAllProject {
  application: AdminLoanApplication;
  farmer: { _id: string; name: string; email?: string; phone?: string; district: string | null };
  project: { _id: string; fundedAmount: number; fundingGoal: number } | null;
}
export interface AdminAllProjectResponse { applications: AdminAllProject[]; meta: { total: number } }
export interface AdminUser { _id: string; name: string; phone?: string; role: AdminUserRole; status: AdminUserStatus; nidVerificationStatus: AdminVerificationStatus | null; createdAt: string }
export interface AdminUserResponse { users: AdminUser[]; meta: { total: number } }
export interface AdminTransaction {
  _id: string;
  type: string;
  amount: number;
  status: string;
  createdAt: string;
  investor: { _id: string; name: string } | null;
  farmer: { _id: string; name: string } | null;
  project: { _id: string; title: string } | null;
}
export interface AdminTransactionResponse { transactions: AdminTransaction[]; meta: { total: number } }
export interface ApproveLoanApplicationInput { riskLevel: "low" | "medium" | "high"; expectedROIPercent: number; fundingGoal?: number; cropType?: string }

export async function getAdminDashboard(api: AxiosInstance) { const response = await api.get<AdminDashboardData>("/admin/dashboard"); return response.data; }
export async function listAdminVerifications(api: AxiosInstance) { const response = await api.get<AdminVerificationResponse>("/admin/verifications", { params: { status: "pending", limit: 3 } }); return response.data; }
export async function listAdminLoanApplications(api: AxiosInstance) { const response = await api.get<AdminLoanApplicationResponse>("/admin/loan-applications", { params: { limit: 100 } }); return response.data; }
export async function listAdminAllProjects(api: AxiosInstance) { const response = await api.get<AdminAllProjectResponse>("/admin/all-projects", { params: { limit: 50 } }); return response.data; }
export async function listAdminUsers(api: AxiosInstance, limit = 4) { const response = await api.get<AdminUserResponse>("/admin/users", { params: { limit } }); return response.data; }
export async function listAdminTransactions(api: AxiosInstance) { const response = await api.get<AdminTransactionResponse>("/admin/transactions"); return response.data; }
export async function approveAdminVerification(api: AxiosInstance, id: string) { const response = await api.post(`/admin/verifications/${id}/approve`); return response.data; }
export async function rejectAdminVerification(api: AxiosInstance, id: string, rejectionReason: string) { const response = await api.post(`/admin/verifications/${id}/reject`, { rejectionReason }); return response.data; }
export async function approveAdminLoanApplication(api: AxiosInstance, id: string, data: ApproveLoanApplicationInput) { const response = await api.post(`/admin/loan-applications/${id}/approve`, data); return response.data; }
export async function rejectAdminLoanApplication(api: AxiosInstance, id: string, rejectionReason: string) { const response = await api.post(`/admin/loan-applications/${id}/reject`, { rejectionReason }); return response.data; }
export interface AdminProfileData {
  user: { _id: string; name: string; email?: string; phone?: string; role: string; status: string; };
}
export interface UpdateAdminProfileInput { name?: string; email?: string; phone?: string; }
export async function getAdminProfile(api: AxiosInstance) { const response = await api.get<AdminProfileData>("/admin/profile"); return response.data; }
export async function updateAdminProfile(api: AxiosInstance, data: UpdateAdminProfileInput) { const response = await api.patch<{ user: any }>("/admin/profile", data); return response.data; }
