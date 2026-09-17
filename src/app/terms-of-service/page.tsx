import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { LegalHero } from "@/components/pages/legal/LegalHero";
import { LegalProse } from "@/components/pages/legal/LegalProse";
import { company } from "@/lib/data/company";

const PATH = "/terms-of-service";
const TITLE = "Terms of Service";
const DESCRIPTION = "The terms that apply to your use of the GraphikosX website and the GraphikosX AI Assistant on WhatsApp.";
const UPDATED = "17 September 2026";

export const metadata: Metadata = buildMetadata({ title: `${TITLE} | GraphikosX`, description: DESCRIPTION, path: PATH, noIndex: true });

export default function TermsOfServicePage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "terms-of-service", name: `${TITLE} | GraphikosX`, description: DESCRIPTION, path: PATH }),
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
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of graphikosx.in (the &ldquo;Site&rdquo;) and
          the GraphikosX AI Assistant on WhatsApp (together, the &ldquo;Services&rdquo;), operated by GraphikosX. By
          browsing the Site, submitting a form on it, or messaging the GraphikosX AI Assistant, you agree to these
          Terms.
        </p>

        <h2>Use of the Services</h2>
        <p>
          The Services are provided to share information about GraphikosX and its services, let visitors request a
          Free Audit or get in touch, and answer enquiries through the AI Assistant. You agree to use the Services
          only for lawful purposes and to provide accurate information when you submit a form or message us.
        </p>

        <h2>The Free Audit</h2>
        <p>
          The Free Audit is a courtesy review offered at GraphikosX&rsquo;s discretion, based on the information you
          provide. It is a starting point for a conversation, not a guaranteed deliverable, a formal contract, or a
          substitute for a full paid engagement. We may decline or limit a Free Audit request at our discretion.
        </p>

        <h2>The GraphikosX AI Assistant — AI-generated responses and their limitations</h2>
        <p>
          The GraphikosX AI Assistant uses artificial intelligence to help answer enquiries, explain our services,
          and gather information about your requirements. Its responses are generated automatically and are provided
          for general information only. Nothing the AI Assistant says — including any figure, timeline, scope
          description, or availability it mentions — constitutes a confirmed quotation, a signed service agreement,
          a guaranteed business outcome, or a confirmed booking or meeting, unless separately confirmed in writing by
          a member of our team. AI-generated responses may occasionally be inaccurate or incomplete; you can ask for
          human assistance at any time.
        </p>

        <h2>Human assistance</h2>
        <p>
          You can request to speak with a person instead of the AI Assistant at any time by asking in the WhatsApp
          conversation, or by using the contact details on our <a href="/contact">Contact</a> page.
        </p>

        <h2>Service engagements</h2>
        <p>
          Any paid engagement for GraphikosX services, including strategy, branding, websites, marketing, automation
          or any other service listed on this Site, is governed by a separate proposal, agreement or contract signed
          between GraphikosX and the client. Nothing on the Site or in an AI Assistant conversation constitutes such
          an agreement on its own.
        </p>

        <h2>No guarantee of results</h2>
        <p>
          Marketing, branding, search visibility and growth outcomes depend on many factors outside our control,
          including your market, competitors, budget and platform algorithm changes. We do not guarantee specific
          rankings, traffic, leads, revenue or other outcomes, on the Site, in any Free Audit response, or in any AI
          Assistant conversation.
        </p>

        <h2>Website and Service availability</h2>
        <p>
          We aim to keep the Site and the AI Assistant available, but do not guarantee uninterrupted access. Either
          may be unavailable from time to time for maintenance, technical issues, or reasons outside our control,
          including outages of third-party platforms such as WhatsApp or our AI service provider.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The content, design, brand assets and logo on the Site belong to GraphikosX and may not be copied,
          reproduced or reused without our written permission.
        </p>

        <h2>Acceptable use</h2>
        <p>
          You agree not to misuse the Services — including attempting to disrupt them, submit false or fraudulent
          information, or use the AI Assistant to generate content unrelated to a genuine enquiry about our
          services.
        </p>

        <h2>Third-party services</h2>
        <p>
          The Services rely on and link to third-party platforms, including WhatsApp (Meta), OpenAI, Instagram and
          LinkedIn. We are not responsible for the content, availability, or practices of those platforms; your use
          of them is also governed by their own terms.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          The Site, the AI Assistant, and any Free Audit response are provided on an &ldquo;as is&rdquo; basis. To
          the fullest extent permitted by law, GraphikosX is not liable for any indirect, incidental or consequential
          loss arising from your use of the Services or reliance on information contained in them, including
          AI-generated responses.
        </p>

        <h2>Governing law</h2>
        <p>These Terms are governed by the laws of India.</p>

        <h2>Changes to these Terms</h2>
        <p>
          We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date at the top of this page
          reflects the most recent revision.
        </p>

        <h2>Contact us</h2>
        <p>
          Questions about these Terms can be sent to <a href={`mailto:${company.salesEmail}`}>{company.salesEmail}</a>.
        </p>
      </LegalProse>
    </>
  );
}
