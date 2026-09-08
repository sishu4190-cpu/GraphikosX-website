"use client";

import { ReactLenis } from "lenis/react";
import { useEffect, useState, type ReactNode } from "react";

/**
 * Sitewide smooth-scroll provider (Phase 3, Tier 1 item 1) — mounted once in
 * the root layout, wrapping the whole page.
 *
 * Uses lenis/react's `root` mode, which attaches Lenis directly to the
 * window/document scroll and renders zero wrapper elements — `children` is
 * passed straight through a context provider. That matters here because it
 * means every existing scroll-position-dependent thing keeps working
 * completely unmodified: `Header.tsx`'s own `window.scrollY` listener, every
 * `IntersectionObserver` in `CursorAtmosphere`/`GXHero`/`ScrollActivationTimeline`,
 * and framer-motion's `useInView`/`whileInView`. Lenis smooths the *input*
 * (wheel events on desktop; touch is left untouched — `syncTouch` defaults
 * to false, so this introduces no custom touch-scroll behavior, consistent
 * with the sitewide "no heavy pointer work on touch" rule already followed
 * by `CursorAtmosphere.tsx`), not the scroll position it produces, so
 * anything reading `window.scrollY` or observing intersection still sees
 * the real, final scroll position every frame.
 *
 * `prefers-reduced-motion` is checked once, client-side, inside an effect —
 * the same pattern `GXHero.tsx` and `CursorAtmosphere.tsx` already use:
 * decide after mount rather than during SSR, so the server render and the
 * first client paint match exactly, then flip a boolean that changes
 * behavior only. When reduced motion is on, Lenis is never instantiated —
 * `children` renders completely unwrapped, giving native/instant scroll,
 * rather than instantiating Lenis and then fighting it into a disabled
 * state. Both branches below produce the exact same DOM (root-mode
 * `ReactLenis` never renders a wrapper element to begin with), so flipping
 * this after mount carries none of the hydration-mismatch risk a
 * structural change would normally carry.
 *
 * Phase 2 (GSAP + ScrollTrigger) note: don't add a second scroll-sync
 * system on top of this one. Sync ScrollTrigger to this same Lenis instance
 * from inside whichever component registers scroll-pinned animations, via
 * the `useLenis` hook this package also exports, e.g.:
 *   useLenis(() => ScrollTrigger.update())
 * rather than reaching for a separately-managed singleton.
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [smoothScrollEnabled, setSmoothScrollEnabled] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSmoothScrollEnabled(!prefersReducedMotion);
  }, []);

  if (!smoothScrollEnabled) return <>{children}</>;

  return (
    <ReactLenis root options={{ duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
