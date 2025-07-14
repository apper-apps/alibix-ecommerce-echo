import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary shadow-lg hover:shadow-xl",
    secondary: "bg-surface text-white border border-white/20 hover:bg-white/10 focus:ring-white/50",
    accent: "bg-accent text-black hover:bg-accent/90 focus:ring-accent shadow-lg hover:shadow-xl",
    outline: "border-2 border-secondary text-secondary hover:bg-secondary hover:text-white focus:ring-secondary",
    ghost: "text-white hover:bg-white/10 focus:ring-white/50"
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
    xl: "h-14 px-8 text-lg"
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;