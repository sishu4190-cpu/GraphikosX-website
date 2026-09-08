"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Phase 5 — first-load intro (logo build-in), revised per Prakash's
 * feedback after the first delivery: (1) the ring's silhouette now uses a
 *真 smooth curve instead of the straight-line polygon approximation this
 * component originally reused from `GXFallback.tsx` — see the `RING_PATH`
 * constant below; (2) a 1→100 loading counter + progress bar, bottom-left,
 * styled after the reference preloader; (3) once the counter reaches 100,
 * the mark zooms up dramatically while the whole curtain fades out, as the
 * reveal transition, replacing the original plain opacity fade.
 *
 * Homepage only: this component is imported and rendered exactly once, in
 * `app/page.tsx`, never in `layout.tsx` — so there's no route check to get
 * wrong, it structurally cannot render on `/industries/healthcare` or any
 * other deep link, per the plan's explicit requirement that a user landing
 * directly on an inner page from Google shouldn't sit through a
 * homepage-branded intro.
 *
 * WHY THE RING IS A <path> NOW, NOT A <polygon>, AND WHY IT'S BUILT FROM SVG
 * ARCS (round 2 of this fix): the ring data is 26 points traced directly
 * from the logo PNG's silhouette. A `<polygon>` can only connect points with
 * straight lines, which is what first read as faceted. The first fix
 * splined a curve through those points — rounder, but Prakash's follow-up
 * feedback was that it still didn't read as a *true* circular arc the way
 * the reference logo's does, because a spline through traced points carries
 * whatever small noise is in the tracing itself as visible not-quite-
 * constant curvature. `GXScene.tsx`'s `RING_ARC` fixes this the same way for
 * the 3D hero — by least-squares-fitting an actual circle through each of
 * the ring's two curved runs (points 9-21 and 22-8, the two runs between the
 * G-terminus's flat "cut" corners at indices 8/9 and 21/22) rather than
 * curving through the raw points — and `RING_PATH` below is that same fit,
 * in this component's own pixel-space coordinates, expressed as native SVG
 * arc commands (`A rx ry 0 large-arc-flag sweep-flag x y`) instead of
 * Beziers, since SVG can draw a true circle directly. The four corner points
 * are snapped onto their circle (moved by under a pixel) so the straight cut
 * edges meet the arcs with zero kink. Same source data, same corner
 * indices, same shape — the curved parts are just mathematically perfect
 * circles now. The X blades stay straight-sided `<polygon>`s — they're
 * genuinely straight in the source logo, `GXScene.tsx` doesn't curve its
 * blade geometry either.
 *
 * THE HARD PART THIS COMPONENT SOLVES (unchanged from the original):
 * deciding "show or don't show" has to happen *before the browser's first
 * paint*, or one of two bad things happens — a first-time visitor sees the
 * real hero flash on screen for a frame before the intro slams down over
 * it, or (worse) a repeat visitor sees the intro curtain flash on screen
 * for a frame before JS removes it. `useEffect` always runs *after* paint,
 * so it can't make this decision in time. A plain synchronous inline
 * `<script>` — the same `dangerouslySetInnerHTML` mechanism every
 * `page.tsx` in this codebase already uses for its JSON-LD block — can: as
 * a classic (non-async, non-deferred) script, the browser executes it
 * immediately upon parsing it and blocks on it before parsing anything
 * after it. Since this component is rendered as the very first thing in
 * the homepage's JSX (see `page.tsx`), the script below runs, and either
 * adds or doesn't add a class to `<html>`, before the Hero section a few
 * lines later even exists in the DOM. All the CSS keys off that one class
 * (`.gx-intro-pending`); this component's own React output is always
 * identical between server and client, so none of this carries any
 * hydration-mismatch risk.
 *
 * The script decides not to show the intro when: the pathname isn't "/"
 * (defensive — should already be unreachable given where this component is
 * mounted, but costs nothing to also check directly); the visitor prefers
 * reduced motion; or `sessionStorage` already has the "shown" flag for this
 * session — `sessionStorage`, not `localStorage`, so it replays the next
 * time the browser itself is reopened but never again on internal
 * navigation back to "/" within one visit, and it's written the moment the
 * script decides to show the intro (not after it finishes), so closing the
 * tab mid-animation still counts as "shown."
 *
 * SEQUENCING: the ring/blade draw-on and fill-in stay pure CSS (triggered
 * purely by the `.gx-intro-pending` class, no JS involved, exactly as
 * before) — nothing about *how they look* needed to change. What's new is
 * JS-driven: a `requestAnimationFrame` loop writes the counter text and
 * progress-bar scale directly to their DOM nodes via refs (the same
 * "no React state for a value that changes every frame" discipline
 * `CursorAtmosphere`/`CursorState`/`GlowCard` already use, for the same
 * reason — a `setState` on every tick would mean ~100 re-renders across
 * ~1.6s for a value nothing else in the tree reads). The one thing that
 * *does* need to be React state is `revealing`: the moment the counter
 * hits 100, this flips once, adding `.gx-intro-revealing`, whose CSS (see
 * globals.css) starts the zoom-and-fade reveal with *no* animation-delay —
 * because JS just decided the exact right moment to start it, a fixed CSS
 * delay (which is how the original curtain-fade timed itself) would drift
 * out of sync with wherever the counter's own `requestAnimationFrame` loop
 * actually finished.
 */
const RING_PATH =
  "M 341.73,626.68 L 388.55,572.31 " +
  "A 152.07 152.07 0 1 1 518.60,318.80 " +
  "L 595.86,319.31 " +
  "A 215.30 215.30 0 1 0 341.73,626.68 Z";

/** Exact arc length of `RING_PATH` — drives the stroke-draw-on's
 * dasharray/dashoffset. Computed exactly (two straight segments + two
 * circular-arc lengths, `radius × angle`), not sampled, since both curved
 * runs are now true circular arcs. */
const RING_PATH_LENGTH = 1578;

const COUNTER_DURATION_MS = 1600;

export function IntroSequence() {
  const [revealing, setRevealing] = useState(false);
  const [done, setDone] = useState(false);
  const counterNumberRef = useRef<HTMLSpanElement | null>(null);
  const counterBarRef = useRef<HTMLDivElement | null>(null);

  // Drives the 1 -> 100 counter + progress bar via direct DOM writes (see
  // the class doc comment above for why this isn't setState-per-frame),
  // then flips `revealing` exactly once when it reaches 100.
  useEffect(() => {
    if (!document.documentElement.classList.contains("gx-intro-pending")) return;
    let rafId: number;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min(1, elapsed / COUNTER_DURATION_MS);
      const value = Math.max(1, Math.round(pct * 100));
      if (counterNumberRef.current) counterNumberRef.current.textContent = String(value).padStart(3, "0");
      if (counterBarRef.current) counterBarRef.current.style.transform = `scaleX(${value / 100})`;
      if (pct < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setRevealing(true);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Teardown: once the reveal's curtain-fade keyframe finishes, unmount
  // the whole overlay rather than leaving a full-viewport zero-opacity
  // node sitting in the DOM.
  useEffect(() => {
    const el = document.getElementById("gx-intro");
    if (!el) return;
    const onAnimationEnd = (event: AnimationEvent) => {
      if (event.animationName === "gx-intro-curtain-out") setDone(true);
    };
    el.addEventListener("animationend", onAnimationEnd);
    return () => el.removeEventListener("animationend", onAnimationEnd);
  }, []);

  if (done) return null;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-sync-scripts */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{
            if (location.pathname !== "/") return;
            if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            if (sessionStorage.getItem("gx-intro-shown")) return;
            sessionStorage.setItem("gx-intro-shown", "1");
            document.documentElement.classList.add("gx-intro-pending");
          } catch (e) {}})();`,
        }}
      />
      <div id="gx-intro" className={`gx-intro${revealing ? " gx-intro-revealing" : ""}`} aria-hidden="true">
        <svg viewBox="0 0 941 932" className="gx-intro-mark">
          <path className="gx-intro-ring-stroke" d={RING_PATH} fill="none" stroke="#0a0a0c" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round" style={{ strokeDasharray: RING_PATH_LENGTH, strokeDashoffset: RING_PATH_LENGTH }} />
          <path className="gx-intro-ring-fill" d={RING_PATH} fill="#0a0a0c" />
          <polygon
            className="gx-intro-blade gx-intro-blade-1"
            points="793,221 423,664 343,664 724,221"
            fill="none"
            stroke="#0a0a0c"
            strokeWidth="6"
          />
          <polygon
            className="gx-intro-blade gx-intro-blade-2"
            points="369,386 413,441 481,442 669,664 746,663 519,387"
            fill="none"
            stroke="#0a0a0c"
            strokeWidth="6"
          />
          <polygon
            className="gx-intro-blade-fill gx-intro-blade-fill-1"
            points="793,221 423,664 343,664 724,221"
            fill="#0a0a0c"
          />
          <polygon
            className="gx-intro-blade-fill gx-intro-blade-fill-2"
            points="369,386 413,441 481,442 669,664 746,663 519,387"
            fill="#0a0a0c"
          />
        </svg>
        <div className="gx-intro-counter">
          <span ref={counterNumberRef} className="gx-intro-counter-number">
            001
          </span>
          <div className="gx-intro-counter-bar">
            <div ref={counterBarRef} className="gx-intro-counter-bar-fill" />
          </div>
        </div>
      </div>
    </>
  );
}
