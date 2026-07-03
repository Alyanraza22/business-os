import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import { getUser } from "@/features/auth/auth";
import { AuthDivider } from "@/features/auth/components/auth-divider";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";
import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create account",
  description: `Create your ${siteConfig.name} account.`,
  robots: { index: false, follow: false },
};

export default async function SignUpPage() {
  if (await getUser()) redirect("/dashboard");

  return (
    <>
      <AuthHeader
        title="Create your account"
        subtitle="Start organizing your work in one place"
      />
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <GoogleSignInButton />
          <AuthDivider />
          <SignUpForm />
        </CardContent>
      </Card>
      <p className="text-muted-foreground mt-6 text-center text-sm">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
