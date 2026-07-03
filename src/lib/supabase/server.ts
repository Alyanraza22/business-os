import { cookies } from "next/headers";

import { createServerClient } from "@supabase/ssr";

import { clientEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

/**
 * Supabase client for use in Server Components, Server Actions and Route
 * Handlers. Reads/writes the auth session from the request cookies.
 *
 * `cookies()` is async in Next.js 15+, so this factory is async too.
 * The `setAll` try/catch is required because Server Components cannot mutate
 * cookies — session refresh is handled in `proxy.ts` instead.
 */
export async function createClient(options?: { persistSession?: boolean }) {
  const cookieStore = await cookies();
  // When false ("Remember me" unchecked at sign-in), auth cookies are written
  // as session cookies (no maxAge/expires) so they clear on browser close.
  // Safe: if a later request re-persists the session, auth still works.
  const persistSession = options?.persistSession ?? true;

  return createServerClient<Database>(
    clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options: cookieOptions }) => {
              const finalOptions = persistSession
                ? cookieOptions
                : { ...cookieOptions, maxAge: undefined, expires: undefined };
              cookieStore.set(name, value, finalOptions);
            });
          } catch {
            // Called from a Server Component — safe to ignore when the proxy
            // refreshes the session on every request.
          }
        },
      },
    },
  );
}
