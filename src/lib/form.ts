import type { ZodError } from "zod";

/**
 * Standard result shape returned by form server actions and consumed by
 * `useActionState` on the client. `errors` is keyed by field name.
 */
export interface FormState {
  ok: boolean;
  message?: string;
  errors?: Record<string, string[]>;
}

export const initialFormState: FormState = { ok: false };

/** Collapse a ZodError into per-field message arrays for inline display. */
export function zodFieldErrors(error: ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    (fieldErrors[key] ??= []).push(issue.message);
  }
  return fieldErrors;
}
