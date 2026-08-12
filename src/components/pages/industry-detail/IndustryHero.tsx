import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { TrackedFreeAuditButton } from "@/components/ui/TrackedFreeAuditButton";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { StyleMotif } from "./StyleMotif";
import type { IndustryDetail } from "@/lib/data/industry-details";

export function IndustryHero({ detail, industryName }: { detail: IndustryDetail; industryName: string }) {
  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-12 md:pb-24 md:pt-16">
      <StyleMotif style={detail.visualStyle} className="pointer-events-none absolute -right-20 -top-16 h-96 w-96 opacity-[0.05]" />
      <CursorAtmosphere tone="light" />

      <Container className="relative">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Industries", path: "/industries" },
            { name: industryName, path: `/industries/${detail.slug}` },
          ]}
        />

        <div className="mb-5 mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-paper">Industry</span>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{detail.eyebrow}</p>
        </div>

        <MaskReveal as="h1" className="max-w-3xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          {detail.headline}
        </MaskReveal>

        <MaskReveal delay={0.15} as="p" className="mt-6 max-w-2xl text-base leading-relaxed text-grey-700 md:text-lg">
          {detail.heroApproach}
        </MaskReveal>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <TrackedFreeAuditButton source={`industry-${detail.slug}-hero`} industry={detail.slug} event="industry_cta_clicked" variant="primary">Get a Free Audit</TrackedFreeAuditButton>
          <Button href="/services" variant="secondary">Explore Relevant Services</Button>
        </div>
      </Container>
    </section>
  );
}
