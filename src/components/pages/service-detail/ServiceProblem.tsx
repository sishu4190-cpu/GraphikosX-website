import { Container } from "@/components/ui/Container";
import { LineDraw } from "@/components/motion/LineDraw";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { ServiceDetail } from "@/lib/data/service-details";

export function ServiceProblem({ detail }: { detail: ServiceDetail }) {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative grid gap-10 lg:grid-cols-[0.7fr_1.4fr]">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">The Business Problem</p>
          <LineDraw className="mt-4 w-16" />
        </Reveal>
        <div>
          {detail.problem.map((para, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <p className="mt-0 mb-5 text-sm leading-relaxed text-grey-700 last:mb-0 md:text-base">{para}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
