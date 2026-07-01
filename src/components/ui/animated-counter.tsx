"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  /** Animation duration in milliseconds. */
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Custom formatter; overrides decimals/prefix/suffix when provided. */
  format?: (value: number) => string;
  className?: string;
}

/**
 * Counts up to `value` on mount. Lightweight requestAnimationFrame — no
 * animation library. Honors the user's reduced-motion preference.
 */
export function AnimatedCounter({
  value,
  duration = 900,
  decimals = 0,
  prefix = "",
  suffix = "",
  format,
  className,
}: AnimatedCounterProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      const id = requestAnimationFrame(() => setDisplay(value));
      return () => cancelAnimationFrame(id);
    }

    let frame = 0;
    const start = performance.now();
    const tick = (time: number) => {
      const progress = Math.min(1, (time - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(value * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  const formatted = format
    ? format(display)
    : display.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      });

  return (
    <span className={cn("tabular-nums", className)}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
