import type { Metadata } from "next";
import { Gauge, Lock, Shapes, Sparkles } from "lucide-react";

import { siteConfig } from "@/config/site";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { SectionHeading } from "@/features/marketing/components/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Business OS is one calm, unified workspace for people who run their own work. Learn the idea behind it and the principles that guide it.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About · ${siteConfig.name}`,
    description:
      "The idea and principles behind Business OS — one workspace for self-directed work.",
    url: `${siteConfig.url}/about`,
    type: "website",
  },
};

const PRINCIPLES = [
  {
    title: "Restraint over decoration",
    description:
      "A timeless interface that respects your attention. No gradients, no noise — just clarity.",
    icon: Sparkles,
  },
  {
    title: "One connected model",
    description:
      "Projects, time, goals and earnings share one foundation, so the numbers always agree.",
    icon: Shapes,
  },
  {
    title: "Fast by default",
    description:
      "Server-rendered and keyboard-friendly. The tool should never be the thing slowing you down.",
    icon: Gauge,
  },
  {
    title: "Private by design",
    description:
      "Row-level security scopes every record to you. Your workspace is yours alone.",
    icon: Lock,
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-border border-b py-20 sm:py-24">
        <div className="mx-auto max-w-3xl px-6">
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">
            About
          </span>
          <h1 className="text-foreground mt-2 text-4xl font-semibold tracking-[-0.02em] text-balance sm:text-5xl">
            One place for the work of running your own thing
          </h1>
          <div className="text-muted-foreground mt-6 flex flex-col gap-4 text-lg leading-relaxed text-pretty">
            <p>
              Business OS started from a simple frustration: the work of running
              your own thing is scattered across too many tools. Projects live
              in one app, your day in another, time in a spreadsheet, and income
              wherever you last wrote it down.
            </p>
            <p>
              It&apos;s built to bring all of that into a single, calm workspace
              — where your projects, planner, time, goals, notes and earnings
              share the same foundation. When everything is connected, progress
              stops being a guess.
            </p>
            <p>
              This is a portfolio-grade product, crafted with the same care you
              would expect from a mature, paid SaaS: considered spacing,
              typography and interactions, and an interface designed to stay out
              of your way.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <SectionHeading
            eyebrow="Principles"
            title="What guides every decision"
          />
          <div className="mt-14 grid gap-4 sm:grid-cols-2">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.title}
                className="border-border bg-card flex gap-4 rounded-xl border p-6"
              >
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-md">
                  <principle.icon className="size-5" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3 className="text-foreground font-semibold tracking-tight">
                    {principle.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
