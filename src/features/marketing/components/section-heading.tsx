import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
}

/** Shared eyebrow + title + description block for marketing sections. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
      )}
    >
      {eyebrow ? (
        <span className="text-primary text-xs font-semibold tracking-wider uppercase">
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-foreground text-3xl font-semibold tracking-[-0.02em] text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="text-muted-foreground text-base leading-relaxed text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
