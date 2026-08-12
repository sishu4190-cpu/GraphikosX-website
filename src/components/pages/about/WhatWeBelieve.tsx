import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const beliefs = [
  { title: "Strategy Before Execution", detail: "We understand before we create." },
  { title: "Quality Over Quantity", detail: "We'd rather build fewer things exceptionally well." },
  { title: "Specialization Over Generalization", detail: "We don't want to be everything to everyone." },
  { title: "Long-Term Over Short-Term", detail: "We build assets, authority and systems that compound." },
  { title: "Human Strategy × AI Execution", detail: "AI accelerates our capabilities. Human thinking drives direction." },
  { title: "Continuous Evolution", detail: "Marketing, technology and behaviour keep changing. So will we." },
];

export function WhatWeBelieve() {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-20 md:py-28">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="What We Believe" title="Six principles, not a mission-statement wall." />

        <ol className="mt-14 divide-y divide-ink/10 border-y border-ink/10">
          {beliefs.map((belief, i) => (
            <Reveal
              key={belief.title}
              as="li"
              delay={i * 0.05}
              tabIndex={0}
              className="flex flex-col gap-2 px-2 py-6 outline-none transition-colors duration-300 hover:bg-white/60 focus-visible:bg-white/60 sm:flex-row sm:items-baseline sm:gap-8"
            >
              <span className="font-display text-sm font-bold text-accent sm:w-10">{String(i + 1).padStart(2, "0")}</span>
              <p className="font-display text-lg font-bold text-ink sm:w-80">{belief.title}</p>
              <p className="text-sm text-grey-700">{belief.detail}</p>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}
