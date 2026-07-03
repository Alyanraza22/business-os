import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { LegalPage } from "@/features/marketing/components/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `The terms that govern your use of ${siteConfig.name}.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updatedOn="2026-07-03"
      intro={`These terms govern your access to and use of ${siteConfig.name}. By using the product, you agree to them.`}
    >
      <section>
        <h2>Using the service</h2>
        <p>
          You may use {siteConfig.name} for lawful purposes and in line with
          these terms. You are responsible for the activity in your account and
          for keeping your login credentials secure.
        </p>
      </section>

      <section>
        <h2>Your content</h2>
        <p>
          You retain ownership of the content you create in the app. You grant
          us the limited rights needed to store and display that content back to
          you as part of providing the service.
        </p>
      </section>

      <section>
        <h2>Acceptable use</h2>
        <ul>
          <li>Do not misuse, disrupt, or attempt to break the service.</li>
          <li>Do not use the service to store or share unlawful content.</li>
          <li>Do not attempt to access data that is not yours.</li>
        </ul>
      </section>

      <section>
        <h2>Availability</h2>
        <p>
          The service is provided on an “as is” and “as available” basis. We
          work to keep it reliable but do not guarantee uninterrupted access,
          and we may change or discontinue features over time.
        </p>
      </section>

      <section>
        <h2>Limitation of liability</h2>
        <p>
          To the extent permitted by law, {siteConfig.name} is not liable for
          indirect or consequential damages arising from your use of the
          service. Always keep your own backups of important data.
        </p>
      </section>

      <section>
        <h2>Contact</h2>
        <p>
          Questions about these terms? Reach us at{" "}
          <a href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </section>
    </LegalPage>
  );
}
