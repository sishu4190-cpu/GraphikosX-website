import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { LegalHero } from "@/components/pages/legal/LegalHero";
import { LegalProse } from "@/components/pages/legal/LegalProse";
import { company } from "@/lib/data/company";

const PATH = "/data-deletion";
const TITLE = "Data Deletion Instructions";
const DESCRIPTION = "How to request deletion of your information from GraphikosX, including from the GraphikosX AI Assistant on WhatsApp.";
const UPDATED = "17 September 2026";
const DELETION_SUBJECT = "Data Deletion Request — GraphikosX";
const mailtoHref = `mailto:${company.founder.email}?subject=${encodeURIComponent(DELETION_SUBJECT)}`;

export const metadata: Metadata = buildMetadata({ title: `${TITLE} | GraphikosX`, description: DESCRIPTION, path: PATH, noIndex: true });

export default function DataDeletionPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "data-deletion", name: `${TITLE} | GraphikosX`, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: TITLE, path: PATH },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <LegalHero title={TITLE} path={PATH} updated={UPDATED} />
      <LegalProse>
        <p>
          If you have contacted GraphikosX through this website or messaged the GraphikosX AI Assistant on WhatsApp,
          you can ask us to delete the information we hold about you. You do not need to create an account or sign up
          for anything to make this request.
        </p>

        <h2>How to request deletion</h2>
        <p>
          Email <a href={mailtoHref}>{company.founder.email}</a> with the subject line{" "}
          <strong>&ldquo;{DELETION_SUBJECT}&rdquo;</strong>, or use the button below to start a pre-filled email.
          You can also send the same request as a WhatsApp message to{" "}
          <a href={`tel:${company.phoneE164}`}>{company.phoneDisplay}</a>.
        </p>
        <p>
          <a
            href={mailtoHref}
            className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper! no-underline! transition-colors hover:bg-accent hover:text-paper!"
          >
            Email a Deletion Request →
          </a>
        </p>

        <h2>What to include</h2>
        <p>So we can find and act on the correct record, please include:</p>
        <ul>
          <li>Your full name;</li>
          <li>The phone number, WhatsApp number, or email address you used to contact us; and</li>
          <li>Optionally, the business or organisation name you enquired under, and roughly when you contacted us.</li>
        </ul>

        <h2>How we verify your request</h2>
        <p>
          To avoid deleting or disclosing someone else&rsquo;s information by mistake, we confirm deletion requests
          by replying to the same email address, phone number, or WhatsApp number the original enquiry came from. If
          you contact us from a different address or number than the one on file, we may ask you to also confirm
          from the original one, or provide enough detail for us to reasonably match you to the record.
        </p>

        <h2>Which systems may hold your information</h2>
        <p>Depending on how you contacted us, your information may exist in:</p>
        <ul>
          <li>Free Audit or Contact form submissions and the email notifications they generate;</li>
          <li>WhatsApp conversation history with the GraphikosX AI Assistant or our team; and</li>
          <li>Any notes, proposals, or correspondence created if we followed up with you about your enquiry.</li>
        </ul>

        <h2>How we process your request</h2>
        <p>
          We review each deletion request manually, confirm it is genuinely yours as described above, and then
          delete or anonymise the information across the systems listed above. We will let you know once your
          request has been completed, using the same channel you contacted us on. We aim to act on requests as
          promptly as we reasonably can; we have not committed to a fixed number of days, since this depends on the
          nature and location of the record.
        </p>

        <h2>Legal retention and backups</h2>
        <p>
          We may need to retain certain information despite a deletion request — for example, where we are legally
          required to keep business records (such as accounting or tax records), where information is necessary to
          resolve a dispute or enforce our agreements, or where information persists briefly in routine backups
          until those backups naturally cycle out. Where this applies, we will tell you what we could and could not
          delete, and why.
        </p>

        <h2>Related pages</h2>
        <p>
          For more detail on what we collect and why, see our <a href="/privacy-policy">Privacy Policy</a>. For the
          terms that apply to using our website and the AI Assistant, see our{" "}
          <a href="/terms-of-service">Terms of Service</a>.
        </p>

        <h2>Contact us</h2>
        <p>
          Questions about this page can be sent to <a href={`mailto:${company.founder.email}`}>{company.founder.email}</a>.
        </p>
      </LegalProse>
    </>
  );
}
