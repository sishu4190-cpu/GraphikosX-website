"use client";

import { useEffect, useRef } from "react";
import type { HeroTouchTarget } from "@/components/three/useHeroTouchControl";

/**
 * Touch-only glow trail for the GX hologram (GXHero.tsx's "lite" and "full"
 * 3D modes) — the touch-drag equivalent of CursorAtmosphere.tsx's
 * mouse-tracked glow. Mounted alongside GXScene.tsx/GXSceneLite.tsx, never
 * alongside the static SVG fallback (GXFallback.tsx) — there's no real 3D
 * geometry being manipulated there for a "the hologram reacted to your
 * touch" trail to respond to. Never mounted on desktop either —
 * CursorAtmosphere.tsx already owns the mouse-glow experience there, and
 * this component's own pointer handling only ever reads from
 * useHeroTouchControl.ts's touch-filtered target ref, so it does nothing on
 * mouse-only devices regardless.
 *
 * Perf, matching CursorAtmosphere.tsx's established discipline:
 *   - No React state for finger position, ever. This reads directly off the
 *     shared ref useHeroTouchControl.ts's own pointer handlers already
 *     update on every touchmove (no second listener here) and writes it to
 *     this element's own CSS custom property, one write per animation frame
 *     at most.
 *   - A soft, low-opacity `radial-gradient`, not a real `filter: blur()`
 *     over a large area — see globals.css's `.gx-touch-glow` rule, the same
 *     technique `.gx-cursor-atmosphere` already uses and for the same
 *     reason (a blur filter over a large area is real per-pixel GPU cost;
 *     a pre-softened gradient costs nothing extra to draw).
 *   - `prefers-reduced-motion` is checked once, client-only, and skips the
 *     whole rAF loop below; a second, render-agnostic `display:none` rule
 *     in globals.css enforces the same thing purely in CSS regardless.
 *   - The loop only ever does a couple of property reads plus an early
 *     return while idle (no drag in progress) — on a phone that never
 *     touches the hologram this is not meaningfully different in cost from
 *     the loop not running at all, and it's already sharing a frame with
 *     the Canvas's own continuous render loop (GXForm's useFrame), so it
 *     adds no new "wake the device up" cost of its own.
 */
export function GXTouchGlow({ targetRef }: { targetRef: React.MutableRefObject<HeroTouchTarget> }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined" || !window.matchMedia) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number | null = null;
    let wasActive = false;

    const tick = () => {
      const current = targetRef.current;
      if (current.active) {
        const rect = el.getBoundingClientRect();
        const x = ((current.clientX - rect.left) / rect.width) * 100;
        const y = ((current.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--gx-touch-glow-x", `${x}%`);
        el.style.setProperty("--gx-touch-glow-y", `${y}%`);
        if (!wasActive) el.classList.add("is-active");
      } else if (wasActive) {
        el.classList.remove("is-active");
      }
      wasActive = current.active;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [targetRef]);

  return <div ref={ref} aria-hidden className="gx-touch-glow" />;
}
