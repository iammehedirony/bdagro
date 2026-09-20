import React from "react";
import Image from "next/image";
import { User, Settings, LogOut } from "lucide-react";
import Link from "next/link";

// Props এর টাইপ ডিক্লেয়ারেশন
interface UserDropdownProps {
  isOpen: boolean; // ড্রপডাউন ওপেন নাকি ক্লোজ তা নির্ধারণ করবে
  user: {
    name: string;
    role: string;
    imageUrl: string; 
  };
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onLogoutClick: () => void;
}

export const UserDropdown: React.FC<UserDropdownProps> = ({
  isOpen,
  user,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
}) => {
  // যদি ড্রপডাউন ওপেন না থাকে, তবে কিছুই রেন্ডার হবে না
  if (!isOpen) return null;

  // নামের প্রথম অক্ষর বের করা (অবতারের জন্য)
  const avatarInitial = user.name ? user.name.charAt(0) : "U";

  return (
    <div className="absolute right-6 top-16 w-64 border border-stone-200 bg-white shadow-sm z-10 transition-all duration-200">
      {/* User Info Header */}
      <div className="p-4 border-b border-stone-200 flex items-center gap-3">
        {user?.imageUrl ? (
           <Image 
             src={user.imageUrl} 
             className="w-9 h-9 rounded-full object-cover" 
             alt="User Avatar" 
             width={36} 
             height={36} 
           />
         ) : (
           <div className="w-9 h-9 rounded-full flex items-center justify-center bg-stone-200 text-stone-600 font-medium">
             {avatarInitial}
           </div>
         )}
        <div>
          <div className="text-sm font-medium text-stone-900">{user.name}</div>
          <div className="text-xs text-stone-400 mt-0.5">{user.role}</div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        <Link
          href={user.role === "farmer" ? "/farmer/settings" : user.role === "investor" ? "/investor/settings" : "/admin/settings"}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
        >
          <User className="w-4 h-4 text-stone-400" />
          প্রোফাইল দেখুন
        </Link>
      </div>

      {/* Logout Action */}
      <div className="border-t border-stone-200 py-1">
        <button
          onClick={onLogoutClick}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          লগআউট
        </button>
      </div>
    </div>
  );
}