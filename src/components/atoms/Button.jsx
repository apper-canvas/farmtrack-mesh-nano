import React from "react";
import { cn } from "@/utils/cn";

const Button = React.forwardRef(({
  children,
  className,
  variant = "primary",
  size = "default",
  disabled = false,
  ...props
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center rounded-button font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-600 focus:ring-primary-500 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    secondary: "bg-secondary text-white hover:bg-secondary-600 focus:ring-secondary-500 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    accent: "bg-accent text-white hover:bg-accent-600 focus:ring-accent-500 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-primary hover:text-white focus:ring-primary-500",
    ghost: "bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500",
    danger: "bg-error text-white hover:bg-red-700 focus:ring-red-500 shadow-sm hover:shadow-md"
  };
  
  const sizes = {
    small: "px-3 py-1.5 text-sm min-h-[36px]",
    default: "px-4 py-2 text-base min-h-[44px]",
    large: "px-6 py-3 text-lg min-h-[52px]"
  };
  
  return (
    <button
      ref={ref}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;