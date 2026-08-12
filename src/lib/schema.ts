import { company, SITE_URL } from "@/lib/data/company";

export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: company.name,
    url: SITE_URL,
    logo: `${SITE_URL}${company.logoPath}`,
    description: company.description,
    founder: { "@id": `${SITE_URL}/#founder` },
    email: company.salesEmail,
    telephone: company.phoneE164,
    sameAs: [company.instagramUrl, company.linkedinUrl],
  };
}

export function founderSchema() {
  return {
    "@type": "Person",
    "@id": `${SITE_URL}/#founder`,
    name: company.founder.name,
    jobTitle: "Founder",
    worksFor: { "@id": `${SITE_URL}/#organization` },
    email: company.founderEmail,
    sameAs: [company.linkedinUrl],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: company.name,
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function homepageSchemaGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), founderSchema(), websiteSchema()],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function webPageSchema({
  id,
  type = "WebPage",
  name,
  description,
  path,
}: {
  id: string;
  type?: "WebPage" | "AboutPage" | "ContactPage";
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@type": type,
    "@id": `${SITE_URL}${path}#${id}`,
    url: `${SITE_URL}${path}`,
    name,
    description,
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#organization` },
  };
}

export function pageSchemaGraph(nodes: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [organizationSchema(), founderSchema(), websiteSchema(), ...nodes],
  };
}

export function serviceSchema({
  slug,
  name,
  description,
}: {
  slug: string;
  name: string;
  description: string;
}) {
  return {
    "@type": "Service",
    "@id": `${SITE_URL}/services/${slug}#service`,
    name,
    description,
    serviceType: name,
    provider: { "@id": `${SITE_URL}/#organization` },
  };
}

export function faqPageSchema(faqs: { q: string; a: string }[]) {
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
