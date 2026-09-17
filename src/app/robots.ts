import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/data/company";

export default function robots(): MetadataRoute.Robots {
  return {
    // /privacy-policy, /terms-of-service, and /data-deletion are
    // intentionally NOT disallowed here: they use a per-page `noindex` meta
    // tag instead (see buildMetadata calls in those pages). A robots.txt
    // disallow would stop crawlers — including Meta's own app-review
    // crawler, which must be able to reach these exact URLs — from ever
    // reading that noindex tag, which can leave the URL indexed with no
    // snippet. The meta tag alone is the correct way to keep them out of
    // search results while staying reachable by every crawler.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
