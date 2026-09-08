import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { services } from "@/lib/data/services";
import type { IndustryDetail } from "@/lib/data/industry-details";

export function RelevantServices({ detail }: { detail: IndustryDetail }) {
  const resolved = detail.relevantServices
    .map((rs) => ({ ...rs, service: services.find((s) => s.slug === rs.slug) }))
    .filter((rs) => Boolean(rs.service));

  return (
    <section className="relative overflow-hidden bg-grey-100 py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="What GraphikosX Builds" title="The services that matter most here." description="Not all 15: the ones with a genuine reason to be here." />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {resolved.map((rs, i) => (
            <Reveal key={rs.slug} delay={i * 0.06}>
              <GlowCard tone="light" className="h-full rounded-xl border border-ink/10 bg-white p-0">
                <Link href={`/services/${rs.slug}`} className="flex h-full flex-col p-6">
                  <p className="font-display text-base font-bold text-ink">{rs.service!.name}</p>
                  <p className="mt-2 text-sm leading-relaxed text-grey-700">{rs.why}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    Learn more <span aria-hidden>&rarr;</span>
                  </span>
                </Link>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
