"use client";

import { useEffect, useRef } from "react";

type Tone = "light" | "dark";

/**
 * Global cursor-reactive atmosphere (Phase 2G refinement, spec item 5; Phase
 * 2H spec item 36 extended its usage to every major page — Industries,
 * Services, About, Contact — with no per-page forks of this component): a
 * large, extremely diffused GraphikosX-blue glow that follows the pointer
 * on desktop, and a slow, static-feeling atmospheric drift on touch/mobile
 * — not a visible "flashlight", just a subtle sense that the surface is
 * reacting to the user.
 *
 * Perf/architecture, per spec item 20 (and Phase 2H's restated performance
 * requirements):
 *   - No React state for pointer position, ever. Position is written
 *     directly to a CSS custom property on this element's own DOM node
 *     (`--gx-cursor-x`/`--gx-cursor-y`), exactly the same rAF-throttled
 *     direct-DOM-write pattern `GlowCard.tsx` already uses for its per-card
 *     glow — one write per animation frame at most, never a React re-render.
 *   - One `pointermove` listener per mounted instance, but it's a cheap
 *     early-return no-op unless this section is both (a) currently
 *     intersecting the viewport (IntersectionObserver gates it — no work is
 *     done for the eleven other sections the user isn't near) and (b) the
 *     device actually has a fine pointer.
 *   - Touch/coarse-pointer devices never get the pointermove listener at
 *     all — no heavy per-frame tracking on mobile. Instead, `globals.css`
 *     switches this same element to a static/slow-drifting CSS-only
 *     gradient below the `lg` breakpoint (a plain `background-position`
 *     keyframe animation, no JS driving it). The one thing this component
 *     still does for that path is reuse the *same* IntersectionObserver to
 *     toggle an `is-in-view` class, which pauses that CSS animation
 *     (`animation-play-state`) for sections currently off-screen — one
 *     shared observer, one shared architecture, for both the desktop and
 *     mobile paths, rather than a second bespoke system.
 *   - `prefers-reduced-motion` is checked once, client-only, inside the
 *     effect, and short-circuits all of the above (no observer, no
 *     listener) — this only skips *work*, it never changes what gets
 *     rendered, so it carries none of the hydration-mismatch risk a
 *     structural `if (reduced) return null` would; see
 *     AnimatedText.tsx/Vision.tsx for the prior instance of that exact bug
 *     and why it's avoided here too. The element itself is always rendered
 *     identically on server and client; `prefers-reduced-motion` is
 *     additionally enforced in pure CSS (globals.css) as a second,
 *     render-agnostic guarantee (the layer is hidden outright).
 */
export function CursorAtmosphere({ tone = "light" }: { tone?: Tone }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof window === "undefined" || !window.matchMedia) return;
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    let inView = false;
    let rafId: number | null = null;

    // Shared across both paths: gates the desktop pointer-tracked glow
    // (via the `inView` closure var below) and pauses the mobile static
    // drift's CSS animation (via the `is-in-view` class) for off-screen
    // sections, so neither path does work the user can't see.
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      el.classList.toggle("is-in-view", entry.isIntersecting);
    });
    io.observe(el);

    if (!isFinePointer) {
      // Touch/coarse-pointer: no pointer tracking at all. CSS drives a
      // static/slow gradient instead (see globals.css); nothing else to do.
      return () => io.disconnect();
    }

    const onPointerMove = (event: PointerEvent) => {
      if (!inView || event.pointerType !== "mouse") return;
      if (rafId !== null) return; // one write queued per frame, extra moves are dropped
      rafId = requestAnimationFrame(() => {
        rafId = null;
        const rect = el.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 100;
        const y = ((event.clientY - rect.top) / rect.height) * 100;
        el.style.setProperty("--gx-cursor-x", `${x}%`);
        el.style.setProperty("--gx-cursor-y", `${y}%`);
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return <div ref={ref} aria-hidden className={`gx-cursor-atmosphere ${tone === "dark" ? "gx-cursor-atmosphere--dark" : ""}`} />;
}
