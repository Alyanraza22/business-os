import type { Metadata } from "next";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { getFeature, marketingFeatures } from "@/features/marketing/features";

interface FeaturePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return marketingFeatures.map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({
  params,
}: FeaturePageProps): Promise<Metadata> {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return {};

  const title = `${feature.name} — ${siteConfig.name}`;
  return {
    title: feature.name,
    description: feature.tagline,
    keywords: feature.keywords,
    alternates: { canonical: `/features/${feature.slug}` },
    openGraph: {
      title,
      description: feature.tagline,
      url: `${siteConfig.url}/features/${feature.slug}`,
      type: "article",
    },
  };
}

export default async function FeaturePage({ params }: FeaturePageProps) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const Icon = feature.icon;
  const others = marketingFeatures.filter((item) => item.slug !== feature.slug);

  return (
    <>
      <section className="border-border border-b py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <Link
            href="/features"
            className="text-muted-foreground hover:text-foreground mb-8 inline-flex items-center gap-1.5 text-sm transition-colors"
          >
            <ArrowLeft className="size-4" aria-hidden />
            All features
          </Link>

          <div className="bg-primary/10 text-primary mb-6 flex size-12 items-center justify-center rounded-lg">
            <Icon className="size-6" />
          </div>

          <span className="text-primary text-xs font-semibold tracking-wider uppercase">
            Feature
          </span>
          <h1 className="text-foreground mt-2 text-4xl font-semibold tracking-[-0.02em] text-balance sm:text-5xl">
            {feature.name}
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed text-pretty">
            {feature.overview}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/login">Start free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/features">See all features</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-foreground text-2xl font-semibold tracking-tight">
            What you can do
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {feature.highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="border-border bg-card rounded-xl border p-5"
              >
                <div className="bg-primary/10 text-primary mb-3 flex size-8 items-center justify-center rounded-md">
                  <Check className="size-4" />
                </div>
                <h3 className="text-foreground font-semibold tracking-tight">
                  {highlight.title}
                </h3>
                <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-border border-t py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-foreground text-xl font-semibold tracking-tight">
            Explore other features
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item) => (
              <Link
                key={item.slug}
                href={`/features/${item.slug}`}
                className="border-border bg-card hover:border-primary/40 group flex items-center gap-3 rounded-xl border p-4 transition-colors"
              >
                <div className="bg-muted text-muted-foreground group-hover:text-primary flex size-9 shrink-0 items-center justify-center rounded-md transition-colors">
                  <item.icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-foreground text-sm font-medium">
                    {item.name}
                  </span>
                </div>
                <ArrowRight
                  className="text-muted-foreground size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
