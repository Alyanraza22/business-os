import { Activity } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { BusinessHealth } from "../queries";

function toneFor(score: number): string {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-primary";
  if (score >= 25) return "text-warning";
  return "text-destructive";
}

/** The CEO-level read: one number, and exactly what fed it. */
export function BusinessHealthCard({ health }: { health: BusinessHealth }) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="flex items-center gap-2">
          <Activity className="text-muted-foreground size-4" />
          Business health
        </CardTitle>
        <span className={cn("text-xs font-medium", toneFor(health.score))}>
          {health.label}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div>
          <div className="flex items-end gap-1.5">
            <span
              className={cn(
                "text-4xl font-semibold tracking-tight tabular-nums",
                toneFor(health.score),
              )}
            >
              {health.score}
            </span>
            <span className="text-muted-foreground mb-1 text-sm">/ 100</span>
          </div>
          <Progress value={health.score} className="mt-3" />
        </div>

        <ul className="border-border flex flex-col gap-2 border-t pt-3">
          {health.factors.map((factor) => (
            <li key={factor.label} className="flex items-center gap-3 text-xs">
              <span className="text-muted-foreground w-24 shrink-0">
                {factor.label}
              </span>
              <div className="bg-muted h-1.5 flex-1 overflow-hidden rounded-full">
                <div
                  className="bg-primary h-full rounded-full"
                  style={{ width: `${factor.value}%` }}
                />
              </div>
              <span className="text-foreground w-9 shrink-0 text-right font-medium tabular-nums">
                {factor.value}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
