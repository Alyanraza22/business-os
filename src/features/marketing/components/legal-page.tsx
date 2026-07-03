import type { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  updatedOn: string;
  intro: string;
  children: ReactNode;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Shared shell + prose styling for legal pages. Content is generic,
 * product-appropriate boilerplate — not a substitute for legal review.
 */
export function LegalPage({
  title,
  updatedOn,
  intro,
  children,
}: LegalPageProps) {
  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-6">
        <h1 className="text-foreground text-4xl font-semibold tracking-[-0.02em] text-balance sm:text-5xl">
          {title}
        </h1>
        <p className="text-muted-foreground mt-3 text-sm">
          Last updated {formatDate(updatedOn)}
        </p>
        <p className="text-muted-foreground mt-6 leading-relaxed">{intro}</p>

        <div className="[&_a]:text-primary [&_h2]:text-foreground [&_p]:text-muted-foreground [&_ul]:text-muted-foreground [&_li]:marker:text-muted-foreground/50 mt-10 flex flex-col gap-8 [&_a]:underline-offset-4 hover:[&_a]:underline [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_li]:leading-relaxed [&_p]:leading-relaxed [&_section]:flex [&_section]:flex-col [&_section]:gap-3 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-6">
          {children}
        </div>

        <div className="border-border text-muted-foreground mt-12 rounded-xl border border-dashed p-4 text-xs leading-relaxed">
          This document is a general template provided for information only and
          is not legal advice. Please review and adapt it with a qualified
          professional before relying on it.
        </div>
      </div>
    </section>
  );
}
