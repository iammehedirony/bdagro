"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import FilterSection from "@/components/ui/FilterSection";
import Checkbox from "@/components/ui/Checkbox";
import ProjectCard from "@/components/project/ProjectCard";
import { useProjectsQuery } from "@/hooks/queries/useProjectQueries";
import type { ProjectExplorerFilters } from "@/lib/services/project.service";

const cropOptions = ["ধান", "ফল বাগান", "সবজি", "মৎস্য", "প্রাণিসম্পদ"];
const riskOptions = [{ label: "কম", value: "low" }, { label: "মাঝারি", value: "medium" }, { label: "বেশি", value: "high" }];
const statusOptions = [{ label: "খোলা আছে", value: "open" }, { label: "সম্পূর্ণ ফান্ডেড", value: "fully_funded" }];
const locationOptions = ["কুমিল্লা", "রাজশাহী", "খুলনা", "দিনাজপুর"];

const initialFilters: ProjectExplorerFilters = {
  searchQuery: "",
  sortBy: "highest_roi",
  cropTypes: [],
  riskLevels: [],
  fundingStatus: [],
  locations: [],
  page: 1,
  limit: 9,
};

function toggleValue(values: string[], value: string) {
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}

function formatCurrency(value: number) {
  return value.toLocaleString("bn-BD");
}

function getRiskLabel(value: "low" | "medium" | "high") {
  return value === "low" ? "কম" : value === "medium" ? "মাঝারি" : "বেশি";
}

function getPageNumbers(currentPage: number, totalPages: number) {
  const start = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
  const end = Math.min(totalPages, start + 4);
  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}

export default function ProjectBrowsePage() {
  const [filters, setFilters] = useState(initialFilters);
  const query = useProjectsQuery(filters);
  const data = query.data;

  const updateArray = (field: "cropTypes" | "riskLevels" | "fundingStatus" | "locations", value: string) => {
    setFilters((current) => ({ ...current, [field]: toggleValue(current[field], value), page: 1 }));
  };

  const updatePage = (page: number) => {
    setFilters((current) => ({ ...current, page }));
  };

  const totalPages = data?.meta.totalPages ?? 1;
  const pageNumbers = getPageNumbers(filters.page, totalPages);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl text-neutral-900">খামার প্রকল্প খুঁজুন</h1>
        <p className="mt-2 text-sm text-neutral-500">ঝুঁকির মাত্রা, ফসলের ধরন ও প্রত্যাশিত ROI অনুযায়ী প্রকল্প বাছাই করুন</p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full max-w-sm items-center gap-2 border border-neutral-300 px-3 py-2.5">
            <Search className="h-4 w-4 text-neutral-400" />
            <input value={filters.searchQuery} onChange={(event) => setFilters((current) => ({ ...current, searchQuery: event.target.value, page: 1 }))} type="text" placeholder="প্রকল্প বা এলাকার নাম দিয়ে খুঁজুন" className="flex-1 text-sm outline-none placeholder:text-neutral-300" />
          </div>
          <label className="flex w-fit items-center gap-2 border border-neutral-300 px-3 py-2.5 text-sm text-neutral-600">
            <span className="text-neutral-400">সাজান:</span>
            <select value={filters.sortBy} onChange={(event) => setFilters((current) => ({ ...current, sortBy: event.target.value as ProjectExplorerFilters["sortBy"], page: 1 }))} className="bg-transparent outline-none">
              <option value="highest_roi">সর্বোচ্চ ROI</option><option value="lowest_roi">সর্বনিম্ন ROI</option><option value="newest">নতুন</option><option value="oldest">পুরোনো</option><option value="highest_funding">সর্বোচ্চ ফান্ডিং</option>
            </select>
          </label>
        </div>

        <div className="mt-8 grid gap-10 md:grid-cols-[240px_1fr]">
          <aside>
            <div className="mb-1 flex items-center gap-2 text-neutral-900"><SlidersHorizontal className="h-4 w-4" /><span className="text-sm">ফিল্টার</span></div>
            <FilterSection title="ফসলের ধরন">{cropOptions.map((value) => <Checkbox key={value} label={value} count={data?.facets.cropTypes[value] ?? 0} checked={filters.cropTypes.includes(value)} onChange={() => updateArray("cropTypes", value)} />)}</FilterSection>
            <FilterSection title="ঝুঁকির মাত্রা">{riskOptions.map((option) => <Checkbox key={option.value} label={option.label} count={data?.facets.riskLevels[option.value] ?? 0} checked={filters.riskLevels.includes(option.value)} onChange={() => updateArray("riskLevels", option.value)} />)}</FilterSection>
            <FilterSection title="ফান্ডিং অবস্থা">{statusOptions.map((option) => <Checkbox key={option.value} label={option.label} count={data?.facets.fundingStatus[option.value] ?? 0} checked={filters.fundingStatus.includes(option.value)} onChange={() => updateArray("fundingStatus", option.value)} />)}</FilterSection>
            <FilterSection title="এলাকা">{locationOptions.map((value) => <Checkbox key={value} label={value} count={data?.facets.locations[value] ?? 0} checked={filters.locations.includes(value)} onChange={() => updateArray("locations", value)} />)}</FilterSection>
          </aside>

          <div>
            <div className="mb-5 flex items-center justify-between"><span className="text-sm text-neutral-400">{data?.meta.total ?? 0}টি প্রকল্প পাওয়া গেছে</span></div>
            {query.isLoading && <div className="py-10 text-center text-sm text-neutral-500">প্রকল্পগুলো লোড হচ্ছে...</div>}
            {query.isError && <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-700">প্রকল্পের তথ্য লোড করা যায়নি। <button onClick={() => query.refetch()} className="ml-2 underline">আবার চেষ্টা করুন</button></div>}
            {!query.isLoading && !query.isError && <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{(data?.projects ?? []).map((project) => {
                const percent = project.fundingGoal ? Math.min(Math.round((project.fundedAmount / project.fundingGoal) * 100), 100) : 0;
                const risk = getRiskLabel(project.riskLevel);
                const tone = project.riskLevel === "high" ? "orange" : project.riskLevel === "medium" ? "amber" : "emerald";
                return <ProjectCard key={project._id} id={project._id} title={project.title} location={project.location} goal={formatCurrency(project.fundingGoal)} raised={formatCurrency(project.fundedAmount)} percent={percent} risk={risk} roi={`${project.expectedROIPercent}%`} tone={tone} image={project.farmImage} />;
              })}</div>}
            {!query.isLoading && !query.isError && data?.projects.length === 0 && <div className="py-10 text-center text-sm text-neutral-500">এই ফিল্টারে কোনো প্রকল্প পাওয়া যায়নি।</div>}
            {!query.isLoading && !query.isError && totalPages > 1 && <nav aria-label="প্রকল্পের পৃষ্ঠা" className="mt-8 flex items-center justify-center gap-1">
              <button type="button" aria-label="আগের পৃষ্ঠা" disabled={filters.page === 1} onClick={() => updatePage(filters.page - 1)} className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-neutral-600 hover:border-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
              {pageNumbers.map((page) => <button key={page} type="button" aria-current={page === filters.page ? "page" : undefined} onClick={() => updatePage(page)} className={`h-9 min-w-9 border px-2 text-sm ${page === filters.page ? "border-neutral-900 bg-neutral-900 text-white" : "border-neutral-300 text-neutral-600 hover:border-neutral-800"}`}>{page}</button>)}
              <button type="button" aria-label="পরের পৃষ্ঠা" disabled={filters.page === totalPages} onClick={() => updatePage(filters.page + 1)} className="flex h-9 w-9 items-center justify-center border border-neutral-300 text-neutral-600 hover:border-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
            </nav>}
          </div>
        </div>
      </div>
    </div>
  );
}
