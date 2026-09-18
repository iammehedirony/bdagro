"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import { RoleTag } from "@/components/ui/RoleTag";
import { useAdminUsersQuery } from "@/hooks/queries/useAdminQueries";
import type { AdminUser, AdminUserRole } from "@/lib/services/admin.service";

const tabs = ["সব", "Farmer", "Investor", "Admin"] as const;
type UserTab = (typeof tabs)[number];

function getRoleLabel(role: AdminUserRole) {
  return role[0].toUpperCase() + role.slice(1) as "Farmer" | "Investor" | "Admin";
}

function getStatusLabel(user: AdminUser) {
  if (user.role === "farmer") {
    if (user.nidVerificationStatus === "approved") return "Verified";
    if (user.nidVerificationStatus === "rejected") return "Rejected";
    return "Pending";
  }
  if (user.status === "active") return "Active";
  if (user.status === "suspended") return "Suspended";
  return "Blocked";
}

function getStatusClass(status: string) {
  return status === "Verified" || status === "Active"
    ? "border-primary-600 text-primary-800 bg-primary-50"
    : "border-neutral-300 text-neutral-600 bg-neutral-50";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("bn-BD");
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return "আবার চেষ্টা করুন।";
}

export default function AdminUserManagementPage() {
  const [activeTab, setActiveTab] = useState<UserTab>("সব");
  const usersQuery = useAdminUsersQuery(50);
  const users = usersQuery.data?.users ?? [];
  const filteredUsers = activeTab === "সব"
    ? users
    : users.filter((user) => getRoleLabel(user.role) === activeTab);

  if (usersQuery.isLoading) return <div className="p-8 text-sm text-neutral-500">ইউজার তালিকা লোড হচ্ছে...</div>;

  if (usersQuery.error) {
    return <div className="p-8"><div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">ইউজার তালিকা লোড করা যায়নি। {getErrorMessage(usersQuery.error)}</div></div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border px-4 py-2 text-sm ${activeTab === tab ? "border-primary-900 bg-primary-900 text-white" : "border-neutral-300 text-neutral-600 hover:border-primary-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-sm text-neutral-400">{filteredUsers.length} জন ইউজার</span>
        </div>

        <div className="border border-neutral-200">
          <div className="hidden grid-cols-[1fr_1fr_100px_110px_120px_40px] gap-4 border-b border-neutral-200 px-5 py-3 text-xs text-neutral-400 lg:grid">
            <span>নাম</span><span>ফোন নম্বর</span><span>রোল</span><span>স্ট্যাটাস</span><span>যোগদান</span><span />
          </div>
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500">এই রোলে কোনো ইউজার নেই।</div>
          ) : (
            <div className="divide-y divide-neutral-100">
              {filteredUsers.map((user) => {
                const role = getRoleLabel(user.role);
                const status = getStatusLabel(user);
                return (
                  <div key={user._id} className="grid gap-3 px-5 py-4 lg:grid-cols-[1fr_1fr_100px_110px_120px_40px] lg:items-center lg:gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm text-neutral-500">{user.name[0]}</div>
                      <span className="text-sm text-neutral-800">{user.name}</span>
                    </div>
                    <span className="text-sm text-neutral-500">{user.phone || "-"}</span>
                    <RoleTag role={role} />
                    <span className={`w-fit border px-2 py-0.5 text-xs ${getStatusClass(status)}`}>{status}</span>
                    <span className="text-xs text-neutral-400">{formatDate(user.createdAt)}</span>
                    <button type="button" aria-label={`${user.name} এর অপশন`} className="text-neutral-400 hover:text-neutral-700"><MoreVertical className="h-4 w-4" /></button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
