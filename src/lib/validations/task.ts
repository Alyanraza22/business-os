import { z } from "zod";

import {
  isoDateSchema,
  prioritySchema,
  taskStatusSchema,
  uuidSchema,
} from "./shared";

export const createTaskSchema = z.object({
  // Optional: daily tasks can be project-less (personal / admin work).
  project_id: uuidSchema.nullish(),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(5000).nullish(),
  status: taskStatusSchema.default("todo"),
  priority: prioritySchema.default("medium"),
  // The daily-sheet date the task is planned for. Defaults to today in the DB.
  work_date: isoDateSchema.optional(),
  due_date: isoDateSchema.nullish(),
  estimated_hours: z.number().min(0).max(10000).nullish(),
  labels: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  // Optional link up to a project task (deliverable).
  project_task_id: uuidSchema.nullish(),
});

export const updateTaskSchema = createTaskSchema.partial();

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
