interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "neutral";
  size?: "sm" | "md";
  className?: string;
}

function Badge({ children, variant = "neutral", size = "sm", className }: BadgeProps) {
  const variantStyles = {
    success: "border-state-success-border text-state-success-text bg-state-success-bg",
    warning: "border-state-warning-border text-state-warning-text bg-state-warning-bg",
    danger: "border-state-danger-border text-state-danger-text bg-state-danger-bg",
    neutral: "border-neutral-300 text-neutral-600 bg-neutral-50",
  };

  const sizeStyles = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
  };

  return (
    <span
      className={`inline-block border ${variantStyles[variant]} ${sizeStyles[size]} ${className || ""}`}
    >
      {children}
    </span>
  );
}

export default Badge;
