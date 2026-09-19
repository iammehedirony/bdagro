import { z } from "zod";
import { PaymentMethod } from "../utils/constants";

/**
 * Farmer Settings Schema
 */
export const updateFarmerSettingsSchema = z.object({
  // Payment receiving methods
  bkashNumber: z.string().trim().optional(),
  nagadNumber: z.string().trim().optional(),
  bankAccount: z.string().trim().optional(),
  defaultPaymentGateway: z.nativeEnum(PaymentMethod).optional(),

  // Notification preferences
  notifyInvestmentUpdates: z.boolean().optional(),
  notifyProfitReportReminders: z.boolean().optional(),
  notifyProjectStatusChanges: z.boolean().optional(),
  notifyPromotional: z.boolean().optional(),
});
export type UpdateFarmerSettingsInput = z.infer<typeof updateFarmerSettingsSchema>;

/**
 * Investor Settings Schema
 */
export const updateInvestorSettingsSchema = z.object({
  // Investment preferences
  riskTolerance: z.enum(["low", "medium", "high"]).optional(),

  // Payment method
  defaultPaymentGateway: z.nativeEnum(PaymentMethod).optional(),
  returnAccountNumber: z.string().trim().optional(),

  // Notification preferences
  notifyNewProjects: z.boolean().optional(),
  notifyFundingUpdates: z.boolean().optional(),
  notifyPaymentConfirmation: z.boolean().optional(),
  notifyPromotional: z.boolean().optional(),
});
export type UpdateInvestorSettingsInput = z.infer<typeof updateInvestorSettingsSchema>;

/**
 * Admin Settings Schema
 */
export const updateAdminSettingsSchema = z.object({
  name: z.string().min(2, { message: "নাম কমপক্ষে ২ অক্ষরের হতে হবে" }),
  email: z.string().email({ message: "সঠিক ইমেইল ঠিকানা দিন" }),
});
export type UpdateAdminSettingsInput = z.infer<typeof updateAdminSettingsSchema>;

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
