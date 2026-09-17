import type { AxiosInstance } from "axios";

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