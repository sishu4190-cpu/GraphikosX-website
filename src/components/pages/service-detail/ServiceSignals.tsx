import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { ServiceDetail } from "@/lib/data/service-details";

export function ServiceSignals({ detail }: { detail: ServiceDetail }) {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="When You Need It" title="You may need this when..." />
        <ul className="mt-10 grid gap-3 sm:grid-cols-2">
          {detail.whenYouNeedIt.map((signal, i) => (
            <Reveal key={i} as="li" delay={i * 0.06}>
              <GlowCard tone="light" focusable className="flex h-full gap-3 rounded-xl border border-ink/10 bg-white p-5 text-sm leading-relaxed text-grey-700">
                <span aria-hidden className="text-accent">&rarr;</span>
                {signal}
              </GlowCard>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
