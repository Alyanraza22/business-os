import { siteConfig } from "@/config/site";
import { marketingFeatures } from "@/features/marketing/features";

/** Dynamic llms.txt describing the site for language models. */
export function GET() {
  const base = siteConfig.url;

  const modules = marketingFeatures
    .map(
      (feature) =>
        `- [${feature.name}](${base}/features/${feature.slug}): ${feature.tagline}`,
    )
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

Business OS brings the scattered tools of running your own work into a single, calm workspace. Its modules share one data model, so progress, time and revenue always agree with each other.

## Core modules

${modules}

## Key pages

- [Home](${base}/): Product overview and getting started.
- [Features](${base}/features): All modules explained.
- [Blog](${base}/blog): Product notes, workflow ideas and design thinking.

## About

- Free to use, sign in with Google.
- Privacy-first: every record is protected by row-level security and scoped to the account owner.
- Built as a portfolio-grade, production-ready SaaS product.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
