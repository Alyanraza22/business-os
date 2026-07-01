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

const COLUMNS = [
  { id: "complete", label: "", className: "w-10" },
  { id: "task", label: "Task", className: "min-w-[13rem]" },
  { id: "project", label: "Project", className: "w-40" },
  { id: "project_task", label: "Project Task", className: "w-44" },
  { id: "status", label: "Status", className: "w-36" },
  { id: "priority", label: "Priority", className: "w-32" },
  { id: "estimate", label: "Est. h", className: "w-20" },
  { id: "actual", label: "Actual h", className: "w-20" },
  { id: "notes", label: "Notes", className: "min-w-[10rem]" },
  { id: "actions", label: "", className: "w-12" },
];

// Non-editable leading columns in the new-task row (task + project handled).
const NEW_ROW_FILL = COLUMNS.length - 3;

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
      <table className="w-full min-w-[1040px] border-collapse text-sm">
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
            fillColumns={NEW_ROW_FILL}
          />
        </tbody>
      </table>
    </div>
  );
}
