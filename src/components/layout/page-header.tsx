import type { ReactNode } from "react";

import { Heading, Text } from "@/components/ui/typography";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

/** Consistent page title block reused across every dashboard route. */
export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-1">
        <Heading size="h2">{title}</Heading>
        {description ? <Text variant="muted">{description}</Text> : null}
      </div>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
