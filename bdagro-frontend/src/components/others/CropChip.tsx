function CropChip({ label, selected }) {
  return (
    <span
      className={`px-3 py-1.5 text-sm border cursor-pointer ${
        selected
          ? "border-emerald-800 bg-emerald-50 text-emerald-900"
          : "border-stone-300 text-stone-500 hover:border-emerald-700"
      }`}
    >
      {label}
    </span>
  );
}

export default CropChip;