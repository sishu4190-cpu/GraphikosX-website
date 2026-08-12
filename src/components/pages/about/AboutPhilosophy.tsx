import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

export function AboutPhilosophy() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
      <CursorAtmosphere tone="dark" />
      <Container className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Our Philosophy</p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight md:text-4xl">
            We don&rsquo;t want to be everything to everyone.
            <br />
            We want to be <span className="text-accent">something meaningful to someone.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="gx-card gx-card--dark rounded-2xl bg-surface p-8">
            <div className="gx-card-content">
              <p className="text-sm leading-relaxed text-grey-300">
                This philosophy is why GraphikosX works with 10 chosen industries instead of every business that walks
                in the door. Each industry has a different customer, buying behaviour, competitive landscape and trust
                signal &mdash; so the strategy has to be built for that industry specifically, not adapted from a
                generic template.
              </p>
              <Link href="/industries" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-paper hover:text-accent">
                See the 10 industries <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
