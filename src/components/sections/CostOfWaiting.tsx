"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const years = [
  { year: "Year 1", label: "Foundation" },
  { year: "Year 2", label: "Visibility" },
  { year: "Year 3", label: "Authority" },
  { year: "Year 4", label: "Trust" },
  { year: "Year 5", label: "Digital Brand Equity" },
];

const compounding = ["Content", "Search Authority", "Audience", "Customer Data", "Reputation", "Brand Recognition", "Learning", "Optimization"];

export function CostOfWaiting() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div aria-hidden className="gx-bg-dark-aurora" />
      <CursorAtmosphere tone="dark" />
      <Container className="relative z-10">
        <SectionHeader animate tone="dark" eyebrow="The Cost of Waiting" title="The market won't wait for you." />

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <Reveal>
            <div>
              <p className="mb-6 text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">Start Today</p>
              <div className="space-y-4">
                {years.map((y, i) => (
                  <div key={y.year} className="flex items-center gap-4">
                    <span className="w-16 shrink-0 font-display text-sm font-bold text-accent">{y.year}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-accent/70 to-accent"
                        initial={{ width: shouldReduceMotion ? `${(i + 1) * 20}%` : 0 }}
                        whileInView={{ width: `${(i + 1) * 20}%` }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: shouldReduceMotion ? 0 : i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="w-32 shrink-0 text-right text-xs text-grey-300">{y.label}</span>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">What Accumulates Along the Way</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {compounding.map((c, i) => (
                  <motion.span
                    key={c}
                    tabIndex={0}
                    initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -14 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : 0.5 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                    className="gx-pill gx-pill--dark cursor-default rounded-full border border-white/15 px-3 py-1 text-xs text-grey-300 outline-none"
                  >
                    {c}
                  </motion.span>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="flex h-full flex-col justify-center rounded-2xl bg-surface p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">Start Five Years Later</p>
              <p className="font-display text-5xl font-extrabold text-paper">Day One.</p>
              <p className="mt-4 text-sm leading-relaxed text-grey-300">
                No accumulated content. No search authority. No audience. Just a market that has already moved on.
              </p>
              <p className="mt-8 text-lg font-medium leading-relaxed">
                You won&rsquo;t be competing against where your competitors are today.{" "}
                <span className="text-accent">You&rsquo;ll be competing against what they spent the next five years becoming.</span>
              </p>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
