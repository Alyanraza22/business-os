import type { LucideIcon } from "lucide-react";

import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";

interface StatCardProps {
  label: string;
  value: number;
  icon: LucideIcon;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

/** Metric tile with an animated value. Used across the dashboard overview. */
export function StatCard({
  label,
  value,
  icon: Icon,
  prefix,
  suffix,
  decimals,
}: StatCardProps) {
  return (
    <Card className="hover:border-primary/30 transition-colors">
      <CardContent className="flex items-center justify-between gap-4 p-5">
        <div className="flex flex-col gap-1">
          <Text variant="muted" className="text-xs tracking-wide uppercase">
            {label}
          </Text>
          <span className="text-foreground text-2xl font-semibold tracking-tight">
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />
          </span>
        </div>
        <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-lg">
          <Icon className="size-5" />
        </div>
      </CardContent>
    </Card>
  );
}
