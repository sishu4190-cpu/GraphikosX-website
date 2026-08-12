import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { freeAuditHref, contactHref } from "@/lib/freeAuditUrl";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

export function AboutCTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
      <CursorAtmosphere tone="dark" />
      <Container className="relative text-center">
        <Reveal>
          <h2 className="font-display text-3xl font-extrabold md:text-4xl">Let&rsquo;s build something meaningful.</h2>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button href={freeAuditHref({ source: "about" })} variant="primary">Get a Free Audit</Button>
            <Button href={contactHref("about")} variant="secondary" className="!border-white/20 !text-paper hover:!border-accent hover:!text-accent">
              Contact
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
