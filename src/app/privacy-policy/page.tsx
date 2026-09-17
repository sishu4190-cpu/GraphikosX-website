import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { LegalHero } from "@/components/pages/legal/LegalHero";
import { LegalProse } from "@/components/pages/legal/LegalProse";
import { company } from "@/lib/data/company";

const PATH = "/privacy-policy";
const TITLE = "Privacy Policy";
const DESCRIPTION =
  "How GraphikosX collects, uses, shares and protects information through this website and the GraphikosX AI Assistant on WhatsApp.";
const UPDATED = "17 September 2026";

export const metadata: Metadata = buildMetadata({ title: `${TITLE} | GraphikosX`, description: DESCRIPTION, path: PATH, noIndex: true });

export default function PrivacyPolicyPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "privacy-policy", name: `${TITLE} | GraphikosX`, description: DESCRIPTION, path: PATH }),
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
        <h2>1. Who we are</h2>
        <p>
          This Privacy Policy is issued by GraphikosX (&ldquo;GraphikosX&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;), a
          digital presence agency founded by Prakash Pal and based in India. You can reach us at{" "}
          <a href={`mailto:${company.founder.email}`}>{company.founder.email}</a> for privacy questions and data
          requests, or <a href={`mailto:${company.salesEmail}`}>{company.salesEmail}</a> for general enquiries, or by
          phone/WhatsApp at <a href={`tel:${company.phoneE164}`}>{company.phoneDisplay}</a>.
        </p>

        <h2>2. What this policy covers</h2>
        <p>This policy applies to:</p>
        <ul>
          <li>This website, graphikosx.in, including the Free Audit and Contact forms;</li>
          <li>
            The GraphikosX AI Assistant, an AI-assisted conversation experience available on WhatsApp for answering
            enquiries about GraphikosX services, and
          </li>
          <li>Enquiries, lead information and meeting requests you send us in connection with our services.</li>
        </ul>
        <p>
          It does not cover the internal systems we use to deliver a paid engagement once a separate service
          agreement is in place — those are governed by that agreement.
        </p>

        <h2>3. Information we collect</h2>
        <p>Depending on how you interact with us, we may collect:</p>
        <ul>
          <li>Your name and the name of your business or organisation;</li>
          <li>Your WhatsApp number or phone number, and email address if you provide one;</li>
          <li>Your industry, and links to your existing website or social profiles if you share them;</li>
          <li>
            The content of the enquiry, requirements or business context you share with us, whether through a form or
            a WhatsApp conversation with the GraphikosX AI Assistant;
          </li>
          <li>
            Lead-qualification details our team or the AI Assistant gathers to understand your needs (for example,
            your goals, current situation, or timeline);
          </li>
          <li>Meeting or callback requests you make;</li>
          <li>
            The page you submitted a form from and basic campaign parameters (such as which link or ad brought you
            here), where present in the URL; and
          </li>
          <li>
            Limited website technical information (see &ldquo;Cookies and analytics&rdquo; and &ldquo;Security and
            abuse prevention&rdquo; below).
          </li>
        </ul>
        <p>We do not ask for or knowingly collect payment details, passwords, or government identification.</p>

        <h2>4. How we collect it</h2>
        <p>
          We collect information you actively submit — through the Free Audit or Contact forms on this website, or by
          messaging the GraphikosX AI Assistant (or our team) on WhatsApp. We do not collect information about you
          from other sources or third parties.
        </p>

        <h2>5. Why we process your information</h2>
        <p>We use the information above to:</p>
        <ul>
          <li>Respond to your Free Audit request or enquiry;</li>
          <li>Provide customer support and answer questions about our services;</li>
          <li>Understand your business context so our response is relevant, not generic;</li>
          <li>Manage leads and, where relevant, prepare a quotation or proposal;</li>
          <li>Schedule and manage meeting or callback requests;</li>
          <li>Deliver services you have engaged us for; and</li>
          <li>Meet our own security, fraud-prevention and legal obligations.</li>
        </ul>
        <p>We do not sell your information, and we do not use it to serve you third-party advertising.</p>

        <h2>6. The GraphikosX AI Assistant on WhatsApp</h2>
        <p>
          The GraphikosX AI Assistant is an artificial-intelligence-assisted conversation experience we operate on
          WhatsApp, built on the WhatsApp Business Platform (WhatsApp Cloud API). When you message it:
        </p>
        <ul>
          <li>
            Your message is delivered to us through Meta&rsquo;s WhatsApp Business Platform, which processes the
            message in transit under its own terms and privacy policy;
          </li>
          <li>
            The content of your message may be sent to OpenAI&rsquo;s API to help generate a relevant response — this
            means relevant message text can be processed by OpenAI as part of answering you; and
          </li>
          <li>
            You can ask to speak with a person at any time, and our team can take over the conversation from the AI
            Assistant.
          </li>
        </ul>
        <p>
          Please avoid sending sensitive personal information (such as financial account details, government ID
          numbers, or health information) through this or any chat channel — it is not needed for us to help you, and
          chat channels are not designed for that kind of data.
        </p>

        <h2>7. Who we share information with</h2>
        <p>
          We do not sell your information. We share it only with the service providers that help us operate the
          website and the AI Assistant, and only for the purposes described in this policy:
        </p>
        <ul>
          <li>
            <strong>Meta / WhatsApp Business Platform</strong> — to deliver and receive WhatsApp messages;
          </li>
          <li>
            <strong>OpenAI</strong> — to help generate AI Assistant responses, as described above;
          </li>
          <li>
            <strong>Resend</strong> (or an equivalent transactional email provider) — to email website form
            submissions to our team; and
          </li>
          <li>Our hosting provider, to the extent necessary to operate this website.</li>
        </ul>
        <p>
          At the time of this update, this website&rsquo;s Free Audit and Contact forms do not forward submissions to
          any CRM, spreadsheet or marketing-automation tool beyond the email notification above. If that changes, we
          will update this section to name the tool involved.
        </p>
        <p>
          We may also disclose information where required by law, to protect our legal rights, or in connection with
          a genuine business transaction (such as a merger), in which case the receiving party would be bound by
          commitments at least as protective as this policy.
        </p>

        <h2>8. How long we keep information</h2>
        <p>
          Website form submissions are retained for as long as reasonably necessary to respond to your enquiry or, if
          you become a client, for the duration of our working relationship and as required for our business
          records.
        </p>
        <p>
          WhatsApp AI Assistant conversations are retained for as long as reasonably necessary to respond to your
          enquiry, provide support, and maintain a record of our conversation with you for quality and continuity
          purposes, after which we work to delete or anonymise it in the ordinary course of our systems and backup
          cycles. We are finalising the exact retention schedule and backup-deletion timelines for the AI Assistant
          as that system is built, and will update this section with specifics once confirmed.
        </p>

        <h2>9. Your rights and choices</h2>
        <p>
          You can ask us what information we hold about you, request a correction, or ask us to delete it, by
          emailing <a href={`mailto:${company.founder.email}`}>{company.founder.email}</a>, or by following the steps
          on our <a href="/data-deletion">Data Deletion</a> page. We will respond to reasonable requests as promptly
          as we can, subject to the legal and backup limitations described on that page.
        </p>

        <h2>10. Data security</h2>
        <p>
          We take reasonable technical and organisational measures to protect the information you share with us,
          including transmitting data over encrypted (HTTPS/TLS) connections and limiting access to authorised
          personnel. No method of transmission or storage is completely secure, and we cannot guarantee absolute
          security — including for messages processed by the AI Assistant, WhatsApp, or OpenAI, whose own security
          practices govern their part of the process.
        </p>

        <h2>11. Security and abuse prevention</h2>
        <p>
          When you submit the Free Audit or Contact form, our servers briefly note the IP address the submission
          came from, purely to apply a rate limit that stops automated spam. This is used only for abuse prevention,
          is not linked to your identity beyond that, and is not retained as part of your enquiry record.
        </p>

        <h2>12. International processing</h2>
        <p>
          We are based in India. Some of the service providers described above — including Meta and OpenAI — may
          process or store information on servers located outside India. Where this happens, it is subject to those
          providers&rsquo; own safeguards and terms.
        </p>

        <h2>13. Cookies and analytics</h2>
        <p>
          This website does not currently set cookies for advertising or cross-site tracking. As of this update, no
          analytics or measurement tool is confirmed to be active on the live site; we are verifying this and will
          revise this section if that changes. If we add analytics or measurement tools, we will update this policy
          to describe what is collected and how you can opt out where applicable.
        </p>

        <h2>14. Third-party links</h2>
        <p>
          This site links to external platforms such as Instagram, LinkedIn and WhatsApp. We are not responsible for
          the privacy practices of those platforms once you leave graphikosx.in or their own app.
        </p>

        <h2>15. Children&rsquo;s privacy</h2>
        <p>
          This website and the AI Assistant are intended for business use and are not directed at children. We do
          not knowingly collect information from minors.
        </p>

        <h2>16. Changes to this policy</h2>
        <p>
          We may update this policy as our website, AI Assistant, or processes change. The &ldquo;Last updated&rdquo;
          date at the top of this page reflects the most recent revision.
        </p>

        <h2>17. Contact us</h2>
        <p>
          Questions about this policy, or requests about your information, can be sent to{" "}
          <a href={`mailto:${company.founder.email}`}>{company.founder.email}</a>.
        </p>
      </LegalProse>
    </>
  );
}
