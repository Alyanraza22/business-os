import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { FocusTask } from "../types";

const PRIORITY_DOT: Record<FocusTask["priority"], string> = {
  urgent: "bg-destructive",
  high: "bg-warning",
  medium: "bg-muted-foreground/50",
  low: "bg-muted-foreground/30",
};

interface TodaysFocusProps {
  tasks: FocusTask[];
  total: number;
  done: number;
}

/** Today's pending tasks, each linking straight into the Daily Planner. */
export function TodaysFocus({ tasks, total, done }: TodaysFocusProps) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>Today&apos;s focus</CardTitle>
        <Link
          href="/tasks"
          className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 text-xs font-medium transition-colors"
        >
          Open planner
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col">
        {tasks.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-8 text-center">
            <CheckCircle2 className="text-success size-8" />
            <p className="text-foreground text-sm font-medium">
              {total > 0
                ? "Everything's done for today"
                : "Nothing planned yet"}
            </p>
            <p className="text-muted-foreground text-sm">
              {total > 0
                ? "Great work — enjoy the clear runway."
                : "Add tasks in the Daily Planner to get started."}
            </p>
          </div>
        ) : (
          <ul className="-mx-2 flex flex-col">
            {tasks.map((task) => (
              <li key={task.id}>
                <Link
                  href="/tasks"
                  className="hover:bg-muted/40 group flex items-center gap-3 rounded-md px-2 py-2 transition-colors"
                >
                  <Circle className="text-muted-foreground size-4 shrink-0" />
                  <span className="text-foreground min-w-0 flex-1 truncate text-sm">
                    {task.title}
                  </span>
                  {task.projectName ? (
                    <span className="text-muted-foreground hidden max-w-[8rem] truncate text-xs sm:inline">
                      {task.projectName}
                    </span>
                  ) : null}
                  <span
                    className={cn(
                      "size-2 shrink-0 rounded-full",
                      PRIORITY_DOT[task.priority],
                    )}
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        )}

        {total > 0 ? (
          <div className="mt-auto flex flex-col gap-2 pt-4">
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span>
                {done} of {total} done
              </span>
              <span className="tabular-nums">{pct}%</span>
            </div>
            <Progress value={pct} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
