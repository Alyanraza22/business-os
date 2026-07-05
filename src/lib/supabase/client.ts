import { createBrowserClient } from "@supabase/ssr";

import { clientEnv } from "@/lib/env";
import type { Database } from "@/lib/supabase/database.types";

type BrowserClient = ReturnType<typeof createBrowserClient<Database>>;

// Reuse a single browser client across the app instead of constructing one on
// every call/render. The @supabase/ssr browser client is designed as a
// singleton and shares the auth session via cookies.
let client: BrowserClient | undefined;

/**
 * Supabase client for use in Client Components (browser runtime).
 * Uses the public anon key — never the service-role key.
 */
export function createClient(): BrowserClient {
  if (!client) {
    client = createBrowserClient<Database>(
      clientEnv.NEXT_PUBLIC_SUPABASE_URL,
      clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    );
  }
  return client;
}
