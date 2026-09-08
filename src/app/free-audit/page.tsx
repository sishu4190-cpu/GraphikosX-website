import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { FreeAuditHero } from "@/components/pages/free-audit/FreeAuditHero";
import { FreeAuditWizard } from "@/components/pages/free-audit/FreeAuditWizard";

const PATH = "/free-audit";
const TITLE = "Free Digital Presence Audit | GraphikosX";
const DESCRIPTION =
  "Get a founder-reviewed look at your brand, website, SEO and social presence. Answer a few questions about your business and goals: no cost, no obligation.";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function FreeAuditPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "free-audit", name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Free Audit", path: PATH },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <FreeAuditHero />
      <FreeAuditWizard />
    </>
  );
}
