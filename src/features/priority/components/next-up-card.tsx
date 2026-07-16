import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { CommandCenter } from "../queries";

/**
 * The command-center hero: one clear recommendation, the reasons behind it,
 * and what's still outstanding today.
 */
export function NextUpCard({ data }: { data: CommandCenter }) {
  const { nextTask, overdue, remainingHours, remainingToday } = data;

  if (!nextTask) {
    return (
      <Card className="mb-4">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="bg-success/10 text-success flex size-10 shrink-0 items-center justify-center rounded-lg">
            <CheckCircle2 className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-foreground font-medium">Nothing queued up</p>
            <p className="text-muted-foreground text-sm">
              Your plate is clear — plan tomorrow, or take the win.
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/tasks">Open planner</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-4">
      <CardContent className="flex flex-col gap-4 p-5">
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-lg">
            <Sparkles className="size-5" />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-muted-foreground text-[0.7rem] font-medium tracking-wider uppercase">
              Next up
            </p>
            <p className="text-foreground mt-1 text-lg font-semibold tracking-tight">
              {nextTask.title}
            </p>
            {nextTask.projectName ? (
              <p className="text-muted-foreground mt-0.5 text-sm">
                {nextTask.projectName}
              </p>
            ) : null}

            {nextTask.reasons.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {nextTask.reasons.map((reason) => (
                  <span
                    key={reason}
                    className="bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-xs font-medium"
                  >
                    {reason}
                  </span>
                ))}
              </div>
            ) : null}
          </div>

          <Button size="sm" asChild className="shrink-0">
            <Link href="/focus">
              Focus
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        </div>

        <div className="border-border text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs">
          <span className="tabular-nums">
            <span className="text-foreground font-medium">
              {remainingToday}
            </span>{" "}
            {remainingToday === 1 ? "task" : "tasks"} left today
          </span>
          {remainingHours > 0 ? (
            <span className="tabular-nums">
              <span className="text-foreground font-medium">
                {remainingHours}h
              </span>{" "}
              estimated remaining
            </span>
          ) : null}
          {overdue.length > 0 ? (
            <Link
              href="/tasks"
              className="text-destructive ml-auto inline-flex items-center gap-1 font-medium hover:underline"
            >
              <AlertTriangle className="size-3.5" />
              {overdue.length} carried over
            </Link>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
