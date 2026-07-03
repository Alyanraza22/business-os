import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";

import { createClient } from "@/lib/supabase/server";

/**
 * The authenticated user for the current request, or null. Wrapped in React
 * `cache` so multiple calls within one request hit Supabase only once.
 */
export const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Require an authenticated user; redirect to /signin when absent. */
export async function requireUser() {
  const user = await getUser();
  if (!user) {
    redirect("/signin");
  }
  return user;
}
