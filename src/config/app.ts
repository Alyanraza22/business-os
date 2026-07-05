/**
 * App-level constants for diagnostics and the developer panel. Safe to import
 * anywhere — contains no secrets.
 */
export const APP_VERSION = "1.1.0";

/** Injected at build time via next.config (NEXT_PUBLIC_BUILD_TIME). */
export const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME ?? "unknown";

export const ENVIRONMENT: "development" | "production" | "test" =
  (process.env.NODE_ENV as "development" | "production" | "test") ??
  "production";

export const IS_DEV = ENVIRONMENT === "development";

/**
 * Feature flags. Central place to gate work-in-progress features as the app
 * grows toward v2. Extend freely; the debug panel lists these live.
 */
export const FEATURE_FLAGS: Record<string, boolean> = {
  globalSearch: true,
};
