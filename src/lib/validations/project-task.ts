import { z } from "zod";

import {
  isoDateSchema,
  prioritySchema,
  taskStatusSchema,
  uuidSchema,
} from "./shared";

export const createProjectTaskSchema = z.object({
  project_id: uuidSchema,
  milestone_id: uuidSchema.nullish(),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(5000).nullish(),
  status: taskStatusSchema.default("todo"),
  priority: prioritySchema.default("medium"),
  due_date: isoDateSchema.nullish(),
  estimated_hours: z.number().min(0).max(100000).nullish(),
});

export const updateProjectTaskSchema = createProjectTaskSchema.partial();

export type CreateProjectTaskInput = z.infer<typeof createProjectTaskSchema>;
export type UpdateProjectTaskInput = z.infer<typeof updateProjectTaskSchema>;
