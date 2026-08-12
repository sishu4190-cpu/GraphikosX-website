import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const outcomes = [
  ["Website", "Credibility"],
  ["SEO", "Discoverability"],
  ["Social", "Trust"],
  ["Branding", "Perception"],
  ["Content", "Authority"],
  ["CRM", "Sales Efficiency"],
  ["AI Automation", "Scalability"],
];

export function OutcomesMap() {
  return (
    <section className="relative overflow-hidden bg-paper py-20 md:py-28">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="Why This Grouping" title="Tools change. Business outcomes don't." />

        <div className="mt-14 overflow-hidden rounded-2xl border border-ink/10">
          {outcomes.map(([tool, outcome], i) => (
            <Reveal key={tool} delay={i * 0.04}>
              <div
                tabIndex={0}
                className={`gx-sweep relative flex items-center justify-between px-6 py-4 outline-none transition-colors duration-300 hover:bg-accent/[0.04] focus-visible:bg-accent/[0.04] ${i % 2 === 0 ? "bg-grey-100" : "bg-white"}`}
              >
                <span className="text-sm font-medium text-grey-700">{tool}</span>
                <span className="text-accent" aria-hidden>&rarr;</span>
                <span className="font-display text-sm font-bold text-ink md:text-base">{outcome}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
