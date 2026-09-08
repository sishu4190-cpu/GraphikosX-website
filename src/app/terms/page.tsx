import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { LegalHero } from "@/components/pages/legal/LegalHero";
import { LegalProse } from "@/components/pages/legal/LegalProse";
import { company } from "@/lib/data/company";

const PATH = "/terms";
const TITLE = "Terms of Service";
const DESCRIPTION = "The terms that apply to your use of the GraphikosX website.";
const UPDATED = "10 August 2026";

export const metadata: Metadata = buildMetadata({ title: `${TITLE} | GraphikosX`, description: DESCRIPTION, path: PATH, noIndex: true });

export default function TermsPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "terms", name: `${TITLE} | GraphikosX`, description: DESCRIPTION, path: PATH }),
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
          These Terms of Service (&ldquo;Terms&rdquo;) govern your use of graphikosx.in (the &ldquo;Site&rdquo;), operated
          by GraphikosX. By browsing this Site or submitting a form on it, you agree to these Terms.
        </p>

        <h2>Use of this website</h2>
        <p>
          This Site is provided to share information about GraphikosX and its services, and to let visitors request a
          Free Audit or get in touch. You agree to use it only for lawful purposes and to provide accurate information
          when you submit a form.
        </p>

        <h2>The Free Audit</h2>
        <p>
          The Free Audit is a courtesy review offered at GraphikosX&rsquo;s discretion, based on the information you
          provide. It is a starting point for a conversation, not a guaranteed deliverable, a formal contract, or a
          substitute for a full paid engagement. We may decline or limit a Free Audit request at our discretion.
        </p>

        <h2>Service engagements</h2>
        <p>
          Any paid engagement for GraphikosX services, including strategy, branding, websites, marketing, automation or
          any other service listed on this Site, is governed by a separate proposal, agreement or contract signed
          between GraphikosX and the client. Nothing on this Site constitutes such an agreement on its own.
        </p>

        <h2>No guarantee of results</h2>
        <p>
          Marketing, branding, search visibility and growth outcomes depend on many factors outside our control,
          including your market, competitors, budget and platform algorithm changes. We do not guarantee specific
          rankings, traffic, leads, revenue or other outcomes, on this Site or in any Free Audit response.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The content, design, brand assets and logo on this Site belong to GraphikosX and may not be copied,
          reproduced or reused without our written permission.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          This Site and any Free Audit response are provided on an &ldquo;as is&rdquo; basis. To the fullest extent
          permitted by law, GraphikosX is not liable for any indirect, incidental or consequential loss arising from
          your use of this Site or reliance on information contained in it.
        </p>

        <h2>Third-party links and services</h2>
        <p>
          This Site links to third-party platforms such as WhatsApp, Instagram and LinkedIn. We are not responsible for
          the content, availability or practices of those platforms.
        </p>

        <h2>Governing law</h2>
        <p>These Terms are governed by the laws of India.</p>

        <h2>Changes to these terms</h2>
        <p>We may update these Terms from time to time. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most recent revision.</p>

        <h2>Contact us</h2>
        <p>
          Questions about these Terms can be sent to <a href={`mailto:${company.salesEmail}`}>{company.salesEmail}</a>.
        </p>
      </LegalProse>
    </>
  );
}
