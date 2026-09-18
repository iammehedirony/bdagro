interface CheckboxProps {
  label: string;
  count: number;
  defaultChecked?: boolean;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

function Checkbox({ label, count, defaultChecked, checked, onChange }: CheckboxProps) {
  return (
    <label className="flex items-center justify-between text-sm text-neutral-600 cursor-pointer py-1">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          checked={checked}
          onChange={onChange ? (event) => onChange(event.target.checked) : undefined}
          className="accent-primary-800 w-3.5 h-3.5"
        />
        {label}
      </span>
      <span className="text-xs text-neutral-300">{count}</span>
    </label>
  );
}

export default Checkbox;
