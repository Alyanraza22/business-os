import {
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

/**
 * Timezone-aware date helpers. Timestamps are stored in UTC; "today / this week
 * / this month" boundaries are computed in the user's own timezone so the
 * dashboard reflects their local day, not the server's.
 */

/** Current wall-clock time in the given IANA timezone. */
export function zonedNow(timeZone: string): Date {
  return toZonedTime(new Date(), timeZone);
}

/** UTC instant for the start of today in the given timezone. */
export function startOfTodayUtc(timeZone: string): Date {
  return fromZonedTime(startOfDay(zonedNow(timeZone)), timeZone);
}

/** UTC instant for the start of the current week (Monday) in the timezone. */
export function startOfWeekUtc(timeZone: string): Date {
  return fromZonedTime(
    startOfWeek(zonedNow(timeZone), { weekStartsOn: 1 }),
    timeZone,
  );
}

/** UTC instant for the start of the current month in the timezone. */
export function startOfMonthUtc(timeZone: string): Date {
  return fromZonedTime(startOfMonth(zonedNow(timeZone)), timeZone);
}

/** UTC instant for the start of the day `days` ago in the timezone. */
export function startOfDaysAgoUtc(days: number, timeZone: string): Date {
  return fromZonedTime(startOfDay(subDays(zonedNow(timeZone), days)), timeZone);
}

/** The day key (yyyy-MM-dd) of an instant, in the given timezone. */
export function dayKey(instant: Date | string, timeZone: string): string {
  const date = typeof instant === "string" ? new Date(instant) : instant;
  return format(toZonedTime(date, timeZone), "yyyy-MM-dd");
}

/** Keys + short labels for the last 7 days (including today). */
export function lastSevenDays(timeZone: string) {
  const now = zonedNow(timeZone);
  return Array.from({ length: 7 }, (_, i) => {
    const day = subDays(now, 6 - i);
    return { key: format(day, "yyyy-MM-dd"), label: format(day, "EEE") };
  });
}

/** Keys (yyyy-MM) + short labels for the last 6 months. */
export function lastSixMonths(timeZone: string) {
  const now = zonedNow(timeZone);
  return Array.from({ length: 6 }, (_, i) => {
    const month = subMonths(now, 5 - i);
    return { key: format(month, "yyyy-MM"), label: format(month, "MMM") };
  });
}
