import { ArrowDown, ArrowUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AnalyticsInsights as Insights } from "../queries";

function scoreLabel(score: number): string {
  if (score >= 75) return "Excellent — you're in a strong rhythm.";
  if (score >= 50) return "Solid — steady, consistent progress.";
  if (score >= 25) return "Building momentum.";
  return "Getting started — track a little each day.";
}

function ChangeBadge({ change }: { change: number | null }) {
  if (change === null) {
    return <span className="text-muted-foreground text-xs">no prior data</span>;
  }
  const up = change >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        up ? "text-success" : "text-destructive",
      )}
    >
      {up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
      {Math.abs(change)}% vs last
    </span>
  );
}

function Metric({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: number | null;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-[0.7rem] tracking-wider uppercase">
        {label}
      </span>
      <span className="text-foreground truncate text-xl font-semibold tracking-tight tabular-nums">
        {value}
      </span>
      {change !== undefined ? <ChangeBadge change={change} /> : null}
    </div>
  );
}

/** Productivity score, completion/goal rates, averages and comparisons. */
export function AnalyticsInsights({ insights }: { insights: Insights }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle>Productivity score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-1.5">
            <span className="text-foreground text-4xl font-semibold tracking-tight tabular-nums">
              {insights.productivityScore}
            </span>
            <span className="text-muted-foreground mb-1 text-sm">/ 100</span>
          </div>
          <Progress value={insights.productivityScore} className="mt-3" />
          <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
            {scoreLabel(insights.productivityScore)}
          </p>
        </CardContent>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Key metrics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3">
          <Metric
            label="Completion rate"
            value={`${insights.completionRate}%`}
          />
          <Metric
            label="Avg daily hours"
            value={`${insights.avgDailyHours}h`}
          />
          <Metric
            label="Goal completion"
            value={`${insights.goalCompletion}%`}
          />
          <Metric
            label="Top project"
            value={insights.mostProductiveProject ?? "—"}
          />
          <Metric
            label="This week"
            value={`${insights.weekHours}h`}
            change={insights.weekChangePct}
          />
          <Metric
            label="This month"
            value={`${insights.monthHours}h`}
            change={insights.monthChangePct}
          />
        </CardContent>
      </Card>
    </div>
  );
}
