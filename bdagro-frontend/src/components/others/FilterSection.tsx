function FilterSection({ title, children }) {
  return (
    <div className="py-5 border-b border-stone-200">
      <div className="text-sm text-stone-900 mb-3">{title}</div>
      {children}
    </div>
  );
}

export default FilterSection;