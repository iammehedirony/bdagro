"use client";

import { Sprout, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface User {
  name: string | null;
  role: string;
  imageUrl: string | null;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
}

interface SidebarProps {
  navItems: NavItem[];
  user: User;
  onClose?: () => void;
}

export default function Sidebar({ navItems, user, onClose }: SidebarProps) {
  const pathname = usePathname();
  const userInitial = user?.name ? user.name.charAt(0) : "U";

  return (
    <aside className="w-64 bg-primary-950 min-h-screen flex flex-col shrink-0">
      {/* Logo section with close button for mobile */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-primary-900 lg:justify-start lg:gap-2">
        <Link href="/" className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-accent-400" />
          <span className="text-neutral-50 text-base font-serif">
            Bdagroonline
          </span>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-primary-100/60 hover:text-primary-50 hover:bg-primary-900/40 rounded-lg transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation menu */}
      <nav className="py-4 space-y-1 overflow-y-auto flex-1">
        {navItems.map((item, idx) => {
          const isRoot = item.href === '/farmer' || item.href === '/investor' || item.href === '/admin';
          
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
       
      {/* User profile section */}
      <div className="p-5 border-t border-primary-900 flex items-center gap-3">
        {user?.imageUrl ? (
          <Image 
            src={user.imageUrl} 
            alt="User Avatar" 
            width={32} 
            height={32} 
            className="w-8 h-8 rounded-full object-cover shrink-0" 
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center text-primary-950 text-sm font-bold shrink-0">
            {userInitial}
          </div>
        )}
        <div className="flex-1 overflow-hidden">
          <div className="text-sm text-neutral-100 truncate">{user?.name}</div>
          <div className="text-xs text-primary-100/50 truncate">{user?.role}</div>
        </div>
      </div>
    </aside>
  );
}