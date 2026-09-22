import { getUserProfileAndRole } from "@/actions/getUserProfileAndRole";
import DashboardShell from "@/components/dashboard/DashboardShell";

export default async function FarmerLayout({ children }: { children: React.ReactNode }) {
  const {user, success} = await getUserProfileAndRole();
  if(!success || !user) return null

  return (
    <DashboardShell
      user={{firstName: user.firstName, role: user.role, imageUrl: user.imageUrl}}
    >
      {children}
    </DashboardShell>
  );
}