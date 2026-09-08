import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

export function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-paper pb-14 pt-12 md:pb-20 md:pt-16">
      <CursorAtmosphere tone="light" />
      <svg aria-hidden viewBox="0 0 400 400" className="pointer-events-none absolute -left-24 -top-16 h-96 w-96 opacity-[0.05]">
        <polygon points="200,50 350,150 300,330 100,330 50,150" fill="none" stroke="#1D4ED8" strokeWidth="16" />
      </svg>

      <Container className="relative max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }]} />

        <p className="mb-5 mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-accent">Contact</p>

        <MaskReveal as="h1" className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl">
          Have a project, a question, or just want to talk it through? We&rsquo;re listening.
        </MaskReveal>

        <MaskReveal delay={0.15} as="p" className="mt-6 text-base leading-relaxed text-grey-700 md:text-lg">
          Whether you already know what you need or you&rsquo;re still figuring it out, reach out directly or send a message
          below. We&rsquo;re a remote-first team and reply as soon as we can.
        </MaskReveal>
      </Container>
    </section>
  );
}
