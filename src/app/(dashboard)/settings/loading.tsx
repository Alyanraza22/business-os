import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div>
      <PageHeader
        title="Settings"
        description="Manage your profile and preferences."
      />
      <div className="flex max-w-2xl flex-col gap-6">
        {["a", "b", "c"].map((id) => (
          <Card key={id}>
            <CardHeader>
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-3 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
