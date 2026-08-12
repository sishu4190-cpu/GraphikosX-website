import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { IndustryDetail } from "@/lib/data/industry-details";

export function TrustSignals({ detail }: { detail: IndustryDetail }) {
  return (
    <section className="relative overflow-hidden bg-paper py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="What Builds Trust Here" title="The signals that actually matter in this industry." />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {detail.trustSignals.map((signal, i) => (
            <Reveal key={i} as="li" delay={i * 0.06}>
              <GlowCard tone="light" focusable className="flex h-full items-start gap-3 rounded-xl border border-ink/10 bg-grey-100 p-5 text-sm leading-relaxed text-grey-700">
                <span aria-hidden className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {signal}
              </GlowCard>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
