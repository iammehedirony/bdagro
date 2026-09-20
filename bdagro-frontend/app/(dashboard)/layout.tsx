import { getUserProfileAndRole } from "@/actions/getUserProfileAndRole";
import DashBoardHeader from "@/common/DashboardHeader";
import Sidebar from "@/common/DashboardSidebar";
import { getActiveHeaderConfig, getNavItems } from "@/lib";

export default async function FarmerLayout({ children }: { children: React.ReactNode }) {
  const {user, success} = await getUserProfileAndRole();
  if(!success || !user) return null
  
  return (
    <div className="flex">
     <div className="fixed top-0 left-0 h-screen w-64 bg-white">
       <Sidebar
       navItems={getNavItems(user.role)}
        user={{name: user.firstName, role: user.role,imageUrl: user.imageUrl}} 
      />
     </div>
      <main className="bg-stone-50 min-h-screen w-full ml-64">
        <DashBoardHeader
          userName={user.firstName} 
          config={getActiveHeaderConfig(user.role)} 
        />
        {children}
      </main>
    </div>
  );
}