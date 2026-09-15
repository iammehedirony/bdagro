import React, { forwardRef } from "react";

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  suffix?: React.ReactNode;
}

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, placeholder, type = "text", suffix, readOnly, ...props }, ref) => {
    return (
      <div>
        <label className="text-sm text-neutral-700">{label}</label>
        <div className="mt-1.5 flex items-center border border-neutral-300 focus-within:border-emerald-700">
          <input
            ref={ref} // React Hook Form-এর ref এখানে যুক্ত হলো
            type={type}
            placeholder={placeholder}
            className={`flex-1 px-3 py-2.5 text-sm outline-none placeholder:text-neutral-300 ${
              readOnly
                ? "bg-neutral-50 text-neutral-500 cursor-not-allowed"
                : "bg-white text-neutral-900"
            }`}
            readOnly={readOnly}
            {...props} // register-এর onChange, onBlur, name ইত্যাদি সব প্রপস এখানে পাস হয়ে গেল
          />
          {suffix && suffix}
        </div>
      </div>
    );
  }
);

Field.displayName = "Field";

export default Field;