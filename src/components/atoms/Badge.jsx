import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const variants = {
    default: "bg-surface text-white",
    discount: "bg-secondary text-white",
    accent: "bg-accent text-black",
    success: "bg-success text-white",
    warning: "bg-warning text-black",
    error: "bg-error text-white"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Badge.displayName = "Badge";

export default Badge;