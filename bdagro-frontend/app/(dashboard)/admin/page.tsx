"use client";

import { Check, Loader2, MapPin, X } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import {
  useApproveAdminLoanApplicationMutation,
  useApproveAdminVerificationMutation,
  useRejectAdminLoanApplicationMutation,
  useRejectAdminVerificationMutation,
} from "@/hooks/mutations/useAdminMutations";
import {
  useAdminDashboardQuery,
  useAdminLoanApplicationsQuery,
  useAdminUsersQuery,
  useAdminVerificationsQuery,
} from "@/hooks/queries/useAdminQueries";
import type { AdminUser } from "@/lib/services/admin.service";

function formatNumber(value: number) {
  return value.toLocaleString("bn-BD");
}

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
}

function getErrorMessage(error: unknown) {
  if (error && typeof error === "object" && "response" in error) {
    const response = (error as { response?: { data?: { message?: string } } }).response;
    if (response?.data?.message) return response.data.message;
  }
  return "আবার চেষ্টা করুন।";
}

function getUserStatus(user: AdminUser) {
  if (user.role === "farmer") {
    if (user.nidVerificationStatus === "approved") return "Verified";
    if (user.nidVerificationStatus === "rejected") return "Rejected";
    return "Pending";
  }
  if (user.status === "active") return "Active";
  if (user.status === "suspended") return "Suspended";
  return "Blocked";
}

function statusClass(status: string) {
  return status === "Verified" || status === "Active"
    ? "border-primary-600 text-primary-800 bg-primary-50"
    : "border-accent-600 text-accent-800 bg-accent-50";
}

export default function AdminDashboard() {
  const dashboardQuery = useAdminDashboardQuery();
  const verificationsQuery = useAdminVerificationsQuery();
  const applicationsQuery = useAdminLoanApplicationsQuery();
  const usersQuery = useAdminUsersQuery();
  const approveVerification = useApproveAdminVerificationMutation();
  const rejectVerification = useRejectAdminVerificationMutation();
  const approveApplication = useApproveAdminLoanApplicationMutation();
  const rejectApplication = useRejectAdminLoanApplicationMutation();
  const stats = dashboardQuery.data?.stats;
  const verifications = verificationsQuery.data?.profiles ?? [];
  const applications = (applicationsQuery.data?.applications ?? []).filter(
    (application) => application.status === "Pending" || application.status === "Processing",
  );
  const users = usersQuery.data?.users ?? [];
  const isLoading = dashboardQuery.isLoading || verificationsQuery.isLoading || applicationsQuery.isLoading || usersQuery.isLoading;
  const pageError = dashboardQuery.error || verificationsQuery.error || applicationsQuery.error || usersQuery.error;

  if (isLoading) return <div className="p-4 lg:p-0 text-sm text-neutral-500">ড্যাশবোর্ড লোড হচ্ছে...</div>;
  if (pageError) {
    return <div className="p-4 lg:p-0"><div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">ড্যাশবোর্ড লোড করা যায়নি। {getErrorMessage(pageError)}</div></div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 lg:p-0">
        <div className="grid grid-cols-2 gap-3 lg:gap-4 sm:grid-cols-4 mb-6 lg:mb-8">
          <StatCard label="মোট কৃষক" value={formatNumber(stats?.totalFarmers ?? 0)} sub="প্ল্যাটফর্মে নিবন্ধিত" />
          <StatCard label="মোট বিনিয়োগকারী" value={formatNumber(stats?.totalInvestors ?? 0)} sub="প্ল্যাটফর্মে নিবন্ধিত" />
          <StatCard label="সক্রিয় প্রকল্প" value={formatNumber(stats?.openProjects ?? 0)} sub={`${formatNumber(stats?.pendingLoanApplications ?? 0)}টি যাচাই বাকি`} />
          <StatCard label="মোট বিনিয়োগ" value={formatCurrency(stats?.totalInvested ?? 0)} sub="সম্পন্ন বিনিয়োগ" />
        </div>

        <div className="grid gap-6 lg:gap-8 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6 lg:space-y-8">
            <section className="border border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-200 p-4 lg:p-6">
                <h3 className="text-neutral-900">NID যাচাই অপেক্ষমাণ</h3>
                <span className="text-xs text-neutral-400 shrink-0">{formatNumber(verificationsQuery.data?.meta.total ?? 0)}টি অনুরোধ</span>
              </div>
              <div className="divide-y divide-neutral-200">
                {verifications.length === 0 ? <div className="p-4 lg:p-6 text-sm text-neutral-500">কোনো অপেক্ষমাণ অনুরোধ নেই।</div> : verifications.map((verification) => {
                  const isPending = (approveVerification.isPending && approveVerification.variables === verification._id) || (rejectVerification.isPending && rejectVerification.variables?.id === verification._id);
                  return <div key={verification._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4 p-4 lg:p-5 flex-wrap">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm text-neutral-500">{verification.user.name[0]}</div>
                      <div className="min-w-0">
                        <div className="text-sm text-neutral-800 break-words">{verification.user.name}</div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-neutral-400">
                          <MapPin className="h-3 w-3 shrink-0" />
                          <span className="break-words">{verification.address?.district ?? "-"}</span>
                          <span className="mx-1">·</span>
                          <span>{new Date(verification.createdAt).toLocaleDateString("bn-BD")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button aria-label="NID অনুমোদন করুন" disabled={isPending} onClick={() => approveVerification.mutate(verification._id)} className="flex h-8 w-8 items-center justify-center border border-primary-600 text-primary-700 hover:bg-primary-50 disabled:opacity-50">{isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}</button>
                      <button aria-label="NID প্রত্যাখ্যান করুন" disabled={isPending} onClick={() => rejectVerification.mutate({ id: verification._id, rejectionReason: "NID তথ্য যাচাই করা যায়নি।" })} className="flex h-8 w-8 items-center justify-center border border-danger-500 text-danger-600 hover:bg-danger-50 disabled:opacity-50"><X className="h-4 w-4" /></button>
                    </div>
                  </div>;
                })}
              </div>
            </section>

            <section className="border border-neutral-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-neutral-200 p-4 lg:p-6">
                <h3 className="text-neutral-900">প্রকল্প অনুমোদন অপেক্ষমাণ</h3>
                <span className="text-xs text-neutral-400 shrink-0">{formatNumber(applications.length)}টি অনুরোধ</span>
              </div>
              <div className="divide-y divide-neutral-200">
                {applications.length === 0 ? <div className="p-4 lg:p-6 text-sm text-neutral-500">কোনো অপেক্ষমাণ আবেদন নেই।</div> : applications.map((application) => {
                  const isPending = (approveApplication.isPending && approveApplication.variables?.id === application._id) || (rejectApplication.isPending && rejectApplication.variables?.id === application._id);
                  return <div key={application._id} className="p-4 lg:p-5"><div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 flex-wrap"><div className="min-w-0"><div className="text-sm text-neutral-800 break-words">{application.projectTitle}</div><div className="mt-1 text-xs text-neutral-400">কৃষক: {application.farmer.name} · {application.cropType || "ফসল নির্ধারিত নয়"}</div></div><div className="shrink-0 text-right sm:text-left text-sm text-neutral-800">{formatCurrency(application.requestedAmount)}<div className="mt-0.5 text-xs text-neutral-400">{application.status}</div></div></div><div className="mt-4 flex flex-col sm:flex-row gap-2"><button type="button" disabled={isPending} onClick={() => approveApplication.mutate({ id: application._id, data: { riskLevel: "medium", expectedROIPercent: 10, cropType: application.cropType } })} className="flex-1 border border-primary-800 bg-primary-900 py-2 text-sm text-white hover:bg-primary-800 disabled:opacity-50">{approveApplication.isPending && approveApplication.variables?.id === application._id ? "অনুমোদন হচ্ছে..." : "অনুমোদন করুন"}</button><button disabled={isPending} onClick={() => rejectApplication.mutate({ id: application._id, rejectionReason: "আবেদনটি প্রশাসনিক পর্যালোচনায় অনুমোদিত হয়নি।" })} className="flex-1 border border-neutral-300 py-2 text-sm text-neutral-600 hover:border-danger-500 hover:text-danger-600 disabled:opacity-50">প্রত্যাখ্যান করুন</button></div></div>;
                })}
              </div>
            </section>
          </div>

          <section className="h-fit border border-neutral-200">
            <div className="p-4 lg:p-6 border-b border-neutral-200"><h3 className="text-neutral-900">ইউজার ও রোল</h3><p className="mt-1 text-xs text-neutral-400">Role-Based Access Control</p></div>
            <div className="divide-y divide-neutral-200">
              {users.map((user) => {
                const status = getUserStatus(user);
                return <div key={user._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4"><div className="flex items-center gap-3 min-w-0"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm text-neutral-500">{user.name[0]}</div><div className="min-w-0"><div className="text-sm text-neutral-800 break-words">{user.name}</div><div className="mt-0.5 text-xs capitalize text-neutral-400">{user.role}</div></div></div><span className={`border px-2 py-0.5 text-xs shrink-0 ${statusClass(status)}`}>{status}</span></div>;
              })}
            </div>
            <div className="p-4"><button className="w-full border border-neutral-300 py-2 text-sm text-primary-900 hover:border-primary-800">সব ইউজার দেখুন</button></div>
          </section>
        </div>
      </div>
    </div>
  );
}