import type { Database } from "./database.types";

/** Convenience accessors over the generated Database type. */
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];

/** Row aliases for ergonomic imports across features. */
export type Profile = Tables<"profiles">;
export type Project = Tables<"projects">;
export type Milestone = Tables<"milestones">;
export type ProjectTask = Tables<"project_tasks">;
/** Daily tasks live in the `tasks` table (the worksheet). */
export type DailyTask = Tables<"tasks">;
export type Task = Tables<"tasks">;
export type TimeLog = Tables<"time_logs">;
export type Goal = Tables<"goals">;
export type Earning = Tables<"earnings">;
export type Note = Tables<"notes">;

export type { Database };
