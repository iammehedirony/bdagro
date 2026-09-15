import { getUserProfileAndRole } from "@/actions/getUserProfileAndRole";
import DashBoardHeader from "@/common/DashboardHeader";
import Sidebar from "@/common/DashboardSidebar";
import { getActiveHeaderConfig, getNavItems } from "@/lib";

export default async function FarmerLayout({ children }: { children: React.ReactNode }) {
  const {user, success} = await getUserProfileAndRole();
  if(!success || !user) return null
  
  return (
    <div className="flex">
      <Sidebar
       navItems={getNavItems(user.role)}
        user={{name: user.firstName, role: user.role}} 
      />
      <main className="flex-1 bg-stone-50 min-h-screen">
        <DashBoardHeader
          userName={user.firstName} 
          config={getActiveHeaderConfig(user.role)} 
        />
        {children}
      </main>
    </div>
  );
}