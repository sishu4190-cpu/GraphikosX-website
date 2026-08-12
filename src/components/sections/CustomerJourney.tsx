import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScrollActivationTimeline } from "@/components/motion/ScrollActivationTimeline";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const steps = [
  { id: "search", number: "01", label: "Search", detail: "Google" },
  { id: "check", number: "02", label: "Check", detail: "Website" },
  { id: "compare", number: "03", label: "Compare", detail: "Reviews & Social" },
  { id: "trust", number: "04", label: "Trust", detail: "Credibility" },
  { id: "decide", number: "05", label: "Decide", detail: "Competitors" },
];

export function CustomerJourney() {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-24 md:py-32">
      <div aria-hidden className="gx-bg-diagram-grid" />
      <CursorAtmosphere tone="light" />
      <Container className="relative z-10">
        <SectionHeader
          animate
          eyebrow="The World Has Changed"
          title="Your customers research you before they reach you."
          description="Your digital presence is influencing buying decisions before your sales team is ever involved."
        />

        <ScrollActivationTimeline steps={steps} className="mt-20" />
      </Container>
    </section>
  );
}
