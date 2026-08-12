import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { IndustryDetail } from "@/lib/data/industry-details";

export function IndustryApproach({ detail }: { detail: IndustryDetail }) {
  return (
    <section className="relative overflow-hidden bg-surface py-16 text-paper md:py-24">
      <CursorAtmosphere tone="dark" />
      <Container className="relative">
        <SectionHeader tone="dark" eyebrow="The GraphikosX Approach" title="Why specialization matters here." />

        <div className="relative mt-14 grid gap-8 sm:grid-cols-5">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-white/10 sm:block" aria-hidden />
          {detail.approach.map((step, i) => (
            <Reveal key={step.phase} delay={i * 0.08}>
              <span className="font-numeric flex h-12 w-12 items-center justify-center rounded-full bg-accent text-sm font-bold text-paper">
                0{i + 1}
              </span>
              <p className="mt-4 font-display text-base font-bold text-paper">{step.phase}</p>
              <p className="mt-2 text-sm leading-relaxed text-grey-300">{step.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
