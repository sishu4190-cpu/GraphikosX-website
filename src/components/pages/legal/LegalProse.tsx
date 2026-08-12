import { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

export function LegalProse({ children }: { children: ReactNode }) {
  return (
    <section className="bg-paper pb-20 md:pb-28">
      <Container className="max-w-3xl">
        <div
          className="
            text-base leading-relaxed text-grey-700
            [&>h2]:font-display [&>h2]:text-xl [&>h2]:font-bold [&>h2]:text-ink [&>h2]:mt-10 [&>h2]:mb-3 [&>h2]:first:mt-0
            [&>p]:mb-4
            [&>ul]:mb-4 [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5
            [&_a]:text-accent [&_a]:underline [&_a:hover]:text-ink
            [&>p:last-child]:mb-0
          "
        >
          {children}
        </div>
      </Container>
    </section>
  );
}
