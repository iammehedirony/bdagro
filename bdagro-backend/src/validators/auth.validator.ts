import { z } from "zod";
import { UserRole } from "../utils/constants";

/**
 * The registration flow uses this endpoint to create the local user after
 * Clerk signup has completed.
 */
export const selectRoleSchema = z.object({
  role: z.enum([UserRole.FARMER, UserRole.INVESTOR, UserRole.ADMIN]),
  phone: z.string().optional(),
}).superRefine((data, context) => {
  if (data.role !== UserRole.ADMIN && !data.phone) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ["phone"], message: "Phone is required for this role" });
  }
});

export type SelectRoleInput = z.infer<typeof selectRoleSchema>;
