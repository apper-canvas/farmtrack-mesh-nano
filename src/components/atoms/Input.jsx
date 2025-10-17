import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({
  className,
  type = "text",
  label,
  error,
  ...props
}, ref) => {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        className={cn(
          "flex w-full rounded-button border-2 border-gray-200 bg-white px-3 py-2.5 text-base transition-colors",
          "placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-0",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "min-h-[44px]",
          error && "border-error focus:border-error",
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="text-sm text-error mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;