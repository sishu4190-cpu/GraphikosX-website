import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaskReveal } from "@/components/motion/MaskReveal";

export function FreeAuditHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-14 pt-12 md:pb-20 md:pt-16">
      <Container className="relative max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Free Audit", path: "/free-audit" }]} />

        <p className="mb-5 mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Free Audit</p>

        <MaskReveal as="h1" className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          A clear look at where your digital presence stands today.
        </MaskReveal>

        <MaskReveal delay={0.15} as="p" className="mt-6 text-base leading-relaxed text-grey-700 md:text-lg">
          Answer a few questions about your business, your goals and what you already have online. We&rsquo;ll review it and get
          back to you with what we see, no cost, no obligation, and no generic template.
        </MaskReveal>
      </Container>
    </section>
  );
}
