import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-20 pt-12 md:pb-28 md:pt-16">
      <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -left-24 -top-24 h-[420px] w-[420px] opacity-[0.05]">
        <path d="M 200 60 A 140 140 0 1 0 262 308" fill="none" stroke="#1D4ED8" strokeWidth="24" strokeLinecap="round" />
      </svg>
      <CursorAtmosphere tone="light" />

      <Container className="relative">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "About", path: "/about" }]} />

        <p className="mb-5 mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-accent">About GraphikosX</p>

        <MaskReveal as="h1" className="max-w-4xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          GraphikosX isn&rsquo;t being built to become another agency.
        </MaskReveal>

        <MaskReveal delay={0.15} as="p" className="mt-6 max-w-2xl text-base leading-relaxed text-grey-700 md:text-lg">
          It&rsquo;s being built to become a name businesses associate with strategy, technology, creativity and digital
          growth.
        </MaskReveal>
      </Container>
    </section>
  );
}
