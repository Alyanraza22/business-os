import "server-only";

import { format, startOfMonth, startOfWeek, startOfYear } from "date-fns";

import { dayKey, zonedNow } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";
import type { Earning, Enums } from "@/lib/supabase/types";

interface GetEarningsParams {
  category?: string;
  q?: string;
}

const CATEGORY_VALUES: readonly Enums<"earning_category">[] = [
  "freelancing",
  "etsy",
  "affiliate",
  "ads",
  "other",
];

function isCategory(value?: string): value is Enums<"earning_category"> {
  return value !== undefined && (CATEGORY_VALUES as string[]).includes(value);
}

export async function getEarnings({
  category,
  q,
}: GetEarningsParams = {}): Promise<Earning[]> {
  const supabase = await createClient();
  let query = supabase
    .from("earnings")
    .select("*")
    .is("deleted_at", null)
    .order("earned_on", { ascending: false });

  if (isCategory(category)) query = query.eq("category", category);
  if (q && q.trim()) query = query.ilike("source", `%${q.trim()}%`);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export interface EarningsSummary {
  today: number;
  week: number;
  month: number;
  year: number;
  currency: string;
}

/** Income totals for today / week / month / year (calendar dates, tz-aware). */
export async function getEarningsSummary(): Promise<EarningsSummary> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let currency = "USD";
  let timezone = "UTC";
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("currency, timezone")
      .eq("id", user.id)
      .single();
    currency = data?.currency ?? "USD";
    timezone = data?.timezone ?? "UTC";
  }

  const now = zonedNow(timezone);
  const todayStr = dayKey(new Date(), timezone);
  const weekStr = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd");
  const monthStr = format(startOfMonth(now), "yyyy-MM-dd");
  const yearStr = format(startOfYear(now), "yyyy-MM-dd");

  const { data } = await supabase
    .from("earnings")
    .select("amount, earned_on")
    .is("deleted_at", null)
    .gte("earned_on", yearStr);

  let today = 0;
  let week = 0;
  let month = 0;
  let year = 0;
  for (const entry of data ?? []) {
    const amount = Number(entry.amount);
    year += amount;
    if (entry.earned_on >= monthStr) month += amount;
    if (entry.earned_on >= weekStr) week += amount;
    if (entry.earned_on === todayStr) today += amount;
  }

  const round = (n: number) => Math.round(n * 100) / 100;
  return {
    today: round(today),
    week: round(week),
    month: round(month),
    year: round(year),
    currency,
  };
}
