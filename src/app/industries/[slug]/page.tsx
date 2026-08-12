import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, pageSchemaGraph, webPageSchema } from "@/lib/schema";
import { industries } from "@/lib/data/industries";
import { industryDetails } from "@/lib/data/industry-details";
import { IndustryHero } from "@/components/pages/industry-detail/IndustryHero";
import { IndustryAnswer } from "@/components/pages/industry-detail/IndustryAnswer";
import { IndustryChallenges } from "@/components/pages/industry-detail/IndustryChallenges";
import { BuyerJourney } from "@/components/pages/industry-detail/BuyerJourney";
import { TrustSignals } from "@/components/pages/industry-detail/TrustSignals";
import { RelevantServices } from "@/components/pages/industry-detail/RelevantServices";
import { IndustryTransformation } from "@/components/pages/industry-detail/IndustryTransformation";
import { IndustryOutcomes } from "@/components/pages/industry-detail/IndustryOutcomes";
import { IndustryApproach } from "@/components/pages/industry-detail/IndustryApproach";
import { IndustryEcosystem } from "@/components/pages/industry-detail/IndustryEcosystem";
import { IndustryFAQ } from "@/components/pages/industry-detail/IndustryFAQ";
import { IndustryCTA } from "@/components/pages/industry-detail/IndustryCTA";

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

function getData(slug: string) {
  const industry = industries.find((i) => i.slug === slug);
  const detail = industryDetails[slug];
  if (!industry || !detail) return null;
  return { industry, detail };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getData(slug);
  if (!data) return {};
  return buildMetadata({
    title: data.detail.metaTitle,
    description: data.detail.metaDescription,
    path: `/industries/${slug}`,
  });
}

export default async function IndustryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getData(slug);
  if (!data) notFound();
  const { industry, detail } = data;
  const path = `/industries/${slug}`;

  const schema = pageSchemaGraph([
    webPageSchema({ id: "webpage", name: detail.metaTitle, description: detail.metaDescription, path }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Industries", path: "/industries" },
      { name: industry.name, path },
    ]),
    faqPageSchema(detail.faqs),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <IndustryHero detail={detail} industryName={industry.name} />
      <IndustryAnswer detail={detail} industryName={industry.name} />
      <IndustryChallenges detail={detail} industryName={industry.name} />
      <BuyerJourney detail={detail} />
      <TrustSignals detail={detail} />
      <RelevantServices detail={detail} />
      <IndustryTransformation detail={detail} industryName={industry.name} />
      <IndustryOutcomes detail={detail} industryName={industry.name} />
      <IndustryApproach detail={detail} />
      <IndustryEcosystem detail={detail} industryName={industry.name} />
      <IndustryFAQ detail={detail} />
      <IndustryCTA detail={detail} industryName={industry.name} />
    </>
  );
}
