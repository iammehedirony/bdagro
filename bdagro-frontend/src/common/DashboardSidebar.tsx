"use client";

import { Sprout } from 'lucide-react'; // আইকনের জন্য
import Link from 'next/link';
import { usePathname } from 'next/navigation';


export default function Sidebar({ navItems, user }) {
  const pathname = usePathname();
  const userInitial = user?.name ? user.name.charAt(0) : "U";

  return (
    <aside className="w-60 bg-emerald-950 min-h-screen flex flex-col shrink-0 transition-all">
      {/* লোগো সেকশন */}
      <div className="h-16 flex items-center gap-2 px-5 border-b border-emerald-900">
        <Sprout className="w-5 h-5 text-amber-400" />
        <span className="text-stone-50 text-base font-serif">
          Bdagroonline
        </span>
      </div>

      {/* নেভিগেশন মেনু (Props থেকে আসা ডাইনামিক ডেটা) */}
      <nav className="py-4 space-y-1 overflow-y-auto">
        {navItems.map((item,idx) => {
         const { icon: Icon, label } = item;
         const isActive = pathname === item.href;
         return (
             <Link
      key={idx}
      href={item.href}
      className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-200 ${
        isActive
          ? "bg-emerald-900 text-white border-r-4 border-amber-400" 
          : "text-emerald-100/60 hover:bg-emerald-900/40 hover:text-emerald-50"
      }`}
    >
      {item.icon}
      <span>{item.label}</span>
    </Link>
         ) 
})}
      </nav>

      {/* ইউজার প্রোফাইল সেকশন (Props থেকে আসা ডাইনামিক ডেটা) */}
      <div className="mt-auto p-5 border-t border-emerald-900 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-emerald-950 text-sm font-bold">
          {userInitial}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-sm text-stone-100 truncate">{user?.name}</div>
          <div className="text-xs text-emerald-100/50 truncate">{user?.role}</div>
        </div>
      </div>
    </aside>
  );
}