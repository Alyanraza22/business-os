import { MobileNav } from "./mobile-nav";
import { SearchTrigger } from "./search-trigger";
import { ThemeToggle } from "./theme-toggle";
import { UserMenu } from "./user-menu";

interface TopbarProps {
  name: string;
  email: string;
  avatarUrl?: string | null;
}

/** Sticky application top bar: mobile menu trigger, theme toggle, account menu. */
export function Topbar({ name, email, avatarUrl }: TopbarProps) {
  return (
    <header className="border-border bg-background/80 sticky top-0 z-30 flex h-14 items-center gap-2 border-b px-4 backdrop-blur md:px-6">
      <MobileNav />
      <SearchTrigger />
      <div className="flex-1" />
      <ThemeToggle />
      <UserMenu name={name} email={email} avatarUrl={avatarUrl} />
    </header>
  );
}
