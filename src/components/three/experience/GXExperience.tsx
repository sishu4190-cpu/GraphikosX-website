"use client";

import { useEffect, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { GXFallback } from "@/components/three/GXFallback";
import { GXTouchGlow } from "@/components/three/GXTouchGlow";
import { useHeroTouchControl } from "@/components/three/useHeroTouchControl";
import { GXCanvas } from "@/components/three/experience/GXCanvas";
import { useChapterVisibility } from "@/components/three/experience/ScrollDirector";
import { CHAPTER_IDS } from "@/components/three/experience/types";
import type { AnchorState, PointerTarget } from "@/components/three/experience/types";

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

const DESKTOP_ANCHOR_ID = "gx-hero-anchor-desktop";
const MOBILE_ANCHOR_ID = "gx-hero-anchor-mobile";

/**
 * The persistent GX 3D experience's entry point — still mounted exactly
 * where Phase 2 put it, as the last child of Hero.tsx's own `<section>`
 * (see that file). This component owns:
 *
 *  - The capability gate (full/lite/static), decided once for the whole
 *    experience instead of twice — the exact same four-signal check
 *    GXHero.tsx used (prefers-reduced-motion / deviceMemory / WebGL support
 *    / small screen), just no longer duplicated per layout.
 *  - One shared pointer/touch interaction state (Hero's drag-to-rotate
 *    mark is still the only interactive scene; Journey/Problem/Ecosystem
 *    are ambient backdrops with no interaction of their own).
 *  - Anchor tracking: a small rAF loop that finds whichever of Hero.tsx's
 *    two anchor divs (#gx-hero-anchor-desktop / #gx-hero-anchor-mobile) is
 *    currently laid out (exactly one is, via the same Tailwind
 *    `hidden lg:block` / `lg:hidden` split Hero.tsx always used), and uses
 *    its on-screen rect both to position the DOM hit-region/touch-glow/
 *    fallback overlay below and to feed HeroScene/HeroSceneLite (via
 *    `anchorStateRef`) where the 3D mark should render — see types.ts's
 *    AnchorState doc for the derivation. Unaffected by the Phase 3 change
 *    below: `wrapperRef`'s own rect is now always the full viewport rather
 *    than Hero's (scrolling) box, and the tracking formula already worked
 *    purely in terms of each anchor's live `getBoundingClientRect()`
 *    relative to `wrapperRef`, so it continues to place the mark correctly
 *    as Hero scrolls.
 *  - Wiring GXCanvas's scene selection to ScrollDirector's
 *    `useChapterVisibility(CHAPTER_IDS)` — Phase 3's multi-chapter version
 *    of Phase 2's single-section `useSectionVisibility`. `activeChapter` is
 *    `null` during the gap sections between chapters, which is what pauses
 *    and fades the canvas per the "fade out between chapters" decision.
 *
 * Phase 3: `wrapperRef` (and therefore GXCanvas, which fills it) changed
 * from `absolute inset-0` (scoped to Hero's own box) to `fixed inset-0`
 * (the whole viewport) — the canvas now needs to stay visible behind
 * Journey/Problem/Ecosystem too, not just Hero, as the visitor scrolls
 * past Hero into later chapters. Deliberately NOT moved out of Hero.tsx to
 * a page-level mount point, even though it now paints beyond Hero's own
 * box: a `position: fixed` element still establishes its stacking context
 * at the point it sits in the DOCUMENT (inside Hero, near the end of
 * Hero's own children), not at some new location — so this stays
 * correctly layered ON TOP of Hero's own background/content (exactly as
 * Phase 2 already had it — Hero's background needs no change) while also
 * painting BEHIND every section that comes after Hero in the document
 * (CustomerJourney, CostOfWaiting, DigitalPresenceProblem, ...,
 * Ecosystem), since they're all later siblings. What DOES need each of
 * those later sections' own cooperation is that Journey/Problem/
 * Ecosystem's own background can no longer be fully opaque, or it would
 * hide the canvas within its own box regardless of paint order — see the
 * CHANGELOG's Phase 3 entry for exactly which three sections' backgrounds
 * were loosened and why (Hero's is untouched; the gap sections in between
 * are untouched too, since the canvas is paused/invisible there anyway).
 */
export function GXExperience() {
  const [mode, setMode] = useState<"pending" | "full" | "lite" | "static">("pending");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackedBoxRef = useRef<HTMLDivElement>(null);
  const anchorStateRef = useRef<AnchorState>({ nx: 0, ny: 0, widthPx: 0, heightPx: 0, visible: false });
  const pointerRef = useRef<PointerTarget>({ x: 0, y: 0, active: false });
  const isFinePointer = useRef(false);
  const { target: touchTarget, handlers: touchHandlers } = useHeroTouchControl();
  const activeChapter = useChapterVisibility(CHAPTER_IDS);

  // One-time client-only capability check — see GXHero.tsx's retired
  // version of this same effect for the original reasoning (matchMedia/
  // WebGL/deviceMemory are unavailable during SSR, and rendering nothing
  // but the fallback-ish "pending" state first avoids a hydration
  // mismatch).
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowMemory = "deviceMemory" in navigator && (navigator as unknown as { deviceMemory: number }).deviceMemory < 4;
    const smallScreen = window.innerWidth < 640;

    let next: "full" | "lite" | "static";
    if (prefersReducedMotion || lowMemory || !supportsWebGL()) {
      next = "static";
    } else if (smallScreen) {
      next = "lite";
    } else {
      next = "full";
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(next);
  }, []);

  // Anchor tracking (see file header). Runs regardless of `mode` — cheap (a
  // couple of getBoundingClientRect() calls and, when something changed, a
  // few style writes) — so the hit-region/fallback overlay stays correctly
  // positioned even while `mode` is still "pending" right after mount.
  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const wrapper = wrapperRef.current;
      const desktopRect = document.getElementById(DESKTOP_ANCHOR_ID)?.getBoundingClientRect();
      const mobileRect = document.getElementById(MOBILE_ANCHOR_ID)?.getBoundingClientRect();
      const activeRect =
        desktopRect && desktopRect.width > 0 ? desktopRect : mobileRect && mobileRect.width > 0 ? mobileRect : null;

      if (wrapper && activeRect) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const left = activeRect.left - wrapperRect.left;
        const top = activeRect.top - wrapperRect.top;

        anchorStateRef.current = {
          nx: wrapperRect.width > 0 ? ((left + activeRect.width / 2) / wrapperRect.width) * 2 - 1 : 0,
          ny: wrapperRect.height > 0 ? -(((top + activeRect.height / 2) / wrapperRect.height) * 2 - 1) : 0,
          widthPx: activeRect.width,
          heightPx: activeRect.height,
          visible: true,
        };

        if (trackedBoxRef.current) {
          trackedBoxRef.current.style.left = `${left}px`;
          trackedBoxRef.current.style.top = `${top}px`;
          trackedBoxRef.current.style.width = `${activeRect.width}px`;
          trackedBoxRef.current.style.height = `${activeRect.height}px`;
        }
      } else {
        anchorStateRef.current.visible = false;
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const resolvePointerCapability = () => {
    if (typeof window !== "undefined" && window.matchMedia) {
      isFinePointer.current = window.matchMedia("(pointer: fine)").matches;
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return; // touch/pen: idle rotation only, per spec
    resolvePointerCapability();
    if (!isFinePointer.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointerRef.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    pointerRef.current.active = true;
  };

  const handlePointerLeave = () => {
    pointerRef.current.active = false;
  };

  return (
    <div ref={wrapperRef} className="pointer-events-none fixed inset-0">
      {(mode === "full" || mode === "lite") && (
        <GXCanvas
          mode={mode}
          activeChapter={activeChapter}
          anchorStateRef={anchorStateRef}
          pointerRef={pointerRef}
          touchRef={touchTarget}
        />
      )}

      {/* Positioned every frame (see the effect above) to match whichever
          of Hero.tsx's two anchor divs is currently laid out — hosts either
          the interactive hit-region + touch-glow trail (full/lite) or the
          static SVG fallback (static/pending), exactly the box the old
          per-layout GXHero instance used to fill on its own. */}
      <div ref={trackedBoxRef} className="absolute">
        {(mode === "static" || mode === "pending") && <GXFallback />}

        {(mode === "full" || mode === "lite") && (
          <>
            <GXTouchGlow targetRef={touchTarget} />
            {/* Invisible, precisely-scoped hit area for the mouse/touch
                interaction — see GXScene.tsx's retired version of this same
                div for the full reasoning (data-gx-cursor="drag" is read by
                GXCursor.tsx via delegated pointerover; touchAction: "none"
                is scoped to only this small region so dragging the
                hologram rotates it without breaking page scroll anywhere
                else). */}
            <div
              aria-hidden
              data-gx-cursor="drag"
              className="absolute top-1/2 left-1/2 h-[60%] w-[60%] max-h-[380px] max-w-[380px] -translate-x-1/2 -translate-y-1/2"
              style={{ pointerEvents: "auto", touchAction: "none" }}
              onPointerDown={touchHandlers.onPointerDown}
              onPointerMove={(event) => {
                handlePointerMove(event);
                touchHandlers.onPointerMove(event);
              }}
              onPointerUp={touchHandlers.onPointerEnd}
              onPointerCancel={touchHandlers.onPointerEnd}
              onPointerLeave={handlePointerLeave}
            />
          </>
        )}
      </div>
    </div>
  );
}
