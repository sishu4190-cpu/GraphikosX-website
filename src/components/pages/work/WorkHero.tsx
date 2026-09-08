import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { Reveal } from "@/components/motion/Reveal";
import { workCaseStudy } from "@/lib/data/work";

/**
 * Phase 8 — "Our Work" showcase page, hero section. Later expanded with
 * the client's real name and a bigger real-photography banner once they
 * confirmed it was fine to name and show them (see src/lib/data/work.ts).
 *
 * Deliberately honest framing rather than the generic "our portfolio"
 * agency-page opener: GraphikosX has exactly one full-scope engagement
 * completed so far, and pretending otherwise with a wall of placeholder
 * logos would be exactly the kind of generic agency puffery the brand's
 * own positioning ("0% GENERIC") argues against — naming the real client
 * doesn't change that, it just lets the page be direct about it instead of
 * hedging. Same AboutHero.tsx pattern (MaskReveal + CursorAtmosphere) for
 * visual consistency with the rest of the inner-page set.
 */
export function WorkHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-12 md:pb-20 md:pt-16">
      <CursorAtmosphere tone="light" />

      <Container className="relative">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Our Work", path: "/work" }]} />

        <p className="mb-5 mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Our Work</p>

        <MaskReveal as="h1" className="max-w-3xl font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl">
          One real case study: {workCaseStudy.client.name}.
        </MaskReveal>

        <MaskReveal delay={0.15} as="p" className="mt-6 max-w-2xl text-base leading-relaxed text-grey-700 md:text-lg">
          GraphikosX is a young studio. We&rsquo;d rather show you the real depth of a single full-scope engagement,
          spanning website, product catalogue, and brand identity, than pad this page with work that isn&rsquo;t ours.
        </MaskReveal>

        <Reveal delay={0.3} className="mt-10">
          <div className="relative aspect-[21/6] w-full overflow-hidden rounded-2xl bg-grey-100 sm:aspect-[21/5]">
            <Image
              src="/work/hero-banner.jpg"
              alt="Industrial chemical manufacturing imagery from MAAC's own product catalogue, spanning a chemical plant, a lab flask, and farmland."
              fill
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-cover"
            />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.15em] text-grey-500">
            {workCaseStudy.client.industry} &middot; {workCaseStudy.client.website}
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
