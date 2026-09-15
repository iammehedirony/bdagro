import { z } from "zod";
import { RiskLevel, InvestmentType, PaymentMethod } from "../utils/constants";

export const createInvestorProfileSchema = z.object({
  preferredCropTypes: z.array(z.string().trim()).min(1),
  maxRiskLevel: z.string().trim().nullable(),
  monthlyInvestmentPlan: z.string().trim().min(1),
}).strict();
export type CreateInvestorProfileInput = z.infer<typeof createInvestorProfileSchema>;

export const listProjectsQuerySchema = z.object({
  cropType: z.string().trim().optional(),
  riskLevel: z.enum(RiskLevel).optional(),
  status: z.string().optional(), // "open", "partially_funded", "fully_funded"
  location: z.string().trim().optional(),
  minROI: z.coerce.number().optional(),
  maxROI: z.coerce.number().optional(),
  search: z.string().trim().optional(),
  sort: z.enum(["roi_desc", "roi_asc", "newest", "oldest", "funding_desc", "funding_asc"]).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
});
export type ListProjectsQuery = z.infer<typeof listProjectsQuerySchema>;

export const createInvestmentSchema = z.object({
  project: z.string().min(1, "project id is required"),
  amount: z.coerce.number().positive("amount must be greater than 0"),
  investmentType: z.enum(InvestmentType),
  paymentMethod: z.enum(PaymentMethod).default(PaymentMethod.SSLCOMMERZ),
});
export type CreateInvestmentInput = z.infer<typeof createInvestmentSchema>;
