// Option sets for the Free Audit wizard. Kept as data (not hardcoded JSX)
// so the checkbox/radio grids in the wizard steps stay declarative.

export const improvementAreas: { id: string; label: string }[] = [
  { id: "brand-identity", label: "Brand & visual identity" },
  { id: "website", label: "Website" },
  { id: "seo-visibility", label: "SEO & search visibility" },
  { id: "social-media", label: "Social media presence" },
  { id: "content", label: "Content & authority" },
  { id: "lead-generation", label: "Lead generation & follow-up" },
  { id: "automation", label: "Automation & internal systems" },
  { id: "not-sure", label: "Not sure yet, that's what the audit is for" },
];

export const auditGoals: { id: string; label: string }[] = [
  { id: "more-leads", label: "Generate more qualified leads" },
  { id: "stronger-brand", label: "Build a stronger, more credible brand" },
  { id: "search-visibility", label: "Get found on Google and AI search tools" },
  { id: "consistent-social", label: "Post consistently without it depending on one person" },
  { id: "automate-work", label: "Automate repetitive follow-up and admin work" },
  { id: "scale-systems", label: "Turn what's already working into a repeatable system" },
];
