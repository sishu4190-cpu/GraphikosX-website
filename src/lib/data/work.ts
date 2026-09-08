/**
 * "Our Work" showcase page data (Phase 8, revealed with real client details
 * in a later pass).
 *
 * GraphikosX is a young studio with exactly one full-scope engagement
 * completed so far — Mangalam Acid and Chemicals (MAAC), a chemical
 * manufacturer, supplier and exporter based in Vapi, Gujarat: a website
 * rebuild, digital product catalogue, and visual identity refresh. Rather
 * than pad this page with placeholder "client" logos or invented case
 * studies, this file holds that one real engagement, broken into its three
 * real facets (each genuinely a separate deliverable, not three different
 * clients). Every `scope` line describes work that was actually done — no
 * invented results/metrics (no fabricated "40% more leads" style claims),
 * since that would be exactly the kind of generic-agency puffery
 * GraphikosX's own positioning ("0% GENERIC") argues against.
 *
 * The client was originally shown anonymized at their request; they have
 * since confirmed it's fine to name and show them. `facets[].image` for
 * "website" is a branded interim placeholder (not a real screenshot) until
 * real screenshots of the live site are supplied — see its own comment
 * below. "catalogue" and "brand" use real assets: crops from the client's
 * actual logo file, their real downloadable product catalogue PDF, and
 * their one-page company profile sheet. `gallery` below holds the wider
 * set of real reference material for the new gallery section.
 */

export type WorkFacet = {
  slug: "website" | "catalogue" | "brand";
  title: string;
  category: string;
  summary: string;
  image: string;
  imageAlt: string;
  scope: string[];
};

export type WorkGalleryItem = {
  image: string;
  alt: string;
  caption: string;
};

export const workCaseStudy = {
  client: {
    name: "Mangalam Acid and Chemicals (MAAC)",
    industry: "Chemical manufacturing, supply & export — Vapi, Gujarat",
    website: "mangalamchemicals.com",
    note: "A manufacturer, supplier and exporter of industrial, agricultural and pharmaceutical chemicals.",
  },
  facets: [
    {
      slug: "website",
      title: "Website rebuild",
      category: "Web design & development",
      summary:
        "A full rebuild on Next.js. The manufacturer's old site was a static brochure page with no way to update it without a developer. The new one gives the team direct control over their own content.",
      image: "/work/case-study-website.jpg",
      // Interim: a branded card built from MAAC's own logo and product
      // imagery, not a screenshot of the live rebuilt site — real
      // screenshots are being supplied and will replace this image in a
      // follow-up pass. Alt text is written honestly for what's actually
      // shown, not for what the facet describes.
      imageAlt: "The Mangalam Acid and Chemicals logo mark on a dark green backdrop.",
      scope: [
        "Custom admin panel so the team can add products, update pages, and manage inquiries without touching code",
        "Structured SEO and schema markup across every page, plus an llms.txt for AI-driven discovery",
        "Business inquiry form with automatic email routing to the right department and a WhatsApp auto-redirect on submit",
        "Professional domain email setup (info@, sales@, exports@) replacing free-provider addresses",
      ],
    },
    {
      slug: "catalogue",
      title: "Digital product catalogue",
      category: "Content & documentation systems",
      summary:
        "MAAC's full product range, organized into categories with a downloadable PDF catalogue and certificate/compliance documents, so a buyer or distributor can find and verify a product in minutes instead of emailing back and forth.",
      image: "/work/case-study-catalogue.jpg",
      imageAlt: "The cover page of MAAC's real downloadable product catalogue PDF.",
      scope: [
        "Product gallery organized into five categories with image lightbox viewing",
        "Auto-generated, downloadable PDF catalogue kept in sync with the live product data",
        "Certificate and compliance document display for regulated-industry buyers",
        "Admin-side activity log with PDF export, so changes to the catalogue are auditable",
      ],
    },
    {
      slug: "brand",
      title: "Visual identity",
      category: "Branding",
      summary:
        "A logo mark and a small, consistent color and type system, designed to work as well on a compliance certificate as it does on the website. Most manufacturers in this space use whatever their printer's default template gives them.",
      image: "/work/case-study-brand.jpg",
      imageAlt:
        "MAAC's real product-portfolio brand artwork: the logo's flask mark surrounded by element-symbol chips, with the full logo lockup below it.",
      scope: [
        "Logo mark design and refinement across several rounds of exploration",
        "A small, deliberately restrained color and type system applied consistently across the site, catalogue, and documents",
        "Guidance handed off so the client's own team can apply the identity consistently going forward",
      ],
    },
  ] as WorkFacet[],
  // New gallery section — real reference material drawn from the client's
  // own logo file, product catalogue PDF, and one-page company profile,
  // shown as direct proof this is a real engagement rather than another
  // abstract illustration.
  gallery: [
    {
      image: "/work/gallery-logo.png",
      alt: "The Mangalam Acid and Chemicals logo mark and wordmark.",
      caption: "Logo mark",
    },
    {
      image: "/work/gallery-catalogue-cover.jpg",
      alt: "Cover page of the real MAAC product catalogue, listing every chemical category the company supplies.",
      caption: "Catalogue cover",
    },
    {
      image: "/work/gallery-product-page.jpg",
      alt: "An inside page of the MAAC catalogue listing industrial and textile chemical products with application icons.",
      caption: "Inside the catalogue",
    },
    {
      image: "/work/gallery-plant.jpg",
      alt: "Aerial photograph of an industrial chemical manufacturing complex, used on MAAC's About Us page.",
      caption: "About Us",
    },
    {
      image: "/work/gallery-industries.jpg",
      alt: "A strip of five photographs representing the industries MAAC serves: agriculture, fertilizers, industrial processing, pharmaceuticals, and dyes & pigments.",
      caption: "Industries served",
    },
    {
      image: "/work/gallery-profile-sheet.jpg",
      alt: "MAAC's one-page company profile sheet, summarizing their product portfolio, certifications, and industries served.",
      caption: "Company profile sheet",
    },
  ] as WorkGalleryItem[],
};
