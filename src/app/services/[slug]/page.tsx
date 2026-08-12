import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, faqPageSchema, pageSchemaGraph, serviceSchema, webPageSchema } from "@/lib/schema";
import { services } from "@/lib/data/services";
import { serviceDetails } from "@/lib/data/service-details";
import { ServiceHero } from "@/components/pages/service-detail/ServiceHero";
import { ServiceProblem } from "@/components/pages/service-detail/ServiceProblem";
import { ServiceDefinition } from "@/components/pages/service-detail/ServiceDefinition";
import { ServiceSignals } from "@/components/pages/service-detail/ServiceSignals";
import { ServiceApproach } from "@/components/pages/service-detail/ServiceApproach";
import { ServiceDeliverables } from "@/components/pages/service-detail/ServiceDeliverables";
import { ServiceOutcome } from "@/components/pages/service-detail/ServiceOutcome";
import { ServiceEcosystem } from "@/components/pages/service-detail/ServiceEcosystem";
import { ServiceFAQ } from "@/components/pages/service-detail/ServiceFAQ";
import { ServiceCTA } from "@/components/pages/service-detail/ServiceCTA";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

function getData(slug: string) {
  const service = services.find((s) => s.slug === slug);
  const detail = serviceDetails[slug];
  if (!service || !detail) return null;
  return { service, detail };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = getData(slug);
  if (!data) return {};
  return buildMetadata({
    title: data.detail.metaTitle,
    description: data.detail.metaDescription,
    path: `/services/${slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = getData(slug);
  if (!data) notFound();
  const { service, detail } = data;
  const path = `/services/${slug}`;

  const schema = pageSchemaGraph([
    webPageSchema({ id: "webpage", name: detail.metaTitle, description: detail.metaDescription, path }),
    serviceSchema({ slug, name: service.name, description: service.summary }),
    breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.name, path },
    ]),
    faqPageSchema(detail.faqs),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ServiceHero detail={detail} serviceName={service.name} />
      <ServiceProblem detail={detail} />
      <ServiceDefinition detail={detail} serviceName={service.name} />
      <ServiceSignals detail={detail} />
      <ServiceApproach detail={detail} />
      <ServiceDeliverables detail={detail} />
      <ServiceOutcome detail={detail} serviceName={service.name} />
      <ServiceEcosystem detail={detail} serviceName={service.name} />
      <ServiceFAQ detail={detail} />
      <ServiceCTA detail={detail} />
    </>
  );
}
