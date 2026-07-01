import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TimeTrackerLoading() {
  return (
    <div>
      <PageHeader
        title="Time Tracker"
        description="Your focus time across everything you track."
      />
      <div className="flex flex-col gap-6">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
          {["a", "b", "c", "d"].map((id) => (
            <Card key={id} className="p-5">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="mt-3 h-7 w-16" />
            </Card>
          ))}
        </div>
        <Card className="overflow-hidden">
          {["a", "b", "c", "d"].map((id) => (
            <div
              key={id}
              className="border-border flex items-center gap-3 border-b px-4 py-3"
            >
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-28" />
              </div>
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}
