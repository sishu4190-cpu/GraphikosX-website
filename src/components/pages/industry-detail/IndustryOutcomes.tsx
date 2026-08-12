import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { IndustryDetail } from "@/lib/data/industry-details";

export function IndustryOutcomes({ detail, industryName }: { detail: IndustryDetail; industryName: string }) {
  return (
    <section className="relative overflow-hidden bg-paper py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="Industry Outcomes" title={`What this looks like for ${industryName.toLowerCase()}.`} />
        <div className="mt-10 flex flex-wrap gap-3">
          {detail.outcomes.map((outcome, i) => (
            <Reveal key={outcome} delay={i * 0.05}>
              <span
                tabIndex={0}
                className="gx-pill gx-pill--dark inline-flex cursor-default items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-paper outline-none"
              >
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
                {outcome}
              </span>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
