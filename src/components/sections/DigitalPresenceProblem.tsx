"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GlowCard } from "@/components/motion/GlowCard";
import { HubConnectors } from "@/components/motion/HubConnectors";
import { ShineText } from "@/components/motion/AnimatedText";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";

const problems = ["Fragmented Branding", "Low Visibility", "Weak Authority", "Inconsistent Content", "Poor Conversion", "Disconnected Systems"];

// Deterministic pseudo-random scatter offsets so the "fragmented" starting
// state is consistent between server and client render (no hydration drift).
const scatter = [
  { x: -26, y: -14, r: -9 },
  { x: 22, y: 10, r: 7 },
  { x: -14, y: 18, r: 5 },
  { x: 18, y: -20, r: -6 },
  { x: -22, y: 6, r: 10 },
  { x: 16, y: -8, r: -5 },
];

// Mirrors HubConnectors' own per-line stagger/draw timing (i * 0.1s delay +
// ~0.55s draw), so each card's arrival pulse lands exactly when its energy
// line visually reaches it, not on an unrelated timer.
const CONNECT_STAGGER_MS = 140;
const CONNECT_ARRIVAL_MS = 480;

export function DigitalPresenceProblem() {
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [connecting, setConnecting] = useState(false);
  const [connectedIdx, setConnectedIdx] = useState<Set<number>>(new Set());

  useEffect(() => {
    // connectedIdx is entirely derived from `connecting` (itself driven by
    // hover/focus/click on the hub) and a fixed timing table, not from any
    // value React already owns — the same already-reviewed pattern as
    // GXHero.tsx's capability check and ScrollActivationTimeline's activation
    // sequence.
    if (!connecting) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setConnectedIdx(new Set());
      return;
    }
    if (shouldReduceMotion) {
      setConnectedIdx(new Set(problems.map((_, i) => i)));
      return;
    }
    const timers = problems.map((_, i) =>
      setTimeout(() => setConnectedIdx((prev) => new Set(prev).add(i)), i * CONNECT_STAGGER_MS + CONNECT_ARRIVAL_MS)
    );
    return () => timers.forEach(clearTimeout);
  }, [connecting, shouldReduceMotion]);

  return (
    <section className="relative overflow-hidden bg-paper py-24 md:py-32">
      <div aria-hidden className="gx-bg-light-haze" />
      <CursorAtmosphere tone="light" />
      <Container className="relative z-10">
        <SectionHeader
          animate
          eyebrow="The Real Problem"
          title="Most businesses don't have a marketing problem. They have a digital presence problem."
        />

        <div ref={containerRef} className="relative mt-16">
          <HubConnectors containerRef={containerRef} hubRef={hubRef} targetRefs={cardRefs} active={connecting} />

          <div className="relative grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {problems.map((problem, i) => {
              const s = scatter[i];
              return (
                <motion.div
                  key={problem}
                  initial={{
                    opacity: 0,
                    x: shouldReduceMotion ? 0 : s.x,
                    y: shouldReduceMotion ? 0 : s.y,
                    rotate: shouldReduceMotion ? 0 : s.r,
                  }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: shouldReduceMotion ? 0 : 0.7, delay: shouldReduceMotion ? 0 : i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                >
                  <GlowCard
                    tone="light"
                    focusable
                    elementRef={(el) => {
                      cardRefs.current[i] = el;
                    }}
                    className={`flex h-24 items-center rounded-xl border border-ink/10 bg-grey-100 px-6 transition-colors duration-300 hover:border-accent/40 hover:bg-white ${
                      connectedIdx.has(i) ? "gx-hub-connected" : ""
                    }`}
                  >
                    <p className="font-display text-base font-semibold text-ink">{problem}</p>
                  </GlowCard>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: shouldReduceMotion ? 1 : 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : 0.55 }}
            className="relative mt-10"
          >
            <GlowCard
              tone="dark"
              focusable
              elementRef={(el) => {
                hubRef.current = el as HTMLDivElement | null;
              }}
              onMouseEnter={() => setConnecting(true)}
              onMouseLeave={() => setConnecting(false)}
              onFocus={() => setConnecting(true)}
              onBlur={() => setConnecting(false)}
              onClick={() => setConnecting((v) => !v)}
              className="flex items-center justify-center rounded-xl bg-ink py-10 text-center"
            >
              <p className="font-display text-2xl font-bold text-paper md:text-3xl">
                GraphikosX connects <ShineText delay={0.4}>the pieces.</ShineText>
              </p>
            </GlowCard>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
