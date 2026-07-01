/** Locale-aware formatting helpers for money and metrics. */

/** The currency symbol for an ISO 4217 code (e.g. "USD" → "$"). */
export function getCurrencySymbol(currency: string): string {
  try {
    const parts = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).formatToParts(0);
    return parts.find((part) => part.type === "currency")?.value ?? currency;
  } catch {
    return currency;
  }
}

/** Format a number as currency with no decimals (e.g. 1200 → "$1,200"). */
export function formatCurrency(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value}`;
  }
}

/** Format money allowing up to 2 decimals (e.g. 1200.5 → "$1,200.50"). */
export function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value}`;
  }
}
