import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** Web app manifest for installability and rich mobile presentation. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: siteConfig.shortName,
    description: siteConfig.description,
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#090909",
    theme_color: "#090909",
    categories: ["productivity", "business"],
    icons: [
      {
        src: "/icon",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
