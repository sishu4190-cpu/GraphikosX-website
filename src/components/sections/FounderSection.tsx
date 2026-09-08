import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { company } from "@/lib/data/company";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

export function FounderSection() {
  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-32">
      <CursorAtmosphere tone="light" />

      <Container className="relative max-w-3xl">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">Founder Note</p>
          <blockquote className="mt-6 font-display text-2xl font-bold leading-snug text-ink md:text-4xl">
            &ldquo;I don&rsquo;t believe in generic marketing. I believe every business deserves a strategy that
            understands its industry, customers and trust barriers.&rdquo;
          </blockquote>

          <div className="mt-8 flex items-center gap-4">
            {/* Circular founder photo replaces the previous decorative line —
                object-fit:cover on a fixed square box keeps natural face
                proportions regardless of the source image's own aspect
                ratio (no stretching), with a neutral border by default and
                an extremely subtle blue ring on hover for a touch of
                interactivity without looking like a button. */}
            <span className="group relative inline-block h-12 w-12 shrink-0 overflow-hidden rounded-full border border-ink/10 transition-[box-shadow,border-color] duration-300 hover:border-accent/40 md:h-14 md:w-14">
              <Image
                src="/founder/prakash-pal.jpg"
                alt={`${company.founder.name}, Founder of GraphikosX`}
                fill
                sizes="56px"
                className="object-cover"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-[0_0_0_3px_rgba(29,78,216,0.25)] transition-opacity duration-300 group-hover:opacity-100"
              />
            </span>
            <div>
              <p className="font-display text-base font-bold text-ink">{company.founder.name}</p>
              <p className="text-sm text-grey-500">Founder &middot; GraphikosX</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
