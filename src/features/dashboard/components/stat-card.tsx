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
    <Card className="group hover:border-primary/30 transition-colors">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="flex flex-col gap-1.5">
          <Text
            variant="muted"
            className="text-[0.7rem] font-medium tracking-wider uppercase"
          >
            {label}
          </Text>
          <span className="text-foreground text-2xl font-semibold tracking-tight tabular-nums">
            <AnimatedCounter
              value={value}
              prefix={prefix}
              suffix={suffix}
              decimals={decimals}
            />
          </span>
        </div>
        <div className="bg-muted text-muted-foreground group-hover:text-foreground flex size-9 items-center justify-center rounded-md">
          <Icon className="size-[1.15rem]" aria-hidden />
        </div>
      </CardContent>
    </Card>
  );
}
