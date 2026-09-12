interface ToggleProps {
  label: string;
  sub?: string;
  defaultOn?: boolean;
}

export function Toggle({ label, sub, defaultOn }: ToggleProps) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <div className="text-sm text-neutral-800">{label}</div>
        {sub && <div className="text-xs text-neutral-400 mt-0.5">{sub}</div>}
      </div>
      <div
        className={`w-10 h-6 flex items-center px-0.5 cursor-pointer ${
          defaultOn ? "bg-primary-900 justify-end" : "bg-neutral-200 justify-start"
        }`}
      >
        <div className="w-5 h-5 bg-white" />
      </div>
    </div>
  );
}