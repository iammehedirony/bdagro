import Badge from "./Badge";

export interface StatusTagProps {
  status: string;
}

function StatusTag({ status }: StatusTagProps) {
  const variantMap: Record<string, "success" | "warning" | "neutral" | "danger"> = {
    Approved: "success" as const,
    সফল: "success" as const,
    Processing: "warning" as const,
    প্রক্রিয়াধীন: "warning" as const,
    Pending: "neutral" as const,
    Rejected: "danger" as const,
    ব্যর্থ: "danger" as const,
    বাতিল: "danger" as const,
  };
  return <Badge variant={variantMap[status] ?? "neutral"}>{status}</Badge>;
}

export default StatusTag;