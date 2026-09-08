"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { useLenis } from "lenis/react";
import { ScrollTrigger, registerGsapScrollTrigger } from "@/lib/gsap";
import type { TimelineStep } from "./ScrollActivationTimeline";

const LINE_X1 = 40;
const LINE_X2 = 960;
const LINE_LENGTH = LINE_X2 - LINE_X1;

const ACTIVE_CLASSES = ["scale-110", "bg-[var(--gx-blue)]"];
const INACTIVE_CLASS = "bg-ink";

/**
 * GSAP ScrollTrigger pilot (Phase 3, Tier 1 item 2) — a scroll-*scrubbed*
 * sibling of `ScrollActivationTimeline.tsx`, used ONLY by `CustomerJourney`
 * (the homepage's SEARCH/CHECK/COMPARE/TRUST/DECIDE section) for now.
 *
 * Deliberately a fork, not an edit to the shared original: `HowWeWork.tsx`
 * still uses `ScrollActivationTimeline` and its time-based reveal,
 * untouched, until this scroll-scrubbed version has been tested and
 * approved to roll out further. Same visual markup and Tailwind classes as
 * the original (so the two are visually indistinguishable at rest) — only
 * the activation mechanism differs:
 *   - Original: a single IntersectionObserver crossing (isInView) triggers
 *     a fixed-time staggered reveal (steps light up 200ms apart, once).
 *   - This version: activation is a direct, continuous function of scroll
 *     position within the section via GSAP ScrollTrigger's `scrub` mode —
 *     scroll down and a step lights up at the matching point; scroll back
 *     up and it un-lights at that same point. No pin — the page keeps
 *     scrolling normally the whole time (confirmed with the user: pinning
 *     was deliberately not chosen for this section, to avoid scroll-jacking
 *     on a lead-gen homepage and the extra mobile Safari risk it carries).
 *
 * Performance discipline matches the rest of the codebase's scroll/pointer
 * work (CursorAtmosphere.tsx, GlowCard.tsx): no React state is set on
 * scroll. ScrollTrigger's `onUpdate` writes directly to the DOM (line
 * `stroke-dashoffset`, each circle's classList) via refs, and only touches
 * a circle's classList when its active/inactive state actually changes,
 * not on every tick.
 *
 * `prefers-reduced-motion` skips GSAP/ScrollTrigger entirely and renders
 * the fully-active end state immediately — the same behavior
 * `ScrollActivationTimeline` already gives reduced-motion users, so
 * switching between the two components is invisible to them. This
 * component is only ever reached through a `next/dynamic(..., { ssr: false
 * })` import (see `CustomerJourney.tsx`), so unlike `GXHero.tsx` there is
 * no server-rendered version of it to keep in sync — the reduced-motion
 * check can run synchronously on first client render with no
 * hydration-mismatch risk.
 */
export function ScrollScrubTimeline({ steps, className = "" }: { steps: TimelineStep[]; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const circleRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mobileCircleRefs = useRef<(HTMLSpanElement | null)[]>([]);
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
      // Match ScrollActivationTimeline's reduced-motion behavior exactly:
      // show the fully-active end state immediately, no animation, no
      // ScrollTrigger instance created at all.
      circleRefs.current.forEach((el) => setCircleActive(el, true));
      mobileCircleRefs.current.forEach((el) => setCircleActive(el, true));
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
        mobileCircleRefs.current.forEach((el, i) => setCircleActive(el, i < activeCount));
      },
    });

    return () => {
      trigger.kill();
    };
  }, [shouldReduceMotion, steps.length]);

  // Phase 1 (Lenis) mounted a `lenis` instance sitewide via `lenis/react`'s
  // `root` mode; ScrollTrigger listens for native `scroll` events by
  // default, which Lenis's root mode does genuinely dispatch (it moves the
  // real window scroll position, it doesn't fake it), so this mostly works
  // without any glue. Explicitly forwarding Lenis's own scroll tick to
  // `ScrollTrigger.update()` (the integration GSAP's and Lenis's own docs
  // recommend) removes any last frame-timing gap between the two, without
  // requiring `SmoothScrollProvider.tsx` (a sitewide, Tier-1 file) to know
  // GSAP exists — `useLenis` is already part of the shared bundle since
  // Phase 1, so this adds zero weight outside this already-GSAP-using,
  // dynamically-imported component.
  useLenis(() => {
    if (!shouldReduceMotion) ScrollTrigger.update();
  });

  return (
    <div ref={containerRef} className={className}>
      {/* Desktop / tablet: horizontal line drawn exactly through circle centers */}
      <div className="relative hidden sm:block">
        <svg viewBox="0 0 1000 48" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-12 w-full" aria-hidden>
          <line x1={LINE_X1} y1={24} x2={LINE_X2} y2={24} stroke="rgba(0,0,0,0.08)" strokeWidth={2} />
          <line
            ref={lineRef}
            x1={LINE_X1}
            y1={24}
            x2={LINE_X2}
            y2={24}
            stroke="var(--gx-blue)"
            strokeWidth={2}
            strokeDasharray={LINE_LENGTH}
            strokeDashoffset={LINE_LENGTH}
          />
        </svg>

        <div className="relative grid gap-6" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((step, i) => (
            <div key={step.id} className="flex flex-col items-center gap-3 text-center">
              <span
                ref={(el) => {
                  circleRefs.current[i] = el;
                }}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-paper ring-4 ring-grey-100 transition-all duration-500"
              >
                {step.number}
              </span>
              <p className="font-display text-sm font-bold uppercase tracking-wide text-ink">{step.label}</p>
              {step.detail && <p className="text-xs text-grey-700">{step.detail}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: vertical fallback, connector rail on the left */}
      <div className="relative flex flex-col gap-8 sm:hidden">
        <span className="absolute top-6 bottom-6 left-6 w-px bg-ink/10" aria-hidden />
        {steps.map((step, i) => (
          <div key={step.id} className="relative flex items-start gap-4">
            <span
              ref={(el) => {
                mobileCircleRefs.current[i] = el;
              }}
              className="z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink font-display text-sm font-bold text-paper ring-4 ring-grey-100 transition-all duration-500"
            >
              {step.number}
            </span>
            <div className="pt-2.5">
              <p className="font-display text-sm font-bold uppercase tracking-wide text-ink">{step.label}</p>
              {step.detail && <p className="mt-1 text-xs text-grey-700">{step.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
