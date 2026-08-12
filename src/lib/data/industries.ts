export type Industry = {
  slug: string;
  name: string;
  shortLabel: string;
  challenge: string;
  opportunity: string;
};

// Canonical final list — the 10 industries GraphikosX specializes in
// (Phase 2H). Four entries carry a Phase 2H display-name refinement while
// keeping their original slug/route unchanged, specifically so existing
// links, the sitemap and any external SEO equity are not disrupted:
//   healthcare                 -> displayed as "Doctors & Clinics"
//   legal-professional-services -> displayed as "Legal, CA & Professional Services"
//   fitness-wellness           -> displayed as "Gyms & Fitness"
//   hospitality                -> displayed as "Cafes & Restaurants"
// "founders-personal-brands" (not part of the Phase 2H 10-industry list) has
// been retired in favor of the newly added "jewellery-wedding" — see
// CHANGELOG.md for the full reasoning. Its relevant-service cross-links were
// reassigned rather than left dangling (see service-details.ts).
export const industries: Industry[] = [
  {
    slug: "healthcare",
    name: "Doctors & Clinics",
    shortLabel: "Doctors & Clinics",
    challenge: "Patients research a doctor or clinic extensively before booking, but the trust signals they're looking for online are often thin, outdated or inconsistent.",
    opportunity: "Build the trust a patient needs before they ever call — clear credentials, real reviews and a clean appointment path.",
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    shortLabel: "Real Estate",
    challenge: "High-value, high-consideration purchases get lost among near-identical project listings and generic marketing.",
    opportunity: "Make the project hard to ignore with distinct positioning and a credible digital presence.",
  },
  {
    slug: "education-coaching",
    name: "Education & Coaching",
    shortLabel: "Education & Coaching",
    challenge: "Enrollment decisions hinge on trust and outcomes, which are hard to communicate through generic ads alone.",
    opportunity: "Build authority and visible outcomes that shorten the enrollment decision.",
  },
  {
    slug: "jewellery-wedding",
    name: "Jewellery & Wedding",
    shortLabel: "Jewellery & Wedding",
    challenge: "A high-emotion, high-trust purchase is still often presented through generic product photos and price-first messaging.",
    opportunity: "Present craftsmanship, trust and occasion together, the way a buyer actually experiences the decision.",
  },
  {
    slug: "industrial-manufacturing-chemicals",
    name: "Industrial Manufacturing & Chemicals",
    shortLabel: "Manufacturing & Chemicals",
    challenge: "Technical capability rarely translates into an online presence buyers can evaluate before the first call.",
    opportunity: "Turn deep technical expertise into digital authority procurement teams can verify.",
  },
  {
    slug: "legal-professional-services",
    name: "Legal, CA & Professional Services",
    shortLabel: "Legal, CA & Professional",
    challenge: "Authority and discretion both matter, and most firms and practices are invisible or generic online.",
    opportunity: "Authority starts before the consultation, built through credible, precise digital presence.",
  },
  {
    slug: "fitness-wellness",
    name: "Gyms & Fitness",
    shortLabel: "Gyms & Fitness",
    challenge: "Local competition is intense and retention depends on community and visible results, not just acquisition ads.",
    opportunity: "Build a recognisable local brand and content system that drives both trials and long-term retention.",
  },
  {
    slug: "hospitality",
    name: "Cafes & Restaurants",
    shortLabel: "Cafes & Restaurants",
    challenge: "Diners decide almost entirely on photos, reviews and how easy the place is to find — before ever seeing the menu in person.",
    opportunity: "Win the discovery-and-reviews moment that decides footfall before a table is ever booked.",
  },
  {
    slug: "architecture-interior",
    name: "Architecture & Interior",
    shortLabel: "Architecture & Interior",
    challenge: "Portfolio-driven work is judged on taste and credibility, which most studio websites fail to convey.",
    opportunity: "Present a portfolio and process with the same design quality as the work itself.",
  },
  {
    slug: "automotive-ev",
    name: "Automobile & EV",
    shortLabel: "Automobile & EV",
    challenge: "A fast-changing category where buyers research extensively but dealership presence is often outdated.",
    opportunity: "Build a modern digital showroom that matches how buyers actually decide today.",
  },
];
