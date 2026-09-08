export const SITE_URL = "https://graphikosx.in";

export const company = {
  name: "GraphikosX",
  legalName: "GraphikosX",
  tagline: "The AI-Driven Agency",
  positioningPrimary: "100% AI-DRIVEN. 0% GENERIC.",
  positioningSecondary: "10 Industries. Deeper Expertise. Better Strategy.",
  description:
    "GraphikosX is an AI-driven digital presence agency that combines strategy, branding, technology, content and AI to build authority, visibility, trust and scalable digital systems for businesses across ten specialised industries.",
  url: SITE_URL,
  phoneDisplay: "+91 79840 10393",
  phoneE164: "+917984010393",
  whatsappNumber: "917984010393",
  founderEmail: "prakash@graphikosx.in",
  salesEmail: "sales@graphikosx.in",
  instagramHandle: "@graphikosx",
  instagramUrl: "https://www.instagram.com/graphikosx",
  linkedinUrl: "https://www.linkedin.com/in/prakash-pal-75a0b93a6",
  founder: {
    name: "Prakash Pal",
    role: "Founder",
    email: "prakash@graphikosx.in",
    // Founder's personal social profiles (Phase 2G refinement, spec item
    // 17) — deliberately separate from the top-level `instagramUrl`/
    // `linkedinUrl` above, which are the organization's own identity URLs
    // and feed the Organization/Person `sameAs` structured data in
    // schema.ts. Overwriting those with the founder's personal Instagram
    // would misrepresent the business's own sameAs identity, so instead
    // these live here and are only consumed by the footer's new founder
    // social links (Footer.tsx).
    instagramUrl: "https://www.instagram.com/prxkshhhh?igsh=MWdpZDg2dXdlYjhwYQ==",
    linkedinUrl: "https://www.linkedin.com/in/prakash-pal-75a0b93a6?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  logoPath: "/brand/graphikosx-logo.png",
  ogImagePath: "/og/graphikosx-og.png",
} as const;

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${company.whatsappNumber}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

export const primaryNav = [
  { label: "Industries", href: "/industries" },
  { label: "Services", href: "/services" },
  { label: "Our Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;
