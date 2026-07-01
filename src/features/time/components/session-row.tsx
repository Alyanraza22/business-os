"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { deleteSession } from "../actions";
import type { TimeSession } from "../types";

function formatDuration(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${m}m`;
}

function formatStart(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatEnd(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SessionRow({ session }: { session: TimeSession }) {
  const [pending, startTransition] = useTransition();

  function remove() {
    startTransition(async () => {
      const result = await deleteSession(session.id);
      if (result.ok) toast.success("Entry deleted");
      else toast.error(result.message ?? "Could not delete the entry");
    });
  }

  return (
    <div
      className={cn(
        "hover:bg-muted/40 flex items-center gap-3 px-4 py-3 transition-colors",
        pending && "opacity-70",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate text-sm font-medium">
          {session.taskTitle ?? "Untitled session"}
        </span>
        <div className="text-muted-foreground flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
          {session.projectName ? (
            <span className="flex items-center gap-1.5">
              <span
                className="size-2 rounded-full"
                style={{ backgroundColor: session.projectColor ?? undefined }}
              />
              {session.projectName}
            </span>
          ) : null}
          <span>
            {formatStart(session.startedAt)}
            {session.endedAt ? ` – ${formatEnd(session.endedAt)}` : ""}
          </span>
        </div>
      </div>

      <span className="shrink-0 text-sm font-medium tabular-nums">
        {formatDuration(session.durationSeconds ?? 0)}
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground size-8"
        onClick={remove}
        disabled={pending}
        aria-label="Delete entry"
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
