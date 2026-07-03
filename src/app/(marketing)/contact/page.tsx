import type { Metadata } from "next";
import { ExternalLink, Mail } from "lucide-react";

import { siteConfig } from "@/config/site";
import { ContactForm } from "@/features/marketing/components/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the team behind Business OS — questions, feedback, or just to say hello.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact · ${siteConfig.name}`,
    description: "Questions, feedback, or just to say hello.",
    url: `${siteConfig.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <section className="py-20 sm:py-24">
      <div className="mx-auto grid max-w-5xl gap-12 px-6 lg:grid-cols-2">
        <div>
          <span className="text-primary text-xs font-semibold tracking-wider uppercase">
            Contact
          </span>
          <h1 className="text-foreground mt-2 text-4xl font-semibold tracking-[-0.02em] text-balance sm:text-5xl">
            Let&apos;s talk
          </h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed text-pretty">
            Have a question, some feedback, or an idea for Business OS? We read
            everything. Send a note and we&apos;ll get back to you.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <a
              href={`mailto:${siteConfig.contactEmail}`}
              className="border-border bg-card hover:border-primary/40 group flex items-center gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-muted text-muted-foreground group-hover:text-primary flex size-9 items-center justify-center rounded-md transition-colors">
                <Mail className="size-4" />
              </span>
              <span className="text-foreground text-sm font-medium">
                {siteConfig.contactEmail}
              </span>
            </a>
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noreferrer noopener"
              className="border-border bg-card hover:border-primary/40 group flex items-center gap-3 rounded-xl border p-4 transition-colors"
            >
              <span className="bg-muted text-muted-foreground group-hover:text-primary flex size-9 items-center justify-center rounded-md transition-colors">
                <ExternalLink className="size-4" />
              </span>
              <span className="text-foreground text-sm font-medium">
                GitHub
              </span>
            </a>
          </div>
        </div>

        <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
