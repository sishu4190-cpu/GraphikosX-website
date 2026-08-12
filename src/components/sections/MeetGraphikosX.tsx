import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { EyebrowReveal, HeadlineReveal, DescriptionReveal, ShineText } from "@/components/motion/AnimatedText";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const pillars = ["Authority", "Visibility", "Trust", "Scalable Digital Systems"];

export function MeetGraphikosX() {
  return (
    <section className="relative overflow-hidden bg-surface py-24 text-paper md:py-32">
      <div aria-hidden className="gx-bg-dark-aurora" />
      <CursorAtmosphere tone="dark" />
      <Container className="relative z-10">
        <EyebrowReveal className="text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">GraphikosX</EyebrowReveal>
        <HeadlineReveal
          as="h2"
          delay={0.08}
          lines={["The AI-Driven Agency"]}
          className="mt-3 font-display text-3xl font-bold text-paper md:text-4xl"
        />
        <DescriptionReveal delay={0.3} className="mt-6 max-w-2xl text-base leading-relaxed text-grey-300 md:text-lg">
          GraphikosX helps businesses build authority, visibility, trust and scalable digital systems through strategy,
          branding, technology, content and AI.
        </DescriptionReveal>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {pillars.map((pillar, i) => (
            <Reveal key={pillar} delay={i * 0.08}>
              <GlowCard tone="dark" focusable className="rounded-xl border border-white/10 px-5 py-6">
                <p className="font-display text-lg font-bold text-paper">{pillar}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <p className="mt-14 font-display text-2xl font-extrabold md:text-3xl">
            100% AI-DRIVEN. <ShineText delay={0.6}>0% GENERIC.</ShineText>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
