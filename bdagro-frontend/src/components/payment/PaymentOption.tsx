
interface PaymentOptionProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  sub: string;
  selected?: boolean;
}

export function PaymentOption({ icon: Icon, title, sub, selected }: PaymentOptionProps) {
  return (
    <label
      className={`flex items-center gap-4 border p-4 cursor-pointer ${
        selected ? "border-emerald-800 bg-emerald-50" : "border-stone-300"
      }`}
    >
      <input
        type="radio"
        name="payment"
        defaultChecked={selected}
        className="accent-emerald-800"
      />
      <Icon className="w-5 h-5 text-stone-500 shrink-0" />
      <div>
        <div className="text-sm text-stone-800">{title}</div>
        <div className="text-xs text-stone-400 mt-0.5">{sub}</div>
      </div>
    </label>
  );
}