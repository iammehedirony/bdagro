import { z } from "zod";

export const submitProfitReportSchema = z.object({
  totalSales: z.coerce.number().positive("Total sales must be greater than 0"),
  productionCost: z.coerce.number().min(0, "Production cost cannot be negative"),
  profitSharePercent: z.coerce.number().min(0).max(100, "Profit share must be between 0 and 100"),
});
export type SubmitProfitReportInput = z.infer<typeof submitProfitReportSchema>;

export const markPaidSchema = z.object({
  confirmPaid: z.boolean().refine((val) => val === true, {
    message: "You must confirm that all investors have been paid",
  }),
});
export type MarkPaidInput = z.infer<typeof markPaidSchema>;
