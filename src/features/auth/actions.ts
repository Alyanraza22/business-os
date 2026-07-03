"use server";

import { redirect } from "next/navigation";

import { getSiteURL } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

/**
 * Begin the Google OAuth flow. Supabase returns a provider URL that we redirect
 * the user to; after consent Google sends them back to /auth/callback.
 */
export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${getSiteURL()}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error) {
    redirect("/login?error=oauth");
  }

  if (data.url) {
    redirect(data.url);
  }
}

/**
 * End the session and return to the public landing page. The session cookies
 * are cleared first; the landing page then renders the logged-out navbar
 * (Sign in / Get started, no avatar) since it reads the session fresh.
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
