import "server-only";

import { cache } from "react";

import { getUser } from "@/features/auth/auth";
import { createClient } from "@/lib/supabase/server";

export interface UserSettings {
  timezone: string;
  currency: string;
}

const DEFAULTS: UserSettings = { timezone: "UTC", currency: "USD" };

/**
 * The current user's regional settings.
 *
 * Wrapped in React `cache` so the many queries that need a timezone/currency
 * (dashboard, overview, onboarding, priority, analytics, time, earnings…) all
 * share a single profiles lookup per request instead of each issuing their own.
 */
export const getUserSettings = cache(async (): Promise<UserSettings> => {
  const user = await getUser();
  if (!user) return DEFAULTS;

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("timezone, currency")
    .eq("id", user.id)
    .single();

  return {
    timezone: data?.timezone ?? DEFAULTS.timezone,
    currency: data?.currency ?? DEFAULTS.currency,
  };
});
