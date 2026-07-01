import { z } from "zod";

import { uuidSchema } from "./shared";

export const createNoteSchema = z.object({
  project_id: uuidSchema.nullish(),
  title: z.string().trim().max(200).default(""),
  content: z.string().max(50000).default(""),
  is_pinned: z.boolean().default(false),
  is_archived: z.boolean().default(false),
});

export const updateNoteSchema = createNoteSchema.partial();

export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
