import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { IndustryDetail } from "@/lib/data/industry-details";

export function IndustryAnswer({ detail, industryName }: { detail: IndustryDetail; industryName: string }) {
  return (
    <section className="relative overflow-hidden bg-paper py-16 md:py-20">
      <CursorAtmosphere tone="light" />
      <Container className="relative max-w-3xl">
        <Reveal>
          <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">
            How does GraphikosX help {industryName.toLowerCase()} businesses?
          </h2>
          <p className="mt-4 text-base font-medium leading-relaxed text-ink md:text-lg">{detail.aeoAnswer}</p>
        </Reveal>
      </Container>
    </section>
  );
}
