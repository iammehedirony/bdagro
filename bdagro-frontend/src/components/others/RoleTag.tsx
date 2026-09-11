export function RoleTag({ role }) {
  const map = {
    Farmer: "border-emerald-600 text-emerald-800 bg-emerald-50",
    Investor: "border-amber-600 text-amber-800 bg-amber-50",
    Admin: "border-stone-400 text-stone-700 bg-stone-100",
  };
  return <span className={`text-xs border px-2 py-0.5 ${map[role]}`}>{role}</span>;
}