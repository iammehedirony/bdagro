"use client";

import { useRef } from "react";
import { Upload, CheckCircle2, X } from "lucide-react";

interface UploadBoxProps {
  label: string;
  hint: string;
  file?: File | null;
  onChange?: (file: File | null) => void;
  accept?: string;
}

function UploadBox({
  label,
  hint,
  file,
  onChange,
  accept = "image/*",
}: UploadBoxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    onChange?.(selected);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div
      onClick={handleClick}
      className="border border-dashed border-neutral-300 p-6 flex flex-col items-center justify-center text-center hover:border-primary-700 transition-colors cursor-pointer relative"
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleFileChange}
      />

      {file ? (
        <>
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-1.5 right-1.5 text-neutral-300 hover:text-neutral-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <CheckCircle2 className="w-5 h-5 text-emerald-700" />
          <div className="mt-2 text-sm text-neutral-700 truncate max-w-[150px]">
            {file.name}
          </div>
          <div className="mt-1 text-xs text-emerald-700">যোগ হয়েছে · পরিবর্তন করতে ক্লিক করুন</div>
        </>
      ) : (
        <>
          <Upload className="w-5 h-5 text-neutral-400" />
          <div className="mt-2 text-sm text-neutral-700">{label}</div>
          <div className="mt-1 text-xs text-neutral-400">{hint}</div>
        </>
      )}
    </div>
  );
}

export default UploadBox;