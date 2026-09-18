import { z } from "zod";

export const profitReportSchema = z
  .object({
    totalSales: z.coerce.number().positive("মোট বিক্রয় ০-এর বেশি হতে হবে"),
    productionCost: z.coerce.number().min(0, "উৎপাদন খরচ ঋণাত্মক হতে পারবে না"),
  })
  .refine((values) => values.productionCost <= values.totalSales, {
    path: ["productionCost"],
    message: "উৎপাদন খরচ মোট বিক্রয়ের চেয়ে বেশি হতে পারবে না",
  });

export type ProfitReportFormValues = z.infer<typeof profitReportSchema>;

export const manualPayoutSchema = z.object({
  transactionId: z.string().trim().min(1, "ট্রানজেকশন আইডি দিন").max(120, "ট্রানজেকশন আইডি অনেক বড়"),
});

export type ManualPayoutFormValues = z.infer<typeof manualPayoutSchema>;