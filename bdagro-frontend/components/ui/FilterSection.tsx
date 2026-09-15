interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

function FilterSection({ title, children }: FilterSectionProps) {
  return (
    <div className="py-5 border-b border-neutral-200">
      <div className="text-sm text-neutral-900 mb-3">{title}</div>
      {children}
    </div>
  );
}

export default FilterSection;
