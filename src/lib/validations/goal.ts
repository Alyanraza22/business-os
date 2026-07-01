import { z } from "zod";

import {
  goalStatusSchema,
  goalTypeSchema,
  isoDateSchema,
  uuidSchema,
} from "./shared";

export const createGoalSchema = z.object({
  project_id: uuidSchema.nullish(),
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).nullish(),
  type: goalTypeSchema,
  status: goalStatusSchema.default("active"),
  target: z.number().positive("Target must be greater than zero"),
  current: z.number().min(0).default(0),
  unit: z.string().trim().max(40).nullish(),
  start_date: isoDateSchema.nullish(),
  deadline: isoDateSchema.nullish(),
});

export const updateGoalSchema = createGoalSchema.partial();

export type CreateGoalInput = z.infer<typeof createGoalSchema>;
export type UpdateGoalInput = z.infer<typeof updateGoalSchema>;
