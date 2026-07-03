/**
 * Single source of truth for route protection. The app (authenticated) area is
 * defined by these prefixes; every other path — the marketing site, auth pages,
 * legal pages — is public and never requires a session.
 *
 * Consumed by the auth middleware so navbar state, redirects and route guards
 * can never disagree about what is protected.
 */
export const PROTECTED_PREFIXES = [
  "/dashboard",
  "/projects",
  "/tasks", // Daily Planner
  "/time",
  "/goals",
  "/earnings",
  "/analytics",
  "/notes",
  "/settings",
] as const;

/** True when the path belongs to the authenticated application area. */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
