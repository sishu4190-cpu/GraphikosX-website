// Phase 2F route inventory + internal link crawl against a running
// production server (npm run start). Not part of the app build — a
// one-off QA script, run manually.
import { services } from "../src/lib/data/services.ts";
import { industries } from "../src/lib/data/industries.ts";

const BASE = process.env.CRAWL_BASE || "http://localhost:4010";

const routes = [
  "/",
  "/about",
  "/services",
  ...services.map((s) => `/services/${s.slug}`),
  "/industries",
  ...industries.map((i) => `/industries/${i.slug}`),
  "/free-audit",
  "/contact",
  "/privacy",
  "/terms",
  "/sitemap.xml",
  "/robots.txt",
  "/this-route-should-not-exist-qa-check",
];

const results = [];
const linkGraph = new Map(); // route -> Set of internal hrefs found
const allInternalLinks = new Set();

function extractLinks(html) {
  const hrefs = new Set();
  const re = /href="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    hrefs.add(m[1]);
  }
  return [...hrefs];
}

for (const route of routes) {
  const url = BASE + route;
  const start = Date.now();
  try {
    const res = await fetch(url, { redirect: "manual" });
    const html = res.status < 400 ? await res.text() : "";
    const ms = Date.now() - start;
    const hasH1 = /<h1[\s>]/.test(html);
    const canonicalMatch = html.match(/<link rel="canonical" href="([^"]+)"/);
    const titleMatch = html.match(/<title>([^<]*)<\/title>/);
    const descMatch = html.match(/<meta name="description" content="([^"]*)"/);
    const robotsMatch = html.match(/<meta name="robots" content="([^"]*)"/);
    const jsonLdCount = (html.match(/application\/ld\+json/g) || []).length;
    const ogTitleMatch = html.match(/<meta property="og:title" content="([^"]*)"/);
    const ogImageMatch = html.match(/<meta property="og:image" content="([^"]*)"/);

    results.push({
      route,
      status: res.status,
      ms,
      hasH1,
      title: titleMatch?.[1] ?? null,
      titleLen: titleMatch?.[1]?.length ?? 0,
      description: descMatch?.[1] ?? null,
      descLen: descMatch?.[1]?.length ?? 0,
      canonical: canonicalMatch?.[1] ?? null,
      robots: robotsMatch?.[1] ?? "index, follow (default)",
      jsonLdCount,
      ogTitle: Boolean(ogTitleMatch),
      ogImage: ogImageMatch?.[1] ?? null,
    });

    if (res.status < 400) {
      const links = extractLinks(html).filter((h) => h.startsWith("/") && !h.startsWith("//"));
      linkGraph.set(route, new Set(links));
      links.forEach((l) => allInternalLinks.add(l.split("#")[0].split("?")[0]));
    }
  } catch (err) {
    results.push({ route, status: "ERROR", error: String(err) });
  }
}

// Check every discovered internal link resolves to a known route or a 200.
const knownRoutes = new Set(routes.map((r) => r.split("?")[0]));
const brokenLinks = [];
for (const link of allInternalLinks) {
  const clean = link.split("?")[0];
  if (knownRoutes.has(clean)) continue;
  try {
    const res = await fetch(BASE + clean, { redirect: "manual" });
    if (res.status >= 400) brokenLinks.push({ link: clean, status: res.status });
  } catch (err) {
    brokenLinks.push({ link: clean, status: "ERROR", error: String(err) });
  }
}

console.log(JSON.stringify({ results, brokenLinks, totalInternalLinksDiscovered: allInternalLinks.size }, null, 2));
