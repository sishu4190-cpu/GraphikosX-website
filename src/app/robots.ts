import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/data/company";

export default function robots(): MetadataRoute.Robots {
  return {
    // /privacy and /terms are intentionally NOT disallowed here: they use a
    // per-page `noindex` meta tag instead (see buildMetadata calls in those
    // pages). A robots.txt disallow would stop crawlers from ever reading
    // that noindex tag, which can leave the URL indexed with no snippet —
    // the meta tag alone is the correct way to keep them out of search
    // results.
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
