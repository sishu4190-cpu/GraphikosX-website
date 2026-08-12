import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const qa = [
  { q: "What does GraphikosX do?", a: "GraphikosX builds and runs the digital systems a business needs to be found, trusted and chosen — combining strategy, branding, technology, content and AI." },
  { q: "What is Build / Grow / Scale?", a: "It's the order most businesses actually need work done in: build the foundation (brand, website), grow visibility and authority (SEO, content, social), then scale with systems (CRM, automation, lead generation)." },
  { q: "Does GraphikosX provide AI automation?", a: "Yes — AI automation, CRM integration, workflow automation and lead generation systems are part of the Scale stage, built once the foundation and visibility work is in place." },
  { q: "How are services selected for a business?", a: "Through the Discover and Audit stages of the process (see How We Work) — services are prioritised based on where a business is today, not sold as a fixed package." },
];

export function ServicesAnswers() {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-20 md:py-28">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="In Short" title="Common questions, answered directly." />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {qa.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.08}>
              <GlowCard tone="light" focusable className="h-full rounded-xl border border-ink/10 bg-white p-6">
                <h3 className="font-display text-base font-bold text-ink">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey-700">{item.a}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
