import React from "react";
import {
  Sprout,
  LayoutDashboard,
  Wallet,
  Search,
  Bell,
  Settings,
  Lock,
} from "lucide-react";

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
`;

const serif = { fontFamily: "'Fraunces', serif" };
const sans = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

function NavItem({ icon: Icon, label, active }) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer ${
        active
          ? "bg-emerald-900 text-white"
          : "text-emerald-100/60 hover:bg-emerald-900/40 hover:text-emerald-50"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </div>
  );
}

function Field({ label, value, placeholder, type = "text", readOnly }) {
  return (
    <div>
      <label className="text-sm text-stone-700">{label}</label>
      <input
        type={type}
        defaultValue={value}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`mt-1.5 w-full border px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 ${
          readOnly ? "border-stone-200 bg-stone-50 text-stone-500" : "border-stone-300 focus:border-emerald-700"
        }`}
      />
    </div>
  );
}

function RiskOption({ label, desc, selected }) {
  return (
    <label
      className={`flex items-start gap-3 border p-4 cursor-pointer ${
        selected ? "border-emerald-800 bg-emerald-50" : "border-stone-300"
      }`}
    >
      <input type="radio" name="risk" defaultChecked={selected} className="accent-emerald-800 mt-1" />
      <div>
        <div className="text-sm text-stone-800">{label}</div>
        <div className="text-xs text-stone-400 mt-0.5">{desc}</div>
      </div>
    </label>
  );
}

function Toggle({ label, sub, defaultOn }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm text-stone-800">{label}</div>
        {sub && <div className="text-xs text-stone-400 mt-0.5">{sub}</div>}
      </div>
      <div
        className={`w-10 h-6 flex items-center px-0.5 cursor-pointer ${
          defaultOn ? "bg-emerald-900 justify-end" : "bg-stone-200 justify-start"
        }`}
      >
        <div className="w-5 h-5 bg-white" />
      </div>
    </div>
  );
}

export default function InvestorSettingsPage() {
  return (
    <div className="bg-white min-h-screen flex" style={sans}>
      <style>{fontImport}</style>

      {/* SIDEBAR */}
      <aside className="w-60 bg-emerald-950 min-h-screen flex flex-col shrink-0">
        <div className="h-16 flex items-center gap-2 px-5 border-b border-emerald-900">
          <Sprout className="w-5 h-5 text-amber-400" />
          <span className="text-stone-50 text-base" style={serif}>
            Bdagroonline
          </span>
        </div>
        <nav className="py-4 space-y-1">
          <NavItem icon={LayoutDashboard} label="ওভারভিউ" />
          <NavItem icon={Wallet} label="আমার বিনিয়োগ" />
          <NavItem icon={Search} label="প্রজেক্ট খুঁজুন" />
          <NavItem icon={Bell} label="নোটিফিকেশন" />
          <NavItem icon={Settings} label="সেটিংস" active />
        </nav>
        <div className="mt-auto p-5 border-t border-emerald-900 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-emerald-950 text-sm">
            র
          </div>
          <div>
            <div className="text-sm text-stone-100">রাহাত করিম</div>
            <div className="text-xs text-emerald-100/50">বিনিয়োগকারী</div>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 min-w-0">
        <header className="h-16 border-b border-stone-200 flex items-center px-8">
          <div className="text-stone-900 text-base" style={serif}>
            সেটিংস
          </div>
        </header>

        <div className="p-8 max-w-2xl space-y-10">
          {/* PROFILE */}
          <div>
            <h2 className="text-xl text-stone-900 mb-4" style={serif}>
              প্রোফাইল তথ্য
            </h2>
            <div className="border border-stone-200 p-6 grid sm:grid-cols-2 gap-5">
              <Field label="পূর্ণ নাম" value="রাহাত করিম" />
              <Field label="ফোন নম্বর" value="+৮৮০ ১৮৯৮-৭৬৫৪৩২" />
              <Field label="ইমেইল" value="rahat.karim@email.com" />
              <Field label="ঠিকানা" placeholder="শহর, জেলা" />
            </div>
          </div>

          {/* INVESTMENT PREFERENCES */}
          <div>
            <h2 className="text-xl text-stone-900 mb-4" style={serif}>
              বিনিয়োগ পছন্দ
            </h2>
            <div className="border border-stone-200 p-6">
              <label className="text-sm text-stone-700 mb-2 block">
                ঝুঁকি সহনশীলতা
              </label>
              <div className="grid sm:grid-cols-3 gap-3">
                <RiskOption label="কম" desc="স্থিতিশীল, কম ROI" />
                <RiskOption label="মাঝারি" desc="সুষম ঝুঁকি ও রিটার্ন" selected />
                <RiskOption label="বেশি" desc="উচ্চ ROI, বেশি ঝুঁকি" />
              </div>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <div>
            <h2 className="text-xl text-stone-900 mb-4" style={serif}>
              পেমেন্ট মাধ্যম
            </h2>
            <div className="border border-stone-200 p-6 grid sm:grid-cols-2 gap-5">
              <div>
                <label className="text-sm text-stone-700">ডিফল্ট পেমেন্ট গেটওয়ে</label>
                <select className="mt-1.5 w-full border border-stone-300 px-3 py-2.5 text-sm text-stone-700 focus:outline-none focus:border-emerald-700">
                  <option>SSLCommerz (বিকাশ/নগদ/কার্ড)</option>
                  <option>Stripe (আন্তর্জাতিক কার্ড)</option>
                </select>
              </div>
              <Field label="রিটার্নের জন্য অ্যাকাউন্ট নম্বর" placeholder="০১XXXXXXXXX" />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <h2 className="text-xl text-stone-900 mb-4" style={serif}>
              পাসওয়ার্ড পরিবর্তন
            </h2>
            <div className="border border-stone-200 p-6 grid sm:grid-cols-2 gap-5">
              <Field label="বর্তমান পাসওয়ার্ড" type="password" placeholder="••••••••" />
              <Field label="নতুন পাসওয়ার্ড" type="password" placeholder="••••••••" />
            </div>
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div>
            <h2 className="text-xl text-stone-900 mb-4" style={serif}>
              নোটিফিকেশন পছন্দ
            </h2>
            <div className="border border-stone-200 px-6 divide-y divide-stone-100">
              <Toggle label="নতুন প্রকল্প সুপারিশ" sub="আপনার আগ্রহ অনুযায়ী নতুন প্রকল্প এলে জানানো হবে" defaultOn />
              <Toggle label="ফান্ডিং ও রিটার্ন আপডেট" sub="প্রকল্পের অগ্রগতি ও রিটার্ন জমা হলে জানানো হবে" defaultOn />
              <Toggle label="পেমেন্ট নিশ্চিতকরণ" sub="প্রতিটি লেনদেনের নোটিফিকেশন" defaultOn />
              <Toggle label="প্রোমোশনাল আপডেট" sub="নতুন ফিচার ও অফার সম্পর্কে তথ্য" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-emerald-900 text-white px-6 py-3 text-sm hover:bg-emerald-800">
              পরিবর্তন সংরক্ষণ করুন
            </button>
            <button className="text-sm text-stone-500 hover:text-stone-800 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              অ্যাকাউন্ট নিষ্ক্রিয় করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}