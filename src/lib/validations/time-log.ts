import { z } from "zod";

import { isoDateTimeSchema, uuidSchema } from "./shared";

/** Start a live timer for a project (optionally a specific task). */
export const startTimerSchema = z.object({
  project_id: uuidSchema,
  task_id: uuidSchema.nullish(),
  description: z.string().trim().max(500).nullish(),
});

/** Create or edit a completed time entry manually. */
export const createTimeLogSchema = z
  .object({
    project_id: uuidSchema,
    task_id: uuidSchema.nullish(),
    description: z.string().trim().max(500).nullish(),
    started_at: isoDateTimeSchema,
    ended_at: isoDateTimeSchema.nullish(),
  })
  .refine(
    (value) =>
      !value.ended_at ||
      Date.parse(value.ended_at) > Date.parse(value.started_at),
    { message: "End time must be after start time", path: ["ended_at"] },
  );

export const updateTimeLogSchema = z.object({
  task_id: uuidSchema.nullish(),
  description: z.string().trim().max(500).nullish(),
  started_at: isoDateTimeSchema.optional(),
  ended_at: isoDateTimeSchema.nullish(),
});

export type StartTimerInput = z.infer<typeof startTimerSchema>;
export type CreateTimeLogInput = z.infer<typeof createTimeLogSchema>;
export type UpdateTimeLogInput = z.infer<typeof updateTimeLogSchema>;
