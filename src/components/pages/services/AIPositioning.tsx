import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

export function AIPositioning() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
      <CursorAtmosphere tone="dark" />
      <Container className="relative max-w-2xl text-center">
        <Reveal>
          <p className="font-display text-2xl font-extrabold md:text-3xl">
            AI isn&rsquo;t the product. <span className="text-accent">It&rsquo;s our advantage.</span>
          </p>
          <p className="mt-6 text-sm leading-relaxed text-grey-300 md:text-base">
            AI accelerates execution &mdash; research, analysis, workflows and personalization move faster. Human
            strategy still drives every decision GraphikosX makes for a client. AI changes how fast the work gets
            done. It doesn&rsquo;t change who&rsquo;s deciding what to do.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
