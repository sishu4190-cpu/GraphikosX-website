"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Phase 9 — full custom-cursor replacement, reserved for Tier 2's two pages
 * (`/` and `/work`). Unlike `CursorState.tsx` (Phase 3's sitewide, lighter
 * hover ring, which deliberately keeps the native OS cursor visible), this
 * component:
 *
 *   - hides the native cursor outright (`cursor: none` on <body>, toggled
 *     by this component itself for exactly as long as it's mounted) and
 *     draws its own dot + state pill in its place.
 *   - is mounted directly inside `app/page.tsx` and `app/work/page.tsx`'s
 *     own component trees — NOT sitewide in `layout.tsx`. Route-scoping is
 *     therefore guaranteed structurally by React's component tree, not by a
 *     runtime `usePathname()` check: this component simply does not exist
 *     in the tree on any other route, whether you arrive by a hard
 *     navigation or by `PageTransition.tsx`'s client-side `AnimatePresence`
 *     swap (both destroy and recreate the whole page tree, this component
 *     included, so cleanup below always runs and `cursor: none` is always
 *     reverted before any other route's tree mounts).
 *   - exposes three states using the plan's own vocabulary via the
 *     `data-gx-cursor-state` attribute: "view" (default, everywhere), "drag"
 *     (the homepage hero's pointer-tilt hit area — see the matching
 *     `data-gx-cursor="drag"` on GXScene.tsx's hit-area div) and "play" (the
 *     /work WebGL grid — see `data-gx-cursor="play"` on WorkShowcase.tsx's
 *     section). The on-screen *label* for those two states deliberately
 *     does not say "DRAG" or "PLAY": nothing on this site is actually
 *     click-and-drag (the hero mark responds to continuous pointer
 *     position, not a drag gesture) or media playback (the /work tiles
 *     scroll to real content on click, nothing plays). "Orbit" and
 *     "Explore" describe what a visitor can actually do, while the
 *     attribute values underneath stay exactly what the plan named.
 *
 * Capability gate mirrors GXHero.tsx's own "pending" pattern: matchMedia is
 * unavailable during SSR, so the first client render must match the server
 * (nothing). A dedicated `active` state — resolved once, client-only, in the
 * first effect below — means touch and `prefers-reduced-motion` visitors
 * get a genuine non-mount (this component returns null, no DOM node, no
 * `cursor: none` ever applied) rather than an invisible-but-present one.
 * `prefers-reduced-motion` visitors keep seeing the plain native cursor,
 * exactly as the plan requires ("still shows a cursor — native is
 * acceptable — rather than nothing").
 *
 * Coexistence with CursorState.tsx: rather than reopening that already-
 * shipped Phase 3 file, this component toggles one class — `gx-cursor-
 * active` — on <body> while mounted, and a single new rule in `globals.css`
 * hides `.gx-cursor-ring` for as long as that class is present. Two cursor
 * systems, one small, explicit coordination point, zero edits to
 * CursorState.tsx.
 *
 * Position tracking deliberately differs from CursorState.tsx's discipline
 * (which writes position only once per genuine `pointermove`, no continuous
 * loop). This is the flagship, fully-custom cursor for the site's two most
 * produced pages with the native cursor gone entirely, so a light, always-
 * running rAF lerp toward the last known pointer position gives it a
 * trailing, physical feel rather than a rigid 1:1 reskin. The loop only
 * ever runs on these two capability-gated, fine-pointer-desktop pages.
 */
export function GXCursor() {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Resolve capability once, client-only, after mount — never during SSR or
  // the first client render, so there's no hydration mismatch to reconcile.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(finePointer && !reducedMotion);
  }, []);

  useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;

    document.body.classList.add("gx-cursor-active");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    let rafId = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!el.classList.contains("is-active")) el.classList.add("is-active");
    };

    const onPointerOver = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const t = event.target;
      if (!(t instanceof Element)) return;
      const zone = t.closest("[data-gx-cursor]");
      const state = zone?.getAttribute("data-gx-cursor");
      el.dataset.gxCursorState = state === "drag" || state === "play" ? state : "view";
    };

    // Pointer leaving the whole viewport — hide rather than leaving the
    // cursor stuck at its last position, same as CursorState.tsx.
    const onPointerLeaveDoc = () => el.classList.remove("is-active");

    const tick = () => {
      // Critically-damped-feeling lerp (fixed factor is fine here — this
      // runs every animation frame regardless of refresh rate, unlike
      // GXScene's delta-scaled damping which only runs inside r3f's own
      // frame loop).
      current.x += (target.x - current.x) * 0.22;
      current.y += (target.y - current.y) * 0.22;
      el.style.setProperty("--gx-cursor-x", `${current.x}px`);
      el.style.setProperty("--gx-cursor-y", `${current.y}px`);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerover", onPointerOver, { passive: true });
    document.addEventListener("pointerleave", onPointerLeaveDoc);

    return () => {
      document.body.classList.remove("gx-cursor-active");
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerleave", onPointerLeaveDoc);
      cancelAnimationFrame(rafId);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div ref={ref} aria-hidden className="gx-cursor" data-gx-cursor-state="view">
      <span className="gx-cursor-dot" />
      <span className="gx-cursor-pill">
        <svg className="gx-cursor-icon gx-cursor-icon-drag" viewBox="0 0 24 24" fill="none">
          <path d="M12 4a8 8 0 1 0 8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 1.5 15 4l-3 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="gx-cursor-word gx-cursor-word-drag">Orbit</span>
        <svg className="gx-cursor-icon gx-cursor-icon-play" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 3H3v6M15 3h6v6M9 21H3v-6M15 21h6v-6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="gx-cursor-word gx-cursor-word-play">Explore</span>
      </span>
    </div>
  );
}
