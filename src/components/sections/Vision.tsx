"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { MaskReveal } from "@/components/motion/MaskReveal";
import { EyebrowReveal } from "@/components/motion/AnimatedText";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const journey = ["India", "Global", "Category Leadership"];

// Approximate along-the-line stop percentages for the traveling energy
// indicator — India / Global / Category Leadership / past-the-edge. Kept as
// percentages (not measured pixel positions) so the same motion scales
// naturally across breakpoints without a resize-observer.
const ARROW_STOPS = ["0%", "30%", "62%", "100%", "114%"];
const ARROW_TIMES = [0, 0.28, 0.58, 0.85, 1];
const ARROW_DURATION = 2.6;

function pillArrivalDelay(index: number) {
  return ARROW_TIMES[index + 1] * ARROW_DURATION;
}

export function Vision() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-ink py-24 text-paper md:py-32">
      <div aria-hidden className="gx-bg-dark-aurora" />
      <CursorAtmosphere tone="dark" />
      <Container className="relative z-10">
        <EyebrowReveal className="text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">
          The position at the top is still open.
        </EyebrowReveal>
        <MaskReveal as="h2" delay={0.08} className="mt-4 font-display text-3xl font-extrabold leading-tight md:text-5xl">
          We&rsquo;re building <span className="text-accent">GraphikosX</span> to take it.
        </MaskReveal>

        <Reveal delay={0.15}>
          <div className="relative mt-12 py-2">
            {/* Energy line: spans the FULL section width (not just the pills'
                content width), so the flow visibly continues past the last
                pill ("Category Leadership") into the section edge. */}
            <span className="gx-journey-line pointer-events-none absolute inset-y-1/2 left-0 right-0 h-[2px] -translate-y-1/2" aria-hidden />

            {/* Traveling energy indicator: India -> Global -> Category
                Leadership -> continues past the last pill toward the
                section boundary, where a soft blue edge-light suggests
                forward momentum rather than the animation simply stopping.
                Always mounted (never conditionally rendered on
                shouldReduceMotion) — a structural branch there would render
                differently on the server (which never knows the client's
                motion preference) than on the client's first paint, which
                React reports as a hydration error. Under reduced motion it
                simply never animates and stays invisible via the static
                opacity below instead. */}
            <motion.span
              aria-hidden
              className="pointer-events-none absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--gx-blue-bright)] shadow-[0_0_16px_4px_rgba(124,156,255,0.75)]"
              initial={{ left: ARROW_STOPS[0], opacity: 0, scale: 0.6 }}
              whileInView={
                shouldReduceMotion
                  ? { opacity: 0 }
                  : { left: ARROW_STOPS, opacity: [0, 1, 1, 1, 0], scale: [0.6, 1, 1, 1.1, 0.7] }
              }
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: shouldReduceMotion ? 0 : ARROW_DURATION, times: shouldReduceMotion ? undefined : ARROW_TIMES, ease: [0.65, 0, 0.35, 1] }}
            />
            <motion.span
              aria-hidden
              className="pointer-events-none absolute top-1/2 right-0 h-16 w-16 -translate-y-1/2 translate-x-1/2 rounded-full bg-[var(--gx-blue-bright)] blur-2xl"
              initial={{ opacity: 0 }}
              whileInView={shouldReduceMotion ? { opacity: 0 } : { opacity: [0, 0, 0.4, 0] }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: shouldReduceMotion ? 0 : ARROW_DURATION, times: shouldReduceMotion ? undefined : [0, 0.82, 0.92, 1], ease: "easeOut" }}
            />

            <div className="relative flex flex-wrap items-center gap-4">
              {journey.map((step, i) => {
                const isLast = i === journey.length - 1;
                const delay = shouldReduceMotion ? 0 : pillArrivalDelay(i);
                return (
                  <div key={step} className="flex items-center gap-4">
                    <motion.span
                      className={`rounded-full border border-white/15 bg-ink px-5 py-2 text-sm font-semibold tracking-wide ${
                        shouldReduceMotion && isLast ? "!border-[var(--gx-blue-bright)] !bg-[var(--gx-blue)]" : ""
                      }`}
                      initial={
                        shouldReduceMotion
                          ? undefined
                          : { backgroundColor: "rgba(17,19,24,1)", borderColor: "rgba(255,255,255,0.15)", boxShadow: "0 0 0px rgba(29,78,216,0)" }
                      }
                      whileInView={
                        shouldReduceMotion
                          ? undefined
                          : isLast
                            ? {
                                // Category Leadership: strongest activation, and it stays lit
                                // (the destination the whole sequence is building toward).
                                backgroundColor: ["rgba(17,19,24,1)", "rgba(29,78,216,0.95)"],
                                borderColor: ["rgba(255,255,255,0.15)", "rgba(124,156,255,0.9)"],
                                boxShadow: ["0 0 0px rgba(29,78,216,0)", "0 0 28px rgba(29,78,216,0.65)"],
                              }
                            : {
                                // India / Global: receive activation, then settle back down
                                // as the energy continues toward the next stop.
                                backgroundColor: ["rgba(17,19,24,1)", "rgba(29,78,216,0.85)", "rgba(17,19,24,1)"],
                                borderColor: ["rgba(255,255,255,0.15)", "rgba(124,156,255,0.85)", "rgba(124,156,255,0.35)"],
                                boxShadow: ["0 0 0px rgba(29,78,216,0)", "0 0 22px rgba(29,78,216,0.55)", "0 0 0px rgba(29,78,216,0)"],
                              }
                      }
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.85, delay, ease: "easeInOut" }}
                    >
                      {step}
                    </motion.span>
                    {i < journey.length - 1 && <span className="text-accent">&rarr;</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <p className="mt-12 max-w-2xl text-base leading-relaxed text-grey-300">
            Our ambition is to build GraphikosX into India&rsquo;s leading and most respected specialist digital presence
            agency &mdash; and, over time, to compete for a position among the world&rsquo;s leading agencies in the category.
            This is an ambition we are building toward, not a claim of where we stand today.
          </p>
        </Reveal>

        <Reveal delay={0.35}>
          <div className="mt-12 rounded-2xl bg-surface p-8 md:p-10">
            <p className="font-display text-xl font-bold md:text-2xl">
              Revenue builds the company. <span className="text-accent">Reputation builds the legacy.</span>
            </p>
            <p className="mt-4 text-sm leading-relaxed text-grey-300">
              We are not building GraphikosX only for revenue. We are building for the name, the reputation, the position
              and the legacy.
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
