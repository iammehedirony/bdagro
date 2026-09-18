"use client";

import { useState } from "react";
import { Eye, MapPin, Sprout } from "lucide-react";
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

export default function AdminAllProjectsPage() {
  const [activeTab, setActiveTab] = useState<ProjectTab>("সব");
  const projectsQuery = useAdminAllProjectsQuery();
  const applications = projectsQuery.data?.applications ?? [];
  const filteredApplications = applications.filter((item) => {
    const status = getDisplayStatus(item);
    return activeTab === "সব" || status === activeTab || (activeTab === "Pending" && status === "Processing");
  });

  if (projectsQuery.isLoading) return <div className="p-8 text-sm text-neutral-500">প্রকল্পের তালিকা লোড হচ্ছে...</div>;

  if (projectsQuery.error) {
    return <div className="p-8"><div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">প্রকল্পের তালিকা লোড করা যায়নি। {getErrorMessage(projectsQuery.error)}</div></div>;
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
          <span className="text-sm text-neutral-400">{filteredApplications.length}টি প্রকল্প</span>
        </div>

        <div className="border border-neutral-200">
          {filteredApplications.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500">এই স্ট্যাটাসে কোনো প্রকল্প নেই।</div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {filteredApplications.map((item) => {
                const status = getDisplayStatus(item);
                const progress = getProgress(item);
                const target = item.project?.fundingGoal ?? item.application.requestedAmount;
                const tone = status === "Approved" ? "emerald" : "amber";

                return (
                  <div key={item.application._id} className="flex flex-wrap items-center gap-6 p-5">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center ${status === "Approved" ? "bg-primary-900" : "bg-accent-700"}`}>
                      <Sprout className="h-5 w-5 text-white/80" />
                    </div>
                    <div className="min-w-45 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-neutral-900">{item.application.projectTitle}</span>
                        <StatusTag status={status} />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                        <span>কৃষক: {item.farmer.name}</span><span>·</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{item.farmer.district || "-"}</span>
                      </div>
                    </div>
                    <div className="w-40">
                      {progress === null ? (
                        <div className="text-xs text-neutral-400">ফান্ডিং শুরু হয়নি</div>
                      ) : (
                        <><ProgressBar percent={progress} tone={tone} /><div className="mt-1 text-xs text-neutral-400">{progress}% ফান্ডেড</div></>
                      )}
                    </div>
                    <div className="w-28 shrink-0 text-right"><div className="text-sm text-neutral-800">{formatCurrency(target)}</div><div className="text-xs text-neutral-400">লক্ষ্যমাত্রা</div></div>
                    <button type="button" aria-label={`${item.application.projectTitle} দেখুন`} className="flex h-9 w-9 shrink-0 items-center justify-center border border-neutral-300 text-neutral-500 hover:border-primary-800 hover:text-primary-900"><Eye className="h-4 w-4" /></button>
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
