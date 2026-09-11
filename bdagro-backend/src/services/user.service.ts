import type { UserJSON } from "@clerk/express";
import type { User as ClerkUserResource } from "@clerk/backend";
import type { HydratedDocument } from "mongoose";
import { User, IUser } from "../models/User";
import { UserRole, UserStatus } from "../utils/constants";

/**
 * Clerk gives us user data in two different shapes depending on where it
 * comes from: snake_case `UserJSON` from webhooks, and a camelCase `User`
 * class instance from `clerkClient.users.getUser()`. Both get normalized
 * into this shape before touching the database, so the upsert logic below
 * only has to deal with one format.
 */
interface NormalizedClerkUser {
  clerkId: string;
  name: string;
  email?: string;
  phone?: string;
  imageUrl?: string | null;
  role: UserRole | null;
}

/**
 * Security note: `public_metadata` / `publicMetadata` can only be written
 * from our backend (via clerkClient), so it is trusted for ANY role,
 * including "admin". `unsafe_metadata` / `unsafeMetadata` can be set
 * directly by the client during sign-up (e.g. the Farmer vs Investor
 * sign-up form), so it is only trusted for those two self-service roles —
 * never for "admin".
 */
function resolveRole(publicRole: unknown, unsafeRole: unknown): UserRole | null {
  if (typeof publicRole === "string" && (Object.values(UserRole) as string[]).includes(publicRole)) {
    return publicRole as UserRole;
  }
  if (unsafeRole === UserRole.FARMER || unsafeRole === UserRole.INVESTOR) {
    return unsafeRole;
  }
  return null;
}

/** Normalize a webhook payload (`user.created` / `user.updated`). */
export function normalizeFromWebhook(data: UserJSON): NormalizedClerkUser {
  const email =
    data.email_addresses.find((e) => e.id === data.primary_email_address_id)?.email_address ??
    data.email_addresses[0]?.email_address;
  const phone =
    data.phone_numbers.find((p) => p.id === data.primary_phone_number_id)?.phone_number ??
    data.phone_numbers[0]?.phone_number;
  const name = [data.first_name, data.last_name].filter(Boolean).join(" ").trim() || email || phone || "Unnamed User";

  return {
    clerkId: data.id,
    name,
    email,
    phone,
    imageUrl: data.image_url,
    role: resolveRole(data.public_metadata?.role, data.unsafe_metadata?.role),
  };
}

/** Normalize a live `clerkClient.users.getUser()` result (self-healing fallback path). */
export function normalizeFromApi(user: ClerkUserResource): NormalizedClerkUser {
  const email = user.primaryEmailAddress?.emailAddress ?? user.emailAddresses[0]?.emailAddress;
  const phone = user.primaryPhoneNumber?.phoneNumber ?? user.phoneNumbers[0]?.phoneNumber;
  const name = user.fullName || email || phone || "Unnamed User";

  return {
    clerkId: user.id,
    name,
    email,
    phone,
    imageUrl: user.imageUrl,
    role: resolveRole(
      (user.publicMetadata as Record<string, unknown> | undefined)?.role,
      (user.unsafeMetadata as Record<string, unknown> | undefined)?.role
    ),
  };
}

/**
 * Create or update the local User document from a normalized Clerk payload.
 *
 * If the user doesn't exist locally yet AND no trustworthy role can be
 * resolved, this returns `null` — the account will be created once the
 * person completes role selection via POST /api/auth/select-role.
 * Role and status are never overwritten here on an existing user; those
 * only change through explicit, auditable actions (select-role once, or
 * an Admin action for status).
 */
export async function upsertUser(normalized: NormalizedClerkUser): Promise<HydratedDocument<IUser> | null> {
  const existing = await User.findOne({ clerkId: normalized.clerkId });

  if (existing) {
    existing.name = normalized.name;
    if (normalized.email) existing.email = normalized.email;
    if (normalized.phone) existing.phone = normalized.phone;
    if (normalized.imageUrl !== undefined) existing.avatarUrl = normalized.imageUrl;
    await existing.save();
    return existing;
  }

  if (!normalized.role) {
    return null;
  }

  return User.create({
    clerkId: normalized.clerkId,
    name: normalized.name,
    email: normalized.email,
    phone: normalized.phone,
    avatarUrl: normalized.imageUrl ?? null,
    role: normalized.role,
  });
}

/**
 * Handle a Clerk `user.deleted` webhook. We never hard-delete financial
 * records, so the local account is soft-blocked instead of removed.
 */
export async function markUserDeletedInClerk(clerkId: string): Promise<void> {
  await User.findOneAndUpdate(
    { clerkId },
    { status: UserStatus.BLOCKED, statusReason: "Clerk account was deleted" }
  );
}
