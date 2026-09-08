"use client";

import { useEffect, useRef } from "react";

/**
 * Phase 3, item 2 — context-aware cursor states (default / hover-link /
 * hover-button). Per the plan: this deliberately does NOT hide the native
 * OS cursor sitewide (that's reserved for Tier 2's two pages). Instead this
 * is a small, subtle ring that follows the pointer and changes scale/style
 * depending on what it's hovering, so hover intent reads clearly while the
 * native cursor — and everything it gives you for free (text-selection
 * I-beam, resize cursors, form-field affordances) — stays completely
 * intact everywhere on the site.
 *
 * Mounted exactly once, sitewide, in `layout.tsx` (a genuine singleton,
 * unlike `CursorAtmosphere` which mounts once per section) — hover state
 * is a single global concept, not a per-section one.
 *
 * Two independent, cheap DOM writes, matching the rest of the codebase's
 * scroll/pointer discipline (`CursorAtmosphere.tsx`, `useMagneticHover.ts`):
 *   - `pointermove` (window, rAF-throttled): writes the ring's position via
 *     CSS custom properties. At most one write per animation frame.
 *   - `pointerover` (document, NOT rAF-throttled — it already only fires on
 *     genuine element-boundary crossings, not continuously): a single
 *     delegated listener that reads `event.target.closest(...)` to decide
 *     the hover state, rather than attaching a listener to every
 *     link/button on the page. Writes a `data-cursor-state` attribute on
 *     the ring element itself; every visual per-state difference lives in
 *     `globals.css`, keyed off that attribute.
 *
 * Gated exactly like `CursorAtmosphere`: `prefers-reduced-motion` and
 * `pointer: coarse` (touch) both skip attaching any listener at all — the
 * ring's own markup always renders (no hydration-mismatch risk), and
 * `globals.css` hides it outright under those same two conditions as a
 * second, render-agnostic guarantee.
 */
export function CursorState() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined" || !window.matchMedia) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    let rafId: number | null = null;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      if (rafId !== null) return; // one write queued per frame, extra moves are dropped
      rafId = requestAnimationFrame(() => {
        rafId = null;
        el.style.setProperty("--gx-ring-x", `${event.clientX}px`);
        el.style.setProperty("--gx-ring-y", `${event.clientY}px`);
      });
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      // `data-cursor="button"` is the explicit marker `Button.tsx` sets on
      // every rendered anchor/button (which is also every magnetic-hover
      // element, since they're the same component). Anything else that's
      // still a plain `<a>` reads as a link; everything else is "default".
      const isButton = target.closest('[data-cursor="button"]');
      const isLink = !isButton && target.closest("a");
      el.dataset.cursorState = isButton ? "button" : isLink ? "link" : "default";
    };

    // Also show the ring only once the pointer has actually moved (avoids
    // it appearing pinned at 0,0 before the first real move on page load).
    const onFirstMove = () => {
      el.classList.add("is-active");
      window.removeEventListener("pointermove", onFirstMove);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointermove", onFirstMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    // Pointer leaving the whole viewport (e.g. to the browser chrome) —
    // hide the ring rather than leaving it stuck at the last position.
    const onPointerLeaveDoc = () => el.classList.remove("is-active");
    document.addEventListener("pointerleave", onPointerLeaveDoc);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointermove", onFirstMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerleave", onPointerLeaveDoc);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ref} aria-hidden className="gx-cursor-ring" data-cursor-state="default" />;
}
