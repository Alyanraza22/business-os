import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EarningsLoading() {
  return (
    <div>
      <PageHeader
        title="Earnings"
        description="Log income and track your revenue."
      />
      <div className="mb-6 grid grid-cols-2 gap-4 xl:grid-cols-4">
        {["a", "b", "c", "d"].map((id) => (
          <Card key={id} className="p-5">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="mt-3 h-7 w-24" />
          </Card>
        ))}
      </div>
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-9 w-full max-w-xs" />
        <Skeleton className="h-9 w-40" />
      </div>
      <Card className="overflow-hidden">
        {["a", "b", "c", "d"].map((id) => (
          <div
            key={id}
            className="border-border flex items-center gap-3 border-b px-4 py-3"
          >
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-28" />
            </div>
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </Card>
    </div>
  );
}
