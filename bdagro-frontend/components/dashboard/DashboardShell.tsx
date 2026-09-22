"use client";

import { useState, useEffect } from "react";
import DashBoardHeader from "@/common/DashboardHeader";
import Sidebar from "@/common/DashboardSidebar";
import { getActiveHeaderConfig, getNavItems } from "@/lib";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    firstName: string | null;
    role: string;
    imageUrl: string | null;
  };
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const navItems = getNavItems(user.role as 'admin' | 'farmer' | 'investor');
  const headerConfig = getActiveHeaderConfig(user.role);

  return (
    <div className="flex min-h-screen bg-stone-50 overflow-x-hidden">
      {/* Desktop Sidebar - Fixed, always visible on lg+ */}
      <aside className="hidden lg:block fixed top-0 left-0 h-screen w-64 bg-primary-950 z-40 overflow-y-auto">
        <Sidebar
          navItems={navItems}
          user={{ name: user.firstName, role: user.role, imageUrl: user.imageUrl }}
          onClose={() => {}}
        />
      </aside>

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Sidebar - Off-canvas drawer */}
      {isMobile && (
        <aside
          className={`fixed inset-y-0 left-0 w-64 bg-primary-950 z-50 overflow-y-auto transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <Sidebar
            navItems={navItems}
            user={{ name: user.firstName, role: user.role, imageUrl: user.imageUrl }}
            onClose={() => setIsSidebarOpen(false)}
          />
        </aside>
      )}

      {/* Main Content - Uses lg:pl-64 to make room for fixed sidebar */}
      <main className="flex-1 min-h-screen w-full lg:pl-64 flex flex-col">
        <DashBoardHeader
          userName={user.firstName}
          config={headerConfig}
          onMenuClick={() => setIsSidebarOpen(true)}
          isMobile={isMobile}
        />
        <div className="w-full max-w-full px-4 md:px-6 lg:px-8 py-6 flex-1 box-border">
          {children}
        </div>
      </main>
    </div>
  );
}