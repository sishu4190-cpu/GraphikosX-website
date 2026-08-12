import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Page Not Found — GraphikosX",
  description: "The page you're looking for doesn't exist.",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="flex min-h-[70vh] items-center bg-paper py-24">
      <Container className="max-w-2xl text-center">
        <p className="font-numeric text-sm font-semibold uppercase tracking-[0.2em] text-accent">404</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">
          You found a page we didn&rsquo;t build.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-grey-700">
          The link that brought you here is broken or the page has moved. Everything else on GraphikosX is
          exactly where it should be.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href="/" variant="primary">
            Back Home
          </Button>
          <Button href="/services" variant="secondary">
            Explore Services
          </Button>
        </div>
      </Container>
    </section>
  );
}
