import { Upload } from "lucide-react";

interface UploadBoxProps {
  label: string;
  hint: string;
}

function UploadBox({ label, hint }: UploadBoxProps) {
  return (
    <div className="border border-dashed border-neutral-300 p-6 flex flex-col items-center justify-center text-center hover:border-primary-700 transition-colors cursor-pointer">
      <Upload className="w-5 h-5 text-neutral-400" />
      <div className="mt-2 text-sm text-neutral-700">{label}</div>
      <div className="mt-1 text-xs text-neutral-400">{hint}</div>
    </div>
  );
}

export default UploadBox;
