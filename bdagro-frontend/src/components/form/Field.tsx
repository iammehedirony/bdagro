
interface FieldProps {
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password";
  suffix?: React.ReactNode;
  value?: string | number;
  readOnly?: boolean;
}

function Field({ label, placeholder, type = "text", suffix, value, readOnly }: FieldProps) {
  return (
    <div>
      <label className="text-sm text-stone-700">{label}</label>
      <div className="mt-1.5 flex items-center border border-stone-300 focus-within:border-emerald-700">
        <input
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          className={`mt-1.5 w-full border px-3 py-2.5 text-sm outline-none placeholder:text-stone-300 ${
          readOnly
            ? "border-stone-200 bg-stone-50 text-stone-500"
            : "border-stone-300 focus:border-emerald-700"
        }`}
          value={value}
          readOnly={readOnly}
        />
        {suffix && suffix}
      </div>
    </div>
  );
}

export default Field;