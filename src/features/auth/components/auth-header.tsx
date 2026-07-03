import Link from "next/link";

import { siteConfig } from "@/config/site";

/** Shared logo + title block for the auth pages. Logo links to the landing. */
export function AuthHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6 flex flex-col items-center gap-3 text-center">
      <Link
        href="/"
        aria-label={`${siteConfig.name} home`}
        className="focus-visible:ring-ring focus-visible:ring-offset-background rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <span className="bg-primary text-primary-foreground flex size-11 items-center justify-center rounded-xl text-lg font-bold">
          B
        </span>
      </Link>
      <div className="flex flex-col gap-1">
        <h1 className="text-foreground text-xl font-semibold tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-muted-foreground text-sm">{subtitle}</p>
        ) : null}
      </div>
    </div>
  );
}
