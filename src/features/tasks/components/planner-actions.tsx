"use client";

import { CopyPlus, MoveRight } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { carryOverUnfinished, copyPreviousDayPlan } from "../actions";

/** Bulk day-level helpers that save rebuilding a plan by hand. */
export function PlannerActions({ date }: { date: string }) {
  const [pending, startTransition] = useTransition();

  function carryOver() {
    startTransition(async () => {
      const result = await carryOverUnfinished(date);
      if (!result.ok) {
        toast.error(result.message ?? "Could not carry tasks over");
        return;
      }
      toast.success(
        result.count === 0
          ? "Nothing left behind — you're all caught up"
          : `Moved ${result.count} unfinished ${
              result.count === 1 ? "task" : "tasks"
            } to this day`,
      );
    });
  }

  function copyPrevious() {
    startTransition(async () => {
      const result = await copyPreviousDayPlan(date);
      if (!result.ok) {
        toast.error(result.message ?? "Could not copy the previous plan");
        return;
      }
      toast.success(`Copied ${result.count} tasks from your last plan`);
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={carryOver}
        disabled={pending}
      >
        <MoveRight className="size-3.5" />
        Carry over unfinished
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={copyPrevious}
        disabled={pending}
      >
        <CopyPlus className="size-3.5" />
        Copy previous day
      </Button>
    </div>
  );
}
