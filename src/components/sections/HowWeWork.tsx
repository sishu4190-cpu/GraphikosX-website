import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollActivationTimeline } from "@/components/motion/ScrollActivationTimeline";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const steps = [
  { id: "discover", number: "01", label: "Discover", detail: "Understand the business, customers and goals." },
  { id: "audit", number: "02", label: "Audit", detail: "Analyze brand, digital presence and competition." },
  { id: "strategize", number: "03", label: "Strategize", detail: "Build a customized roadmap." },
  { id: "execute", number: "04", label: "Execute", detail: "Deploy branding, content, technology and campaigns." },
  { id: "optimize", number: "05", label: "Optimize", detail: "Measure, learn and improve." },
];

export function HowWeWork() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div aria-hidden className="gx-bg-diagram-grid" />
      <CursorAtmosphere tone="light" />
      <Container className="relative z-10">
        <SectionHeader animate eyebrow="Our Process" title="Strategy before execution." />

        <ScrollActivationTimeline steps={steps} className="mt-20" />

        <Reveal delay={0.4}>
          <p className="mt-14 text-center font-display text-lg font-bold text-ink">
            No copy-paste packages. <span className="text-accent">No generic strategies.</span>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
