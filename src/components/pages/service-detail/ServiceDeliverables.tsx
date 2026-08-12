import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { ServiceDetail } from "@/lib/data/service-details";

export function ServiceDeliverables({ detail }: { detail: ServiceDetail }) {
  return (
    <section className="relative overflow-hidden bg-paper py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="What We Build" title="What this actually includes." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {detail.deliverables.map((item, i) => (
            <Reveal key={i} as="li" delay={i * 0.06}>
              <GlowCard tone="light" focusable className="flex h-full items-start gap-3 rounded-xl border border-ink/10 bg-grey-100 p-5 text-sm leading-relaxed text-grey-700 md:text-base">
                <span aria-hidden className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                {item}
              </GlowCard>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}
