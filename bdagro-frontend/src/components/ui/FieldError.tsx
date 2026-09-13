import {
  type FieldError as RHFFieldError,
} from "react-hook-form";

export function FieldError({ error }: { error?: RHFFieldError | { message?: string } }) {
  if (!error?.message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
      <span className="inline-block w-1 h-1 rounded-full bg-red-600 shrink-0" />
      {error.message}
    </p>
  );
}