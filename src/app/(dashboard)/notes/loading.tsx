import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function NotesLoading() {
  return (
    <div>
      <PageHeader
        title="Notes"
        description="Quick notes, pinned and searchable."
      />
      <div className="mb-4 flex items-center gap-2">
        <Skeleton className="h-9 w-full max-w-xs" />
        <Skeleton className="h-9 w-36" />
      </div>
      <div className="grid grid-cols-1 items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {["a", "b", "c", "d", "e", "f"].map((id) => (
          <Card key={id} className="flex flex-col gap-2 p-4">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </Card>
        ))}
      </div>
    </div>
  );
}
