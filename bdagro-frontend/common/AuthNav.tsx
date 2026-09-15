"use client";
import { useUserWithRole } from '@/hooks/useUserWithRole';
import { Sprout } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AuthNav = () => {
  const pathname = usePathname();
  const isRegisterPage = pathname.includes('/register');
  const {user, role} = useUserWithRole()
    return (
        <div>
          <header className="border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-800" />
            <span className="text-stone-900 text-lg">
              Bdagroonline
            </span>
          </Link>
          <div className="text-sm text-stone-500">
            {user && role ? <Link href="/" className="bg-emerald-900 text-white px-4 py-2 rounded-md hover:bg-emerald-800 transition-colors">
              Go To Home
            </Link> :isRegisterPage ? (
              <span>
                Already have an account?{' '}
                <Link href="/login" className="text-emerald-900">
                  Log in
                </Link>
              </span>
            ) : (
              <span>
                Don't have an account?{' '}
                <Link href="/register" className="text-emerald-900">
                  Sign up
                </Link>
              </span>
            )}
          </div>
        </div>
      </header>
        </div>
    );
};

export default AuthNav;