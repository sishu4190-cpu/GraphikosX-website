import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { AboutHero } from "@/components/pages/about/AboutHero";
import { WhyExists } from "@/components/pages/about/WhyExists";
import { AboutVision } from "@/components/pages/about/AboutVision";
import { AboutMission } from "@/components/pages/about/AboutMission";
import { WhatWeBelieve } from "@/components/pages/about/WhatWeBelieve";
import { AboutPhilosophy } from "@/components/pages/about/AboutPhilosophy";
import { AboutFounder } from "@/components/pages/about/AboutFounder";
import { AboutAnswers } from "@/components/pages/about/AboutAnswers";
import { AboutCTA } from "@/components/pages/about/AboutCTA";

const PATH = "/about";
const TITLE = "About GraphikosX — The AI-Driven Agency";
const DESCRIPTION =
  "GraphikosX exists to replace fragmented digital marketing with one connected system — strategy, branding, technology, content and AI across 10 industries.";

export const metadata: Metadata = buildMetadata({ title: TITLE, description: DESCRIPTION, path: PATH });

export default function AboutPage() {
  const schema = pageSchemaGraph([
    webPageSchema({ id: "about", type: "AboutPage", name: TITLE, description: DESCRIPTION, path: PATH }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "About", path: PATH },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <AboutHero />
      <WhyExists />
      <AboutVision />
      <AboutMission />
      <WhatWeBelieve />
      <AboutPhilosophy />
      <AboutFounder />
      <AboutAnswers />
      <AboutCTA />
    </>
  );
}
