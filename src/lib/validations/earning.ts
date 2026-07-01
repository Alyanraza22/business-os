import { z } from "zod";

import {
  currencySchema,
  earningCategorySchema,
  isoDateSchema,
  uuidSchema,
} from "./shared";

export const createEarningSchema = z.object({
  project_id: uuidSchema.nullish(),
  amount: z.number().min(0, "Amount cannot be negative").max(1_000_000_000),
  currency: currencySchema.default("USD"),
  source: z.string().trim().max(120).nullish(),
  category: earningCategorySchema.default("other"),
  // Defaults to current_date in the database when omitted.
  earned_on: isoDateSchema.optional(),
  description: z.string().trim().max(2000).nullish(),
});

export const updateEarningSchema = createEarningSchema.partial();

export type CreateEarningInput = z.infer<typeof createEarningSchema>;
export type UpdateEarningInput = z.infer<typeof updateEarningSchema>;
