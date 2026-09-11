import {
  Search,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import FilterSection from "@/components/others/FilterSection";
import Checkbox from "@/components/form/Checkbox";
import ProjectCard from "@/components/project/ProjectCard";



const projects = [
  { title: "সবুজ ধানখেত", location: "কুমিল্লা", crop: "ধান", goal: "৫,০০,০০০", raised: "৩,৭৫,০০০", percent: 75, risk: "কম" as const, roi: "১৫%", tone: "emerald" as const },
  { title: "আম বাগান প্রকল্প", location: "রাজশাহী", crop: "আম", goal: "৮,০০,০০০", raised: "৪,০০,০০০", percent: 50, risk: "মাঝারি" as const, roi: "২০%", tone: "amber" as const },
  { title: "মাছ চাষ প্রকল্প", location: "খুলনা", crop: "মৎস্য", goal: "৬,৫০,০০০", raised: "৪,৮০,০০০", percent: 74, risk: "বেশি" as const, roi: "২২%", tone: "orange" as const },
  { title: "লিচু বাগান", location: "দিনাজপুর", crop: "লিচু", goal: "৪,৫০,০০০", raised: "১,৮০,০০০", percent: 40, risk: "মাঝারি" as const, roi: "১৮%", tone: "amber" as const },
  { title: "গরু মোটাতাজাকরণ", location: "পাবনা", crop: "প্রাণিসম্পদ", goal: "৭,০০,০০০", raised: "৭,০০,০০০", percent: 100, risk: "কম" as const, roi: "১৬%", tone: "emerald" as const },
  { title: "সবজি খামার", location: "যশোর", crop: "সবজি", goal: "৩,৫০,০০০", raised: "৯০,০০০", percent: 26, risk: "কম" as const, roi: "১৪%", tone: "emerald" as const },
];

 function ProjectBrowsePage() {
  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-3xl text-neutral-900">
          খামার প্রকল্প খুঁজুন
        </h1>
        <p className="mt-2 text-neutral-500 text-sm">
          ঝুঁকির মাত্রা, ফসলের ধরন ও প্রত্যাশিত ROI অনুযায়ী প্রকল্প বাছাই করুন
        </p>

        {/* SEARCH + SORT */}
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 border border-neutral-300 px-3 py-2.5 max-w-sm w-full">
            <Search className="w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="প্রকল্প বা এলাকার নাম দিয়ে খুঁজুন"
              className="flex-1 text-sm outline-none placeholder:text-neutral-300"
            />
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 border border-neutral-300 px-3 py-2.5 w-fit">
            <span className="text-neutral-400">সাজান:</span>
            <span>সর্বোচ্চ ROI</span>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
          </div>
        </div>

        <div className="mt-8 grid md:grid-cols-[240px_1fr] gap-10">
          {/* FILTERS */}
          <aside>
            <div className="flex items-center gap-2 text-neutral-900 mb-1">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-sm">ফিল্টার</span>
            </div>

            <FilterSection title="ফসলের ধরন">
              <Checkbox label="ধান" count={18} defaultChecked />
              <Checkbox label="ফল বাগান" count={9} />
              <Checkbox label="সবজি" count={14} />
              <Checkbox label="মৎস্য" count={7} />
              <Checkbox label="প্রাণিসম্পদ" count={5} />
            </FilterSection>

            <FilterSection title="ঝুঁকির মাত্রা">
              <Checkbox label="কম" count={22} defaultChecked />
              <Checkbox label="মাঝারি" count={19} />
              <Checkbox label="বেশি" count={6} />
            </FilterSection>

            <FilterSection title="ফান্ডিং অবস্থা">
              <Checkbox label="খোলা আছে" count={31} defaultChecked />
              <Checkbox label="সম্পূর্ণ ফান্ডেড" count={16} />
            </FilterSection>

            <FilterSection title="প্রত্যাশিত ROI">
              <div className="text-xs text-neutral-400 mb-2">১০% – ২৫%</div>
              <div className="h-1.5 bg-neutral-200 relative">
                <div className="absolute left-[15%] right-[20%] h-1.5 bg-accent-500" />
              </div>
            </FilterSection>

            <FilterSection title="এলাকা">
              <Checkbox label="কুমিল্লা" count={4} />
              <Checkbox label="রাজশাহী" count={6} />
              <Checkbox label="খুলনা" count={5} />
              <Checkbox label="দিনাজপুর" count={3} />
            </FilterSection>
          </aside>

          {/* RESULTS */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-neutral-400">৪৭টি প্রকল্প পাওয়া গেছে</span>
            </div>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((p) => (
                <ProjectCard key={p.title} {...p} />
              ))}
            </div>

            {/* PAGINATION */}
            <div className="mt-12 flex items-center justify-center gap-2 text-sm">
              <button className="w-8 h-8 border border-neutral-300 text-neutral-400 hover:border-primary-800">‹</button>
              <button className="w-8 h-8 border border-primary-900 bg-primary-900 text-white">১</button>
              <button className="w-8 h-8 border border-neutral-300 text-neutral-600 hover:border-primary-800">২</button>
              <button className="w-8 h-8 border border-neutral-300 text-neutral-600 hover:border-primary-800">৩</button>
              <span className="px-1 text-neutral-300">…</span>
              <button className="w-8 h-8 border border-neutral-300 text-neutral-600 hover:border-primary-800">৮</button>
              <button className="w-8 h-8 border border-neutral-300 text-neutral-400 hover:border-primary-800">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProjectBrowsePage;
