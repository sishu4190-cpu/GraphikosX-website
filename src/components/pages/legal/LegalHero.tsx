import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export function LegalHero({ title, path, updated }: { title: string; path: string; updated: string }) {
  return (
    <section className="bg-paper pb-10 pt-12 md:pb-14 md:pt-16">
      <Container className="max-w-3xl">
        <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: title, path }]} />
        <h1 className="mb-2 mt-8 font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h1>
        <p className="text-sm text-grey-500">Last updated: {updated}</p>
      </Container>
    </section>
  );
}
