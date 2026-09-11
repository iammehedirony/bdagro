import { Upload } from "lucide-react";

function UploadBox({ label, hint }) {
  return (
    <div className="border border-dashed border-stone-300 p-6 flex flex-col items-center justify-center text-center hover:border-emerald-700 transition-colors cursor-pointer">
      <Upload className="w-5 h-5 text-stone-400" />
      <div className="mt-2 text-sm text-stone-700">{label}</div>
      <div className="mt-1 text-xs text-stone-400">{hint}</div>
    </div>
  );
}

export default UploadBox;