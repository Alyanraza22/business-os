"use client";

import { Pause, Play, Square } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { startTimer, stopTimer } from "../timer-actions";

function formatClock(totalSeconds: number) {
  const seconds = Math.max(0, totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

interface TaskTimerProps {
  taskId: string;
  baseSeconds: number;
  running: boolean;
  startedAt: string | null;
}

export function TaskTimer({
  taskId,
  baseSeconds,
  running,
  startedAt,
}: TaskTimerProps) {
  const [now, setNow] = useState(() => Date.now());
  const [pending, startTransition] = useTransition();
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Tick every second while running; `now` is only updated in the interval
  // callback (never in render or synchronously in the effect body).
  useEffect(() => {
    if (!running) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [running]);

  const liveExtra =
    running && startedAt
      ? Math.max(0, Math.floor((now - Date.parse(startedAt)) / 1000))
      : 0;
  const total = baseSeconds + liveExtra;

  function begin(force: boolean) {
    startTransition(async () => {
      const result = await startTimer(taskId, force);
      if (result.ok) return;
      if (result.conflict) {
        setConfirmOpen(true);
        return;
      }
      toast.error(result.message ?? "Could not start the timer");
    });
  }

  function halt() {
    startTransition(async () => {
      const result = await stopTimer();
      if (!result.ok) toast.error(result.message ?? "Could not stop the timer");
    });
  }

  return (
    <div className="flex items-center gap-1">
      <span
        className={cn(
          "w-16 shrink-0 text-right text-xs tabular-nums",
          running ? "text-foreground font-medium" : "text-muted-foreground",
        )}
      >
        {total > 0 || running ? formatClock(total) : "—"}
      </span>

      {running ? (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="text-warning size-7"
            onClick={halt}
            disabled={pending}
            aria-label="Pause timer"
          >
            <Pause className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive size-7"
            onClick={halt}
            disabled={pending}
            aria-label="Stop timer"
          >
            <Square className="size-4" />
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          className="text-success size-7"
          onClick={() => begin(false)}
          disabled={pending}
          aria-label={baseSeconds > 0 ? "Resume timer" : "Start timer"}
        >
          <Play className="size-4" />
        </Button>
      )}

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="A timer is already running"
        description="Stop the running timer and start this one instead?"
        confirmLabel="Switch"
        onConfirm={() => {
          setConfirmOpen(false);
          begin(true);
        }}
      />
    </div>
  );
}
