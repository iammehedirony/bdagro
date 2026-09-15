import { adminHeaderConfig, adminMenu, farmerHeaderConfig, farmerMenu, investorHeaderConfig, investorMenu } from "@/constants/navItems";


export  const getNavItems = (roleType: 'admin' | 'farmer' | 'investor') => {
    if (roleType === 'admin') return adminMenu;
    if (roleType === 'farmer') return farmerMenu;
    return investorMenu; 
  };

  export const getActiveHeaderConfig = (roleType: string) => {
  let activeHeaderConfig : any[] = [];
  if (roleType === 'farmer') activeHeaderConfig = farmerHeaderConfig;
  else if (roleType === 'investor') activeHeaderConfig = investorHeaderConfig;
  else if (roleType === 'admin') activeHeaderConfig = adminHeaderConfig;
  return activeHeaderConfig;
};