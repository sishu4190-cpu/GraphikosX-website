import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { company } from "@/lib/data/company";

const traits = ["Ambition", "Accountability", "Specialization", "Reputation", "Category Leadership"];

export function AboutFounder() {
  return (
    <section className="relative overflow-hidden bg-paper py-20 md:py-28">
      <CursorAtmosphere tone="light" />
      <Container className="relative max-w-3xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Who Is Building This</p>
          <div className="mt-4 flex items-center gap-4">
            <span className="group relative inline-block h-14 w-14 shrink-0 overflow-hidden rounded-full border border-ink/10 transition-[box-shadow,border-color] duration-300 hover:border-accent/40 md:h-16 md:w-16">
              <Image src="/founder/prakash-pal.jpg" alt={`${company.founder.name}, Founder of GraphikosX`} fill sizes="64px" className="object-cover" />
              <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_0_3px_rgba(29,78,216,0.25)] transition-opacity duration-300 group-hover:opacity-100" />
            </span>
            <div>
              <h2 className="font-display text-2xl font-bold leading-snug text-ink md:text-3xl">{company.founder.name}</h2>
              <p className="text-sm text-grey-500">Founder &middot; GraphikosX</p>
            </div>
          </div>

          <p className="mt-6 text-sm leading-relaxed text-grey-700 md:text-base">
            GraphikosX is founder-led, which means senior strategic thinking stays involved in the work rather than
            being handed off after the pitch. But GraphikosX is built as a system and a standard, not a single
            person &mdash; the goal is a company that holds its position because of how it works, not because of who
            runs it.
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {traits.map((trait) => (
              <span key={trait} tabIndex={0} className="gx-pill gx-pill--light cursor-default rounded-full border border-ink/10 bg-grey-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-grey-700 outline-none">
                {trait}
              </span>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
