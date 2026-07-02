import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { marketingFeatures } from "../features";
import { SectionHeading } from "./section-heading";

/** Grid of the product's core modules, each linking to its feature page. */
export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading
          eyebrow="Everything in one place"
          title="One workspace for how you actually work"
          description="Seven connected modules replace the scattered tabs, spreadsheets and sticky notes."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {marketingFeatures.map((feature) => (
            <Link
              key={feature.slug}
              href={`/features/${feature.slug}`}
              className="border-border bg-card hover:border-primary/40 focus-visible:border-primary/40 focus-visible:ring-ring/25 group rounded-xl border p-5 transition-colors outline-none focus-visible:ring-[3px]"
            >
              <div className="bg-muted text-muted-foreground group-hover:text-primary mb-4 flex size-10 items-center justify-center rounded-md transition-colors">
                <feature.icon className="size-5" />
              </div>
              <h3 className="text-foreground flex items-center gap-1.5 font-semibold tracking-tight">
                {feature.name}
                <ArrowRight
                  className="size-4 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
                  aria-hidden
                />
              </h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {feature.tagline}
              </p>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/features"
            className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            Explore all features
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
