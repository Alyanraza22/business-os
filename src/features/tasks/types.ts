import type { Project, Task } from "@/lib/supabase/types";

/** Minimal project shape used in pickers and chips. */
export type ProjectOption = Pick<Project, "id" | "name" | "color" | "icon">;

/** Minimal project-task shape for the daily planner's deliverable picker. */
export interface ProjectTaskOption {
  id: string;
  project_id: string;
  title: string;
}

/** A task joined with its parent project. */
export type TaskWithProject = Task & {
  project: ProjectOption | null;
};

/** A worksheet task with its derived actual time (from time logs). */
export type WorksheetTask = TaskWithProject & {
  /** Sum of completed timer segments, in seconds (excludes a live running one). */
  actualSeconds: number;
  actualHours: number;
};

/** The user's currently running timer, if any. */
export interface RunningTimer {
  taskId: string | null;
  startedAt: string;
}
