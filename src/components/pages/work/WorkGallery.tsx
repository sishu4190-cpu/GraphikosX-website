import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { workCaseStudy } from "@/lib/data/work";

/**
 * "Our Work" real-reference gallery — added once the client confirmed it
 * was fine to name and show them (see src/lib/data/work.ts's header
 * comment). Sits between WorkHero and the WebGL WorkShowcase grid: this is
 * the immediate, no-interaction-required proof that the case study below
 * is real — the client's actual logo file, their actual downloadable
 * catalogue PDF, and their actual company profile sheet, not another round
 * of abstract illustration.
 *
 * The wide "Industries served" strip is a real photo montage rather than
 * five separate images, so it gets its own full-width row (`sm:col-span-2
 * lg:col-span-3`) instead of being cropped into a square like the other
 * items.
 */
export function WorkGallery() {
  return (
    <section className="relative overflow-hidden bg-paper py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader
          eyebrow="Real Reference Material"
          title="Straight from the client's own files."
          description={`Logo file, product catalogue, and company profile sheet for ${workCaseStudy.client.name} — the actual source material this engagement was built from.`}
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workCaseStudy.gallery.map((item, i) => {
            const isWide = item.caption === "Industries served";
            return (
              <Reveal key={item.image} delay={i * 0.05} className={isWide ? "sm:col-span-2 lg:col-span-3" : ""}>
                <GlowCard tone="light" className="h-full overflow-hidden rounded-2xl border border-ink/10 bg-grey-100">
                  <div
                    className={`relative w-full ${isWide ? "aspect-[32/5] bg-white" : "aspect-[4/5]"} ${item.image.endsWith(".png") ? "bg-white p-6" : ""}`}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes={isWide ? "100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
                      className={item.image.endsWith(".png") || isWide ? "object-contain" : "object-cover"}
                    />
                  </div>
                  <p className="border-t border-ink/10 px-4 py-3 text-sm font-semibold text-ink">{item.caption}</p>
                </GlowCard>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
