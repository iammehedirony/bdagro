import { Sprout } from 'lucide-react';

const Footer = () => {
    return (
        <div>
            <footer className="bg-emerald-950 text-emerald-100/70">
        <div className="max-w-6xl mx-auto px-6 py-14 grid md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-2 text-stone-50">
              <Sprout className="w-4 h-4" />
              <span>Bdagroonline</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed max-w-[220px]">
              কৃষক ও বিনিয়োগকারীর মধ্যে স্বচ্ছ, নিরাপদ সেতুবন্ধন।
            </p>
          </div>
          <div>
            <div className="text-stone-200 text-sm mb-3">প্ল্যাটফর্ম</div>
            <ul className="space-y-2 text-xs">
              <li>হোম</li>
              <li>প্রজেক্টসমূহ</li>
              <li>কীভাবে কাজ করে</li>
            </ul>
          </div>
          <div>
            <div className="text-stone-200 text-sm mb-3">অ্যাকাউন্ট</div>
            <ul className="space-y-2 text-xs">
              <li>কৃষক সাইন আপ</li>
              <li>বিনিয়োগকারী সাইন আপ</li>
              <li>লগইন</li>
            </ul>
          </div>
          <div>
            <div className="text-stone-200 text-sm mb-3">যোগাযোগ</div>
            <ul className="space-y-2 text-xs">
              <li>support@bao.com</li>
              <li>+৮৮০ ১XXX-XXXXXX</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-emerald-900 py-5 text-center text-xs">
          © ২০২৬ Bdagroonline (Bao.com)। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </footer> 
        </div>
    );
};

export default Footer;