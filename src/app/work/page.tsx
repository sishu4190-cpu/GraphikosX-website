import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { GXCursor } from "@/components/motion/GXCursor";
import { WorkHero } from "@/components/pages/work/WorkHero";
import { WorkGallery } from "@/components/pages/work/WorkGallery";
import { WorkShowcase } from "@/components/pages/work/WorkShowcase";
import { WorkCaseStudy } from "@/components/pages/work/WorkCaseStudy";
import { WorkCTA } from "@/components/pages/work/WorkCTA";

const PATH = "/work";
const TITLE = "Our Work: Mangalam Acid and Chemicals (MAAC) | GraphikosX Case Studies";
const DESCRIPTION =
  "A real, full-scope GraphikosX engagement for Mangalam Acid and Chemicals (MAAC): website rebuild, digital product catalogue, and visual identity.";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function WorkPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "work", type: "WebPage", name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Our Work", path: PATH },
    ]),
  ]);

  return (
    <>
      {/* Phase 9 — full custom cursor. Mounted directly in this page's own
          tree (not layout.tsx) so it structurally cannot leak onto any
          other route — see GXCursor.tsx's own doc comment. */}
      <GXCursor />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <WorkHero />
      <WorkGallery />
      {/* Decorative WebGL layer (capability-gated, aria-hidden) — the real,
          always-rendered content is WorkCaseStudy below it. */}
      <WorkShowcase />
      <WorkCaseStudy />
      <WorkCTA />
    </>
  );
}
