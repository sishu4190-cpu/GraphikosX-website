import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { freeAuditHref } from "@/lib/freeAuditUrl";
import { GXHero } from "@/components/three/GXHero";
import { EyebrowReveal, HeadlineReveal, DescriptionReveal, CTAReveal } from "@/components/motion/AnimatedText";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-paper pt-16 pb-24 md:pt-24 md:pb-32">
      {/* Side-by-side 3D logo starts at lg (1024px), not md (768px): below
          lg the text column and this decorative half visually collide (the
          text column can run past the 50% mark on tablet widths). Below lg
          the mark instead renders full-width beneath the text (further
          down this file), where there's nothing to overlap.
          pointer-events-none on this whole decorative half — GXScene opens
          its own small, precisely-scoped pointer-events:auto hit area
          centered on the mark itself (see GXScene.tsx), so the mouse-control
          interaction never risks capturing clicks meant for the CTA buttons. */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 lg:block">
        <GXHero layout="lg-up" />
      </div>

      <Container>
        <div className="max-w-2xl">
          {/* Homepage text-motion system (AnimatedText.tsx): eyebrow ->
              headline -> description -> CTA -> supporting element, each
              triggering once on viewport entry. */}
          <EyebrowReveal className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-accent">
            GraphikosX &middot; The AI-Driven Agency
          </EyebrowReveal>

          <HeadlineReveal
            as="h1"
            delay={0.08}
            lines={["We don’t just market businesses.", "We build brands people remember."]}
            className="font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl lg:text-6xl"
          />

          <DescriptionReveal delay={0.4} className="mt-6 max-w-xl text-base leading-relaxed text-grey-700 md:text-lg">
            Strategy <span className="text-accent">&times;</span> Branding <span className="text-accent">&times;</span> Technology{" "}
            <span className="text-accent">&times;</span> Content <span className="text-accent">&times;</span> AI &mdash; combined
            into digital systems built for authority, visibility and trust.
          </DescriptionReveal>

          <CTAReveal delay={0.55} className="mt-10 flex flex-wrap items-center gap-4">
            <Button href={freeAuditHref({ source: "homepage-hero" })} variant="primary">Get a Free Audit</Button>
            <Button href="/industries" variant="secondary">Explore Industries</Button>
          </CTAReveal>

          <EyebrowReveal
            delay={0.7}
            className="mt-10 text-sm font-medium uppercase tracking-[0.15em] text-grey-500"
          >
            10 Industries. One Standard of Excellence.
          </EyebrowReveal>
        </div>
      </Container>

      <div className="relative mt-16 h-72 w-full lg:hidden">
        <GXHero layout="below-lg" />
      </div>
    </section>
  );
}
