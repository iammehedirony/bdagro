"use server";

import { auth, currentUser } from "@clerk/nextjs/server";

export async function getUserProfileAndRole() {
  try {
    // ১. auth() থেকে ইউজার আইডি এবং সেশন ক্লেইম (রোল পাওয়ার জন্য) নেওয়া
    const { userId, sessionClaims } = await auth();

    if (!userId) {
      return { success: false, user: null, role: null, message: "Unauthorized" };
    }

    // ২. publicMetadata থেকে রোল বের করা
    const metadata = (sessionClaims?.publicMetadata as any) || {};
    const role = metadata?.role || null;

    // ৩. currentUser() দিয়ে Clerk থেকে ইউজারের মূল ডেটা নিয়ে আসা
    const rawUser = await currentUser();

    // ৪. ক্লায়েন্টে পাঠানোর সুবিধার্থে শুধু প্রয়োজনীয় ডেটা ফিল্টার করে প্লেইন অবজেক্ট বানানো
    const user = rawUser ? {
      id: rawUser.id,
      firstName: rawUser.firstName,
      lastName: rawUser.lastName,
      imageUrl: rawUser.imageUrl,
      email: rawUser.emailAddresses[0]?.emailAddress,
      role: role,
    } : null;

    return {
      success: true,
      user
    };
  } catch (error) {
    console.error("Failed to fetch user and role:", error);
    return { success: false, user: null, role: null, message: "Server Error" };
  }
}