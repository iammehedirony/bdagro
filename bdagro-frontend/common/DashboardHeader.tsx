"use client";
import { usePathname } from 'next/navigation';
import { Bell, Plus, Menu } from 'lucide-react';
import Link from 'next/link';

interface ConfigItem {
  pathMatch: string;
  title?: string;
  buttonText?: string | null;
  buttonLink?: string | null;
}

interface DashboardHeaderProps {
  userName: string | null;
  config?: ConfigItem[];
  onMenuClick: () => void;
  isMobile: boolean;
}

export default function DashBoardHeader({ userName, config, onMenuClick, isMobile }: DashboardHeaderProps) {
  const pathname = usePathname();

  // ডিফল্ট মান
  let title = `স্বাগতম, ${userName}`;
  let buttonText: string | null = null;
  let buttonLink: string | null = null;

  // URL অনুযায়ী কনফিগারেশন ম্যাচ করা
  if (config && config.length > 0) {
    const matchedItem = config.find(item => pathname.startsWith(item.pathMatch));

    if (matchedItem) {
      title = matchedItem.title || title;
      buttonLink = matchedItem.buttonLink !== undefined ? matchedItem.buttonLink : buttonLink;
      buttonText = matchedItem.buttonText !== undefined ? matchedItem.buttonText : buttonText;
    }
  }

  return (
    <header className="h-16 border-b border-neutral-200 flex items-center justify-between px-4 lg:px-8 bg-white shrink-0">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <div className="text-neutral-900 text-base font-medium">
          {title}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-neutral-400 cursor-pointer hover:text-neutral-600 transition-colors" />

        {buttonText && (
          <Link
              href={buttonLink || "#"}
              className="bg-accent-500 text-primary-950 px-4 py-2 text-sm hover:bg-accent-400 flex items-center gap-1.5 transition-colors hidden sm:flex"
            >
              <Plus className="w-4 h-4" />
              {buttonText}
            </Link>
        )}
      </div>
    </header>
  );
}
