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
];

const orgIds = new Set();
const founderIds = new Set();
const websiteIds = new Set();
const allTypes = new Map(); // type -> count
const suspiciousKeywords = ["AggregateRating", "Review", "\"offers\"", "Award", "employee", "GeoCoordinates"];
const suspiciousHits = [];
let h1Texts = [];
let missingH1 = [];
let noJsonLd = [];
let multipleH1 = [];

for (const route of routes) {
  const res = await fetch(BASE + route);
  const html = await res.text();

  const h1matches = [...html.matchAll(/<h1[^>]*>(.*?)<\/h1>/gs)];
  if (h1matches.length === 0) missingH1.push(route);
  if (h1matches.length > 1) multipleH1.push({ route, count: h1matches.length });
  const h1text = h1matches[0]?.[1]?.replace(/<[^>]+>/g, "").trim();
  h1Texts.push({ route, h1: h1text });

  const scriptMatches = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)];
  if (scriptMatches.length === 0) {
    noJsonLd.push(route);
    continue;
  }
  for (const s of scriptMatches) {
    let json;
    try {
      json = JSON.parse(s[1]);
    } catch (e) {
      console.error("JSON parse failed for", route, e.message);
      continue;
    }
    const graph = json["@graph"] || [json];
    for (const node of graph) {
      allTypes.set(node["@type"], (allTypes.get(node["@type"]) || 0) + 1);
      if (node["@type"] === "Organization") orgIds.add(node["@id"]);
      if (node["@type"] === "Person") founderIds.add(node["@id"]);
      if (node["@type"] === "WebSite") websiteIds.add(node["@id"]);
    }
    for (const kw of suspiciousKeywords) {
      if (s[1].includes(kw)) suspiciousHits.push({ route, keyword: kw });
    }
  }
}

console.log("=== H1 AUDIT ===");
console.log("Missing H1:", missingH1);
console.log("Multiple H1:", multipleH1);
console.log("\n=== H1 TEXT (checking duplicates) ===");
const h1map = new Map();
for (const { route, h1 } of h1Texts) {
  h1map.set(h1, [...(h1map.get(h1) || []), route]);
}
for (const [h1, rs] of h1map) {
  if (rs.length > 1) console.log("DUPLICATE H1:", JSON.stringify(h1), rs);
}

console.log("\n=== JSON-LD PRESENCE ===");
console.log("Pages with no JSON-LD:", noJsonLd);

console.log("\n=== ENTITY ID CONSISTENCY ===");
console.log("Organization @id values found:", [...orgIds]);
console.log("Person(founder) @id values found:", [...founderIds]);
console.log("WebSite @id values found:", [...websiteIds]);

console.log("\n=== SCHEMA TYPE COUNTS (sitewide occurrences) ===");
console.log(Object.fromEntries(allTypes));

console.log("\n=== SUSPICIOUS/FAKE-DATA KEYWORD HITS ===");
console.log(suspiciousHits);
