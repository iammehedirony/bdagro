import { z } from "zod";

/**
 * Farmer Profile Schema (Account Settings)
 * Email is intentionally excluded — it is managed by Clerk and is read-only.
 */
export const updateFarmerProfileSchema = z.object({
  name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
});
export type UpdateFarmerProfileInput = z.infer<typeof updateFarmerProfileSchema>;

/**
 * Investor Profile Schema (Account Settings)
 * Email is intentionally excluded — it is managed by Clerk and is read-only.
 */
export const updateInvestorProfileSchema = z.object({
  name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
  phone: z.string().trim().optional(),
  address: z.string().trim().optional(),
  maxRiskLevel: z.enum(["low", "medium", "high"]).optional(),
});
export type UpdateInvestorProfileInput = z.infer<typeof updateInvestorProfileSchema>;
