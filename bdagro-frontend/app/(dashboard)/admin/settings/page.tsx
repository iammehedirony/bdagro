import { Lock } from "lucide-react";
import Field from "@/components/ui/Field";
import { PermissionCheck } from "@/components/dashboard/PermissionCheck";

export default function AdminSettingsPage() {
  return (
    <div className="bg-white min-h-screen flex">


      {/* MAIN */}
      <div className="flex-1 min-w-0">

        <div className="p-8 max-w-3xl space-y-10">
          {/* PROFILE */}
          <div>
            <h2 className="text-xl text-neutral-900 mb-4">
              অ্যাডমিন প্রোফাইল
            </h2>
            <div className="border border-neutral-200 p-6 grid sm:grid-cols-2 gap-5">
              <Field label="পূর্ণ নাম" value="নাফিস আহমেদ" />
              <Field label="ইমেইল" value="nafis@bao.com" />
              <Field label="ফোন নম্বর" value="+৮৮০ ১৭৭৭-০০৯৯১১" />
            
            </div>
          </div>


          {/* PASSWORD */}
          <div>
            <h2 className="text-xl text-neutral-900 mb-4">
              পাসওয়ার্ড পরিবর্তন
            </h2>
            <div className="border border-neutral-200 p-6 grid sm:grid-cols-2 gap-5">
              <Field label="বর্তমান পাসওয়ার্ড" type="password" placeholder="••••••••" />
              <Field label="নতুন পাসওয়ার্ড" type="password" placeholder="••••••••" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-primary-900 text-white px-6 py-3 text-sm hover:bg-primary-800">
              পরিবর্তন সংরক্ষণ করুন
            </button>
            <button className="text-sm text-neutral-500 hover:text-neutral-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              লগ আউট করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}