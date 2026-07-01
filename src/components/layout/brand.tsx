import Link from "next/link";

import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

/** App wordmark + logo, links to the dashboard. */
export function Brand({ className }: { className?: string }) {
  return (
    <Link
      href="/dashboard"
      className={cn(
        "focus-visible:ring-ring flex items-center gap-2 rounded-md outline-none focus-visible:ring-2",
        className,
      )}
    >
      <span className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-lg text-sm font-bold">
        B
      </span>
      <span className="font-semibold tracking-tight">{siteConfig.name}</span>
    </Link>
  );
}
