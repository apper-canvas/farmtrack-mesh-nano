import React from "react";
import { cn } from "@/utils/cn";

const Card = React.forwardRef(({
  children,
  className,
  hover = false,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-card shadow-card transition-all duration-200",
        hover && "hover:shadow-elevated hover:-translate-y-0.5 cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;