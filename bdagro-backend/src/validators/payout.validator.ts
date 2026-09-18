import { z } from "zod";

export const manualPayoutSchema = z.object({
  transactionId: z.string().trim().min(1, "Transaction ID is required").max(120),
});
export type ManualPayoutInput = z.infer<typeof manualPayoutSchema>;

export const completePayoutSchema = z.object({
  confirmPaid: z.literal(true, "All investor payouts must be confirmed"),
});