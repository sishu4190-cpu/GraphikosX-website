import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

export function ServicesHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-20 pt-12 md:pb-28 md:pt-16">
      <CursorAtmosphere tone="light" />

      <Container className="relative">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Services", path: "/services" }]} />

        <p className="mb-5 mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-accent">What We Do</p>

        <MaskReveal as="h1" className="max-w-3xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          We don&rsquo;t sell services. We build business outcomes.
        </MaskReveal>

        <MaskReveal delay={0.15} as="p" className="mt-6 max-w-2xl text-base leading-relaxed text-grey-700 md:text-lg">
          Fifteen capabilities, organised into one progression &mdash; Build, Grow, Scale &mdash; because a website
          without SEO, or SEO without a system to convert the traffic, rarely moves a business forward on its own.
        </MaskReveal>
      </Container>
    </section>
  );
}
