import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { CtaSection } from "@/features/marketing/components/cta-section";
import { FaqSection } from "@/features/marketing/components/faq-section";
import { FeaturesSection } from "@/features/marketing/components/features-section";
import { Hero } from "@/features/marketing/components/hero";
import { WhySection } from "@/features/marketing/components/why-section";
import { WorkflowSection } from "@/features/marketing/components/workflow-section";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — One workspace to run your work`,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${siteConfig.name} — One workspace to run your work`,
    description: siteConfig.description,
    url: siteConfig.url,
    type: "website",
  },
};

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <WorkflowSection />
      <WhySection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
