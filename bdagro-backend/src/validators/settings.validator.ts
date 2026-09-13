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
  // Platform configuration
  minInvestmentAmount: z.coerce.number().positive().optional(),
  nidVerificationTimeoutHours: z.coerce.number().positive().optional(),
  allowedPaymentGateways: z.array(z.nativeEnum(PaymentMethod)).optional(),
});
export type UpdateAdminSettingsInput = z.infer<typeof updateAdminSettingsSchema>;
