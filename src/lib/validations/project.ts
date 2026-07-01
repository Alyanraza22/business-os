import { z } from "zod";

import {
  hexColorSchema,
  isoDateSchema,
  prioritySchema,
  projectStatusSchema,
} from "./shared";

export const createProjectSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(120),
  description: z.string().trim().max(2000).nullish(),
  status: projectStatusSchema.default("planning"),
  priority: prioritySchema.default("medium"),
  deadline: isoDateSchema.nullish(),
  progress: z.number().int().min(0).max(100).default(0),
  color: hexColorSchema.default("#6366F1"),
  icon: z.string().trim().max(50).nullish(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
