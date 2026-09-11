import Badge from "./Badge";

interface RiskBadgeProps {
  level: "কম" | "মাঝারি" | "বেশি";
}

function RiskBadge({ level }: RiskBadgeProps) {
  const variantMap = {
    "কম": "success" as const,
    "মাঝারি": "warning" as const,
    "বেশি": "danger" as const,
  };

  return <Badge variant={variantMap[level]}>ঝুঁকি: {level}</Badge>;
}

export default RiskBadge;