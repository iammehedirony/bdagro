function Field({ label, placeholder, type = "text", suffix }) {
  return (
    <div>
      <label className="text-sm text-stone-700">{label}</label>
      <div className="mt-1.5 flex items-center border border-stone-300 focus-within:border-emerald-700">
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 px-3 py-2.5 text-sm outline-none placeholder:text-stone-300"
        />
        {suffix}
      </div>
    </div>
  );
}

export default Field;