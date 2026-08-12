import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const shifts = [
  ["Unknown", "Recognized"],
  ["Inconsistent", "Systemized"],
  ["Visible", "Trusted"],
  ["Business", "Brand"],
];

export function Mission() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div aria-hidden className="gx-bg-light-haze" />
      <CursorAtmosphere tone="light" />
      <Container className="relative z-10">
        <SectionHeader
          animate
          eyebrow="Our Mission"
          title="Build brands that become hard to ignore and harder to replace."
          description="Combining strategy, branding, technology, content and AI to build digital ecosystems that create long-term authority, trust and sustainable business growth."
        />

        {/* Each card visually communicates its own transformation on
            hover/focus, not just a generic lift: the shared `.gx-sweep`
            energy travels top -> bottom (from the "before" word toward the
            "after" word) and the destination word gains a touch of extra
            weight/color right as the sweep reaches it — the same reusable
            card system as every other homepage card (GlowCard/.gx-card),
            just with the directional sweep variant layered on top. */}
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {shifts.map(([from, to], i) => (
            <Reveal key={from} delay={i * 0.08}>
              <GlowCard
                tone="light"
                focusable
                className="group gx-sweep gx-sweep--vertical flex flex-col items-center gap-3 rounded-xl border border-ink/10 bg-grey-100 py-8 text-center transition-colors duration-300 hover:border-accent/40 focus-visible:border-accent/40"
              >
                <p className="text-sm font-medium text-grey-500 transition-colors duration-300 group-hover:text-grey-700 group-focus-visible:text-grey-700">
                  {from}
                </p>
                <span
                  aria-hidden
                  className="text-accent transition-transform duration-300 group-hover:translate-y-0.5 group-focus-visible:translate-y-0.5"
                >
                  &darr;
                </span>
                <p className="font-display text-lg font-bold text-ink transition-[color,transform] duration-300 group-hover:scale-[1.05] group-hover:text-accent group-focus-visible:scale-[1.05] group-focus-visible:text-accent">
                  {to}
                </p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
