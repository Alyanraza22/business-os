import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ElementType } from "react";

import { cn } from "@/lib/utils";

const headingVariants = cva("font-semibold tracking-tight text-foreground", {
  variants: {
    size: {
      h1: "text-3xl sm:text-4xl",
      h2: "text-2xl sm:text-3xl",
      h3: "text-xl sm:text-2xl",
      h4: "text-lg sm:text-xl",
    },
  },
  defaultVariants: { size: "h2" },
});

interface HeadingProps
  extends ComponentProps<"h2">, VariantProps<typeof headingVariants> {
  /** Override the rendered tag independently of the visual size. */
  as?: ElementType;
}

function Heading({ className, size, as, ...props }: HeadingProps) {
  const Tag = (as ?? size ?? "h2") as ElementType;
  return (
    <Tag className={cn(headingVariants({ size }), className)} {...props} />
  );
}

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-sm text-foreground",
      muted: "text-sm text-muted-foreground",
      lead: "text-lg text-muted-foreground",
      small: "text-xs text-muted-foreground",
    },
  },
  defaultVariants: { variant: "default" },
});

type TextProps = ComponentProps<"p"> & VariantProps<typeof textVariants>;

function Text({ className, variant, ...props }: TextProps) {
  return <p className={cn(textVariants({ variant }), className)} {...props} />;
}

export { Heading, Text, headingVariants, textVariants };
