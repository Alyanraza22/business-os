"use client";

import { CheckCircle2, Circle, MoreHorizontal, Trash2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PRIORITY_META } from "@/features/shared/constants";
import type { Enums } from "@/lib/supabase/types";
import { cn } from "@/lib/utils";
import { PRIORITIES, VISIBLE_TASK_STATUSES } from "@/lib/enums";

import { deleteTask, toggleTaskStatus, updateTaskFields } from "../actions";
import { TASK_STATUS_META } from "../constants";
import type { ProjectOption, ProjectTaskOption, WorksheetTask } from "../types";
import { TaskTimer } from "./task-timer";

const CELL_INPUT =
  "h-9 w-full rounded-md border border-transparent bg-transparent px-2 text-sm outline-none transition-colors hover:border-border focus:border-ring focus:bg-background";
const CELL_SELECT =
  "h-9 w-full min-w-0 gap-1 border-transparent bg-transparent px-2 shadow-none hover:border-border focus:ring-1";

const NONE = "none";

interface WorksheetRowProps {
  task: WorksheetTask;
  projects: ProjectOption[];
  projectTasks: ProjectTaskOption[];
  runningTaskId: string | null;
  runningStartedAt: string | null;
}

export function WorksheetRow({
  task,
  projects,
  projectTasks,
  runningTaskId,
  runningStartedAt,
}: WorksheetRowProps) {
  const [pending, startTransition] = useTransition();
  const [status, setStatus] = useState<Enums<"task_status">>(task.status);
  const [priority, setPriority] = useState<Enums<"priority">>(task.priority);
  const [projectId, setProjectId] = useState(task.project_id ?? NONE);
  const [projectTaskId, setProjectTaskId] = useState(
    task.project_task_id ?? NONE,
  );
  const completed = status === "completed";
  const linkedProjectTasks = projectTasks.filter(
    (option) => option.project_id === projectId,
  );

  function run(patch: Record<string, unknown>) {
    startTransition(async () => {
      const result = await updateTaskFields(task.id, patch);
      if (!result.ok) toast.error(result.message ?? "Update failed");
    });
  }

  function toggle() {
    const next = !completed;
    setStatus(next ? "completed" : "todo");
    startTransition(async () => {
      const result = await toggleTaskStatus(task.id, next);
      if (!result.ok) {
        setStatus(task.status);
        toast.error(result.message ?? "Update failed");
      }
    });
  }

  function remove() {
    startTransition(async () => {
      const result = await deleteTask(task.id);
      if (result.ok) toast.success("Task deleted");
      else toast.error(result.message ?? "Delete failed");
    });
  }

  function changeProject(value: string) {
    setProjectId(value);
    setProjectTaskId(NONE);
    run({
      project_id: value === NONE ? null : value,
      project_task_id: null,
    });
  }

  function changeProjectTask(value: string) {
    setProjectTaskId(value);
    run({ project_task_id: value === NONE ? null : value });
  }

  function commitTitle(event: React.FocusEvent<HTMLInputElement>) {
    const value = event.target.value.trim();
    if (value === task.title) return;
    if (value === "") {
      event.target.value = task.title;
      return;
    }
    run({ title: value });
  }

  function commitNotes(event: React.FocusEvent<HTMLInputElement>) {
    const value = event.target.value.trim();
    if (value === (task.description ?? "")) return;
    run({ description: value === "" ? null : value });
  }

  function commitEstimate(event: React.FocusEvent<HTMLInputElement>) {
    const raw = event.target.value.trim();
    const value = raw === "" ? null : Number(raw);
    if (value !== null && Number.isNaN(value)) return;
    if (value === (task.estimated_hours ?? null)) return;
    run({ estimated_hours: value });
  }

  return (
    <tr
      className={cn(
        "border-border hover:bg-muted/40 border-b transition-colors [&>td]:py-1",
        pending && "opacity-70",
      )}
    >
      <td className="px-2">
        <button
          type="button"
          onClick={toggle}
          disabled={pending}
          aria-pressed={completed}
          aria-label={completed ? "Mark as not done" : "Mark as done"}
          className={cn(
            "focus-visible:ring-ring rounded-full transition-colors outline-none focus-visible:ring-2",
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
      </td>

      <td className="px-1">
        <input
          defaultValue={task.title}
          onBlur={commitTitle}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          className={cn(
            CELL_INPUT,
            completed && "text-muted-foreground line-through",
          )}
          aria-label="Task name"
        />
      </td>

      <td className="hidden px-1 md:table-cell">
        <Select value={projectId} onValueChange={changeProject}>
          <SelectTrigger className={CELL_SELECT} aria-label="Project">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>No project</SelectItem>
            {projects.map((project) => (
              <SelectItem key={project.id} value={project.id}>
                {project.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      <td className="hidden px-1 md:table-cell">
        <Select
          value={projectTaskId}
          onValueChange={changeProjectTask}
          disabled={projectId === NONE || linkedProjectTasks.length === 0}
        >
          <SelectTrigger className={CELL_SELECT} aria-label="Project task">
            <SelectValue placeholder="—" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE}>None</SelectItem>
            {linkedProjectTasks.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      <td className="px-1">
        <Select
          value={status}
          onValueChange={(value) => {
            setStatus(value as Enums<"task_status">);
            run({ status: value });
          }}
        >
          <SelectTrigger className={CELL_SELECT} aria-label="Status">
            <Badge variant={TASK_STATUS_META[status].badge}>
              {TASK_STATUS_META[status].label}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {VISIBLE_TASK_STATUSES.map((value) => (
              <SelectItem key={value} value={value}>
                {TASK_STATUS_META[value].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      <td className="hidden px-1 md:table-cell">
        <Select
          value={priority}
          onValueChange={(value) => {
            setPriority(value as Enums<"priority">);
            run({ priority: value });
          }}
        >
          <SelectTrigger className={CELL_SELECT} aria-label="Priority">
            <Badge variant={PRIORITY_META[priority].badge}>
              {PRIORITY_META[priority].label}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((value) => (
              <SelectItem key={value} value={value}>
                {PRIORITY_META[value].label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </td>

      <td className="hidden px-1 md:table-cell">
        <input
          type="number"
          min={0}
          step="0.5"
          defaultValue={task.estimated_hours ?? ""}
          onBlur={commitEstimate}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          className={cn(CELL_INPUT, "w-20")}
          aria-label="Estimated hours"
        />
      </td>

      <td className="px-2">
        <TaskTimer
          taskId={task.id}
          baseSeconds={task.actualSeconds}
          running={runningTaskId === task.id}
          startedAt={runningTaskId === task.id ? runningStartedAt : null}
        />
      </td>

      <td className="hidden px-1 md:table-cell">
        <input
          defaultValue={task.description ?? ""}
          onBlur={commitNotes}
          onKeyDown={(event) => {
            if (event.key === "Enter") event.currentTarget.blur();
          }}
          placeholder="—"
          className={CELL_INPUT}
          aria-label="Notes"
        />
      </td>

      <td className="px-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground size-8"
              aria-label="Task actions"
            >
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={remove}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
