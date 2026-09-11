
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
      <label className="text-sm text-neutral-700">{label}</label>
      <div className="mt-1.5 flex items-center border border-neutral-300 focus-within:border-primary-700">
        <input
          type={type}
          defaultValue={value}
          placeholder={placeholder}
          className={`flex-1 px-3 py-2.5 text-sm outline-none placeholder:text-neutral-300 ${
            readOnly
              ? "bg-neutral-50 text-neutral-500 cursor-not-allowed"
              : "bg-white text-neutral-900"
          }`}
          readOnly={readOnly}
        />
        {suffix && suffix}
      </div>
    </div>
  );
}

export default Field;