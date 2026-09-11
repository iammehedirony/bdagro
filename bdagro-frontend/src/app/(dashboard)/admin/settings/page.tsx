import { Lock } from "lucide-react";
import Field from "@/components/form/Field";
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
              <Field label="রোল" value="Super Admin" readOnly />
            </div>
          </div>

          {/* RBAC PERMISSION MATRIX */}
          <div>
            <h2 className="text-xl text-neutral-900 mb-1">
              রোল ও পারমিশন (RBAC)
            </h2>
            <p className="text-sm text-neutral-400 mb-4">
              প্রতিটা রোলের জন্য কোন কোন অ্যাকশন অনুমোদিত তা নিয়ন্ত্রণ করুন
            </p>
            <div className="border border-neutral-200">
              <div className="grid grid-cols-[1fr_90px_90px_90px] gap-2 px-5 py-3 border-b border-neutral-200 text-xs text-neutral-400">
                <span>পারমিশন</span>
                <span className="text-center">Farmer</span>
                <span className="text-center">Investor</span>
                <span className="text-center">Admin</span>
              </div>
              <div className="divide-y divide-neutral-100">
                {[
                  { label: "প্রকল্প পোস্ট করা", f: true, i: false, a: true },
                  { label: "বিনিয়োগ করা", f: false, i: true, a: true },
                  { label: "NID যাচাই অনুমোদন", f: false, i: false, a: true },
                  { label: "প্রকল্প অনুমোদন/প্রত্যাখ্যান", f: false, i: false, a: true },
                  { label: "ইউজার ম্যানেজমেন্ট", f: false, i: false, a: true },
                  { label: "লোন আবেদন", f: true, i: false, a: false },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[1fr_90px_90px_90px] gap-2 px-5 py-3 items-center"
                  >
                    <span className="text-sm text-neutral-700">{row.label}</span>
                    <PermissionCheck checked={row.f} />
                    <PermissionCheck checked={row.i} />
                    <PermissionCheck checked={row.a} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* PLATFORM SETTINGS */}
          <div>
            <h2 className="text-xl text-neutral-900 mb-4">
              প্ল্যাটফর্ম সেটিংস
            </h2>
            <div className="border border-neutral-200 p-6 grid sm:grid-cols-2 gap-5">
              <Field label="প্ল্যাটফর্ম ফি (%)" value="২" />
              <Field label="সর্বনিম্ন বিনিয়োগ (৳)" value="৫,০০০" />
              <Field label="NID যাচাই সময়সীমা (ঘণ্টা)" value="২৪" />
              <div>
                <label className="text-sm text-neutral-700">পেমেন্ট গেটওয়ে</label>
                <select className="mt-1.5 w-full border border-neutral-300 px-3 py-2.5 text-sm text-neutral-700 focus:outline-none focus:border-primary-700">
                  <option>SSLCommerz + Stripe (উভয়)</option>
                  <option>শুধু SSLCommerz</option>
                  <option>শুধু Stripe</option>
                </select>
              </div>
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