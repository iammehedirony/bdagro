import Badge from "./Badge";

export interface StatusTagProps {
  status: string;
  className?: string;
}

function StatusTag({ status, className }: StatusTagProps) {
  const variantMap: Record<string, "success" | "warning" | "neutral" | "danger"> = {
    Approved: "success" as const,
    সফল: "success" as const,
    Processing: "warning" as const,
    প্রক্রিয়াধীন: "warning" as const,
    Pending: "neutral" as const,
    Rejected: "danger" as const,
    ব্যর্থ: "danger" as const,
    বাতিল: "danger" as const,
    পরিশোধিত: "success" as const,
    বাকি: "warning" as const,
  };
  return <Badge variant={variantMap[status] ?? "neutral"} className={className}>{status}</Badge>;
}

export default StatusTag;