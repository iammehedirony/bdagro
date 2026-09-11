function StatusTag({ status }) {
  const map = {
    Approved: "border-emerald-600 text-emerald-800 bg-emerald-50",
    Processing: "border-amber-600 text-amber-800 bg-amber-50",
    Pending: "border-stone-300 text-stone-500 bg-stone-50",
    Rejected: "border-orange-600 text-orange-700 bg-orange-50",
  };
  return (
    <span className={`text-xs border px-2 py-0.5 ${map[status]}`}>{status}</span>
  );
}

export default StatusTag;