"use client";

import { useState } from "react";
import { Eye, MapPin, Sprout } from "lucide-react";
import Image from "next/image";
import StatusTag from "@/components/ui/StatusTag";
import ProgressBar from "@/components/ui/ProgressBar";
import { useAdminAllProjectsQuery } from "@/hooks/queries/useAdminQueries";
import type { AdminAllProject } from "@/lib/services/admin.service";

const tabs = ["সব", "Approved", "Pending", "Rejected"] as const;
type ProjectTab = (typeof tabs)[number];

type DisplayStatus = "Approved" | "Pending" | "Processing" | "Rejected";

function getDisplayStatus(item: AdminAllProject): DisplayStatus {
  if (item.application.status === "Approved") return "Approved";
  if (item.application.status === "Rejected") return "Rejected";
  return item.application.status === "Processing" ? "Processing" : "Pending";
}

function getProgress(item: AdminAllProject) {
  if (!item.project || item.project.fundingGoal <= 0) return null;
  return Math.min(Math.round((item.project.fundedAmount / item.project.fundingGoal) * 100), 100);
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

function ProjectThumbnail({ image, status }: { image?: string | null; status: DisplayStatus }) {
  const [showFallback, setShowFallback] = useState(!image);
  const bgColor = status === "Approved" ? "bg-primary-900" : "bg-accent-700";

  return (
    <div className="relative h-10 w-10 sm:h-11 sm:w-11 shrink-0 overflow-hidden rounded-lg">
      {!showFallback && image && (
        <Image
          src={image}
          alt=""
          fill
          className="object-cover"
          onError={() => setShowFallback(true)}
          sizes="44px"
        />
      )}
      {showFallback && (
        <div className={`h-full w-full flex items-center justify-center ${bgColor}`}>
          <Sprout className="h-5 w-5 text-white/80" />
        </div>
      )}
    </div>
  );
}

export default function AdminAllProjectsPage() {
  const [activeTab, setActiveTab] = useState<ProjectTab>("সব");
  const projectsQuery = useAdminAllProjectsQuery();
  const applications = projectsQuery.data?.applications ?? [];
  const filteredApplications = applications.filter((item) => {
    const status = getDisplayStatus(item);
    return activeTab === "সব" || status === activeTab || (activeTab === "Pending" && status === "Processing");
  });

  if (projectsQuery.isLoading) return <div className="p-4 lg:p-0 text-sm text-neutral-500">প্রকল্পের তালিকা লোড হচ্ছে...</div>;

  if (projectsQuery.error) {
    return <div className="p-4 lg:p-0"><div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">প্রকল্পের তালিকা লোড করা যায়নি। {getErrorMessage(projectsQuery.error)}</div></div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 lg:p-0">
        <div className="mb-4 lg:mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2 flex-wrap">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`border px-3 lg:px-4 py-2 text-sm ${activeTab === tab ? "border-primary-900 bg-primary-900 text-white" : "border-neutral-300 text-neutral-600 hover:border-primary-700"}`}
              >
                {tab}
              </button>
            ))}
          </div>
          <span className="text-sm text-neutral-400 shrink-0">{filteredApplications.length}টি প্রকল্প</span>
        </div>

        <div className="border border-neutral-200">
          {filteredApplications.length === 0 ? (
            <div className="p-4 lg:p-8 text-center text-sm text-neutral-500">এই স্ট্যাটাসে কোনো প্রকল্প নেই।</div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredApplications.map((item) => {
                const status = getDisplayStatus(item);
                const progress = getProgress(item);
                const target = item.project?.fundingGoal ?? item.application.requestedAmount;
                const tone = status === "Approved" ? "emerald" : "amber";
                const image = item.application.farmImage ?? item.project?.farmImage ?? null;

                return (
                  <div key={item.application._id} className="p-4 lg:p-5 w-full max-w-full box-border">
                    <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
                      <ProjectThumbnail image={image} status={status} />

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm text-neutral-900 break-words min-w-0">{item.application.projectTitle}</span>
                          <StatusTag status={status} className="shrink-0" />
                        </div>
                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                          <span>কৃষক: {item.farmer.name}</span><span>·</span>
                          <span className="flex items-center gap-1"><MapPin className="h-3 w-3 shrink-0" />{item.farmer.district || "-"}</span>
                        </div>

                        {/* Progress Section - Mobile Stacked */}
                        <div className="mt-3 sm:hidden space-y-2">
                          {progress === null ? (
                            <div className="text-xs text-neutral-400">ফান্ডিং শুরু হয়নি</div>
                          ) : (
                            <div className="space-y-1">
                              <ProgressBar percent={progress} tone={tone} />
                              <div className="text-xs text-neutral-400">{progress}% ফান্ডেড</div>
                            </div>
                          )}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-neutral-100">
                            <div className="text-sm text-neutral-800">{formatCurrency(target)}</div>
                            <div className="text-xs text-neutral-400">লক্ষ্যমাত্রা</div>
                          </div>
                        </div>

                        {/* Progress Section - Desktop Inline */}
                        <div className="hidden sm:flex sm:flex-col sm:flex-row sm:items-center sm:gap-4 sm:mt-0 sm:space-y-0">
                          <div className="w-36 shrink-0">
                            {progress === null ? (
                              <div className="text-xs text-neutral-400">ফান্ডিং শুরু হয়নি</div>
                            ) : (
                              <><ProgressBar percent={progress} tone={tone} /><div className="mt-1 text-xs text-neutral-400">{progress}% ফান্ডেড</div></>
                            )}
                          </div>
                          <div className="w-28 shrink-0 text-right sm:text-left"><div className="text-sm text-neutral-800">{formatCurrency(target)}</div><div className="text-xs text-neutral-400">লক্ষ্যমাত্রা</div></div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-3 sm:mt-0">
                        <button
                          type="button"
                          aria-label={`${item.application.projectTitle} দেখুন`}
                          className="flex h-9 w-9 sm:w-auto sm:px-3 shrink-0 items-center justify-center gap-2 border border-neutral-300 text-neutral-500 hover:border-primary-800 hover:text-primary-900"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">দেখুন</span>
                        </button>
                      </div>
                    </div>
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