import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { siteConfig } from "@/config/site";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { ROADMAP, type RoadmapStatus } from "@/features/marketing/roadmap";

export const metadata: Metadata = {
  title: "Roadmap",
  description:
    "What's shipped, what's in progress, and what's next for Business OS.",
  alternates: { canonical: "/roadmap" },
  openGraph: {
    title: `Roadmap · ${siteConfig.name}`,
    description: "What's shipped, in progress, and planned for Business OS.",
    url: `${siteConfig.url}/roadmap`,
    type: "website",
  },
};

const GROUPS: {
  status: RoadmapStatus;
  label: string;
  badge: "success" | "default" | "outline";
}[] = [
  { status: "shipped", label: "Shipped", badge: "success" },
  { status: "in-progress", label: "In progress", badge: "default" },
  { status: "planned", label: "Planned", badge: "outline" },
];

export default function RoadmapPage() {
  return (
    <>
      <section className="border-border border-b py-20 sm:py-24">
        <div className="mx-auto max-w-4xl px-6">
          <SectionHeading
            eyebrow="Roadmap"
            title="Where Business OS is headed"
            description="An honest view of what's done, what's underway, and what's coming next."
          />

          <div className="mt-14 flex flex-col gap-12">
            {GROUPS.map((group) => {
              const items = ROADMAP.filter(
                (item) => item.status === group.status,
              );
              if (items.length === 0) return null;

              return (
                <div key={group.status}>
                  <div className="mb-5 flex items-center gap-3">
                    <h2 className="text-foreground text-lg font-semibold tracking-tight">
                      {group.label}
                    </h2>
                    <Badge variant={group.badge}>{items.length}</Badge>
                  </div>
                  <div className="flex flex-col gap-3">
                    {items.map((item) => (
                      <div
                        key={item.title}
                        className="border-border bg-card rounded-xl border p-5"
                      >
                        <h3 className="text-foreground font-semibold tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
