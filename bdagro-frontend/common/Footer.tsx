import { Sprout } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary-950 text-primary-100/70 w-full max-w-full overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
          <div>
            <div className="flex items-center gap-2 text-neutral-50">
              <Sprout className="w-4 h-4" />
              <span>Bdagroonline</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed max-w-full">
              কৃষক ও বিনিয়োগকারীর মধ্যে স্বচ্ছ, নিরাপদ সেতুবন্ধন।
            </p>
          </div>
          <div>
            <div className="text-neutral-200 text-sm mb-3">প্ল্যাটফর্ম</div>
            <ul className="space-y-2 text-xs">
              <li>হোম</li>
              <li>প্রজেক্টসমূহ</li>
              <li>কীভাবে কাজ করে</li>
            </ul>
          </div>
          <div>
            <div className="text-neutral-200 text-sm mb-3">অ্যাকাউন্ট</div>
            <ul className="space-y-2 text-xs">
              <li>কৃষক সাইন আপ</li>
              <li>বিনিয়োগকারী সাইন আপ</li>
              <li>লগইন</li>
            </ul>
          </div>
          <div>
            <div className="text-neutral-200 text-sm mb-3">যোগাযোগ</div>
            <ul className="space-y-2 text-xs">
              <li>support@bao.com</li>
              <li>+৮৮০ ১XXX-XXXXXX</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-900 px-4 sm:px-6 py-5 text-center text-xs">
          © ২০২৬ Bdagroonline (Bao.com)। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer>
    );
};

export default Footer;