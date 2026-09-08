"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { ScrollTrigger, registerGsapScrollTrigger } from "@/lib/gsap";

const LINE_X1 = 40;
const LINE_X2 = 960;
const LINE_LENGTH = LINE_X2 - LINE_X1;

const ACTIVE_CLASSES = ["scale-110", "bg-[var(--gx-blue)]"];
const INACTIVE_CLASS = "bg-ink";

/**
 * Phase 2b — the same scroll-scrub treatment approved for CustomerJourney
 * (Phase 2 pilot) and HowWeWork, adapted for `BuyerJourney.tsx` (used
 * identically on all 10 industry detail pages, so this one file change
 * rolls out to all 10 at once).
 *
 * A fork, not a shared component with `ScrollScrubTimeline.tsx` — the data
 * shape differs (`detail.buyerJourney` is a plain `string[]`, not the
 * `{id, number, label, detail}` objects the homepage/HowWeWork steps use)
 * and so does the original layout: BuyerJourney used one responsive grid
 * (row on mobile, column on desktop) rather than ScrollScrubTimeline's two
 * separate desktop/mobile blocks. That original layout is kept exactly as
 * it was — only the activation mechanism changes:
 *   - Original (`BuyerJourney.tsx` before this change): a single
 *     `whileInView` (Framer Motion, `once: true`) staggered fade/slide-in
 *     the first time the section scrolled into view — the SVG connector
 *     path drew in via `pathLength`, all 5 steps stayed visible afterward.
 *   - This version: the connector line's `stroke-dashoffset` and each
 *     step's "reached" highlight are both a direct, continuous function of
 *     scroll position via GSAP ScrollTrigger's `scrub` mode — scroll down
 *     and a step highlights at the matching point; scroll back up and it
 *     un-highlights at that same point. No pin, matching the pilot's
 *     confirmed decision.
 *
 * Note this does add one new visual state that the original didn't have:
 * steps now render in a default (not-yet-reached) numbered-circle state
 * before you scroll into them, matching `ScrollScrubTimeline`'s established
 * look, rather than being invisible-then-revealed-once. Same reasoning as
 * the Phase 2 pilot for why this is a deliberate, approved part of "the
 * same scroll-scrub treatment" rather than a side effect.
 *
 * Performance discipline and reduced-motion behavior match
 * `ScrollScrubTimeline.tsx` exactly: no React state set on scroll, DOM
 * writes via refs only when a step's active state actually changes, and
 * `prefers-reduced-motion` skips GSAP entirely and shows the fully-active
 * end state immediately. Only ever reached through a
 * `next/dynamic(..., { ssr: false })` import (see `BuyerJourneyScrubHost.tsx`),
 * so the reduced-motion check can run synchronously on first client render
 * with no hydration-mismatch risk.
 */
export function BuyerJourneyScrub({ steps, className = "" }: { steps: string[]; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const shouldReduceMotion = useReducedMotion();

  const setCircleActive = (el: HTMLSpanElement | null, active: boolean) => {
    if (!el) return;
    if (active) {
      el.classList.remove(INACTIVE_CLASS);
      el.classList.add(...ACTIVE_CLASSES);
    } else {
      el.classList.remove(...ACTIVE_CLASSES);
      el.classList.add(INACTIVE_CLASS);
    }
  };

  useEffect(() => {
    if (shouldReduceMotion) {
      circleRefs.current.forEach((el) => setCircleActive(el, true));
      lineRef.current?.setAttribute("stroke-dashoffset", "0");
      return;
    }

    if (!containerRef.current) return;
    registerGsapScrollTrigger();

    let lastActiveCount = -1;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top 80%",
      end: "bottom 40%",
      scrub: 0.4,
      onUpdate: (self) => {
        const progress = self.progress;
        lineRef.current?.setAttribute("stroke-dashoffset", String(LINE_LENGTH * (1 - progress)));

        const activeCount = Math.round(progress * steps.length);
        if (activeCount === lastActiveCount) return;
        lastActiveCount = activeCount;
        circleRefs.current.forEach((el, i) => setCircleActive(el, i < activeCount));
      },
    });

    return () => {
      trigger.kill();
    };
  }, [shouldReduceMotion, steps.length]);

  // See ScrollScrubTimeline.tsx for the full explanation of this forwarding
  // call — keeps ScrollTrigger's scrub in lockstep with Lenis's own scroll
  // tick without requiring SmoothScrollProvider.tsx to know GSAP exists.
  useLenis(() => {
    if (!shouldReduceMotion) ScrollTrigger.update();
  });

  return (
    <div ref={containerRef} className={className}>
      <div className="relative">
        {/* Alignment fix: the line must sit through the exact vertical
            center of the h-11 (44px) numbered circles below. Rather than
            eyeballing a `top-*` offset against the SVG's implicit
            (auto/aspect-ratio-derived) height, the SVG is given the same
            explicit height as the circles (`h-11`) and positioned flush
            with the row's own top (`top-0`, matching the grid's own top —
            there's no padding above the circles). With that height fixed,
            a line at viewBox y=20 of 40 sits at exactly 50% — the true
            center of the 44px circles — for any rendered width. Same
            technique already used correctly by ScrollScrubTimeline.tsx
            (h-12 circles, viewBox 0 0 1000 48, line y=24). */}
        <svg viewBox="0 0 1000 40" className="absolute inset-x-0 top-0 hidden h-11 w-full sm:block" preserveAspectRatio="none" aria-hidden>
          <line x1={LINE_X1} y1={20} x2={LINE_X2} y2={20} stroke="rgba(0,0,0,0.08)" strokeWidth={2} />
          <line
            ref={lineRef}
            x1={LINE_X1}
            y1={20}
            x2={LINE_X2}
            y2={20}
            stroke="var(--gx-blue)"
            strokeWidth={2}
            strokeDasharray={LINE_LENGTH}
            strokeDashoffset={LINE_LENGTH}
          />
        </svg>

        <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-5">
          {steps.map((step, i) => (
            <div key={step} className="flex flex-row items-center gap-3 sm:flex-col sm:items-center sm:text-center">
              <span
                ref={(el) => {
                  circleRefs.current[i] = el;
                }}
                className="font-numeric flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-paper ring-4 ring-grey-100 transition-all duration-500"
              >
                {i + 1}
              </span>
              <p className="font-display text-sm font-bold text-ink">{step}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
