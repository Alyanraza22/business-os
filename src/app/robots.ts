import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/** Dynamic robots.txt. Public marketing is crawlable; the app is not. */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/dashboard",
          "/projects",
          "/tasks",
          "/time",
          "/goals",
          "/earnings",
          "/analytics",
          "/notes",
          "/settings",
          "/auth/",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
