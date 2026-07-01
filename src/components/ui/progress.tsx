import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

interface ProgressProps extends ComponentProps<"div"> {
  /** 0–100. Values outside the range are clamped. */
  value?: number;
}

function Progress({ value = 0, className, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "bg-muted h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <div
        className="bg-primary h-full rounded-full transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

export { Progress };
