import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { ServiceDetail } from "@/lib/data/service-details";

export function ServiceFAQ({ detail }: { detail: ServiceDetail }) {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="Questions" title="What people actually ask before starting." />
        <div className="mt-12 divide-y divide-ink/10 border-y border-ink/10">
          {detail.faqs.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.05}>
              <div className="py-6">
                <h3 className="font-display text-base font-bold text-ink">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey-700 md:text-base">{item.a}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
