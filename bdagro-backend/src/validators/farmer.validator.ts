import { z } from "zod";
import { PaymentMethod } from "../utils/constants";

/**
 * Sent as multipart/form-data alongside the NID/land-document files, so
 * fields arrive as flat strings — nested address fields are flattened
 * here rather than as a nested object (multer doesn't parse nested keys).
 */
export const submitFarmerProfileSchema = z.object({
  nidNumber: z.string().trim().min(5, "NID number looks too short"),
  nidName: z.string().trim().min(2, "NID অনুযায়ী আপনার সঠিক নাম দিন"),
  dob: z.string().trim().regex(/^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[012])\/(19|20)\d\d$/, {
    message: "সঠিক জন্ম তারিখ দিন (DD/MM/YYYY)",
  }),
  address: z.object({
    district: z.string().trim().min(2, "জেলা কমপক্ষে ২ অক্ষরের হতে হবে"),
    upazila: z.string().trim().min(2, "উপজেলা কমপক্ষে ২ অক্ষরের হতে হবে"),
    village: z.string().trim().min(2, "গ্রাম কমপক্ষে ২ অক্ষরের হতে হবে"),
    fullAddress: z.string().trim().min(5, "পূর্ণ ঠিকানা কমপক্ষে ৫ অক্ষরের হতে হবে"),
  }).strict(),
  
});
export type SubmitFarmerProfileInput = z.infer<typeof submitFarmerProfileSchema>;

export const createLoanApplicationSchema = z.object({
  loanProduct: z.string().min(1, "loanProduct id is required"),
  requestedAmount: z.coerce.number().positive("requestedAmount must be greater than 0"),
  durationMonths: z.coerce.number().int().positive("durationMonths must be a positive integer"),
  projectTitle: z.string().trim().min(3, "projectTitle is too short"),
  projectDescription: z.string().trim().min(10, "projectDescription is too short"),
  location: z.string().trim().min(2, "location is too short"),
  landArea: z.coerce.number().positive("landArea must be greater than 0"),
  expectedHarvestDate: z.coerce.date(),
  cropType: z.string().trim().optional(),
});
export type CreateLoanApplicationInput = z.infer<typeof createLoanApplicationSchema>;

export const initiatePaymentSchema = z.object({
  paymentMethod: z.enum(PaymentMethod).default(PaymentMethod.SSLCOMMERZ),
});
export type InitiatePaymentInput = z.infer<typeof initiatePaymentSchema>;

export const updateFarmerProjectSchema = z.object({
  requestedAmount: z.coerce.number().positive("requestedAmount must be greater than 0").optional(),
  durationMonths: z.coerce.number().int().positive("durationMonths must be a positive integer").optional(),
  projectTitle: z.string().trim().min(3, "projectTitle is too short").optional(),
  projectDescription: z.string().trim().min(10, "projectDescription is too short").optional(),
  location: z.string().trim().min(2, "location is too short").optional(),
  cropType: z.string().trim().optional(),
  landArea: z.coerce.number().positive("landArea must be greater than 0").optional(),
  expectedHarvestDate: z.coerce.date().optional(),
  farmImage: z.string().url("farmImage must be a valid URL").nullable().optional(),
});
export type UpdateFarmerProjectInput = z.infer<typeof updateFarmerProjectSchema>;

export const saveProjectProfitReportSchema = z.object({
  totalSales: z.coerce.number().positive("Total sales must be greater than 0"),
  productionCost: z.coerce.number().min(0, "Production cost cannot be negative"),
});
export type SaveProjectProfitReportInput = z.infer<typeof saveProjectProfitReportSchema>;
