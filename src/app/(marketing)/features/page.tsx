import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { siteConfig } from "@/config/site";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { SectionHeading } from "@/features/marketing/components/section-heading";
import { marketingFeatures } from "@/features/marketing/features";

export const metadata: Metadata = {
  title: "Features",
  description:
    "Explore every module in Business OS — projects, daily planner, time tracking, goals, earnings, notes and analytics — in one connected workspace.",
  alternates: { canonical: "/features" },
  openGraph: {
    title: `Features · ${siteConfig.name}`,
    description: "Every module in Business OS, in one connected workspace.",
    url: `${siteConfig.url}/features`,
    type: "website",
  },
};

export default function FeaturesIndexPage() {
  return (
    <>
      <section className="border-border border-b py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Features"
            title="Everything you need, nothing you don't"
            description="Seven focused modules that share one data model — so your projects, time, goals and earnings always agree."
          />

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {marketingFeatures.map((feature) => (
              <Link
                key={feature.slug}
                href={`/features/${feature.slug}`}
                className="border-border bg-card hover-lift hover:border-primary/40 focus-visible:border-primary/40 focus-visible:ring-ring/25 group flex flex-col rounded-xl border p-6 outline-none hover:shadow-sm focus-visible:ring-[3px]"
              >
                <div className="bg-muted text-muted-foreground group-hover:text-primary mb-4 flex size-11 items-center justify-center rounded-md transition-colors">
                  <feature.icon className="size-5" />
                </div>
                <h2 className="text-foreground flex items-center gap-1.5 text-lg font-semibold tracking-tight">
                  {feature.name}
                </h2>
                <p className="text-muted-foreground mt-2 flex-1 text-sm leading-relaxed">
                  {feature.tagline}
                </p>
                <span className="text-primary mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
                  Learn more
                  <ArrowRight
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
