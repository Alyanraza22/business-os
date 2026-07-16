import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

import type { OnboardingProgress } from "../queries";

/**
 * Activation checklist. Renders only while setup is incomplete; it disappears
 * on its own once every step is done.
 */
export function OnboardingChecklist({
  progress,
}: {
  progress: OnboardingProgress;
}) {
  if (progress.complete) return null;

  return (
    <Card className="mb-6">
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle>Set up your workspace</CardTitle>
          <p className="text-muted-foreground text-sm">
            A few steps to unlock progress tracking, insights and profitability.
          </p>
        </div>
        <span className="text-muted-foreground shrink-0 text-sm tabular-nums">
          {progress.completed}/{progress.total}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Progress value={progress.percent} />

        <ul className="-mx-2 flex flex-col">
          {progress.steps.map((step) =>
            step.done ? (
              <li
                key={step.id}
                className="flex items-center gap-3 rounded-md px-2 py-2"
              >
                <CheckCircle2 className="text-success size-4 shrink-0" />
                <span className="text-muted-foreground text-sm line-through">
                  {step.label}
                </span>
              </li>
            ) : (
              <li key={step.id}>
                <Link
                  href={step.href}
                  className="hover:bg-muted/40 group flex items-center gap-3 rounded-md px-2 py-2 transition-colors"
                >
                  <Circle className="text-muted-foreground size-4 shrink-0" />
                  <span className="flex min-w-0 flex-col">
                    <span className="text-foreground text-sm font-medium">
                      {step.label}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {step.description}
                    </span>
                  </span>
                  <ArrowRight
                    className={cn(
                      "text-muted-foreground ml-auto size-4 shrink-0",
                      "-translate-x-1 opacity-0 transition-all",
                      "group-hover:translate-x-0 group-hover:opacity-100",
                    )}
                    aria-hidden
                  />
                </Link>
              </li>
            ),
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
