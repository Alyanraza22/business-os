"use server";

import { redirect } from "next/navigation";

import { type FormState, zodFieldErrors } from "@/lib/form";
import { getSiteURL } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";
import {
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  signInSchema,
  signUpSchema,
} from "@/lib/validations/auth";

/** Turn a raw Supabase auth error into a friendly, non-leaky message. */
function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("invalid login")) return "Invalid email or password.";
  if (lower.includes("email not confirmed")) {
    return "Please verify your email before signing in — check your inbox.";
  }
  if (lower.includes("already registered") || lower.includes("already been")) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (lower.includes("rate limit") || lower.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }
  return message;
}

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
    redirect("/signin?error=oauth");
  }

  if (data.url) {
    redirect(data.url);
  }
}

/** Create an account with email + password and send a verification email. */
export async function signUpWithEmail(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signUpSchema.safeParse({
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
      emailRedirectTo: `${getSiteURL()}/auth/callback?next=/dashboard`,
    },
  });

  if (error) {
    return { ok: false, message: friendlyAuthError(error.message) };
  }

  // With email confirmation enabled there is no session yet — prompt the user
  // to verify. With it disabled, a session exists and we go straight in.
  if (!data.session) {
    return {
      ok: true,
      message:
        "Check your inbox to verify your email, then sign in to get started.",
    };
  }

  redirect("/dashboard");
}

/** Sign in with email + password. Honors the "Remember me" preference. */
export async function signInWithEmail(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    remember: formData.get("remember") === "on",
  });
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient({
    persistSession: parsed.data.remember ?? false,
  });
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { ok: false, message: friendlyAuthError(error.message) };
  }

  redirect("/dashboard");
}

/** Send a password-reset email. Response never reveals whether the email exists. */
export async function requestPasswordReset(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${getSiteURL()}/auth/callback?next=/reset-password`,
  });

  return {
    ok: true,
    message:
      "If an account exists for that email, a reset link is on its way. Check your inbox.",
  };
}

/**
 * Set a new password. Requires the recovery session established when the user
 * follows the reset link (which routes through /auth/callback).
 */
export async function resetPassword(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = resetPasswordSchema.safeParse({
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return {
      ok: false,
      message: "This reset link has expired. Please request a new one.",
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { ok: false, message: friendlyAuthError(error.message) };
  }

  return {
    ok: true,
    message: "Your password has been updated. You can now sign in.",
  };
}

/**
 * Change the account password from settings. Email/password accounts must
 * confirm their current password; accounts that only have a social provider
 * are simply setting a password for the first time.
 */
export async function changePassword(
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> {
  const parsed = changePasswordSchema.safeParse({
    currentPassword: formData.get("currentPassword") || undefined,
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    return { ok: false, errors: zodFieldErrors(parsed.error) };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) return { ok: false, message: "You must be signed in." };

  const providers =
    (user.app_metadata?.providers as string[] | undefined) ?? [];
  const hasPasswordLogin = providers.includes("email");

  if (hasPasswordLogin) {
    if (!parsed.data.currentPassword) {
      return {
        ok: false,
        errors: { currentPassword: ["Enter your current password."] },
      };
    }
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: parsed.data.currentPassword,
    });
    if (verifyError) {
      return {
        ok: false,
        errors: { currentPassword: ["Current password is incorrect."] },
      };
    }
  }

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });
  if (error) {
    return { ok: false, message: friendlyAuthError(error.message) };
  }

  return { ok: true, message: "Your password has been updated." };
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
