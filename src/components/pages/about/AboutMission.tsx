import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const inputs = ["Strategy", "Branding", "Technology", "Content", "AI"];
const outputs = ["Authority", "Visibility", "Trust", "Digital Infrastructure", "Scalable Systems"];

export function AboutMission() {
  return (
    <section className="relative overflow-hidden bg-paper py-20 md:py-28">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="Our Mission" title="One system, built from five disciplines." />

        <div className="mt-14 grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr]">
          <Reveal>
            <div className="flex flex-wrap gap-2 lg:justify-end">
              {inputs.map((item) => (
                <span key={item} tabIndex={0} className="gx-pill gx-pill--light cursor-default rounded-full border border-ink/10 bg-grey-100 px-4 py-2 text-sm font-medium text-ink outline-none">
                  {item}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="flex justify-center">
            <span className="font-display text-3xl font-extrabold text-accent">&rarr;</span>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="flex flex-wrap gap-2">
              {outputs.map((item) => (
                <span key={item} tabIndex={0} className="gx-pill gx-pill--dark cursor-default rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper outline-none">
                  {item}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
