import { Sprout } from 'lucide-react';
import Link from 'next/link';


const Navbar = () => {
    return (
        <div>
         <header className="border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-800" />
            <span className="text-stone-900 text-lg">
              Bdagroonline
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-stone-600">
            <a href="#" className="hover:text-emerald-900">
              হোম
            </a>
            <a href="#how" className="hover:text-emerald-900">
              কীভাবে কাজ করে
            </a>
            <Link href='/projects' className="hover:text-emerald-900">
              প্রজেক্টসমূহ
            </Link>
            <a href="#roles" className="hover:text-emerald-900">
              কৃষক ও বিনিয়োগকারী
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-stone-700 px-3 py-2 hover:text-emerald-900">
              লগইন
            </Link>
            <Link href="/register/farmer" className="text-sm bg-emerald-900 text-white px-4 py-2 hover:bg-emerald-800">
              সাইন আপ
            </Link>
          </div>
        </div>
      </header> 
        </div>
    );
};

export default Navbar;