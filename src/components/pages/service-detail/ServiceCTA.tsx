import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TrackedFreeAuditButton } from "@/components/ui/TrackedFreeAuditButton";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { ServiceDetail } from "@/lib/data/service-details";

export function ServiceCTA({ detail }: { detail: ServiceDetail }) {
  return (
    <section className="relative overflow-hidden bg-ink py-16 text-paper md:py-24">
      <CursorAtmosphere tone="dark" />
      <Container className="relative text-center">
        <Reveal>
          <h2 className="font-display text-2xl font-extrabold md:text-3xl">Get a Free Audit</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-grey-300 md:text-base">{detail.ctaSupportingCopy}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <TrackedFreeAuditButton source={`service-${detail.slug}-cta`} event="service_cta_clicked" variant="primary">Get a Free Audit</TrackedFreeAuditButton>
            <Button href="/services" variant="secondary" className="!border-white/20 !text-paper hover:!border-accent hover:!text-accent">
              Explore All Services
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
