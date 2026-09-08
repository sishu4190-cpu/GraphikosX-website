import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { services } from "@/lib/data/services";
import { industries } from "@/lib/data/industries";
import type { ServiceDetail } from "@/lib/data/service-details";

export function ServiceEcosystem({ detail, serviceName }: { detail: ServiceDetail; serviceName: string }) {
  const related = detail.ecosystem
    .map((slug) => services.find((s) => s.slug === slug))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  const relevantIndustries = detail.industries
    .map((slug) => industries.find((i) => i.slug === slug))
    .filter((i): i is NonNullable<typeof i> => Boolean(i));

  return (
    <section className="relative overflow-hidden bg-paper py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative grid gap-14 lg:grid-cols-2">
        <div>
          <SectionHeader eyebrow="Connected Ecosystem" title="Where this fits in the wider system." description={`${serviceName} rarely works in isolation. Here is where it connects most directly.`} />
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper">{serviceName}</span>
            {related.map((s) => (
              <Reveal key={s.slug}>
                <Link href={`/services/${s.slug}`} className="gx-pill gx-pill--light inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium text-grey-700">
                  <span aria-hidden>&harr;</span> {s.name}
                </Link>
              </Reveal>
            ))}
          </div>
        </div>

        {relevantIndustries.length > 0 && (
          <div>
            <SectionHeader
              eyebrow="Best Suited For"
              title="The industries this matters most in."
              description="Not every service applies equally everywhere: here is where it tends to matter most."
            />
            <div className="mt-8 flex flex-col gap-3">
              {relevantIndustries.map((ind) => (
                <Reveal key={ind.slug}>
                  <GlowCard tone="light" className="rounded-xl border border-ink/10 bg-grey-100 p-0">
                    <Link href={`/industries/${ind.slug}`} className="flex items-center justify-between px-5 py-4 text-sm font-medium text-ink">
                      {ind.name}
                      <span aria-hidden className="text-accent">&rarr;</span>
                    </Link>
                  </GlowCard>
                </Reveal>
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
