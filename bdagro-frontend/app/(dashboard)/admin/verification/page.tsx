"use client";

import { useState } from "react";
import { Check, MapPin, X } from "lucide-react";
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
  const verifications = verificationsQuery.data?.profiles ?? [];
  const applications = (applicationsQuery.data?.applications ?? []).filter(
    (application) => application.status === "Pending" || application.status === "Processing",
  );
  const isLoading = verificationsQuery.isLoading || applicationsQuery.isLoading;
  const queryError = verificationsQuery.error || applicationsQuery.error;

  if (isLoading) return <div className="p-8 text-sm text-neutral-500">যাচাইয়ের তালিকা লোড হচ্ছে...</div>;

  if (queryError) {
    return <div className="p-8"><div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">যাচাইয়ের তালিকা লোড করা যায়নি। {getErrorMessage(queryError)}</div></div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        <div className="mb-6 flex gap-2 border-b border-neutral-200">
          <button
            type="button"
            onClick={() => setActiveTab("nid")}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm ${activeTab === "nid" ? "border-primary-800 text-primary-900" : "border-transparent text-neutral-400 hover:text-neutral-700"}`}
          >
            NID যাচাই ({verificationsQuery.data?.meta.total ?? verifications.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("projects")}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm ${activeTab === "projects" ? "border-primary-800 text-primary-900" : "border-transparent text-neutral-400 hover:text-neutral-700"}`}
          >
            প্রকল্প অনুমোদন ({applications.length})
          </button>
        </div>

        {activeTab === "nid" ? (
          <div className="border border-neutral-200">
            {verifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-neutral-500">কোনো অপেক্ষমাণ NID যাচাই নেই।</div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {verifications.map((verification) => (
                  <div key={verification._id} className="flex flex-wrap items-center justify-between gap-4 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-sm text-neutral-500">{verification.user.name[0]}</div>
                      <div>
                        <div className="text-sm text-neutral-800">{verification.user.name}</div>
                        <div className="mt-0.5 flex items-center gap-1 text-xs text-neutral-400">
                          <MapPin className="h-3 w-3" />
                          {verification.address?.district ?? "-"}
                          <span className="mx-1">·</span>
                          NID: {verification.nidNumber}
                          <span className="mx-1">·</span>
                          {formatDate(verification.createdAt)}
                        </div>
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button type="button" className="border border-neutral-300 px-3 py-1.5 text-xs text-neutral-600 hover:border-primary-800 hover:text-primary-900">বিস্তারিত দেখুন</button>
                      <button type="button" aria-label="NID অনুমোদন করুন" className="flex h-8 w-8 items-center justify-center border border-primary-600 text-primary-700 hover:bg-primary-50"><Check className="h-4 w-4" /></button>
                      <button type="button" aria-label="NID প্রত্যাখ্যান করুন" className="flex h-8 w-8 items-center justify-center border border-danger-500 text-danger-600 hover:bg-danger-50"><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h3 className="mb-4 text-neutral-900">প্রকল্প অনুমোদন অপেক্ষমাণ</h3>
            <div className="border border-neutral-200">
              {applications.length === 0 ? (
                <div className="p-8 text-center text-sm text-neutral-500">কোনো অপেক্ষমাণ প্রকল্প আবেদন নেই।</div>
              ) : (
                <div className="divide-y divide-neutral-200">
                  {applications.map((application) => (
                    <div key={application._id} className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <div className="text-sm text-neutral-800">{application.projectTitle}</div>
                          <div className="mt-1 text-xs text-neutral-400">
                            কৃষক: {application.farmer.name} · {application.cropType || "ফসল নির্ধারিত নয়"}
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-sm text-neutral-800">{formatCurrency(application.requestedAmount)}</div>
                          <div className="mt-0.5 text-xs text-neutral-400">{application.status}</div>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <button type="button" className="flex-1 border border-primary-800 bg-primary-900 py-2 text-sm text-white hover:bg-primary-800">অনুমোদন করুন</button>
                        <button type="button" className="flex-1 border border-neutral-300 py-2 text-sm text-neutral-600 hover:border-danger-500 hover:text-danger-600">প্রত্যাখ্যান করুন</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
