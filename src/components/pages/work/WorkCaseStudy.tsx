import Image from "next/image";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { workCaseStudy } from "@/lib/data/work";

/**
 * Phase 8 — the real, always-rendered content for the case study. This is
 * intentionally NOT gated behind the WebGL capability check in
 * WorkShowcase.tsx/WorkScene.tsx: per the plan's own explicit note for this
 * phase ("if this page needs any real SEO weight... consider keeping actual
 * project case-study copy in real DOM text below/beside the WebGL grid")
 * and its accessibility test ("keyboard/screen-reader users can still reach
 * and understand each project... not WebGL-only content"), this section is
 * the answer to both at once: real server-rendered text for search engines,
 * real `next/image` elements (responsive `sizes`, lazy-loaded, no CLS —
 * exactly what the plan notes WebGL textures don't give you for free) with
 * real `alt` text, and real DOM anchors (`id="work-<slug>"`) that both
 * keyboard users and WorkScene's tile clicks can reach. The WebGL grid above
 * is the visual centerpiece; this is the substance underneath it.
 */
export function WorkCaseStudy() {
  return (
    <section className="relative bg-paper py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow="The Case Study"
          title="A full-scope engagement, in three parts."
          description={`Client: ${workCaseStudy.client.name}. ${workCaseStudy.client.note}`}
        />

        <div className="mt-16 space-y-20 md:space-y-28">
          {workCaseStudy.facets.map((facet, i) => (
            // Plain wrapping div carries the `id` anchor (WorkScene.tsx's tile
            // clicks and any keyboard/deep-link navigation scroll to this) —
            // Reveal itself doesn't forward arbitrary props like `id`, so the
            // anchor and its scroll-offset live one level up. `scroll-mt-28`
            // keeps the sticky Header from covering the heading on arrival.
            <div key={facet.slug} id={`work-${facet.slug}`} className="scroll-mt-28">
              <Reveal>
                <div className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""}`}>
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-grey-100">
                    <Image
                      src={facet.image}
                      alt={facet.imageAlt}
                      fill
                      sizes="(min-width: 768px) 45vw, 90vw"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{facet.category}</p>
                    <h3 className="mt-3 font-display text-2xl font-bold text-ink md:text-3xl">{facet.title}</h3>
                    <p className="mt-4 text-base leading-relaxed text-grey-700">{facet.summary}</p>
                    <ul className="mt-6 space-y-3">
                      {facet.scope.map((line) => (
                        <li key={line} className="flex gap-3 text-sm leading-relaxed text-grey-700">
                          <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          {line}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
