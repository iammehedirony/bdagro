export 
function PermissionCheck({ checked }) {
  return (
    <div className="flex justify-center">
      <input type="checkbox" defaultChecked={checked} className="accent-emerald-800 w-4 h-4" />
    </div>
  );
}