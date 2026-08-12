"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * Route-level error boundary. Catches rendering/runtime errors anywhere
 * under the root layout (header/footer still render around this).
 * Deliberately never renders `error.message` or `error.stack` to the
 * visitor — only a generic, branded message. The real detail goes to
 * server/console logs via console.error, which is where a real monitoring
 * integration (Sentry, etc.) would hook in later.
 */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error("[GraphikosX] Unhandled route error:", error);
  }, [error]);

  return (
    <section className="flex min-h-[70vh] items-center bg-paper py-24">
      <Container className="max-w-2xl text-center">
        <p className="font-numeric text-sm font-semibold uppercase tracking-[0.2em] text-accent">Something went wrong</p>
        <h1 className="mt-4 font-display text-4xl font-bold text-ink sm:text-5xl">This page hit a snag.</h1>
        <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-grey-700">
          Nothing on your end — try again, or head back home. If this keeps happening, reach us directly and we&rsquo;ll
          sort it out.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button onClick={reset} variant="primary">
            Try Again
          </Button>
          <Button href="/" variant="secondary">
            Back Home
          </Button>
        </div>
      </Container>
    </section>
  );
}
