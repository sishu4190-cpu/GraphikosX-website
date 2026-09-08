import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

// Exported so about/page.tsx can feed this same list into faqPageSchema()
// — one array, both the visible copy and the structured data, so they can
// never drift apart (Phase 10 SEO/AEO gap fix).
export const qa = [
  {
    q: "What is GraphikosX?",
    a: "GraphikosX is an AI-driven digital presence agency that combines strategy, branding, technology, content and AI to build authority, visibility, trust and scalable digital systems for businesses.",
  },
  {
    q: "What makes GraphikosX different?",
    a: "GraphikosX builds connected digital systems rather than selling isolated services: a website, SEO, content, social and automation designed to work toward one business objective instead of existing as separate vendor relationships.",
  },
  {
    q: "Why does GraphikosX specialize by industry?",
    a: "Every industry has a different customer, buying behaviour, sales cycle, competitive landscape and trust signal. GraphikosX works with 10 chosen industries so strategy can be built around those specifics instead of a generic template.",
  },
  {
    q: "How does GraphikosX use AI?",
    a: "AI accelerates research, analysis and execution. It is the advantage, not the product. Human strategy still drives every decision GraphikosX makes on a client's behalf.",
  },
];

export function AboutAnswers() {
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
