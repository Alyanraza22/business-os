"use client";

import {
  CalendarDays,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { ConfirmDialog } from "@/components/layout/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { PRIORITY_META } from "@/features/shared/constants";
import type { Enums, ProjectTask } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { VISIBLE_TASK_STATUSES } from "@/lib/enums";

import { deleteProjectTask, setProjectTaskStatus } from "../actions";
import { PROJECT_TASK_STATUS_META } from "../constants";
import { ProjectTaskDialog } from "./project-task-dialog";

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function ProjectTaskRow({ task }: { task: ProjectTask }) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Enums<"task_status">>(task.status);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const completed = status === "completed";
  const priority = PRIORITY_META[task.priority];

  function changeStatus(next: Enums<"task_status">) {
    const previous = status;
    setStatus(next);
    startTransition(async () => {
      const result = await setProjectTaskStatus(task.id, next);
      if (!result.ok) {
        setStatus(previous);
        toast.error(result.message ?? "Update failed");
      }
    });
  }

  async function handleDelete() {
    const result = await deleteProjectTask(task.id);
    if (result.ok) {
      toast.success("Deliverable deleted");
      setDeleteOpen(false);
    } else {
      toast.error(result.message ?? "Delete failed");
    }
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-4 py-3",
        pending && "opacity-70",
      )}
    >
      <button
        type="button"
        onClick={() => changeStatus(completed ? "todo" : "completed")}
        disabled={pending}
        aria-pressed={completed}
        aria-label={completed ? "Mark as not complete" : "Mark as complete"}
        className={cn(
          "focus-visible:ring-ring shrink-0 rounded-full transition-colors outline-none focus-visible:ring-2",
          completed
            ? "text-success"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {completed ? (
          <CheckCircle2 className="size-5" />
        ) : (
          <Circle className="size-5" />
        )}
      </button>

      <span
        className={cn(
          "min-w-0 flex-1 truncate text-sm font-medium",
          completed && "text-muted-foreground line-through",
        )}
      >
        {task.title}
      </span>

      {task.due_date ? (
        <span className="text-muted-foreground hidden items-center gap-1 text-xs sm:flex">
          <CalendarDays className="size-3.5" />
          {formatDate(task.due_date)}
        </span>
      ) : null}

      <Badge variant={priority.badge} className="hidden sm:inline-flex">
        {priority.label}
      </Badge>

      <Select
        value={status}
        onValueChange={(value) => changeStatus(value as Enums<"task_status">)}
      >
        <SelectTrigger
          className="hover:border-border h-8 w-auto gap-1 border-transparent bg-transparent px-2 shadow-none"
          aria-label="Status"
        >
          <Badge variant={PROJECT_TASK_STATUS_META[status].badge}>
            {PROJECT_TASK_STATUS_META[status].label}
          </Badge>
        </SelectTrigger>
        <SelectContent>
          {VISIBLE_TASK_STATUSES.map((value) => (
            <SelectItem key={value} value={value}>
              {PROJECT_TASK_STATUS_META[value].label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground size-8"
            aria-label="Deliverable actions"
          >
            <MoreHorizontal className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setEditOpen(true)}>
            <Pencil />
            Edit
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

      <ProjectTaskDialog
        projectId={task.project_id}
        task={task}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete deliverable?"
        description={`"${task.title}" will be moved to trash. You can restore it later.`}
        confirmLabel="Delete"
        destructive
        onConfirm={handleDelete}
      />
    </div>
  );
}
