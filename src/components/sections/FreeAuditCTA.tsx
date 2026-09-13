"use client";

import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { company, whatsappLink } from "@/lib/data/company";
import { freeAuditHref } from "@/lib/freeAuditUrl";
import { track } from "@/lib/analytics/track";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

export function FreeAuditCTA({ source = "homepage-cta" }: { source?: string }) {
  return (
    // Phase 5: id + bg-ink/90 (was fully opaque bg-ink) — this is the
    // final chapter of the persistent 3D experience (see
    // GXExperience.tsx / types.ts's CHAPTER_IDS). Already `relative`, so
    // no positioning change needed, only the same opacity loosening every
    // other chapter section has needed. The existing `gx-bg-dark-aurora`
    // CSS glow is untouched — the new 3D layer is deliberately sparse (see
    // FinalCTAScene.tsx) so the two read as complementary, not
    // duplicated, and neither ever competes with the CTA buttons/text for
    // attention.
    <section id="gx-finalcta-section" className="relative overflow-hidden bg-ink/90 py-24 text-paper md:py-32">
      <CursorAtmosphere tone="dark" />
      <div aria-hidden className="gx-bg-dark-aurora" />
      <Container className="relative z-10 text-center">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-grey-500">Enough About Us. Let&rsquo;s Talk About You.</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-3xl font-extrabold leading-tight md:text-4xl">
            Where is your business today? Where do you want it to be in the next 3&ndash;5 years?
          </h2>
        </Reveal>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href={freeAuditHref({ source })} variant="primary">Get Your Free Audit</Button>
            <Button href={whatsappLink("Hello GraphikosX, I'd like to talk about my business.")} variant="secondary" external onClick={() => track("whatsapp_clicked", { source })} className="!border-white/20 !text-paper hover:!border-accent hover:!text-accent">
              Message on WhatsApp
            </Button>
          </div>
          <p className="mt-6 text-xs text-grey-500">
            Prefer email? Write to us at{" "}
            <a href={`mailto:${company.salesEmail}`} onClick={() => track("email_clicked", { source })} className="text-grey-300 underline hover:text-accent">
              {company.salesEmail}
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-14 font-display text-lg font-bold tracking-wide md:text-xl">
            BUILD AUTHORITY. <span className="text-accent">CREATE TRUST.</span> SCALE SMARTER.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
