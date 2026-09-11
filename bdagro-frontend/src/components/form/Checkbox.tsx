function Checkbox({ label, count, defaultChecked }) {
  return (
    <label className="flex items-center justify-between text-sm text-stone-600 cursor-pointer py-1">
      <span className="flex items-center gap-2">
        <input
          type="checkbox"
          defaultChecked={defaultChecked}
          className="accent-emerald-800 w-3.5 h-3.5"
        />
        {label}
      </span>
      <span className="text-xs text-stone-300">{count}</span>
    </label>
  );
}

export default Checkbox;