import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Heading, Text } from "@/components/ui/typography";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}

/** Reusable empty state for lists with no (or no matching) records. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="border-border flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-xl border border-dashed p-8 text-center">
      <div className="bg-card border-border text-muted-foreground flex size-14 items-center justify-center rounded-2xl border">
        <Icon className="size-6" aria-hidden />
      </div>
      <div className="flex flex-col gap-1.5">
        <Heading size="h4">{title}</Heading>
        {description ? (
          <Text variant="muted" className="mx-auto max-w-md leading-relaxed">
            {description}
          </Text>
        ) : null}
      </div>
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
