import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { freeAuditHref, contactHref } from "@/lib/freeAuditUrl";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

/** Same structure as AboutCTA.tsx, tailored copy + `source: "work"` attribution. */
export function WorkCTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
      <CursorAtmosphere tone="dark" />
      <Container className="relative text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">Want to be the next case study?</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href={freeAuditHref({ source: "work" })} variant="primary">Get a Free Audit</Button>
            <Button href={contactHref("work")} variant="secondary" className="!border-white/20 !text-paper hover:!border-accent hover:!text-accent">
              Contact
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
