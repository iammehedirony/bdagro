"use client";

import { Eye, MapPin, Pencil, Sprout } from "lucide-react";
import Link from "next/link";
import StatusTag from "@/components/ui/StatusTag";
import ProgressBar from "@/components/ui/ProgressBar";
import { useFarmerProjectsQuery } from "@/hooks/queries/useFarmerProjectQueries";
import type { FarmerProjectApplication } from "@/lib/services/farmer.service";

function formatCurrency(value: number) {
  return `৳${value.toLocaleString("bn-BD")}`;
}

function getProgress(project: FarmerProjectApplication) {
  const funding = project.marketplaceProject;
  if (!funding || funding.fundingGoal <= 0) return 0;
  return Math.min(Math.round((funding.fundedAmount / funding.fundingGoal) * 100), 100);
}

function getTone(status: FarmerProjectApplication["status"]) {
  return status === "Approved" ? "emerald" : "amber";
}

export default function FarmerMyProjectsPage() {
  const { data, isLoading, isError, refetch } = useFarmerProjectsQuery();
  const projects = data?.projects ?? [];

  if (isLoading) return <div className="p-8 text-sm text-neutral-500">প্রকল্পগুলো লোড হচ্ছে...</div>;

  if (isError) {
    return (
      <div className="p-8">
        <div className="border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          প্রকল্পগুলোর তথ্য লোড করা যায়নি।
          <button className="ml-3 underline" onClick={() => refetch()}>আবার চেষ্টা করুন</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-8">
        <div className="mb-5 flex items-center justify-between">
          <span className="text-sm text-neutral-400">{projects.length}টি প্রকল্প</span>
        </div>

        <div className="border border-neutral-200">
          {projects.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-500">আপনার কোনো প্রকল্পের আবেদন নেই।</div>
          ) : (
            <div className="divide-y divide-neutral-200">
              {projects.map((project) => {
                const marketplaceProject = project.marketplaceProject;
                const fundingGoal = marketplaceProject?.fundingGoal ?? project.requestedAmount;
                const fundedAmount = marketplaceProject?.fundedAmount ?? 0;
                const progress = getProgress(project);

                return (
                  <div key={project._id} className="flex flex-wrap items-center gap-6 p-6">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-primary-900">
                      <Sprout className="h-6 w-6 text-white/70" />
                    </div>

                    <div className="min-w-[180px] flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-neutral-900">{project.projectTitle}</span>
                        <StatusTag status={project.status} />
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{project.cropType || "-"}</span>
                        <span>·</span>
                        <span>{formatCurrency(project.requestedAmount)} আবেদন</span>
                      </div>
                    </div>

                    <div className="w-40">
                      {marketplaceProject ? (
                        <>
                          <ProgressBar percent={progress} tone={getTone(project.status)} />
                          <div className="mt-1.5 text-xs text-neutral-400">{formatCurrency(fundedAmount)} / {formatCurrency(fundingGoal)}</div>
                        </>
                      ) : (
                        <div className="text-xs text-neutral-400">
                          {project.status === "Rejected" ? "আবেদন প্রত্যাখ্যাত" : "অনুমোদনের অপেক্ষায়"}
                        </div>
                      )}
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Link href={`/farmer/projects/${project._id}`} aria-label="প্রকল্প দেখুন" className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-neutral-500 hover:border-primary-800 hover:text-primary-900">
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button aria-label="প্রকল্প সম্পাদনা করুন" className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-neutral-500 hover:border-primary-800 hover:text-primary-900">
                        <Pencil className="h-4 w-4" />
                      </button>
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
