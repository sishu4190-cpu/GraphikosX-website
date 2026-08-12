"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { industries } from "@/lib/data/industries";

const SIZE = 620;
const CENTER = SIZE / 2;
const RADIUS = 255;
const HUB_RADIUS = 64; // matches the hub plate's h-32/w-32 (128px diameter)
const NODE_RADIUS = 40; // matches each node button's h-20/w-20 (80px diameter)

function nodePosition(index: number, total: number) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return { x: CENTER + RADIUS * Math.cos(angle), y: CENTER + RADIUS * Math.sin(angle) };
}

/**
 * Connector endpoints computed from real circle geometry (Phase 2H fix): the
 * previous version drew a raw line from the hub's CENTER to each node's
 * CENTER, so the line visibly passed through both circles instead of
 * stopping at their borders. Every node sits on the same ray from CENTER
 * (nodePosition places all ten at exactly RADIUS from CENTER), so trimming
 * both ends is just pulling back along that ray's unit vector by each
 * circle's own radius — the same approach already used correctly by the
 * homepage's IndustriesTeaser.tsx, applied here to the /industries hub's
 * network diagram.
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

export function IndustriesSystem() {
  const [active, setActive] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const activeIndustry = industries[active];
  const diagramRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(diagramRef, { amount: 0.5, once: true });

  const positions = useMemo(() => industries.map((_, i) => nodePosition(i, industries.length)), []);
  const segments = useMemo(() => positions.map((pos) => connectorSegment(pos)), [positions]);

  // Same one-time introduction pattern as the homepage teaser: on first
  // entering the viewport, energy travels from GraphikosX out through every
  // node in sequence, then hands control to the user's hover/focus/click.
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
    }, 600);
    return () => clearInterval(id);
  }, [isInView, userInteracted, shouldReduceMotion]);

  const preview = (index: number) => {
    setUserInteracted(true);
    setActive(index);
  };

  return (
    <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
      <CursorAtmosphere tone="dark" />
      <Container className="relative">
        {/* Desktop: full GraphikosX-centered industry network */}
        <div className="hidden lg:grid lg:grid-cols-[620px_1fr] lg:items-center lg:gap-14">
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
                      strokeWidth={isActive ? 2.5 : 1}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                    {/* Structural mount driven only by `isActive` (identical
                        on server/first client paint) is hydration-safe; the
                        reduced-motion branch inside only changes the motion
                        values, never whether this mounts at all. */}
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

            <div
              className="absolute flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-paper p-4"
              style={{ left: CENTER, top: CENTER }}
            >
              <Image src="/brand/graphikosx-logo.png" alt="GraphikosX" width={100} height={79} className="h-auto w-full" />
            </div>

            {industries.map((industry, i) => {
              const pos = positions[i];
              const isActive = i === active;
              return (
                <Link
                  key={industry.slug}
                  href={`/industries/${industry.slug}`}
                  onMouseEnter={() => preview(i)}
                  onFocus={() => preview(i)}
                  aria-current={isActive ? "true" : undefined}
                  className={`absolute flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border text-center font-display text-[11px] font-bold leading-tight transition-all duration-300 ${
                    isActive ? "border-accent bg-accent/20 scale-110 text-paper gx-step-pulse" : "border-white/15 bg-surface text-grey-400 hover:border-white/40"
                  }`}
                  style={{ left: pos.x, top: pos.y }}
                >
                  {String(i + 1).padStart(2, "0")}
                  <span className="sr-only"> — {industry.name}</span>
                </Link>
              );
            })}
          </div>

          <Reveal key={activeIndustry.slug}>
            <div className="gx-card gx-card--dark rounded-2xl bg-surface p-10">
              <div className="gx-card-content">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">
                  {String(active + 1).padStart(2, "0")} / 10
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold">{activeIndustry.name}</h2>

                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.1em] text-accent">Primary Digital Challenge</p>
                <p className="mt-1 text-sm leading-relaxed text-grey-300">{activeIndustry.challenge}</p>

                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.1em] text-accent">Strategic Opportunity</p>
                <p className="mt-1 text-sm leading-relaxed text-grey-300">{activeIndustry.opportunity}</p>

                <Link
                  href={`/industries/${activeIndustry.slug}`}
                  className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-paper transition-colors hover:bg-accent-soft"
                >
                  Explore Industry <span aria-hidden>&rarr;</span>
                </Link>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Mobile / tablet: accessible vertical list, no hover dependency */}
        <div className="flex flex-col divide-y divide-white/10 lg:hidden">
          {industries.map((industry, i) => (
            <Link key={industry.slug} href={`/industries/${industry.slug}`} className="gx-card gx-card--dark block rounded-none py-6">
              <div className="gx-card-content">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">{String(i + 1).padStart(2, "0")} / 10</p>
                <h2 className="mt-2 font-display text-xl font-bold">{industry.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-grey-300">{industry.challenge}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                  Explore Industry <span aria-hidden>&rarr;</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
