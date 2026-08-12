import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const contrasts = ["Customers", "Buying Behaviour", "Trust Signals", "Sales Cycles", "Competition", "Decisions"];

export function WhySpecialize() {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-16 md:py-20">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <Reveal>
          <div className="flex flex-wrap gap-2">
            {contrasts.map((item, i) => (
              <span
                key={item}
                tabIndex={0}
                style={{ transitionDelay: `${i * 30}ms` }}
                className="gx-pill gx-pill--light cursor-default rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wide text-grey-700 outline-none"
              >
                Different {item}
              </span>
            ))}
          </div>
          <p className="mt-6 max-w-2xl font-display text-xl font-bold text-ink md:text-2xl">
            Therefore, their marketing shouldn&rsquo;t look the same either.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
