import DashBoardHeader from "@/common/DashboardHeader";
import Sidebar from "@/common/DashboardSidebar";
import { currentUser } from "@/constants/user";
import { getActiveHeaderConfig, getNavItems } from "@/lib";


export default function FarmerLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="flex">
      <Sidebar 
       navItems={getNavItems(currentUser.roleType)}
        user={currentUser} 
      />
      <main className="flex-1 bg-stone-50 min-h-screen">
        <DashBoardHeader 
          userName={currentUser.name} 
          config={getActiveHeaderConfig(currentUser.roleType)} 
        />
        {children}
      </main>
    </div>
  );
}