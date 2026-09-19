import { forwardRef } from "react";

interface RiskOptionProps {
  label: string;
  desc: string;
  value: string;
  checked?: boolean;
  onChange?: () => void;
}

const RiskOption = forwardRef<HTMLInputElement, RiskOptionProps>(
  ({ label, desc, value, checked, onChange }, ref) => {
    return (
      <label
        className={`flex items-start gap-3 border p-4 cursor-pointer ${
          checked ? "border-emerald-800 bg-emerald-50" : "border-stone-300"
        }`}
      >
        <input
          ref={ref}
          type="radio"
          name="risk"
          value={value}
          checked={checked}
          onChange={onChange}
          className="accent-emerald-800 mt-1"
        />
        <div>
          <div className="text-sm text-stone-800">{label}</div>
          <div className="text-xs text-stone-400 mt-0.5">{desc}</div>
        </div>
      </label>
    );
  }
);

RiskOption.displayName = "RiskOption";

export default RiskOption;