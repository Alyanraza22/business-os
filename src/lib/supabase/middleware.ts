import { NextResponse, type NextRequest } from "next/server";

import { createServerClient } from "@supabase/ssr";

import { clientEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/** Paths reachable without an authenticated session. */
function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/login") return true;
  if (pathname.startsWith("/auth")) return true;
  return false;
}

/**
 * Refreshes the Supabase auth session on every matched request, keeps auth
 * cookies in sync, and enforces route protection:
 *   - unauthenticated users hitting a protected path are sent to /login
 *   - authenticated users hitting /login are sent to /dashboard
 *
 * Wired up from `src/proxy.ts` (the Next.js 16 successor to middleware.ts).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // IMPORTANT: do not run code between createServerClient and getUser().
  // getUser() revalidates the token and triggers cookie refresh.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    return redirectPreservingCookies(request, supabaseResponse, "/login");
  }

  if (user && pathname === "/login") {
    return redirectPreservingCookies(request, supabaseResponse, "/dashboard");
  }

  return supabaseResponse;
}

/**
 * Build a redirect response while carrying over any auth cookies that the
 * session refresh just set — otherwise the refreshed session would be lost.
 */
function redirectPreservingCookies(
  request: NextRequest,
  from: NextResponse,
  pathname: string,
) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url);
  from.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  return response;
}
