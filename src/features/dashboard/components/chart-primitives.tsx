"use client";

import { Text } from "@/components/ui/typography";

/** Centered empty state shown inside a chart card when there's no data. */
export function ChartEmpty({ message }: { message: string }) {
  return (
    <div className="flex h-[220px] items-center justify-center">
      <Text variant="muted" className="max-w-[20ch] text-center">
        {message}
      </Text>
    </div>
  );
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: Array<{ value?: number | string }>;
  formatter?: (value: number) => string;
}

/** Themed tooltip injected into Recharts via the `content` prop. */
export function ChartTooltip({
  active,
  label,
  payload,
  formatter,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const value = Number(payload[0]?.value ?? 0);

  return (
    <div className="border-border bg-popover rounded-lg border px-3 py-2 shadow-md">
      <p className="text-foreground text-xs font-medium">{label}</p>
      <p className="text-muted-foreground text-xs">
        {formatter ? formatter(value) : value}
      </p>
    </div>
  );
}
