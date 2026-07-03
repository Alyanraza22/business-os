import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getUser } from "@/features/auth/auth";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { SignInForm } from "@/features/auth/components/sign-in-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to ${siteConfig.name}.`,
  robots: { index: false, follow: false },
};

export default async function SignInPage() {
  if (await getUser()) redirect("/dashboard");

  return (
    <>
      <AuthHeader
        title="Welcome back"
        subtitle={`Sign in to your ${siteConfig.name} account`}
      />
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <GoogleSignInButton />
          <AuthDivider />
          <SignInForm />
        </CardContent>
      </Card>
      <p className="text-muted-foreground mt-6 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="text-primary font-medium hover:underline"
        >
          Create account
        </Link>
      </p>
    </>
  );
}
