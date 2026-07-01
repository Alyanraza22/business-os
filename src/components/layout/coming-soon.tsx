import { Sparkles } from "lucide-react";

import { Text } from "@/components/ui/typography";

/** Shared empty state for routes whose feature module hasn't shipped yet. */
export function ComingSoon({ label }: { label: string }) {
  return (
    <div className="border-border flex min-h-[50vh] flex-col items-center justify-center gap-3 rounded-xl border border-dashed text-center">
      <div className="bg-muted text-muted-foreground flex size-12 items-center justify-center rounded-full">
        <Sparkles className="size-5" />
      </div>
      <Text variant="muted" className="max-w-xs">
        {label} is coming soon. This module is next on the roadmap.
      </Text>
    </div>
  );
}
