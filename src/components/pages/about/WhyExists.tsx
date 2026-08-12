import { Container } from "@/components/ui/Container";
import { LineDraw } from "@/components/motion/LineDraw";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

export function WhyExists() {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-20 md:py-28">
      <CursorAtmosphere tone="light" />
      <Container className="relative grid gap-10 lg:grid-cols-[0.9fr_1.4fr]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Why GraphikosX Exists</p>
          <LineDraw className="mt-4 w-16" />
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-2xl font-bold leading-snug text-ink md:text-3xl">
            Too many agencies sell isolated services. GraphikosX is built around{" "}
            <span className="text-accent">connected digital presence.</span>
          </h2>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grey-700 md:text-base">
            A website from one vendor. SEO from another. Social media from a freelancer. Ads from an agency that has
            never seen the brand guidelines. Most businesses end up with a collection of disconnected activities
            instead of one system working toward the same objective &mdash; which is the digital presence problem
            GraphikosX exists to solve.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
