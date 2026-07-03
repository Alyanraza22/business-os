import Link from "next/link";

import { Brand } from "@/components/layout/brand";
import { UserMenu } from "@/components/layout/user-menu";
import { Button } from "@/components/ui/button";
import { getUser } from "@/features/auth/auth";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/#faq" },
];

/**
 * Public marketing top bar. Auth-aware and server-rendered from the same
 * Supabase source as the rest of the app, so it never flickers or disagrees
 * with the session: signed-out users see Sign in / Get started; signed-in
 * users see Open Dashboard + their avatar.
 */
export async function MarketingHeader() {
  const user = await getUser();

  const metadata = user?.user_metadata ?? {};
  const name =
    (metadata.full_name as string | undefined) ??
    (metadata.name as string | undefined) ??
    user?.email ??
    "User";
  const avatarUrl = (metadata.avatar_url as string | undefined) ?? null;

  return (
    <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-6">
        <Brand href="/" />

        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-foreground text-sm font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {user ? (
            <>
              <Button size="sm" asChild>
                <Link href="/dashboard">Open Dashboard</Link>
              </Button>
              <UserMenu
                name={name}
                email={user.email ?? ""}
                avatarUrl={avatarUrl}
              />
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="hidden sm:inline-flex"
              >
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
