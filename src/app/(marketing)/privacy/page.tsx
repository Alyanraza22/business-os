import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import { LegalPage } from "@/features/marketing/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses and protects your data.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updatedOn="2026-07-03"
      intro={`This policy explains what information ${siteConfig.name} collects, how it is used, and the choices you have. We keep data collection to the minimum needed to run the product.`}
    >
      <section>
        <h2>Information we collect</h2>
        <p>
          When you sign in, we receive basic account details from your chosen
          provider — your name and email address. We also store the content you
          create in the app, such as projects, tasks, time entries, goals, notes
          and earnings.
        </p>
      </section>

      <section>
        <h2>How we use your information</h2>
        <ul>
          <li>To provide the core features of the product to you.</li>
          <li>To keep your account secure and prevent abuse.</li>
          <li>To understand aggregate, non-identifying usage and improve.</li>
        </ul>
      </section>

      <section>
        <h2>How your data is protected</h2>
        <p>
          Your records are scoped to your account using row-level security, so
          other users cannot access them. Data is stored with a reputable
          infrastructure provider and transmitted over encrypted connections.
        </p>
      </section>

      <section>
        <h2>Data sharing</h2>
        <p>
          We do not sell your personal data. We share information only with the
          service providers required to operate the product (such as hosting and
          authentication), and only as needed to deliver the service.
        </p>
      </section>

      <section>
        <h2>Your choices</h2>
        <p>
          You can update your profile in settings and request deletion of your
          account and associated data at any time by contacting us at{" "}
          <a href={`mailto:${siteConfig.contactEmail}`}>
            {siteConfig.contactEmail}
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Changes to this policy</h2>
        <p>
          We may update this policy from time to time. Material changes will be
          reflected by the “last updated” date above.
        </p>
      </section>
    </LegalPage>
  );
}
