import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { ScrollScrubTimelineHost } from "@/components/motion/ScrollScrubTimelineHost";

const steps = [
  { id: "search", number: "01", label: "Search", detail: "Google" },
  { id: "check", number: "02", label: "Check", detail: "Website" },
  { id: "compare", number: "03", label: "Compare", detail: "Reviews & Social" },
  { id: "trust", number: "04", label: "Trust", detail: "Credibility" },
  { id: "decide", number: "05", label: "Decide", detail: "Competitors" },
];

export function CustomerJourney() {
  return (
    // Phase 3: id + bg-grey-100/90 (was fully opaque bg-grey-100) — this is
    // one of the persistent 3D experience's four chapters (see
    // GXExperience.tsx / types.ts's CHAPTER_IDS), so its own background can
    // no longer be fully opaque or it would hide the canvas sitting behind
    // it regardless of paint order. 90% keeps the step timeline fully
    // legible while letting JourneyScene's ambient path/particles read
    // faintly through, mostly at the section's edges away from the text.
    <section id="gx-journey-section" className="relative overflow-hidden bg-grey-100/90 py-24 md:py-32">
      <div aria-hidden className="gx-bg-diagram-grid" />
      <CursorAtmosphere tone="light" />
      <Container className="relative z-10">
        <SectionHeader
          animate
          eyebrow="The World Has Changed"
          title="Your customers research you before they reach you."
          description="Your digital presence is influencing buying decisions before your sales team is ever involved."
        />

        {/* Phase 2 pilot (GSAP + ScrollTrigger): this section's steps light
            up scrubbed to scroll position rather than on a fixed timer — see
            ScrollScrubTimelineHost.tsx / ScrollScrubTimeline.tsx for the full
            explanation. Phase 2b rolled the same component out to
            HowWeWork.tsx and (a dedicated fork of) BuyerJourney.tsx once this
            pilot was approved. */}
        <ScrollScrubTimelineHost steps={steps} className="mt-20" />
      </Container>
    </section>
  );
}
