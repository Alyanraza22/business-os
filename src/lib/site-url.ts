/**
 * Resolve the canonical site origin (no trailing slash) for building absolute
 * URLs such as OAuth redirect targets. Prefers the configured public site URL
 * and falls back to localhost in development.
 */
export function getSiteURL(): string {
  let url = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  if (!url.startsWith("http")) {
    url = `https://${url}`;
  }
  return url.replace(/\/$/, "");
}
