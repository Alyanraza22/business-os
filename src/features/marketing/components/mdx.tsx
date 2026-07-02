import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/**
 * Atelier-styled element map for rendered MDX. Keeps article typography
 * on-brand without pulling in a prose plugin.
 */
export const mdxComponents: MDXComponents = {
  h2: ({ className, ...props }: ComponentProps<"h2">) => (
    <h2
      className={cn(
        "text-foreground mt-12 mb-4 text-2xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: ComponentProps<"h3">) => (
    <h3
      className={cn(
        "text-foreground mt-8 mb-3 text-xl font-semibold tracking-tight",
        className,
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: ComponentProps<"p">) => (
    <p
      className={cn("text-muted-foreground my-4 leading-relaxed", className)}
      {...props}
    />
  ),
  a: ({ className, ...props }: ComponentProps<"a">) => (
    <a
      className={cn(
        "text-primary font-medium underline-offset-4 hover:underline",
        className,
      )}
      {...props}
    />
  ),
  ul: ({ className, ...props }: ComponentProps<"ul">) => (
    <ul
      className={cn(
        "text-muted-foreground my-4 flex list-disc flex-col gap-2 pl-6 leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: ComponentProps<"ol">) => (
    <ol
      className={cn(
        "text-muted-foreground my-4 flex list-decimal flex-col gap-2 pl-6 leading-relaxed",
        className,
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: ComponentProps<"li">) => (
    <li
      className={cn("marker:text-muted-foreground/60", className)}
      {...props}
    />
  ),
  strong: ({ className, ...props }: ComponentProps<"strong">) => (
    <strong
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: ComponentProps<"blockquote">) => (
    <blockquote
      className={cn(
        "border-primary text-foreground my-6 border-l-2 pl-4 text-lg font-medium italic",
        className,
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: ComponentProps<"code">) => (
    <code
      className={cn(
        "bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-[0.85em]",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }: ComponentProps<"pre">) => (
    <pre
      className={cn(
        "border-border bg-card my-6 overflow-x-auto rounded-lg border p-4 text-sm [&_code]:bg-transparent [&_code]:p-0",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: ComponentProps<"hr">) => (
    <hr className={cn("border-border my-10", className)} {...props} />
  ),
};
