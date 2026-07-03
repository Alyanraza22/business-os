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

/**
 * Auth pages a signed-in user should be redirected away from. Note that
 * /reset-password is intentionally excluded: the recovery link puts the user
 * in a temporary session there so they can set a new password.
 */
export const AUTH_PAGES = [
  "/signin",
  "/signup",
  "/login",
  "/forgot-password",
] as const;

export function isAuthPage(pathname: string): boolean {
  return (AUTH_PAGES as readonly string[]).includes(pathname);
}
