interface PermissionCheckProps {
  checked: boolean;
}

export function PermissionCheck({ checked }: PermissionCheckProps) {
  return (
    <div className="flex justify-center">
      <input type="checkbox" defaultChecked={checked} className="accent-primary-800 w-4 h-4" />
    </div>
  );
}