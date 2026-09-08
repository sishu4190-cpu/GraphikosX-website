import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { LegalHero } from "@/components/pages/legal/LegalHero";
import { LegalProse } from "@/components/pages/legal/LegalProse";
import { company } from "@/lib/data/company";

const PATH = "/privacy";
const TITLE = "Privacy Policy";
const DESCRIPTION = "How GraphikosX collects, uses and protects the information you share through this website.";
const UPDATED = "11 August 2026";

export const metadata: Metadata = buildMetadata({ title: `${TITLE} | GraphikosX`, description: DESCRIPTION, path: PATH, noIndex: true });

export default function PrivacyPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "privacy", name: `${TITLE} | GraphikosX`, description: DESCRIPTION, path: PATH }),
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
          This Privacy Policy explains what information GraphikosX (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects through this
          website, why we collect it, and how it is used. It applies to graphikosx.in and the Free Audit and Contact forms
          on this site.
        </p>

        <h2>Information we collect</h2>
        <p>We collect information you choose to submit through our Free Audit and Contact forms, which may include:</p>
        <ul>
          <li>Your name and business or organisation name</li>
          <li>Your WhatsApp number or phone number, and email address if provided</li>
          <li>Your industry, and links to your existing website or social profiles if you share them</li>
          <li>Details you provide about your business, current situation, goals or the subject of your enquiry</li>
          <li>The page you submitted the form from, and basic campaign parameters (such as which link or ad brought you here), where present in the URL</li>
        </ul>
        <p>We do not ask for or knowingly collect payment details, passwords, or government identification through these forms.</p>

        <h2>How we use your information</h2>
        <p>We use the information you submit to:</p>
        <ul>
          <li>Respond to your Free Audit request or enquiry</li>
          <li>Understand your business context so our response is relevant, not generic</li>
          <li>Follow up with you about GraphikosX services, if appropriate</li>
        </ul>
        <p>
          We do not sell your information, and we do not use it to serve you third-party advertising. It may be processed
          by tools we use to manage enquiries (for example, messaging, email or workflow tools), solely for the purposes
          above.
        </p>

        <h2>WhatsApp</h2>
        <p>
          Where this site links you to WhatsApp (operated by Meta), any conversation you start there is governed by
          WhatsApp&rsquo;s own privacy policy and terms, not this one.
        </p>

        <h2>Cookies and analytics</h2>
        <p>
          This website does not currently use cookies for advertising or cross-site tracking. If we add analytics or
          measurement tools in the future, we will update this policy to describe what is collected and how you can
          opt out where applicable.
        </p>

        <h2>Security and abuse prevention</h2>
        <p>
          When you submit the Free Audit or Contact form, our servers briefly note the IP address the submission came
          from, purely to apply a rate limit that stops automated spam (currently capped at a small number of
          submissions per connection every few minutes). This is used only for abuse prevention, is not linked to
          your identity beyond that, and is not retained as part of your enquiry record.
        </p>

        <h2>Data retention</h2>
        <p>
          We retain the information you submit for as long as reasonably necessary to respond to your enquiry or, if you
          become a client, for the duration of our working relationship and as required for our business records.
        </p>

        <h2>Your rights</h2>
        <p>
          You can ask us what information we hold about you, request a correction, or ask us to delete it, by emailing{" "}
          <a href={`mailto:${company.salesEmail}`}>{company.salesEmail}</a>. We will respond to reasonable requests as
          promptly as we can.
        </p>

        <h2>Third-party links</h2>
        <p>
          This site links to external platforms such as Instagram, LinkedIn and WhatsApp. We are not responsible for the
          privacy practices of those platforms once you leave graphikosx.in.
        </p>

        <h2>Children&rsquo;s privacy</h2>
        <p>This website is intended for business use and is not directed at children. We do not knowingly collect information from minors.</p>

        <h2>Changes to this policy</h2>
        <p>We may update this policy as our website or processes change. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent revision.</p>

        <h2>Contact us</h2>
        <p>
          Questions about this policy can be sent to <a href={`mailto:${company.salesEmail}`}>{company.salesEmail}</a>.
        </p>
      </LegalProse>
    </>
  );
}
