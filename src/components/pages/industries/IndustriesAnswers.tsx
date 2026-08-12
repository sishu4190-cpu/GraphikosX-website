import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { industries } from "@/lib/data/industries";

// Generated from the live `industries` list rather than hand-typed, so this
// AEO-facing answer can never silently drift out of sync with the actual 10
// industries GraphikosX serves (spec §21/§22: visible content must match
// what's actually on the site).
const industryNameList = industries.map((i) => i.name);
const industryListSentence =
  industryNameList.length > 1
    ? `${industryNameList.slice(0, -1).join(", ")} and ${industryNameList[industryNameList.length - 1]}`
    : industryNameList[0];

const qa = [
  { q: "Which industries does GraphikosX serve?", a: `${industryListSentence}.` },
  { q: "Why only 10 industries?", a: "Specialization requires depth. Serving fewer industries means understanding each one's customers, buying behaviour and trust signals well enough to build strategy around them, rather than adapting a generic template." },
  { q: "Does GraphikosX use the same strategy for every industry?", a: "No. Each industry has a different digital challenge and opportunity — a healthcare practice and a real estate developer are not marketed the same way, even using the same underlying services." },
  { q: "How does industry specialization improve strategy?", a: "Understanding an industry's customer, buying behaviour, competition and trust signals in advance means less time spent discovering the obvious and more time on what actually moves that specific business forward." },
];

export function IndustriesAnswers() {
  return (
    <section className="relative overflow-hidden bg-grey-100 py-20 md:py-28">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="In Short" title="Common questions, answered directly." />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {qa.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.08}>
              <GlowCard tone="light" focusable className="h-full rounded-xl border border-ink/10 bg-white p-6">
                <h3 className="font-display text-base font-bold text-ink">{item.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-grey-700">{item.a}</p>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
