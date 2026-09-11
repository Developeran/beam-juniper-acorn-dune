import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-border bg-surface px-3 text-sm text-fg outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-subtle",
        "focus-visible:border-fg/30 focus-visible:shadow-[0_0_0_3px_rgb(26_95_180/0.15)]",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
