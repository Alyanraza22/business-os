"use client";

import { Square, Timer } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { stopTimer } from "@/features/tasks/timer-actions";

import type { ActiveSession } from "../types";

function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ActiveTimerCard({
  session,
}: {
  session: ActiveSession | null;
}) {
  const [now, setNow] = useState(() => Date.now());
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [session]);

  if (!session) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-8 text-center">
          <div className="bg-muted text-muted-foreground flex size-11 items-center justify-center rounded-full">
            <Timer className="size-5" />
          </div>
          <Text variant="muted" className="max-w-xs">
            No timer running. Start one from a task in the Daily Planner.
          </Text>
          <Button asChild variant="outline" size="sm">
            <Link href="/tasks">Go to Daily Planner</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const elapsed = Math.max(
    0,
    Math.floor((now - Date.parse(session.startedAt)) / 1000),
  );

  function stop() {
    startTransition(async () => {
      const result = await stopTimer();
      if (result.ok) toast.success("Timer stopped");
      else toast.error(result.message ?? "Could not stop the timer");
    });
  }

  return (
    <Card className="border-primary/40 bg-primary/5">
      <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div className="flex min-w-0 items-center gap-3">
          <span className="relative flex size-2.5 shrink-0">
            <span className="bg-primary absolute inline-flex size-full animate-ping rounded-full opacity-60" />
            <span className="bg-primary relative inline-flex size-2.5 rounded-full" />
          </span>
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-medium">
              {session.taskTitle ?? "Running session"}
            </span>
            {session.projectName ? (
              <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: session.projectColor ?? undefined }}
                />
                {session.projectName}
              </span>
            ) : (
              <span className="text-muted-foreground text-xs">No project</span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-primary text-3xl font-semibold tabular-nums">
            {formatClock(elapsed)}
          </span>
          <Button
            variant="destructive"
            onClick={stop}
            loading={pending}
            className="gap-2"
          >
            <Square className="size-4" />
            Stop
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
