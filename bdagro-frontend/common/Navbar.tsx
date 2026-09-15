"use client";

import { currentUser } from '@/constants/user';
import { useClerk } from '@clerk/nextjs';
import { Sprout } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// নেভিগেশন ডেটা স্ট্রাকচার
const allNavItems = [
  // সবার জন্য
  { name: 'হোম', path: '/', roles: ['all'] },
  
  // শুধুমাত্র ফার্মারদের জন্য
  { name: 'লোন এক্সপ্লোর', path: '/loans/explore', roles: ['farmer'] },
  { name: 'ড্যাশবোর্ড', path: '/farmer', roles: ['farmer'] }, // ফার্মার ড্যাশবোর্ড
  
  // শুধুমাত্র ইনভেস্টরদের জন্য
  { name: 'প্রজেক্টসমূহ', path: '/projects', roles: ['investor'] },
  { name: 'ড্যাশবোর্ড', path: '/investor', roles: ['investor'] }, // ইনভেস্টর ড্যাশবোর্ড

  { name: 'আমাদের সম্পর্কে', path: '/about', roles: ['all'] },
];

const Navbar = () => {
  const pathname = usePathname();
  const { signOut } = useClerk();
  
  // ডেমো ইউজার রোল (আপনার প্রোজেক্টে এটি Auth Context/State থেকে আসবে)
  // ভ্যালুগুলো হতে পারে: 'farmer', 'investor', অথবা লগিন না থাকলে null
  const userRole = currentUser.roleType; // চেক করার জন্য এটি পরিবর্তন করে 'investor' করে দেখতে পারেন

  // ইউজারের রোল অনুযায়ী নেভিগেশন আইটেম ফিল্টার করা হচ্ছে
  const visibleNavItems = allNavItems.filter(
    (item) => item.roles.includes('all') || (userRole && item.roles.includes(userRole))
  );

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* লোগো সেকশন */}
        <Link href="/" className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-primary-800" />
          <span className="text-neutral-900 text-lg font-semibold">
            Bdagroonline
          </span>
        </Link>

        {/* ডায়নামিক নেভিগেশন মেনু */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {visibleNavItems.map((item, index) => {
            // অ্যাক্টিভ ট্যাব চেক করা হচ্ছে
            const isActive = pathname === item.path;

            return (
              <Link
                key={index}
                href={item.path}
                className={`transition-colors duration-200 ${
                  isActive
                    ? "text-primary-900 font-semibold border-b-2 border-primary-900 pb-1"
                    : "text-neutral-600 hover:text-primary-900 pb-1 border-b-2 border-transparent"
                }`}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* বাটন সেকশন */}
        <div className="flex items-center gap-3">
          {!userRole ? (
            // ইউজার লগইন না থাকলে
            <>
              <Link 
                href="/login" 
                className="text-sm font-medium text-neutral-700 px-4 py-2 rounded-md hover:text-primary-900 hover:bg-neutral-100 transition-all"
              >
                লগইন
              </Link>
              <Link 
                href="/register/farmer" 
                className="text-sm font-medium bg-primary-900 text-white px-5 py-2 rounded-md hover:bg-primary-800 shadow-sm transition-all"
              >
                সাইন আপ
              </Link>
            </>
          ) : (
            // ইউজার লগইন থাকলে
            <button 
              onClick={async () => {
                await signOut();
              }}
              className="text-sm font-medium border border-neutral-200 text-neutral-700 px-5 py-2 rounded-md hover:bg-neutral-50 transition-all"
            >
              লগআউট
            </button>
          )}
        </div>
        
      </div>
    </header>
  );
};

export default Navbar;