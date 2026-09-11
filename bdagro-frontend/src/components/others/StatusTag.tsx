import Badge from "./Badge";

interface StatusTagProps {
  status: "Approved" | "Processing" | "Pending" | "Rejected";
}

function StatusTag({ status }: StatusTagProps) {
  const variantMap = {
    Approved: "success" as const,
    Processing: "warning" as const,
    Pending: "neutral" as const,
    Rejected: "danger" as const,
  };
  return <Badge variant={variantMap[status]}>{status}</Badge>;
}

export default StatusTag;