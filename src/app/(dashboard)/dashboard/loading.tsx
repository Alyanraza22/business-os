import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      {/* Welcome */}
      <div className="mb-6 flex flex-col gap-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Quick actions */}
      <div className="mb-6 flex flex-wrap gap-2">
        {["a", "b", "c", "d", "e"].map((id) => (
          <Skeleton key={id} className="h-8 w-28 rounded-md" />
        ))}
      </div>

      {/* Focus + insights */}
      <div className="mb-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {["a", "b", "c", "d"].map((id) => (
              <Skeleton key={id} className="h-6 w-full" />
            ))}
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          {["a", "b"].map((id) => (
            <Card key={id}>
              <CardHeader>
                <Skeleton className="h-5 w-28" />
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stat tiles */}
      {[0, 1].map((row) => (
        <div
          key={row}
          className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 ${
            row === 1 ? "mt-4" : ""
          }`}
        >
          {["a", "b", "c", "d"].map((id) => (
            <Card key={id}>
              <CardContent className="flex items-start justify-between gap-4 p-5">
                <div className="flex flex-col gap-2">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-7 w-16" />
                </div>
                <Skeleton className="size-9 rounded-md" />
              </CardContent>
            </Card>
          ))}
        </div>
      ))}

      {/* Charts */}
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {["left", "right"].map((id) => (
          <Card key={id}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[220px] w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
