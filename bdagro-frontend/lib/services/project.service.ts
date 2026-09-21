import axios, { type AxiosInstance } from "axios";

export interface ProjectExplorerFilters {
  searchQuery: string;
  sortBy: "highest_roi" | "lowest_roi" | "newest" | "oldest" | "highest_funding" | "lowest_funding";
  cropTypes: string[];
  riskLevels: string[];
  fundingStatus: string[];
  locations: string[];
  page: number;
  limit: number;
}

export interface MarketplaceProject {
  _id: string;
  title: string;
  location: string;
  cropType: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  expectedROIPercent: number;
  fundingGoal: number;
  fundedAmount: number;
  status: string;
  expectedHarvestDate: string | null;
  fundingDeadline: string | null;
  farmImage: string | null;
  durationMonths: number | null;
  landArea: number | null;
  investmentSummary: { totalRaised: number; investorCount: number; daysLeft: number | null };
  farmer: { _id: string; name: string; avatarUrl: string | null; createdAt?: string };
}

export interface ProjectExplorerResponse {
  projects: MarketplaceProject[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  facets: { cropTypes: Record<string, number>; riskLevels: Record<string, number>; locations: Record<string, number>; fundingStatus: Record<string, number> };
}

export interface FeaturedProject {
  _id: string;
  title: string;
  location: string;
  cropType: string;
  riskLevel: "low" | "medium" | "high";
  expectedROIPercent: number;
  fundingGoal: number;
  fundedAmount: number;
  progressPercent: number;
  farmImage: string | null;
  farmer: { name: string; avatarUrl: string | null } | null;
  status: string;
}

export interface FeaturedProjectsResponse {
  projects: FeaturedProject[];
}

const publicApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
});

export async function listProjects(api: AxiosInstance, filters: ProjectExplorerFilters) {
  const response = await api.get<ProjectExplorerResponse>("/projects", {
    params: {
      searchQuery: filters.searchQuery || undefined,
      sortBy: filters.sortBy,
      cropTypes: filters.cropTypes.join(",") || undefined,
      riskLevels: filters.riskLevels.join(",") || undefined,
      fundingStatus: filters.fundingStatus.join(",") || undefined,
      locations: filters.locations.join(",") || undefined,
      page: filters.page,
      limit: filters.limit,
    },
  });
  return response.data;
}

export async function getProjectDetails(api: AxiosInstance, projectId: string) {
  const response = await api.get<{ project: MarketplaceProject }>(`/projects/${projectId}`);
  return response.data.project;
}

export async function getFeaturedOngoingProjects(): Promise<FeaturedProject[]> {
  const response = await publicApi.get<FeaturedProjectsResponse>("/projects/featured-ongoing");
  return response.data.projects ?? [];
}