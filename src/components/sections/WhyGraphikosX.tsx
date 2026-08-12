import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { ShineText } from "@/components/motion/AnimatedText";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const reasons = [
  { title: "Industry-Focused", detail: "We deliberately specialize." },
  { title: "Founder-Led", detail: "Senior strategic thinking stays involved." },
  { title: "AI-Driven", detail: "Technology improves speed and efficiency." },
  { title: "Integrated", detail: "Branding + Marketing + Technology + Systems." },
  { title: "Transparent", detail: "Clients understand what we're doing and why." },
  { title: "Long-Term", detail: "We build assets, not temporary numbers." },
];

export function WhyGraphikosX() {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-24 md:py-32">
      <div aria-hidden className="gx-bg-light-haze" />
      <CursorAtmosphere tone="light" />
      <Container className="relative z-10">
        <SectionHeader animate eyebrow="Why GraphikosX" title="Why GraphikosX?" />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.06}>
              <GlowCard tone="light" focusable className="rounded-xl bg-white p-6">
                <p className="font-display text-base font-bold text-accent">{r.title}</p>
                <p className="mt-2 text-sm text-grey-700">{r.detail}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.3}>
          <div className="mt-14 rounded-2xl bg-ink p-10 text-center text-paper">
            <p className="font-display text-xl font-bold md:text-2xl">
              We&rsquo;re not trying to become another vendor on your list.
              <br />
              We want to become <ShineText delay={0.5}>an extension of your growth team.</ShineText>
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
