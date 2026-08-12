import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import type { IndustryDetail } from "@/lib/data/industry-details";

/**
 * Industry-specific before/after transformation narrative (Phase 2H spec
 * §19) — reuses the exact same directional-sweep card mechanism as the
 * homepage's "Our Mission" transformation cards (GlowCard + .gx-sweep
 * .gx-sweep--vertical), just adapted to a single, larger before/after pair
 * per industry instead of four generic ones.
 */
export function IndustryTransformation({ detail, industryName }: { detail: IndustryDetail; industryName: string }) {
  return (
    <section className="bg-grey-100 py-16 md:py-24">
      <Container>
        <SectionHeader eyebrow="The Shift" title={`What changes for a ${industryName.toLowerCase()} business.`} />
        <div className="mt-12 flex justify-center">
          <Reveal className="w-full max-w-xl">
            <GlowCard
              tone="light"
              focusable
              className="group gx-sweep gx-sweep--vertical flex flex-col items-center gap-5 rounded-2xl border border-ink/10 bg-white px-8 py-12 text-center transition-colors duration-300 hover:border-accent/40 focus-visible:border-accent/40"
            >
              <p className="text-sm font-medium text-grey-500 transition-colors duration-300 group-hover:text-grey-700 group-focus-visible:text-grey-700">
                {detail.transformation.before}
              </p>
              <span
                aria-hidden
                className="text-2xl text-accent transition-transform duration-300 group-hover:translate-y-1 group-focus-visible:translate-y-1"
              >
                &darr;
              </span>
              <p className="font-display text-xl font-bold text-ink transition-[color,transform] duration-300 group-hover:scale-[1.03] group-hover:text-accent group-focus-visible:scale-[1.03] group-focus-visible:text-accent md:text-2xl">
                {detail.transformation.after}
              </p>
            </GlowCard>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
