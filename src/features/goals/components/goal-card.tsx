"use client";

import {
  CalendarDays,
  CheckCircle2,
  MoreHorizontal,
  Pencil,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Text } from "@/components/ui/typography";
import type { Goal } from "@/lib/supabase/types";

import { deleteGoal, setGoalStatus, updateGoalProgress } from "../actions";
import { GOAL_STATUS_META, GOAL_TYPE_META } from "../constants";
import { GoalDialog } from "./goal-dialog";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function GoalCard({ goal }: { goal: Goal }) {
  const [pending, startTransition] = useTransition();
  const [current, setCurrent] = useState(goal.current);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const completed = goal.status === "completed";
  const status = GOAL_STATUS_META[goal.status];
  const pct =
    goal.target > 0
      ? Math.min(100, Math.max(0, Math.round((current / goal.target) * 100)))
      : 0;

  function commitCurrent(event: React.FocusEvent<HTMLInputElement>) {
    const raw = event.target.value.trim();
    const value = raw === "" ? 0 : Number(raw);
    if (Number.isNaN(value) || value < 0) {
      event.target.value = String(current);
      return;
    }
    if (value === current) return;
    setCurrent(value);
    startTransition(async () => {
      const result = await updateGoalProgress(goal.id, value);
      if (!result.ok) {
        setCurrent(goal.current);
        toast.error(result.message ?? "Could not update progress");
      }
    });
  }

  function toggleComplete() {
    startTransition(async () => {
      const result = await setGoalStatus(
        goal.id,
        completed ? "active" : "completed",
      );
      if (result.ok) {
        toast.success(completed ? "Goal reopened" : "Goal completed");
      } else {
        toast.error(result.message ?? "Update failed");
      }
    });
  }

  async function handleDelete() {
    const result = await deleteGoal(goal.id);
    if (result.ok) {
      toast.success("Goal deleted");
      setDeleteOpen(false);
    } else {
      toast.error(result.message ?? "Delete failed");
    }
  }

  return (
    <Card className={cardClass(pending)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          <h3 className="truncate leading-tight font-semibold">{goal.title}</h3>
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline">{GOAL_TYPE_META[goal.type].label}</Badge>
            <Badge variant={status.badge}>{status.label}</Badge>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground size-8"
              aria-label="Goal actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onSelect={() => setEditOpen(true)}>
              <Pencil />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={toggleComplete}>
              {completed ? <RotateCcw /> : <CheckCircle2 />}
              {completed ? "Reopen" : "Mark complete"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => setDeleteOpen(true)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {goal.description ? (
        <Text variant="muted" className="line-clamp-2">
          {goal.description}
        </Text>
      ) : null}

      <div className="mt-auto flex flex-col gap-2">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span>Progress</span>
          <span>{pct}%</span>
        </div>
        <Progress value={pct} />
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-sm">
            <Input
              type="number"
              min={0}
              step="any"
              defaultValue={current}
              onBlur={commitCurrent}
              onKeyDown={(event) => {
                if (event.key === "Enter") event.currentTarget.blur();
              }}
              className="h-8 w-20"
              aria-label="Current progress"
            />
            <span className="text-muted-foreground">
              / {goal.target}
              {goal.unit ? ` ${goal.unit}` : ""}
            </span>
          </div>
          {goal.deadline ? (
            <span className="text-muted-foreground flex items-center gap-1 text-xs">
              <CalendarDays className="size-3.5" />
              {formatDate(goal.deadline)}
            </span>
          ) : null}
        </div>
      </div>

      <GoalDialog goal={goal} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete goal?"
        description={`"${goal.title}" will be moved to trash. You can restore it later.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </Card>
  );
}

function cardClass(pending: boolean) {
  return [
    "flex flex-col gap-4 p-5 transition-[border-color,box-shadow,opacity] duration-200 hover:border-primary/40 hover:shadow-sm",
    pending ? "opacity-70" : "",
  ].join(" ");
}
