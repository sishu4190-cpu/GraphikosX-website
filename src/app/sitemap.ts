import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/data/company";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";

export default function sitemap(): MetadataRoute.Sitemap {
  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${SITE_URL}/services/${s.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const industryRoutes: MetadataRoute.Sitemap = industries.map((i) => ({
    url: `${SITE_URL}/industries/${i.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/services`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/industries`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/work`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/free-audit`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    ...serviceRoutes,
    ...industryRoutes,
    // /privacy and /terms are intentionally excluded: they are marked noIndex
    // (see buildMetadata calls in those pages) as standard practice for
    // legal boilerplate pages, so they are omitted from the sitemap too.
  ];
}
