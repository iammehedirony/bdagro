"use client";

import { Sprout } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  name: string | null;
  role: string;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface SidebarProps {
  navItems: NavItem[];
  user: User;
}

export default function Sidebar({ navItems, user }: SidebarProps) {
  const pathname = usePathname();
  const userInitial = user?.name ? user.name.charAt(0) : "U";

  return (
    <aside className="w-60 bg-primary-950 min-h-screen flex flex-col shrink-0 transition-all">
      {/* লোগো সেকশন */}
      <Link href="/" className="h-16 flex items-center gap-2 px-5 border-b border-primary-900">
        <Sprout className="w-5 h-5 text-accent-400" />
        <span className="text-neutral-50 text-base font-serif">
          Bdagroonline
        </span>
      </Link>

      {/* নেভিগেশন মেনু */}
      <nav className="py-4 space-y-1 overflow-y-auto">
        {navItems.map((item, idx) => {
          // রুট ওভারভিউ লিংকগুলো চেক করা হচ্ছে
          const isRoot = item.href === '/farmer' || item.href === '/investor' || item.href === '/admin';
          
          // নতুন isActive লজিক
          const isActive = isRoot 
            ? pathname === item.href 
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={idx}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm cursor-pointer transition-colors duration-200 ${
                isActive
                  ? "bg-primary-900 text-white border-r-4 border-accent-400"
                  : "text-primary-100/60 hover:bg-primary-900/40 hover:text-primary-50"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      

      {/* ইউজার প্রোফাইল সেকশন */}
      <div className="mt-auto p-5 border-t border-primary-900 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-primary-950 text-sm font-bold">
          {userInitial}
        </div>
        <div className="flex-1 overflow-hidden">
          <div className="text-sm text-neutral-100 truncate">{user?.name}</div>
          <div className="text-xs text-primary-100/50 truncate">{user?.role}</div>
        </div>
      </div>
    </aside>
  );
}