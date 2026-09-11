"use client";
import { usePathname } from 'next/navigation';
import { Bell, Plus } from 'lucide-react';

export default function DashBoardHeader({ userName, config }) {
  const pathname = usePathname();

  // ডিফল্ট মান
  let title = `স্বাগতম, ${userName}`;
  let buttonText = "নতুন প্রকল্প পোস্ট করুন";

  // URL অনুযায়ী কনফিগারেশন ম্যাচ করা
  if (config && config.length > 0) {
    // বর্তমান URL-এর সাথে যেটা মিলবে সেটা খুঁজবে
    const matchedItem = config.find(item => pathname.startsWith(item.pathMatch));
    
    if (matchedItem) {
      title = matchedItem.title || title;
      buttonText = matchedItem.buttonText || null;
    }
  }

  return (
    <header className="h-16 border-b border-stone-200 flex items-center justify-between px-8 bg-white shrink-0">
      <div className="text-stone-900 text-base font-medium">
        {title}
      </div>

      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-stone-400 cursor-pointer hover:text-stone-600 transition-colors" />

        {buttonText && (
          <button 
              className="bg-amber-500 text-emerald-950 px-4 py-2 text-sm hover:bg-amber-400 flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              {buttonText}
            </button>
        )}
      </div>
    </header>
  );
}