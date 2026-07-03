import { siteConfig } from "@/config/site";

/**
 * JSON-LD structured data for the marketing home page: Organization, WebSite
 * and SoftwareApplication. Improves rich results and crawler understanding.
 */
export function StructuredData() {
  const base = siteConfig.url;

  const graph = [
    {
      "@type": "Organization",
      "@id": `${base}/#organization`,
      name: siteConfig.name,
      url: base,
      logo: `${base}/icon`,
      description: siteConfig.description,
    },
    {
      "@type": "WebSite",
      "@id": `${base}/#website`,
      url: base,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: { "@id": `${base}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: siteConfig.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      url: base,
      description: siteConfig.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ];

  const json = { "@context": "https://schema.org", "@graph": graph };

  return (
    <script
      type="application/ld+json"
      // Structured data is static and non-interactive.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
