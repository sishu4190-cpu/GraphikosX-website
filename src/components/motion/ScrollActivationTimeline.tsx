"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

export interface TimelineStep {
  id: string;
  number: string;
  label: string;
  detail?: string;
}

const STEP_STAGGER_MS = 200;
const LINE_X1 = 40;
const LINE_X2 = 960;
const LINE_LENGTH = LINE_X2 - LINE_X1;

/**
 * Shared "research/process timeline" primitive — used by both the Customer
 * Research Timeline (SEARCH/CHECK/COMPARE/TRUST/DECIDE) and the Process
 * timeline (Discover/Audit/Strategize/Execute/Optimize) so the two sections
 * share one implementation instead of two near-duplicate ones.
 *
 * Fixes the original vertical-centering bug: the connector line is drawn in
 * an <svg> given an EXPLICIT height (h-12, 48px — matching the h-12 circles)
 * with the line at internal y=24, i.e. exactly the circle's own vertical
 * center. The old implementation relied on the SVG's intrinsic
 * viewBox-derived aspect-ratio height (no explicit height class), which
 * rendered a different actual height than the 40px viewBox implied and threw
 * the line off-center under the circles.
 *
 * Activation model: steps light up sequentially (01 -> 05) once when the
 * timeline scrolls into view (crossing 50% visibility — a single boolean
 * crossing, not a per-pixel scroll listener, so it does not restart on every
 * 2px of scroll) and reset when the section scrolls back out, so re-entering
 * replays the sequence. prefers-reduced-motion shows the fully-active end
 * state immediately, no animation.
 */
export function ScrollActivationTimeline({ steps, className = "" }: { steps: TimelineStep[]; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { amount: 0.5 });
  const shouldReduceMotion = useReducedMotion();
  const [activeCount, setActiveCount] = useState(0);

  useEffect(() => {
    // activeCount is intentionally derived from isInView (an external
    // IntersectionObserver-backed value from framer-motion, not from React
    // state/props), so re-deriving it synchronously here — rather than via a
    // subscription callback — is the correct pattern; see the identical,
    // already-reviewed precedent in GXHero.tsx's capability check.
    if (!isInView) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCount(0);
      return;
    }
    if (shouldReduceMotion) {
      setActiveCount(steps.length);
      return;
    }
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 1; i <= steps.length; i++) {
      timers.push(setTimeout(() => setActiveCount(i), i * STEP_STAGGER_MS));
    }
    return () => timers.forEach(clearTimeout);
  }, [isInView, shouldReduceMotion, steps.length]);

  const progress = steps.length > 1 ? Math.max(0, activeCount - 1) / (steps.length - 1) : activeCount > 0 ? 1 : 0;

  return (
    <div ref={containerRef} className={className}>
      {/* Desktop / tablet: horizontal line drawn exactly through circle centers */}
      <div className="relative hidden sm:block">
        <svg viewBox="0 0 1000 48" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 top-0 h-12 w-full" aria-hidden>
          <line x1={LINE_X1} y1={24} x2={LINE_X2} y2={24} stroke="rgba(0,0,0,0.08)" strokeWidth={2} />
          <line
            x1={LINE_X1}
            y1={24}
            x2={LINE_X2}
            y2={24}
            stroke="var(--gx-blue)"
            strokeWidth={2}
            strokeDasharray={LINE_LENGTH}
            strokeDashoffset={LINE_LENGTH * (1 - progress)}
            style={{ transition: shouldReduceMotion ? "none" : "stroke-dashoffset 0.5s cubic-bezier(0.22,1,0.36,1)" }}
          />
        </svg>

        <div className="relative grid gap-6" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }}>
          {steps.map((step, i) => {
            const isActive = i < activeCount;
            return (
              <div key={step.id} className="flex flex-col items-center gap-3 text-center">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-full font-display text-sm font-bold text-paper ring-4 ring-grey-100 transition-all duration-500 ${
                    isActive ? "scale-110 bg-[var(--gx-blue)] gx-step-pulse" : "bg-ink"
                  }`}
                >
                  {step.number}
                </span>
                <p className="font-display text-sm font-bold uppercase tracking-wide text-ink">{step.label}</p>
                {step.detail && <p className="text-xs text-grey-700">{step.detail}</p>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile: vertical fallback, connector rail on the left */}
      <div className="relative flex flex-col gap-8 sm:hidden">
        <span className="absolute top-6 bottom-6 left-6 w-px bg-ink/10" aria-hidden />
        {steps.map((step, i) => {
          const isActive = i < activeCount;
          return (
            <div key={step.id} className="relative flex items-start gap-4">
              <span
                className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold text-paper ring-4 ring-grey-100 transition-all duration-500 ${
                  isActive ? "scale-110 bg-[var(--gx-blue)] gx-step-pulse" : "bg-ink"
                }`}
              >
                {step.number}
              </span>
              <div className="pt-2.5">
                <p className="font-display text-sm font-bold uppercase tracking-wide text-ink">{step.label}</p>
                {step.detail && <p className="mt-1 text-xs text-grey-700">{step.detail}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
