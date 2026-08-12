import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { ServiceDetail } from "@/lib/data/service-details";

export function ServiceDefinition({ detail, serviceName }: { detail: ServiceDetail; serviceName: string }) {
  return (
    <section className="relative overflow-hidden bg-paper py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative max-w-3xl">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">What is {serviceName.toLowerCase()}?</h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-ink md:text-lg">{detail.definitionAnswer}</p>
          <p className="mt-5 text-sm leading-relaxed text-grey-700 md:text-base">{detail.definitionExpansion}</p>
        </Reveal>
      </Container>
    </section>
  );
}
