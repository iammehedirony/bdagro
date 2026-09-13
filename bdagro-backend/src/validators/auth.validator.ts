import { z } from "zod";
import { UserRole } from "../utils/constants";

/**
 * Only farmer/investor are self-selectable. "admin" is intentionally
 * excluded — admin accounts are provisioned by an existing admin via
 * Clerk's publicMetadata (trusted, backend-only), never through this
 * public endpoint.
 */
export const selectRoleSchema = z.object({
  role: z.enum([UserRole.FARMER, UserRole.INVESTOR]),
  phone: z.string(),
});

export type SelectRoleInput = z.infer<typeof selectRoleSchema>;
