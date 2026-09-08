import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { IndustriesHero } from "@/components/pages/industries/IndustriesHero";
import { WhySpecialize } from "@/components/pages/industries/WhySpecialize";
import { IndustriesSystem } from "@/components/pages/industries/IndustriesSystem";
import { IndustriesAnswers, qa } from "@/components/pages/industries/IndustriesAnswers";
import { FreeAuditCTA } from "@/components/sections/FreeAuditCTA";

const PATH = "/industries";
const TITLE = "Industries We Serve: 10 Specialized Verticals | GraphikosX";
// Trimmed to stay under Google's ~155-160 char safe display length (was 172
// chars pre-Phase-10, which got truncated in search snippets).
const DESCRIPTION =
  "GraphikosX works with 10 chosen industries, from doctors and clinics to real estate to jewellery and wedding, because buying behaviour differs by industry.";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function IndustriesPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "industries", name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Industries", path: PATH },
    ]),
    // Phase 10 SEO/AEO gap fix: this hub page's IndustriesAnswers section
    // already renders this same qa[] visibly — it just wasn't marked up in
    // structured data before. Detail pages (industries/[slug]) already did
    // this correctly; this brings the hub page in line with them.
    faqPageSchema(qa),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <IndustriesHero />
      <WhySpecialize />
      <IndustriesSystem />
      <IndustriesAnswers />
      <FreeAuditCTA source="industries-hub-cta" />
    </>
  );
}
