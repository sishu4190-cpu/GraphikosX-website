export type ServiceGroup = "Build" | "Grow" | "Scale";

export type Service = {
  slug: string;
  name: string;
  group: ServiceGroup;
  outcome: string;
  summary: string;
  audience: string;
};

// Canonical 15 services — approved Build / Grow / Scale architecture.
export const services: Service[] = [
  { slug: "brand-strategy", name: "Brand Strategy", group: "Build", outcome: "Perception", summary: "Positioning, narrative and messaging built on how your customers actually decide.", audience: "Businesses whose category is crowded and need a reason to be chosen." },
  { slug: "visual-identity", name: "Visual Identity", group: "Build", outcome: "Perception", summary: "A visual system that signals premium and stays consistent across every touchpoint.", audience: "Brands that look inconsistent across their website, social and print." },
  { slug: "business-websites", name: "Business Websites", group: "Build", outcome: "Credibility", summary: "Fast, crawlable, conversion-focused websites built as real digital infrastructure.", audience: "Businesses whose website is outdated, slow, or not built to convert." },
  { slug: "landing-pages", name: "Landing Pages", group: "Build", outcome: "Credibility", summary: "Campaign-specific pages built to convert a single, clear intent.", audience: "Businesses running ads or campaigns that send traffic to a generic homepage." },
  { slug: "digital-infrastructure", name: "Digital Infrastructure", group: "Build", outcome: "Credibility", summary: "The technical foundation — hosting, analytics, tracking and systems — done right from day one.", audience: "Businesses with no reliable tracking or a fragile technical setup." },
  { slug: "social-media-management", name: "Social Media Management", group: "Grow", outcome: "Trust", summary: "Consistent, on-strategy content and presence across the platforms your customers use.", audience: "Businesses posting inconsistently or with no clear content strategy." },
  { slug: "seo", name: "Search Engine Optimization (SEO)", group: "Grow", outcome: "Discoverability", summary: "Technical, content and authority SEO built for how search actually works today.", audience: "Businesses invisible on Google for the searches that matter to them." },
  { slug: "google-business-profile", name: "Google Business Profile Optimization", group: "Grow", outcome: "Discoverability", summary: "Local visibility and trust signals where most first impressions now happen.", audience: "Local and location-based businesses competing in map search results." },
  { slug: "content-production", name: "Content Production", group: "Grow", outcome: "Authority", summary: "Content built to demonstrate expertise, not just fill a calendar.", audience: "Businesses with expertise that is not visible anywhere online." },
  { slug: "linkedin-personal-branding", name: "LinkedIn & Personal Branding", group: "Grow", outcome: "Authority", summary: "Founder and leadership visibility that compounds into business credibility.", audience: "Founders and leaders who are absent from the platform their buyers research on." },
  { slug: "ai-automation", name: "AI Automation", group: "Scale", outcome: "Scalability", summary: "AI-accelerated workflows that remove repetitive work without removing judgment.", audience: "Teams spending hours on repetitive tasks that software could handle." },
  { slug: "crm-integration", name: "CRM Integration", group: "Scale", outcome: "Sales Efficiency", summary: "Lead and customer systems connected so nothing falls through the cracks.", audience: "Businesses losing leads because follow-up depends on memory, not a system." },
  { slug: "workflow-automation", name: "Workflow Automation", group: "Scale", outcome: "Sales Efficiency", summary: "Operational automation that lets your team focus on the parts that need a human.", audience: "Growing teams whose manual processes no longer scale." },
  { slug: "lead-generation-systems", name: "Lead Generation Systems", group: "Scale", outcome: "Scalability", summary: "Structured lead flow and follow-up systems, not one-off campaigns.", audience: "Businesses relying on referrals alone and want a predictable pipeline." },
  { slug: "marketing-consultation", name: "Marketing Consultation", group: "Scale", outcome: "Scalability", summary: "Senior strategic guidance to prioritise what actually moves the business forward.", audience: "Businesses unsure which of the above to prioritise first." },
];

export const serviceGroups: { group: ServiceGroup; description: string }[] = [
  { group: "Build", description: "Brand Strategy · Visual Identity · Business Websites · Landing Pages · Digital Infrastructure" },
  { group: "Grow", description: "Social Media Management · SEO · Google Business Profile · Content Production · LinkedIn & Personal Branding" },
  { group: "Scale", description: "AI Automation · CRM Integration · Workflow Automation · Lead Generation Systems · Marketing Consultation" },
];
