function RiskBadge({ level }) {
  const styles = {
    কম: "border-emerald-600 text-emerald-800 bg-emerald-50",
    মাঝারি: "border-amber-600 text-amber-800 bg-amber-50",
    বেশি: "border-orange-600 text-orange-800 bg-orange-50",
  };
  return (
    <span
      className={`inline-block border px-2 py-0.5 text-xs ${styles[level]}`}
    >
      ঝুঁকি: {level}
    </span>
  );
}

export default RiskBadge;