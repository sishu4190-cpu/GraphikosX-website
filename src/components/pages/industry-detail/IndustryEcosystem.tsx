import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { IndustryDetail } from "@/lib/data/industry-details";

export function IndustryEcosystem({ detail, industryName }: { detail: IndustryDetail; industryName: string }) {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-paper md:py-24">
      <CursorAtmosphere tone="dark" />
      <Container className="relative">
        <SectionHeader
          tone="dark"
          eyebrow="Digital Ecosystem"
          title={`How the ${industryName.toLowerCase()} digital journey connects.`}
        />

        {/* Desktop: horizontal connected flow. Mobile: vertical, no horizontal overflow. */}
        <div className="mt-14 flex flex-col gap-0 md:flex-row md:flex-wrap md:items-center md:justify-center md:gap-0">
          {detail.ecosystem.map((node, i) => (
            <Reveal key={node} delay={i * 0.07} className="flex flex-col items-center md:flex-row">
              <div className="flex w-full items-center gap-4 py-3 md:w-auto md:flex-col md:gap-2 md:py-0 md:text-center">
                <span className="font-numeric flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent text-xs font-bold text-accent">
                  {i + 1}
                </span>
                <p className="font-display text-sm font-bold text-paper md:max-w-[9rem]">{node}</p>
              </div>
              {i < detail.ecosystem.length - 1 && (
                <span aria-hidden className="mx-4 hidden text-accent md:block">
                  &rarr;
                </span>
              )}
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
