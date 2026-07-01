import { PageHeader } from "@/components/layout/page-header";
import { Skeleton } from "@/components/ui/skeleton";

export default function TasksLoading() {
  return (
    <div>
      <PageHeader
        title="Daily Planner"
        description="Your day, one sheet at a time."
      />
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="size-9" />
        <Skeleton className="h-9 w-60" />
        <Skeleton className="size-9" />
        <Skeleton className="h-9 w-20" />
      </div>
      <div className="mb-3 flex items-center gap-2">
        <Skeleton className="h-9 w-full max-w-xs" />
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="border-border bg-card overflow-hidden rounded-xl border">
        {["a", "b", "c", "d", "e", "f"].map((id) => (
          <div
            key={id}
            className="border-border flex items-center gap-4 border-b px-4 py-3"
          >
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-5 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
