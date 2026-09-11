"use client";
import { Sprout } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const AuthNav = () => {
  const pathname = usePathname();
  const isRegisterPage = pathname.includes('/register');
    return (
        <div>
          <header className="border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-800" />
            <span className="text-stone-900 text-lg">
              Bdagroonline
            </span>
          </div>
          <div className="text-sm text-stone-500">
            {isRegisterPage ? (
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