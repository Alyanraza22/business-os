import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { CHANGELOG } from "@/features/marketing/roadmap";

export const metadata: Metadata = {
  title: "Changelog",
  description:
    "A record of what's new in Business OS — releases, improvements and fixes.",
  alternates: { canonical: "/changelog" },
  openGraph: {
    title: `Changelog · ${siteConfig.name}`,
    description: "What's new in Business OS, release by release.",
    url: `${siteConfig.url}/changelog`,
    type: "website",
  },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ChangelogPage() {
  return (
    <>
      <section className="border-border border-b py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <SectionHeading
            eyebrow="Changelog"
            title="What's new in Business OS"
            description="Every release, in one place."
          />

          <div className="mt-14 flex flex-col gap-10">
            {CHANGELOG.map((entry) => (
              <article
                key={entry.version}
                className="border-border relative border-l pl-6"
              >
                <span
                  className="bg-primary absolute top-1.5 -left-[5px] size-2.5 rounded-full"
                  aria-hidden
                />
                <div className="flex flex-wrap items-center gap-3">
                  <Badge>v{entry.version}</Badge>
                  <time
                    dateTime={entry.date}
                    className="text-muted-foreground text-xs"
                  >
                    {formatDate(entry.date)}
                  </time>
                </div>
                <h2 className="text-foreground mt-3 text-xl font-semibold tracking-tight">
                  {entry.title}
                </h2>
                <ul className="text-muted-foreground mt-3 flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed">
                  {entry.changes.map((change) => (
                    <li
                      key={change}
                      className="marker:text-muted-foreground/50"
                    >
                      {change}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
