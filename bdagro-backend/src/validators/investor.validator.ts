import { z } from "zod";
import { RiskLevel, InvestmentType, PaymentMethod } from "../utils/constants";

export const listProjectsQuerySchema = z.object({
  cropType: z.string().trim().optional(),
  riskLevel: z.enum(RiskLevel).optional(),
  minROI: z.coerce.number().optional(),
  maxROI: z.coerce.number().optional(),
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
