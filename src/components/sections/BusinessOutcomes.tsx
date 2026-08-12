"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Reveal } from "@/components/motion/Reveal";
import { ShineText } from "@/components/motion/AnimatedText";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const outcomes = [
  ["Website", "Credibility"],
  ["SEO", "Discoverability"],
  ["Social Media", "Trust"],
  ["Branding", "Perception"],
  ["Content", "Authority"],
  ["CRM", "Sales Efficiency"],
  ["AI Automation", "Scalability"],
];

function OutcomeRow({ tool, outcome, index }: { tool: string; outcome: string; index: number }) {
  const shouldReduceMotion = useReducedMotion();
  const rowBorder = index > 0 ? "border-t border-white/10" : "";
  // Every cell in a row shares one entrance transition (same delay/duration)
  // so the row still reveals together even though — for the sake of the grid
  // alignment below — each cell is animated individually rather than through
  // a single wrapping `Reveal`. (A `display:contents` wrapper would have
  // been the more obvious way to keep one JSX group per row while still
  // handing all three cells to the same grid track, but `opacity`/`transform`
  // — exactly what `Reveal` animates — have no effect on a `display:contents`
  // box per the CSS spec, so entrance animation would silently never play.)
  const entrance = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 14 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" } as const,
    transition: { duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : index * 0.05, ease: [0.22, 1, 0.36, 1] as const },
  };

  return (
    // `group` on a `display:contents` element still works for `group-hover`/
    // `group-focus-within` — those pseudo-classes are DOM-tree based, not
    // layout-based, so removing this wrapper's own box doesn't break them.
    // It's just never animated directly (see note above).
    <div className="group contents">
      <motion.span {...entrance} tabIndex={0} className={`text-sm text-grey-300 outline-none transition-colors duration-300 group-hover:text-paper group-focus-visible:text-paper ${rowBorder} py-5`}>
        {tool}
      </motion.span>
      <motion.span
        {...entrance}
        aria-hidden
        className={`relative flex items-center justify-center overflow-hidden text-accent transition-colors duration-300 group-hover:text-[var(--gx-blue-bright)] ${rowBorder} py-5`}
      >
        {/* Traveling energy dot: sits centered at rest, sweeps left -> right
            toward the outcome on hover/focus, then resets — CSS-only, no
            per-row JS/state needed. */}
        <span className="relative inline-flex h-4 w-10 items-center justify-center">
          <span aria-hidden className="absolute inset-y-1/2 left-0 right-0 h-px -translate-y-1/2 bg-current opacity-40" />
          <span
            aria-hidden
            className="absolute left-0 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[var(--gx-blue-bright)] opacity-0 shadow-[0_0_8px_2px_rgba(124,156,255,0.7)] transition-[left,opacity] duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:left-[calc(100%-6px)] group-hover:opacity-100 group-focus-visible:left-[calc(100%-6px)] group-focus-visible:opacity-100"
          />
          <span aria-hidden>&rarr;</span>
        </span>
      </motion.span>
      <motion.span
        {...entrance}
        className={`font-display text-base font-bold text-paper transition-colors duration-300 group-hover:text-[var(--gx-blue-bright)] group-focus-visible:text-[var(--gx-blue-bright)] md:text-lg ${rowBorder} py-5`}
      >
        {outcome}
      </motion.span>
    </div>
  );
}

export function BusinessOutcomes() {
  return (
    <section className="relative overflow-hidden bg-surface py-24 text-paper md:py-32">
      <div aria-hidden className="gx-bg-dark-aurora" />
      <CursorAtmosphere tone="dark" />
      <Container className="relative z-10">
        <SectionHeader animate tone="dark" eyebrow="What We Actually Deliver" title="We don't sell services. We build business outcomes." />

        {/* Strict three-column grid — SERVICE | ARROW | OUTCOME — shared by
            every row (not seven independent flex rows), so the arrow column
            sits on exactly the same vertical axis for all seven rows
            regardless of how long any individual service/outcome label is. */}
        <div className="mt-16 grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 sm:gap-x-8">
          {outcomes.map(([tool, outcome], i) => (
            <OutcomeRow key={tool} tool={tool} outcome={outcome} index={i} />
          ))}
        </div>

        <Reveal delay={0.4}>
          <p className="mt-12 text-center font-display text-xl font-bold md:text-2xl">
            Tools change. <ShineText delay={0.4}>Business outcomes don&rsquo;t.</ShineText>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
