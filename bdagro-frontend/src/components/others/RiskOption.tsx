interface RiskOptionProps {
  label: string;
  desc: string;
  selected?: boolean;
}

function RiskOption({ label, desc, selected }: RiskOptionProps) {
  return (
    <label
      className={`flex items-start gap-3 border p-4 cursor-pointer ${
        selected ? "border-emerald-800 bg-emerald-50" : "border-stone-300"
      }`}
    >
      <input
        type="radio"
        name="risk"
        defaultChecked={selected}
        className="accent-emerald-800 mt-1"
      />
      <div>
        <div className="text-sm text-stone-800">{label}</div>
        <div className="text-xs text-stone-400 mt-0.5">{desc}</div>
      </div>
    </label>
  );
}

export default RiskOption;