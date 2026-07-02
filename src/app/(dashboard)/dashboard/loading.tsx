import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="An overview of your work today."
      />

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
