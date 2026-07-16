import type { Metadata } from "next";

import { PageHeader } from "@/components/layout/page-header";
import {
  DailyReviewSection,
  WeeklyReviewSection,
} from "@/features/review/components/review-sections";
import { getReviewData } from "@/features/review/queries";

export const metadata: Metadata = {
  title: "Review",
  robots: { index: false, follow: false },
};

export default async function ReviewPage() {
  const { daily, weekly } = await getReviewData();

  return (
    <div>
      <PageHeader
        title="Review"
        description="Where the day and the week actually landed."
      />
      <div className="flex flex-col gap-4">
        <DailyReviewSection review={daily} />
        <WeeklyReviewSection review={weekly} />
      </div>
    </div>
  );
}
