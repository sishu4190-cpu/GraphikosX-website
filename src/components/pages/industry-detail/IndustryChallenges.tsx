import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { IndustryDetail } from "@/lib/data/industry-details";

/**
 * SECTION 3 of the industry page master architecture (Phase 2H spec §11/§12):
 * exactly five genuinely sector-specific current challenges, presented as
 * premium interactive cards through the same reusable GlowCard/.gx-card
 * system every other card on the site uses — not a bespoke hover
 * implementation per page. Each card carries a plain numbered mark (the same
 * typographic language already used by IndustryApproach/IndustryEcosystem)
 * rather than a cartoon icon, per spec §12.
 */
export function IndustryChallenges({ detail, industryName }: { detail: IndustryDetail; industryName: string }) {
  return (
    <section className="relative overflow-hidden bg-paper py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader
          eyebrow="Five Current Challenges"
          title={`What actually gets in the way for ${industryName.toLowerCase()} businesses today.`}
          description="Not generic marketing problems — the specific friction this industry deals with."
        />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {detail.challenges.map((challenge, i) => (
            <Reveal key={challenge.title} delay={i * 0.07}>
              <GlowCard tone="light" focusable className="flex h-full flex-col gap-4 rounded-xl border border-ink/10 bg-white p-6">
                <span
                  aria-hidden
                  className="font-numeric flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-accent/30 text-xs font-bold text-accent"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <p className="font-display text-base font-bold text-ink">{challenge.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-grey-700">{challenge.description}</p>
                </div>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
