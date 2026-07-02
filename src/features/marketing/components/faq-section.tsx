import { Plus } from "lucide-react";

import { SectionHeading } from "./section-heading";

const FAQS = [
  {
    q: "Is Business OS free?",
    a: "Yes. Sign in with Google and start using every module right away — no credit card, no trial timer.",
  },
  {
    q: "What can I manage in it?",
    a: "Projects and deliverables, a daily planner, time tracking, goals, earnings, notes and analytics — all in one connected workspace.",
  },
  {
    q: "How does progress tracking work?",
    a: "Project progress is calculated from completed deliverables, and goal progress from the numbers you log — so it always reflects real work, never a guess.",
  },
  {
    q: "Is my data private?",
    a: "Every record is protected by row-level security and scoped to your account. Your workspace is yours alone.",
  },
  {
    q: "Does it work on mobile?",
    a: "Yes. The interface is fully responsive, so you can plan and check things off from any device.",
  },
];

/** Frequently asked questions using a native, accessible disclosure list. */
export function FaqSection() {
  return (
    <section
      id="faq"
      className="border-border scroll-mt-20 border-t py-20 sm:py-28"
    >
      <div className="mx-auto max-w-3xl px-6">
        <SectionHeading eyebrow="FAQ" title="Questions, answered" />

        <div className="mt-12 flex flex-col gap-3">
          {FAQS.map((item) => (
            <details
              key={item.q}
              className="border-border bg-card group rounded-xl border px-5 open:pb-1 [&_summary]:list-none"
            >
              <summary className="text-foreground flex cursor-pointer items-center justify-between gap-4 py-4 font-medium">
                {item.q}
                <Plus
                  className="text-muted-foreground size-4 shrink-0 transition-transform duration-200 group-open:rotate-45"
                  aria-hidden
                />
              </summary>
              <p className="text-muted-foreground pb-4 text-sm leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
