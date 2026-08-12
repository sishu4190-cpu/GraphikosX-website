import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

export function IndustriesHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-12 md:pb-24 md:pt-16">
      <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -right-24 -top-20 h-[420px] w-[420px] opacity-[0.05]">
        <circle cx="200" cy="200" r="150" fill="none" stroke="#1D4ED8" strokeWidth="16" strokeDasharray="4 14" />
      </svg>
      <CursorAtmosphere tone="light" />

      <Container className="relative">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Industries", path: "/industries" }]} />

        <p className="mb-5 mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Specialized By Choice</p>

        <MaskReveal as="h1" className="max-w-3xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          We don&rsquo;t market every industry. By choice.
        </MaskReveal>

        <MaskReveal delay={0.15} as="p" className="mt-6 max-w-xl text-sm font-semibold uppercase tracking-[0.15em] text-grey-700">
          10 Industries. Deeper Expertise. Better Strategy.
        </MaskReveal>
      </Container>
    </section>
  );
}
