import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { ServicesHero } from "@/components/pages/services/ServicesHero";
import { ServiceSystem } from "@/components/pages/services/ServiceSystem";
import { OutcomesMap } from "@/components/pages/services/OutcomesMap";
import { AIPositioning } from "@/components/pages/services/AIPositioning";
import { ServicesAnswers, qa } from "@/components/pages/services/ServicesAnswers";
import { FreeAuditCTA } from "@/components/sections/FreeAuditCTA";

const PATH = "/services";
const TITLE = "Services: Build, Grow & Scale Systems | GraphikosX";
const DESCRIPTION =
  "15 connected services organised into Build, Grow and Scale: strategy, websites, SEO, content, CRM and AI automation, built as one system.";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function ServicesPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "services", name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: PATH },
    ]),
    // Phase 10 SEO/AEO gap fix: see the matching comment in industries/page.tsx.
    faqPageSchema(qa),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ServicesHero />
      <ServiceSystem />
      <OutcomesMap />
      <AIPositioning />
      <ServicesAnswers />
      <FreeAuditCTA source="services-hub-cta" />
    </>
  );
}
