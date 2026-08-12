import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { ServiceDetail } from "@/lib/data/service-details";

export function ServiceOutcome({ detail, serviceName }: { detail: ServiceDetail; serviceName: string }) {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative max-w-3xl">
        <Reveal>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-ink px-4 py-1.5 text-xs font-semibold text-paper">{serviceName}</span>
            <span className="text-accent" aria-hidden>&rarr;</span>
            <span className="rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-paper">{detail.outcomeHeadline}</span>
          </div>
          <p className="mt-6 text-sm leading-relaxed text-grey-700 md:text-base">{detail.outcomeBody}</p>
        </Reveal>
      </Container>
    </section>
  );
}
