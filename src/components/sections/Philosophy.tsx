import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { EyebrowReveal } from "@/components/motion/AnimatedText";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const lenses = ["Industry", "Customer", "Buying Behaviour", "Competition", "Business Model", "Opportunity"];

export function Philosophy() {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-24 md:py-32">
      <div aria-hidden className="gx-bg-light-haze" />
      <CursorAtmosphere tone="light" />
      <Container className="relative z-10 grid gap-12 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <EyebrowReveal className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our Philosophy</EyebrowReveal>
          <MaskReveal as="h2" delay={0.08} className="mt-3 font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
            We don&rsquo;t want to be everything to everyone.
            <br />
            We want to be <span className="text-accent">something meaningful to someone.</span>
          </MaskReveal>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.15em] text-grey-700">
            10 Industries. Deeper Expertise. Better Strategy.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="grid grid-cols-2 gap-3">
            {lenses.map((lens) => (
              <GlowCard key={lens} tone="light" focusable className="rounded-xl bg-white px-5 py-6 text-center shadow-sm">
                <p className="font-display text-sm font-bold text-ink">{lens}</p>
              </GlowCard>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
