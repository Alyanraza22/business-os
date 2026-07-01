import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function GoalsLoading() {
  return (
    <div>
      <PageHeader
        title="Goals"
        description="Set daily, weekly, monthly and yearly targets."
      />
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-9 w-full max-w-xs" />
        <Skeleton className="h-9 w-36" />
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {["a", "b", "c", "d", "e", "f"].map((id) => (
          <Card key={id} className="flex flex-col gap-4 p-5">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="mt-2 h-2 w-full" />
            <Skeleton className="h-8 w-24" />
          </Card>
        ))}
      </div>
    </div>
  );
}
