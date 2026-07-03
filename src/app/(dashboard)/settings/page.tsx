import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/features/auth/auth";
import { AccountForm } from "@/features/settings/components/account-form";
import { AppearanceCard } from "@/features/settings/components/appearance-card";
import { ChangePasswordForm } from "@/features/settings/components/change-password-form";
import { ExportCard } from "@/features/settings/components/export-card";
import { ProfileForm } from "@/features/settings/components/profile-form";
import { getProfile } from "@/features/settings/queries";

export const metadata: Metadata = {
  title: "Settings",
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const [profile, user] = await Promise.all([getProfile(), getUser()]);

  const metadata = user?.user_metadata ?? {};
  const email = user?.email ?? "";
  const fullName =
    (metadata.full_name as string | undefined) ?? profile?.full_name ?? "";
  const avatarUrl = (metadata.avatar_url as string | undefined) ?? "";
  const providers =
    (user?.app_metadata?.providers as string[] | undefined) ?? [];
  const hasPasswordLogin = providers.includes("email");

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your account, security and preferences."
      />

      <div className="flex max-w-2xl flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>
              Your identity across Business OS — name, avatar and email.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AccountForm
              email={email}
              fullName={fullName}
              avatarUrl={avatarUrl}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password &amp; security</CardTitle>
            <CardDescription>
              {hasPasswordLogin
                ? "Update the password you use to sign in."
                : "Add a password to enable email sign-in."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            <ChangePasswordForm hasPasswordLogin={hasPasswordLogin} />
            <div className="border-border flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-foreground text-sm font-medium">
                  Sign out of all sessions
                </p>
                <p className="text-muted-foreground text-sm">
                  End every active session on your other devices.
                </p>
              </div>
              <Button variant="outline" disabled>
                Coming soon
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
            <CardDescription>
              Currency, timezone and working hours used across the app.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProfileForm profile={profile} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Choose your theme.</CardDescription>
          </CardHeader>
          <CardContent>
            <AppearanceCard />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Data</CardTitle>
            <CardDescription>
              Download a complete copy of your data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ExportCard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
