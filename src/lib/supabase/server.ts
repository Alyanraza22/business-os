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
export async function createClient() {
  const cookieStore = await cookies();

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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
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
