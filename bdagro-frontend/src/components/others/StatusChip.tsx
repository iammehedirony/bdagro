import Badge from "./Badge";

interface StatusChipProps {
  label: string;
  active?: boolean;
  tone?: "success" | "warning" | "danger" | "neutral";
}

function StatusChip({ label, active, tone = "neutral" }: StatusChipProps) {
  return (
    <Badge variant={active ? tone : "neutral"}>
      {label}
    </Badge>
  );
}

export default StatusChip;