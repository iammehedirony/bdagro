"use client";

import { useState } from "react";
import { Check, Loader2, MapPin, X } from "lucide-react";
import {
  useApproveAdminLoanApplicationMutation,
  useApproveAdminVerificationMutation,
  useRejectAdminLoanApplicationMutation,
  useRejectAdminVerificationMutation,
} from "@/hooks/mutations/useAdminMutations";
import { useAdminLoanApplicationsQuery, useAdminVerificationsQuery } from "@/hooks/queries/useAdminQueries";

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
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

export default function AdminPendingVerificationsPage() {
  const [activeTab, setActiveTab] = useState<"nid" | "projects">("nid");
  const verificationsQuery = useAdminVerificationsQuery();
  const applicationsQuery = useAdminLoanApplicationsQuery();
  const approveVerification = useApproveAdminVerificationMutation();
  const rejectVerification = useRejectAdminVerificationMutation();
  const approveApplication = useApproveAdminLoanApplicationMutation();
  const rejectApplication = useRejectAdminLoanApplicationMutation();
  const verifications = verificationsQuery.data?.profiles ?? [];
  const applications = (applicationsQuery.data?.applications ?? []).filter(
    (application) => application.status === "Pending" || application.status === "Processing",
  );
  const isLoading = verificationsQuery.isLoading || applicationsQuery.isLoading;
  const queryError = verificationsQuery.error || applicationsQuery.error;

  if (isLoading) return <div className="p-4 lg:p-0 text-sm text-neutral-500">যাচাইয়ের তালিকা লোড হচ্ছে...</div>;

  if (queryError) {
    return <div className="p-4 lg:p-0"><div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">যাচাইয়ের তালিকা লোড করা যায়নি। {getErrorMessage(queryError)}</div></div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 lg:p-0">
        <div className="mb-4 lg:mb-6 flex gap-2 border-b border-neutral-200 flex-wrap">
          <button
            type="button"
            onClick={() => setActiveTab("nid")}
            className={`-mb-px border-b-2 px-3 lg:px-4 py-2 lg:py-2.5 text-sm ${activeTab === "nid" ? "border-primary-800 text-primary-900" : "border-transparent text-neutral-400 hover:text-neutral-700"}`}
          >
            NID যাচাই ({verificationsQuery.data?.meta.total ?? verifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`-mb-px border-b-2 px-3 lg:px-4 py-2 lg:py-2.5 text-sm ${activeTab === "projects" ? "border-primary-800 text-primary-900" : "border-transparent text-neutral-400 hover:text-neutral-700"}`}
          >
            প্রকল্প অনুমোদন ({applications.length})
          </button>
        </div>

        {activeTab === "nid" ? (
          <div className="border border-neutral-200">
            {verifications.length === 0 ? (
              <div className="p-4 lg:p-8 text-center text-sm text-neutral-500">কোনো অপেক্ষমাণ NID যাচাই নেই।</div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {verifications.map((verification) => {
                  const isPending = (approveVerification.isPending && approveVerification.variables === verification._id)
                    || (rejectVerification.isPending && rejectVerification.variables?.id === verification._id);

                  return (
                    <div key={verification._id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 lg:gap-4 p-4 lg:p-5 flex-wrap">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm text-neutral-500">{verification.user.name[0]}</div>
                        <div className="min-w-0">
                          <div className="text-sm text-neutral-800 break-words">{verification.user.name}</div>
                          <div className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-neutral-400">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="break-words">{verification.address?.district ?? "-"}</span>
                            <span className="mx-1">·</span>
                            <span className="break-words">NID: {verification.nidNumber}</span>
                            <span className="mx-1">·</span>
                            <span>{formatDate(verification.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex shrink-0 items-center gap-2 flex-wrap">
                        <button type="button" className="border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:border-primary-800 hover:text-primary-900 whitespace-nowrap">বিস্তারিত দেখুন</button>
                        <button type="button" aria-label="NID অনুমোদন করুন" disabled={isPending} onClick={() => approveVerification.mutate(verification._id)} className="flex h-8 w-8 items-center justify-center border border-primary-600 text-primary-700 hover:bg-primary-50 disabled:opacity-50">{approveVerification.isPending && approveVerification.variables === verification._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}</button>
                        <button type="button" aria-label="NID প্রত্যাখ্যান করুন" disabled={isPending} onClick={() => rejectVerification.mutate({ id: verification._id, rejectionReason: "NID তথ্য যাচাই করা যায়নি।" })} className="flex h-8 w-8 items-center justify-center border border-danger-500 text-danger-600 hover:bg-danger-50 disabled:opacity-50"><X className="h-4 w-4" /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="mb-4 text-neutral-900">প্রকল্প অনুমোদন অপেক্ষমাণ</h3>
            <div className="border border-neutral-200">
              {applications.length === 0 ? (
                <div className="p-4 lg:p-8 text-center text-sm text-neutral-500">কোনো অপেক্ষমাণ প্রকল্প আবেদন নেই।</div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {applications.map((application) => {
                    const isPending = (approveApplication.isPending && approveApplication.variables?.id === application._id)
                      || (rejectApplication.isPending && rejectApplication.variables?.id === application._id);

                    return (
                      <div key={application._id} className="p-4 lg:p-5">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 flex-wrap">
                          <div className="min-w-0">
                            <div className="text-sm text-neutral-800 break-words">{application.projectTitle}</div>
                            <div className="mt-1 text-xs text-neutral-400">
                              কৃষক: {application.farmer.name} · {application.cropType || "ফসল নির্ধারিত নয়"}
                            </div>
                          </div>
                          <div className="shrink-0 text-right sm:text-left">
                            <div className="text-sm text-neutral-800">{formatCurrency(application.requestedAmount)}</div>
                            <div className="mt-0.5 text-xs text-neutral-400">{application.status}</div>
                          </div>
                        </div>
                        <div className="mt-4 flex flex-col sm:flex-row gap-2">
                          <button type="button" disabled={isPending} onClick={() => approveApplication.mutate({ id: application._id, data: { riskLevel: "medium", expectedROIPercent: 10, cropType: application.cropType } })} className="flex-1 border border-primary-800 bg-primary-900 py-2 text-sm text-white hover:bg-primary-800 disabled:opacity-50">{approveApplication.isPending && approveApplication.variables?.id === application._id ? "অনুমোদন হচ্ছে..." : "অনুমোদন করুন"}</button>
                          <button type="button" disabled={isPending} onClick={() => rejectApplication.mutate({ id: application._id, rejectionReason: "আবেদনটি প্রশাসনিক পর্যালোচনায় অনুমোদিত হয়নি।" })} className="flex-1 border border-neutral-300 py-2 text-sm text-neutral-600 hover:border-danger-500 hover:text-danger-600 disabled:opacity-50">প্রত্যাখ্যান করুন</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}