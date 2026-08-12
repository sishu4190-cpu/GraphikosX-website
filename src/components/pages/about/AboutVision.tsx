import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const journey = ["India", "Global", "Category Leadership"];

export function AboutVision() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
      <CursorAtmosphere tone="dark" />
      <Container className="relative">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">Our Vision</p>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-extrabold leading-tight md:text-4xl">
            The position at the top is still open. <span className="text-accent">We&rsquo;re building GraphikosX to take it.</span>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-grey-300 md:text-base">
            This is an ambition we are building toward &mdash; not a claim of where we stand today. Our goal is to build
            GraphikosX into India&rsquo;s leading and most respected specialist digital presence agency, and over time,
            to compete for a position among the world&rsquo;s leading agencies in the category.
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            {journey.map((step, i) => (
              <div key={step} className="flex items-center gap-4">
                <span tabIndex={0} className="gx-pill gx-pill--dark cursor-default rounded-full border border-white/15 px-5 py-2 text-sm font-semibold tracking-wide outline-none">
                  {step}
                </span>
                {i < journey.length - 1 && <span className="text-accent">&rarr;</span>}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div tabIndex={0} className="gx-card gx-card--dark mt-12 rounded-2xl bg-surface p-8 outline-none md:p-10">
            <div className="gx-card-content">
              <p className="font-display text-xl font-bold md:text-2xl">
                Revenue builds the company. <span className="text-accent">Reputation builds the legacy.</span>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
