"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";

export async function updateCustomPassword(currentPassword: string, newPassword: string) {
  try {
    // এখানে await যুক্ত করতে হবে
    const { userId } = await auth();
    
    if (!userId) {
      return { error: "ব্যবহারকারী লগইন করা নেই।" };
    }

    const client = await clerkClient();

    const verify = await client.users.verifyPassword({
      userId,
      password: currentPassword,
    });

    if (!verify.verified) {
      return { error: "বর্তমান পাসওয়ার্ড ভুল হয়েছে।" };
    }

    await client.users.updateUser(userId, {
      password: newPassword,
    });

    return { success: true };
  } catch (error: any) {
    return { error: error.errors?.[0]?.longMessage || "পাসওয়ার্ড আপডেট করতে সমস্যা হয়েছে।" };
  }
}