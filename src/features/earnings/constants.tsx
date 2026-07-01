import type { BadgeVariant } from "@/features/shared/constants";
import type { Enums } from "@/lib/supabase/types";

export const EARNING_CATEGORY_META: Record<
  Enums<"earning_category">,
  { label: string; badge: BadgeVariant }
> = {
  freelancing: { label: "Freelancing", badge: "default" },
  etsy: { label: "Etsy", badge: "success" },
  affiliate: { label: "Affiliate", badge: "secondary" },
  ads: { label: "Ads", badge: "warning" },
  other: { label: "Other", badge: "outline" },
};
