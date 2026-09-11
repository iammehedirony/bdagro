import Badge from "./Badge";

interface RoleTagProps {
  role: "Farmer" | "Investor" | "Admin";
}

export function RoleTag({ role }: RoleTagProps) {
  const variantMap = {
    Farmer: "success" as const,
    Investor: "warning" as const,
    Admin: "neutral" as const,
  };
  return <Badge variant={variantMap[role]}>{role}</Badge>;
}