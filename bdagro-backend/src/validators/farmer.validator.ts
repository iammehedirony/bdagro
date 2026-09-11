import { z } from "zod";
import { PaymentMethod } from "../utils/constants";

/**
 * Sent as multipart/form-data alongside the NID/land-document files, so
 * fields arrive as flat strings — nested address fields are flattened
 * here rather than as a nested object (multer doesn't parse nested keys).
 */
export const submitFarmerProfileSchema = z.object({
  nidNumber: z.string().trim().min(5, "NID number looks too short"),
  district: z.string().trim().optional(),
  upazila: z.string().trim().optional(),
  village: z.string().trim().optional(),
  fullAddress: z.string().trim().optional(),
  farmSizeAcres: z.coerce.number().positive().optional(),
});
export type SubmitFarmerProfileInput = z.infer<typeof submitFarmerProfileSchema>;

export const createLoanApplicationSchema = z.object({
  loanProduct: z.string().min(1, "loanProduct id is required"),
  requestedAmount: z.coerce.number().positive("requestedAmount must be greater than 0"),
  durationMonths: z.coerce.number().int().positive("durationMonths must be a positive integer"),
  projectTitle: z.string().trim().min(3, "projectTitle is too short"),
  projectDescription: z.string().trim().min(10, "projectDescription is too short"),
  cropType: z.string().trim().optional(),
});
export type CreateLoanApplicationInput = z.infer<typeof createLoanApplicationSchema>;

export const initiatePaymentSchema = z.object({
  paymentMethod: z.enum(PaymentMethod).default(PaymentMethod.SSLCOMMERZ),
});
export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;
