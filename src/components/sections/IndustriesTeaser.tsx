"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { industries } from "@/lib/data/industries";

const SIZE = 560;
const CENTER = SIZE / 2;
const ORBIT_RADIUS = 225;
const HUB_RADIUS = 64; // matches the hub button's h-32/w-32 (128px diameter)
const NODE_RADIUS = 32; // matches each node button's h-16/w-16 (64px diameter)

function nodePosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    x: CENTER + ORBIT_RADIUS * Math.cos(angle),
    y: CENTER + ORBIT_RADIUS * Math.sin(angle),
  };
}

/**
 * Connector endpoints computed from real circle geometry: the line starts at
 * the hub's edge and ends at the node's edge (never at either center), so it
 * visually stops exactly at both circle borders instead of passing through
 * them. Both circles sit on the same ray from CENTER (nodePosition places
 * every node at exactly ORBIT_RADIUS from CENTER), so trimming both ends is
 * just pulling back along that ray's unit vector by each circle's radius.
 */
function connectorSegment(pos: { x: number; y: number }) {
  const dx = pos.x - CENTER;
  const dy = pos.y - CENTER;
  const dist = Math.hypot(dx, dy) || 1;
  const ux = dx / dist;
  const uy = dy / dist;
  return {
    x1: CENTER + ux * HUB_RADIUS,
    y1: CENTER + uy * HUB_RADIUS,
    x2: CENTER + ux * (dist - NODE_RADIUS),
    y2: CENTER + uy * (dist - NODE_RADIUS),
  };
}

export function IndustriesTeaser() {
  const [active, setActive] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const activeIndustry = industries[active];
  const diagramRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(diagramRef, { amount: 0.5, once: true });

  const positions = useMemo(() => industries.map((_, i) => nodePosition(i, industries.length)), []);
  const segments = useMemo(() => positions.map((pos) => connectorSegment(pos)), [positions]);

  // One-time, scroll-triggered introduction: on first entering the viewport,
  // the energy visibly travels from GraphikosX out through EVERY industry
  // node in sequence (not all ten at once), so the GraphikosX -> industry
  // expertise relationship reads clearly before the user ever hovers
  // anything. Cancels itself the moment the user takes manual control
  // (hover/focus/click), and never plays under prefers-reduced-motion.
  useEffect(() => {
    if (!isInView || userInteracted || shouldReduceMotion) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      if (i >= industries.length) {
        clearInterval(id);
        return;
      }
      setActive(i);
    }, 650);
    return () => clearInterval(id);
  }, [isInView, userInteracted, shouldReduceMotion]);

  const takeControl = (index: number) => {
    setUserInteracted(true);
    setActive(index);
  };

  return (
    <section className="bg-ink py-24 text-paper md:py-32">
      <Container>
        <SectionHeader
          animate
          tone="dark"
          eyebrow="Specialized by Choice"
          title="10 industries. One standard of excellence."
          description="Different industries have different customers, buying cycles and challenges. Their strategy shouldn't look the same either."
        />

        {/* Desktop: a real industry system — GraphikosX at the center, connected to each industry */}
        <div className="mt-16 hidden lg:grid lg:grid-cols-[560px_1fr] lg:items-center lg:gap-12">
          <div ref={diagramRef} className="relative mx-auto" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} className="absolute inset-0" aria-hidden>
              {segments.map((seg, i) => {
                const isActive = i === active;
                return (
                  <g key={i}>
                    <line
                      x1={seg.x1}
                      y1={seg.y1}
                      x2={seg.x2}
                      y2={seg.y2}
                      stroke={isActive ? "#1D4ED8" : "rgba(255,255,255,0.12)"}
                      strokeWidth={isActive ? 2 : 1}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    {/* Always mounted when `isActive` (never additionally
                        gated on `!shouldReduceMotion`) — `isActive` only
                        depends on `active`/`i`, which are identical on the
                        server and the client's first paint, so branching
                        structure on it alone is safe. Branching on
                        `shouldReduceMotion` too would not be: that value
                        legitimately differs between the server render and a
                        client whose OS/browser has reduced-motion enabled,
                        so a structural mount/unmount driven by it reads as
                        mismatched hydration content. Reduced motion instead
                        collapses this to a static, non-animating dot. */}
                    {isActive && (
                      <motion.circle
                        r={3.5}
                        fill="#7c9cff"
                        initial={false}
                        animate={
                          shouldReduceMotion
                            ? { cx: seg.x2, cy: seg.y2, opacity: 0 }
                            : { cx: [seg.x1, seg.x2], cy: [seg.y1, seg.y2], opacity: [0, 1, 1, 0] }
                        }
                        transition={{
                          duration: shouldReduceMotion ? 0 : 1.1,
                          repeat: shouldReduceMotion ? 0 : Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                  </g>
                );
              })}
            </svg>

            <button
              onClick={() => takeControl(0)}
              className="absolute flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent text-center font-display text-[13px] font-bold tracking-tight whitespace-nowrap"
              style={{ left: CENTER, top: CENTER }}
            >
              GRAPHIKOSX
            </button>

            {industries.map((industry, i) => {
              const pos = positions[i];
              const isActive = i === active;
              return (
                <button
                  key={industry.slug}
                  onMouseEnter={() => takeControl(i)}
                  onFocus={() => takeControl(i)}
                  onClick={() => takeControl(i)}
                  aria-pressed={isActive}
                  className={`absolute flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border text-center font-display text-[11px] font-bold leading-tight transition-all duration-300 ${
                    isActive
                      ? "border-accent bg-accent/20 scale-110 text-paper gx-step-pulse"
                      : "border-white/15 bg-surface text-grey-400 hover:border-white/40"
                  }`}
                  style={{ left: pos.x, top: pos.y }}
                >
                  <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
                  <span className="sr-only">{industry.name}</span>
                </button>
              );
            })}
          </div>

          <div className="relative min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndustry.slug}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -12 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl bg-surface p-8"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">
                  {String(active + 1).padStart(2, "0")} / 10
                </p>
                <h3 className="mt-3 font-display text-2xl font-bold">{activeIndustry.name}</h3>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.1em] text-accent">Key Challenge</p>
                <p className="mt-1 text-sm leading-relaxed text-grey-300">{activeIndustry.challenge}</p>
                <p className="mt-4 text-sm font-semibold uppercase tracking-[0.1em] text-accent">Strategic Opportunity</p>
                <p className="mt-1 text-sm leading-relaxed text-grey-300">{activeIndustry.opportunity}</p>
                <Link href={`/industries/${activeIndustry.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-paper hover:text-accent">
                  Explore Industry <span aria-hidden>&rarr;</span>
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile / tablet: clean, accessible vertical list — no forced orbital UI */}
        <div className="mt-16 flex flex-col divide-y divide-white/10 lg:hidden">
          {industries.map((industry, i) => (
            <Link key={industry.slug} href={`/industries/${industry.slug}`} className="flex items-center justify-between py-4">
              <span className="text-sm font-medium text-grey-300">
                {String(i + 1).padStart(2, "0")} &middot; {industry.shortLabel}
              </span>
              <span className="text-accent" aria-hidden>&rarr;</span>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Button href="/industries" variant="secondary" className="!border-white/20 !text-paper hover:!border-accent hover:!text-accent">
            View All Industries
          </Button>
        </div>
      </Container>
    </section>
  );
}
