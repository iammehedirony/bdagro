import { z } from "zod";
import { UserRole, UserStatus, RiskLevel } from "../utils/constants";

export const rejectSchema = z.object({
  rejectionReason: z.string().trim().min(5, "rejectionReason is required"),
});
export type RejectInput = z.infer<typeof rejectSchema>;

/**
 * Admin fills in the marketplace-facing fields (risk assessment, ROI,
 * funding goal) when approving a loan application — these aren't set by
 * the farmer, since risk/ROI assessment is the platform's job, not
 * self-reported.
 */
export const approveLoanApplicationSchema = z.object({
  riskLevel: z.enum(RiskLevel),
  expectedROIPercent: z.coerce.number().positive(),
  fundingGoal: z.coerce.number().positive().optional(), // defaults to requestedAmount if omitted
  cropType: z.string().trim().optional(), // override/confirm the crop type shown on the marketplace
  location: z.string().trim().min(2).optional(),
  fundingDeadline: z.coerce.date().optional(),
});
export type ApproveLoanApplicationInput = z.infer<typeof approveLoanApplicationSchema>;

export const updateUserStatusSchema = z.object({
  status: z.enum(UserStatus),
  reason: z.string().trim().optional(),
});
export type UpdateUserStatusInput = z.infer<typeof updateUserStatusSchema>;

export const updateUserRoleSchema = z.object({
  role: z.enum(UserRole),
});
export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;

export const sendNotificationSchema = z
  .object({
    userIds: z.array(z.string()).optional(),
    role: z.enum(UserRole).optional(),
    title: z.string().trim().min(1),
    message: z.string().trim().min(1),
    type: z.string().trim().optional(),
  })
  .refine((data) => (data.userIds && data.userIds.length > 0) || !!data.role, {
    message: "Provide either userIds or role to target recipients",
  });
export type SendNotificationInput = z.infer<typeof sendNotificationSchema>;
