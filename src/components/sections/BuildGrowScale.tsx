"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/motion/GlowCard";
import { services } from "@/lib/data/services";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const groups = ["Build", "Grow", "Scale"] as const;

export function BuildGrowScale() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div aria-hidden className="gx-bg-diagram-grid" />
      <CursorAtmosphere tone="light" />
      <Container className="relative z-10">
        <SectionHeader animate eyebrow="How We Grow a Business" title="Build. Grow. Scale." description="A layered growth system, not three disconnected packages." />

        <div className="relative mt-16">
          {groups.map((group, gi) => (
            <div key={group} className="relative">
              <motion.div
                initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : gi * 0.15 }}
                style={{ marginLeft: gi * 0, marginTop: gi === 0 ? 0 : -1 }}
              >
                <GlowCard
                  tone="light"
                  focusable
                  className="group gx-sweep flex flex-col gap-6 border-l-4 border-accent bg-grey-100 py-8 pl-8 pr-6 transition-[background-color,border-color] duration-300 hover:border-l-[6px] hover:border-l-[var(--gx-blue-bright)] hover:bg-white focus-visible:border-l-[6px] focus-visible:border-l-[var(--gx-blue-bright)] focus-visible:bg-white md:flex-row md:items-center md:gap-10"
                >
                  <p className="w-28 shrink-0 font-display text-3xl font-extrabold text-ink">
                    {group}
                    <span className="text-accent">.</span>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {services
                      .filter((s) => s.group === group)
                      .map((s, si) => (
                        <span
                          key={s.slug}
                          tabIndex={0}
                          className="gx-pill gx-pill--light cursor-default rounded-full border border-ink/10 bg-white px-3 py-1.5 text-xs font-medium text-grey-700 outline-none transition-[opacity,transform,border-color] duration-300 group-hover:border-accent/25 group-hover:scale-[1.03] group-focus-visible:border-accent/25 group-focus-visible:scale-[1.03]"
                          style={{ transitionDelay: `${si * 30}ms` }}
                        >
                          {s.name}
                        </span>
                      ))}
                  </div>
                </GlowCard>
              </motion.div>

              {gi < groups.length - 1 && (
                <div className="flex justify-start pl-[calc(2rem-1px)]">
                  <motion.div
                    initial={{ height: 0 }}
                    whileInView={{ height: 28 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: shouldReduceMotion ? 0 : 0.4, delay: shouldReduceMotion ? 0 : gi * 0.15 + 0.3 }}
                    className="w-[2px] bg-accent/40"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <p className="mt-10 text-center font-display text-lg font-bold text-ink">
          Build <span className="text-accent">&rarr;</span> Grow <span className="text-accent">&rarr;</span> Scale
        </p>
      </Container>
    </section>
  );
}
