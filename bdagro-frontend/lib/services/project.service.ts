import type { AxiosInstance } from "axios";

export interface ProjectExplorerFilters {
  searchQuery: string;
  sortBy: "highest_roi" | "lowest_roi" | "newest" | "oldest" | "highest_funding" | "lowest_funding";
  cropTypes: string[];
  riskLevels: string[];
  fundingStatus: string[];
  locations: string[];
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
  landAreaAcres: number | null;
  investmentSummary: { totalRaised: number; investorCount: number; daysLeft: number | null };
  farmer: { _id: string; name: string; avatarUrl: string | null; createdAt?: string };
}

export interface ProjectExplorerResponse {
  projects: MarketplaceProject[];
  meta: { page: number; limit: number; total: number; totalPages: number };
  facets: { cropTypes: Record<string, number>; riskLevels: Record<string, number>; locations: Record<string, number>; fundingStatus: Record<string, number> };
}

export async function listProjects(api: AxiosInstance, filters: ProjectExplorerFilters) {
  const response = await api.get<ProjectExplorerResponse>("/projects", {
    params: {
      searchQuery: filters.searchQuery || undefined,
      sortBy: filters.sortBy,
      cropTypes: filters.cropTypes.join(",") || undefined,
      riskLevels: filters.riskLevels.join(",") || undefined,
      fundingStatus: filters.fundingStatus.join(",") || undefined,
      locations: filters.locations.join(",") || undefined,
      limit: 100,
    },
  });
  return response.data;
}

export async function getProjectDetails(api: AxiosInstance, projectId: string) {
  const response = await api.get<{ project: MarketplaceProject }>(`/projects/${projectId}`);
  return response.data.project;
}