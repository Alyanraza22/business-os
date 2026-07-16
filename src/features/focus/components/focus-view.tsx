"use client";

import { Check, Pause, Play, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toggleTaskStatus } from "@/features/tasks/actions";
import { startTimer, stopTimer } from "@/features/tasks/timer-actions";
import { cn } from "@/lib/utils";

import type { FocusSession } from "../queries";

function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function FocusView({ session }: { session: FocusSession }) {
  const { task, running, startedAt, reasons, todayDone, todayTotal } = session;
  const [now, setNow] = useState(() => Date.now());
  const [pending, startTransition] = useTransition();

  // Tick only while a session is live; `now` is never written during render.
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const elapsed =
    running && startedAt
      ? Math.max(0, Math.floor((now - Date.parse(startedAt)) / 1000))
      : 0;
  const pct = todayTotal > 0 ? Math.round((todayDone / todayTotal) * 100) : 0;

  if (!task) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-foreground text-xl font-semibold tracking-tight">
          Nothing to focus on
        </p>
        <p className="text-muted-foreground max-w-sm text-sm">
          Your plate is clear. Plan some work in the Daily Planner and come back
          when you&apos;re ready to go deep.
        </p>
        <Button variant="outline" asChild>
          <Link href="/tasks">Open planner</Link>
        </Button>
      </div>
    );
  }

  function toggleTimer() {
    startTransition(async () => {
      const result = running
        ? await stopTimer()
        : await startTimer(task!.id, true);
      if (!result.ok) toast.error(result.message ?? "Timer action failed");
    });
  }

  function complete() {
    startTransition(async () => {
      if (running) await stopTimer();
      const result = await toggleTaskStatus(task!.id, true);
      if (result.ok) toast.success("Task completed");
      else toast.error(result.message ?? "Could not complete the task");
    });
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="flex items-center justify-between px-6 py-5">
        <span className="text-muted-foreground text-[0.7rem] font-medium tracking-wider uppercase">
          Focus mode
        </span>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard">
            <X className="size-4" />
            Exit
          </Link>
        </Button>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 pb-16">
        <div className="flex w-full max-w-xl flex-col items-center gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            {task.projectName ? (
              <span className="text-muted-foreground text-sm">
                {task.projectName}
              </span>
            ) : null}
            <h1 className="text-foreground text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {task.title}
            </h1>
            {reasons.length > 0 ? (
              <div className="mt-1 flex flex-wrap justify-center gap-1.5">
                {reasons.map((reason) => (
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

          <p
            className={cn(
              "text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl",
              running ? "text-primary" : "text-muted-foreground/40",
            )}
          >
            {formatClock(elapsed)}
          </p>

          <div className="flex items-center gap-3">
            <Button size="lg" onClick={toggleTimer} loading={pending}>
              {running ? (
                <>
                  <Pause className="size-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Start focus
                </>
              )}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={complete}
              disabled={pending}
            >
              <Check className="size-4" />
              Done
            </Button>
          </div>

          {task.notes ? (
            <p className="text-muted-foreground max-w-md text-sm leading-relaxed whitespace-pre-wrap">
              {task.notes}
            </p>
          ) : null}
        </div>
      </main>

      {todayTotal > 0 ? (
        <footer className="mx-auto w-full max-w-xl px-6 pb-8">
          <div className="text-muted-foreground mb-2 flex items-center justify-between text-xs">
            <span>Today</span>
            <span className="tabular-nums">
              {todayDone} of {todayTotal} done
            </span>
          </div>
          <Progress value={pct} />
        </footer>
      ) : null}
    </div>
  );
}
