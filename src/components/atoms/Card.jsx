import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ 
  className, 
  children, 
  ...props 
}, ref) => {
  return (
    <div
      className={cn(
        "rounded-lg bg-surface border border-white/10 shadow-lg hover:shadow-xl transition-all duration-200",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;