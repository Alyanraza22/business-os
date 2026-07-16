import { cn } from "@/lib/utils";

import type {
  ProjectOption,
  ProjectTaskOption,
  RunningTimer,
  WorksheetTask,
} from "../types";
import { NewTaskRow } from "./new-task-row";
import { WorksheetRow } from "./worksheet-row";

interface WorksheetTableProps {
  tasks: WorksheetTask[];
  projects: ProjectOption[];
  projectTasks: ProjectTaskOption[];
  runningTimer: RunningTimer | null;
  date: string;
  defaultProjectId: string;
}

// Phones can't carry ten columns, so the sheet narrows to what you actually
// need to act on — check it off, see it, see its status and time it. The rest
// returns at md. `HIDDEN_ON_MOBILE` is mirrored by the row cells.
export const HIDDEN_ON_MOBILE = "hidden md:table-cell";

const COLUMNS = [
  { id: "complete", label: "", className: "w-10" },
  { id: "task", label: "Task", className: "min-w-[10rem] md:min-w-[13rem]" },
  { id: "project", label: "Project", className: `w-40 ${HIDDEN_ON_MOBILE}` },
  {
    id: "project_task",
    label: "Project Task",
    className: `w-44 ${HIDDEN_ON_MOBILE}`,
  },
  { id: "status", label: "Status", className: "w-36" },
  { id: "priority", label: "Priority", className: `w-32 ${HIDDEN_ON_MOBILE}` },
  { id: "estimate", label: "Est. h", className: `w-20 ${HIDDEN_ON_MOBILE}` },
  { id: "actual", label: "Actual h", className: "w-20" },
  {
    id: "notes",
    label: "Notes",
    className: `min-w-[10rem] ${HIDDEN_ON_MOBILE}`,
  },
  { id: "actions", label: "", className: "w-12" },
];

export function WorksheetTable({
  tasks,
  projects,
  projectTasks,
  runningTimer,
  date,
  defaultProjectId,
}: WorksheetTableProps) {
  return (
    <div className="border-border bg-card max-h-[calc(100dvh-15rem)] overflow-auto rounded-xl border">
      <table className="w-full border-collapse text-sm md:min-w-[1040px]">
        <thead className="bg-card sticky top-0 z-10">
          <tr className="border-border text-muted-foreground border-b text-left text-xs tracking-wide uppercase">
            {COLUMNS.map((column) => (
              <th
                key={column.id}
                className={`px-2 py-3 font-medium ${column.className}`}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td
                colSpan={COLUMNS.length}
                className="text-muted-foreground px-4 py-6 text-center text-sm"
              >
                No tasks for this day yet. Add your first one below.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <WorksheetRow
                key={task.id}
                task={task}
                projects={projects}
                projectTasks={projectTasks}
                runningTaskId={runningTimer?.taskId ?? null}
                runningStartedAt={runningTimer?.startedAt ?? null}
              />
            ))
          )}
          <NewTaskRow
            projects={projects}
            date={date}
            defaultProjectId={defaultProjectId}
          />
        </tbody>
        {tasks.length > 0 ? (
          <tfoot className="bg-card sticky bottom-0 z-10">
            <tr className="border-border border-t">
              <td colSpan={COLUMNS.length} className="px-4 py-3">
                <EstimateSummary
                  estimate={tasks.reduce(
                    (sum, task) => sum + (task.estimated_hours ?? 0),
                    0,
                  )}
                  actual={tasks.reduce(
                    (sum, task) => sum + task.actualHours,
                    0,
                  )}
                />
              </td>
            </tr>
          </tfoot>
        ) : null}
      </table>
    </div>
  );
}

/** Visual day-total comparison of estimated vs actual hours. */
function EstimateSummary({
  estimate,
  actual,
}: {
  estimate: number;
  actual: number;
}) {
  const over = estimate > 0 && actual > estimate;
  const pct =
    estimate > 0
      ? Math.min(100, (actual / estimate) * 100)
      : actual > 0
        ? 100
        : 0;
  const diff = actual - estimate;

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
      <span className="text-muted-foreground font-medium tracking-wide uppercase">
        Day total
      </span>
      <span className="text-muted-foreground tabular-nums">
        Est{" "}
        <span className="text-foreground font-semibold">
          {estimate.toFixed(1)}h
        </span>
      </span>
      <span className="text-muted-foreground tabular-nums">
        Actual{" "}
        <span className="text-foreground font-semibold">
          {actual.toFixed(1)}h
        </span>
      </span>
      <div className="bg-muted h-1.5 w-32 overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            over ? "bg-destructive" : "bg-primary",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      {estimate > 0 ? (
        <span
          className={cn(
            "font-medium tabular-nums",
            over ? "text-destructive" : "text-success",
          )}
        >
          {over
            ? `${diff.toFixed(1)}h over`
            : `${(estimate - actual).toFixed(1)}h left`}
        </span>
      ) : null}
    </div>
  );
}
