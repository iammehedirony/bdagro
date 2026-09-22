"use client";

import { X, Sprout, MapPin, Users, Building2, LogOut, LayoutDashboard, Home, Info } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { motion, AnimatePresence } from "motion/react";
import { useUserWithRole } from "@/hooks/useUserWithRole";

const allNavItems = [
    { name: "হোম", path: "/", icon: Home, roles: ["all"] },
    { name: "লোন এক্সপ্লোর", path: "/loans/explore", icon: MapPin, roles: ["farmer"] },
    { name: "ড্যাশবোর্ড", path: "/farmer", icon: LayoutDashboard, roles: ["farmer"] },
    { name: "প্রজেক্টসমূহ", path: "/projects", icon: Building2, roles: ["investor"] },
    { name: "ড্যাশবোর্ড", path: "/investor", icon: LayoutDashboard, roles: ["investor"] },
    { name: "ড্যাশবোর্ড", path: "/admin", icon: LayoutDashboard, roles: ["admin"] },
    { name: "আমাদের সম্পর্কে", path: "/about", icon: Info, roles: ["all"] },
];

interface MobileSidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const pathname = usePathname();
    const { signOut } = useClerk();
    const { role: userRole } = useUserWithRole();

    const visibleNavItems = allNavItems.filter(
        (item) =>
            item.roles.includes("all") ||
            (userRole && item.roles.includes(userRole)),
    );

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-40 md:hidden"
                        onClick={onClose}
                        aria-hidden="true"
                    />
                    <motion.aside
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-72 max-w-full bg-white z-50 md:hidden flex flex-col shadow-xl"
                        role="dialog"
                        aria-modal="true"
                        aria-label="মোবাইল মেনু"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
                            <Link href="/" onClick={onClose} className="flex items-center gap-2">
                                <Sprout className="w-6 h-6 text-primary-800" />
                                <span className="text-neutral-900 text-xl font-semibold">Bdagroonline</span>
                            </Link>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                                aria-label="মেনু বন্ধ করুন"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                            {visibleNavItems.map((item, index) => {
                                const isActive = pathname === item.path;
                                const Icon = item.icon;
                                return (
                                    <Link
                                        key={index}
                                        href={item.path}
                                        onClick={onClose}
                                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                            isActive
                                                ? "bg-primary-50 text-primary-900 font-medium"
                                                : "text-neutral-600 hover:bg-neutral-50 hover:text-primary-900"
                                        }`}
                                    >
                                        <Icon className="w-5 h-5 shrink-0" strokeWidth={2} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </nav>

                        <div className="p-4 border-t border-neutral-200 space-y-2">
                            {userRole ? (
                                <>
                                    <Link
                                        href={userRole === "farmer" ? "/farmer" : userRole === "investor" ? "/investor" : "/admin"}
                                        onClick={onClose}
                                        className="flex items-center gap-3 px-4 py-3 rounded-lg bg-primary-900 text-white font-medium hover:bg-primary-800 transition-colors"
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        <span>ড্যাশবোর্ড</span>
                                    </Link>
                                    <button
                                        onClick={() => { onClose(); signOut(); }}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        <span>লগ আউট</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        onClick={onClose}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg border border-neutral-300 text-neutral-700 font-medium hover:bg-neutral-50 hover:border-primary-500 transition-colors"
                                    >
                                        <Users className="w-5 h-5" />
                                        <span>লগইন</span>
                                    </Link>
                                    <Link
                                        href="/register/farmer"
                                        onClick={onClose}
                                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg bg-primary-900 text-white font-medium hover:bg-primary-800 transition-colors"
                                    >
                                        <Sprout className="w-5 h-5" />
                                        <span>সাইন আপ</span>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

export default MobileSidebar;