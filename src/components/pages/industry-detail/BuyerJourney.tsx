import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { BuyerJourneyScrubHost } from "@/components/motion/BuyerJourneyScrubHost";
import type { IndustryDetail } from "@/lib/data/industry-details";

/**
 * Phase 2b: rolled out from CustomerJourney's Phase 2 pilot, now approved.
 * Used identically on all 10 industry detail pages, so this one component
 * change carries the scroll-scrub treatment to all 10 at once.
 *
 * Was a Client Component (Framer Motion `whileInView`, once, on first
 * scroll into view) — now a plain Server Component that renders
 * `BuyerJourneyScrubHost`, matching the `CustomerJourney.tsx` /
 * `HowWeWork.tsx` pattern: the actual GSAP logic lives in
 * `BuyerJourneyScrub.tsx`, reached only through a
 * `next/dynamic(..., { ssr: false })` import, so it never enters the server
 * render pass or any other route's bundle.
 */
export function BuyerJourney({ detail }: { detail: IndustryDetail }) {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="How Buyers Decide" title="The buying journey in this industry." description={detail.buyerJourneyNote} />

        <BuyerJourneyScrubHost steps={detail.buyerJourney} className="mt-14" />
      </Container>
    </section>
  );
}
