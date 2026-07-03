import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { LegalPage } from "@/features/marketing/components/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: `How ${siteConfig.name} uses cookies and similar technologies.`,
  alternates: { canonical: "/cookies" },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updatedOn="2026-07-03"
      intro={`This policy explains how ${siteConfig.name} uses cookies and similar technologies. We keep their use minimal and functional.`}
    >
      <section>
        <h2>What cookies are</h2>
        <p>
          Cookies are small text files stored on your device that help a website
          function and remember your preferences between visits.
        </p>
      </section>

      <section>
        <h2>How we use them</h2>
        <ul>
          <li>
            <strong>Essential:</strong> to keep you signed in and secure your
            session. The product cannot function without these.
          </li>
          <li>
            <strong>Preferences:</strong> to remember choices such as your theme
            (light or dark).
          </li>
        </ul>
      </section>

      <section>
        <h2>Analytics</h2>
        <p>
          If we use analytics in the future, we will rely on privacy-respecting,
          aggregate measurement and update this policy accordingly.
        </p>
      </section>

      <section>
        <h2>Managing cookies</h2>
        <p>
          You can control or delete cookies through your browser settings.
          Blocking essential cookies may prevent you from signing in or using
          parts of the product.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions? Reach us at{" "}
          <a href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
