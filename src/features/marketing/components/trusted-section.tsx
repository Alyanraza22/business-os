const AUDIENCES = [
  "Freelancers",
  "Developers",
  "Designers",
  "Agencies",
  "Solo founders",
  "Creators",
  "Students",
  "Remote workers",
];

/** Lightweight "built for" strip. Honest audience signal, not fake logos. */
export function TrustedSection() {
  return (
    <section className="border-border border-y py-10">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-muted-foreground text-center text-xs font-medium tracking-wider uppercase">
          Built for people who run their own thing
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {AUDIENCES.map((audience) => (
            <span
              key={audience}
              className="text-muted-foreground/80 text-sm font-medium"
            >
              {audience}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
