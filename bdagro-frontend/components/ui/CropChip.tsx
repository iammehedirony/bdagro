interface CropChipProps {
  label: string;
  selected?: boolean;
}

function CropChip({ label, selected }: CropChipProps) {
  return (
    <span
      className={`px-3 py-1.5 text-sm border cursor-pointer ${
        selected
          ? "border-primary-800 bg-primary-50 text-primary-900"
          : "border-neutral-300 text-neutral-500 hover:border-primary-700"
      }`}
    >
      {label}
    </span>
  );
}

export default CropChip;
