"use client";

import { useEffect, useRef } from "react";

/**
 * Phase 3, item 1 — magnetic pull hook, applied to `Button.tsx` (which also
 * covers every "nav CTA" in the codebase, since `Header.tsx`'s CTAs already
 * render the shared `Button` component rather than a bespoke one).
 *
 * Same performance discipline as `CursorAtmosphere.tsx`:
 *   - No React state, ever. The pull is a direct `element.style.transform`
 *     write, at most once per animation frame.
 *   - One `window`-level `pointermove` listener per mounted instance — the
 *     same pattern `CursorAtmosphere` already uses N times per page (one
 *     per section), not a new architecture. Each listener does a cheap
 *     bounding-box distance check and bails out immediately for every
 *     button the pointer isn't near.
 *   - Desktop only: gated by `matchMedia("(pointer: fine)")`, checked once
 *     on mount. Touch/coarse-pointer devices never attach the listener —
 *     there is no hover to be magnetic about, and no per-frame tracking
 *     cost on mobile.
 *   - `prefers-reduced-motion` is checked once, client-only, and skips
 *     attaching the listener entirely (matching `CursorAtmosphere`'s "don't
 *     do the work" approach rather than doing it and hiding the result).
 *
 * "Padded hit-area" (per the plan): the pull starts slightly before the
 * cursor actually reaches the element's own box, not only once it's
 * literally hovered — `MAGNETIC_PADDING` extends the tracked zone a little
 * past the element's real edges in every direction. The element's actual
 * clickable/focusable area is completely unchanged; this only widens where
 * the *visual* pull begins.
 */
const MAGNETIC_PADDING = 24;
const MAGNETIC_STRENGTH = 0.3;

export function useMagneticHover<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined" || !window.matchMedia) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let rafId: number | null = null;
    let isPulled = false;

    const clearTransform = () => {
      el.style.transform = "";
      isPulled = false;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (el instanceof HTMLButtonElement && el.disabled) return;

      const rect = el.getBoundingClientRect();
      const withinX = event.clientX >= rect.left - MAGNETIC_PADDING && event.clientX <= rect.right + MAGNETIC_PADDING;
      const withinY = event.clientY >= rect.top - MAGNETIC_PADDING && event.clientY <= rect.bottom + MAGNETIC_PADDING;

      if (!withinX || !withinY) {
        if (isPulled && rafId === null) {
          rafId = requestAnimationFrame(() => {
            rafId = null;
            clearTransform();
          });
        }
        return;
      }

      isPulled = true;
      if (rafId !== null) return; // one write queued per frame, extra moves are dropped
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = (event.clientX - centerX) * MAGNETIC_STRENGTH;
        const dy = (event.clientY - centerY) * MAGNETIC_STRENGTH;
        el.style.transform = `translate(${dx}px, ${dy}px)`;
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
      clearTransform();
    };
  }, []);

  return ref;
}
