import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { TrackedFreeAuditButton } from "@/components/ui/TrackedFreeAuditButton";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { GroupMotif } from "./GroupMotif";
import type { ServiceDetail } from "@/lib/data/service-details";

export function ServiceHero({ detail, serviceName }: { detail: ServiceDetail; serviceName: string }) {
  return (
    <section className="relative overflow-hidden bg-paper pb-16 pt-12 md:pb-24 md:pt-16">
      <GroupMotif group={detail.group} className="pointer-events-none absolute -right-20 -top-16 h-96 w-96 opacity-[0.05]" />
      <CursorAtmosphere tone="light" />

      <Container className="relative">
        <Breadcrumbs
          items={[
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
            { name: serviceName, path: `/services/${detail.slug}` },
          ]}
        />

        <div className="mb-5 mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-ink px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-paper">
            {detail.group}
          </span>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-accent">{serviceName} Services</p>
        </div>

        <MaskReveal as="h1" className="max-w-3xl font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          {detail.headline}
        </MaskReveal>

        <MaskReveal delay={0.15} as="p" className="mt-6 max-w-2xl text-base leading-relaxed text-grey-700 md:text-lg">
          {detail.subhead}
        </MaskReveal>

        <div className="mt-10 flex flex-wrap items-center gap-4">
          <TrackedFreeAuditButton source={`service-${detail.slug}-hero`} event="service_cta_clicked" variant="primary">Get a Free Audit</TrackedFreeAuditButton>
          <Button href="/services" variant="secondary">Explore Related Services</Button>
        </div>
      </Container>
    </section>
  );
}
