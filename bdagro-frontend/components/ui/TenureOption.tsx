
interface TenureOptionProps {
  label: string;
  selected?: boolean;
}

export function TenureOption({ label, selected }: TenureOptionProps) {
  return (
    <button
      className={`py-2.5 text-sm border ${
        selected
          ? "border-emerald-800 bg-emerald-50 text-emerald-900"
          : "border-stone-300 text-stone-600 hover:border-emerald-700"
      }`}
    >
      {label}
    </button>
  );
}