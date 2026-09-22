import Badge from "./Badge";

interface RoleTagProps {
  role: "Farmer" | "Investor" | "Admin";
  className?: string;
}

export function RoleTag({ role, className }: RoleTagProps) {
  const variantMap = {
    Farmer: "success" as const,
    Investor: "warning" as const,
    Admin: "neutral" as const,
  };
  return <Badge variant={variantMap[role]} className={className}>{role}</Badge>;
}