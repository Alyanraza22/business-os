import type { Metadata } from "next";
import { redirect } from "next/navigation";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Text } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { getUser } from "@/features/auth/auth";
import { GoogleSignInButton } from "@/features/auth/components/google-sign-in-button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  description: `Sign in to ${siteConfig.name}.`,
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getUser();
  if (user) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-xl text-lg font-bold">
          B
        </div>
        <Text variant="muted">Welcome to {siteConfig.name}</Text>
      </div>

      <Card>
        <CardHeader className="text-center">
          <CardTitle>Sign in</CardTitle>
          <CardDescription>
            Continue with your Google account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GoogleSignInButton />
        </CardContent>
      </Card>

      <Text variant="small" className="px-6 text-center">
        By continuing you agree to our Terms of Service and Privacy Policy.
      </Text>
    </div>
  );
}
