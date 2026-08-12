import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { IndustriesHero } from "@/components/pages/industries/IndustriesHero";
import { WhySpecialize } from "@/components/pages/industries/WhySpecialize";
import { IndustriesSystem } from "@/components/pages/industries/IndustriesSystem";
import { IndustriesAnswers } from "@/components/pages/industries/IndustriesAnswers";
import { FreeAuditCTA } from "@/components/sections/FreeAuditCTA";

const PATH = "/industries";
const TITLE = "Industries We Serve — 10 Specialized Verticals | GraphikosX";
const DESCRIPTION =
  "GraphikosX works with 10 chosen industries — from doctors and clinics to real estate to jewellery and wedding — because buying behaviour and trust signals differ by industry.";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function IndustriesPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "industries", name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Industries", path: PATH },
    ]),
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
