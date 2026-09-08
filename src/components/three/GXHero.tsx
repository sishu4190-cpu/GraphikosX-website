"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { GXFallback } from "@/components/three/GXFallback";

const GXScene = dynamic(() => import("@/components/three/GXScene"), { ssr: false, loading: () => null });
const GXSceneLite = dynamic(() => import("@/components/three/GXSceneLite"), { ssr: false, loading: () => null });

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

// Hero.tsx mounts <GXHero> TWICE — a >=lg side-by-side copy and a <lg
// full-width copy beneath the text, toggled purely with responsive CSS
// (Tailwind's `hidden lg:block` / `lg:hidden`) so exactly one is ever
// visually on screen. React has no idea about that CSS split, though:
// without telling each instance which breakpoint range it's actually FOR,
// both independently run the same capability check off the same
// `window.innerWidth`/`matchMedia` and would reach the identical
// conclusion — including on a phone, where both would now decide "lite"
// and both would mount a full WebGL canvas, one of them sitting inside a
// `display: none` ancestor. That invisible canvas still costs real GPU/CPU
// time — a `display: none` element doesn't paint, but the render loop
// driving it (react-three-fiber's `useFrame`, backed by
// `requestAnimationFrame`) is a window-level clock, not gated by any one
// element's visibility, so it silently doubles the true per-frame cost on
// exactly the devices this "lite" tier exists to protect (this was also
// already true of the pre-existing "full" GXScene at 640-1023px widths,
// found and fixed as a side effect of this same check).
//
// `layout` tells each instance which side of the `lg` breakpoint it's
// meant to be visible at; only the instance that's actually on-screen for
// the current viewport ever mounts a canvas (or even the static fallback)
// — the other renders nothing beyond the cheap decorative glow div.
type Layout = "lg-up" | "below-lg";

export function GXHero({ layout }: { layout: Layout }) {
  const [mode, setMode] = useState<"pending" | "full" | "lite" | "static">("pending");
  const [isActiveLayout, setIsActiveLayout] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowMemory = "deviceMemory" in navigator && (navigator as unknown as { deviceMemory: number }).deviceMemory < 4;
    const smallScreen = window.innerWidth < 640;

    // One-time client-only capability check (matchMedia / WebGL / deviceMemory are
    // unavailable during SSR, so this genuinely can't be computed at render time).
    // We intentionally render nothing but the glow first and swap in the real
    // content after mount so the server and first client paint match exactly,
    // avoiding a hydration mismatch.
    //
    // Reduced-motion, low-memory and no-WebGL devices still fall all the way
    // back to the static SVG — unchanged from before, and deliberately so:
    // those are exactly the signals that real 3D (even the trimmed "lite"
    // scene) isn't a good idea on that device, and forcing it anyway is the
    // opposite of what was asked for. Small-screen phones that pass all
    // three of those checks now get GXSceneLite (real, simplified 3D with
    // touch-drag) instead of dropping straight to static — tablets and
    // desktop (>=640px) are completely unaffected and keep the exact same
    // full GXScene they already had.
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

    // Matches Tailwind's default `lg` breakpoint (1024px) — the same
    // threshold Hero.tsx's `hidden lg:block` / `lg:hidden` classes use to
    // decide which of the two <GXHero> mounts is actually shown. Tracked
    // with its own matchMedia listener (not just read once) so resizing
    // across the breakpoint — a foldable, or a desktop window being
    // resized — correctly swaps which instance is "live" instead of
    // leaving a stale one animating off-screen.
    const query = window.matchMedia("(min-width: 1024px)");
    const updateActiveLayout = () => {
      setIsActiveLayout(layout === "lg-up" ? query.matches : !query.matches);
    };
    updateActiveLayout();
    query.addEventListener("change", updateActiveLayout);
    return () => query.removeEventListener("change", updateActiveLayout);
  }, [layout]);

  return (
    <div className="relative h-full w-full">
      {/* Extremely subtle blue atmospheric glow behind the mark — creates
          depth against the white background without reading as a neon
          effect. Pure CSS (radial-gradient + a slow compositor-friendly
          transform drift), not a `filter: blur()` over a large area, so it
          costs nothing on the main thread. Kept unconditional (rendered by
          both instances regardless of `isActiveLayout`) since it's a
          static, non-animating-per-frame CSS layer — negligible cost even
          on the currently-hidden instance, not worth the same gating as
          the canvas/fallback below. Frozen either way by the global
          prefers-reduced-motion rule in globals.css. */}
      <div aria-hidden className="gx-hero-glow" />
      {isActiveLayout && mode === "full" && <GXScene />}
      {isActiveLayout && mode === "lite" && <GXSceneLite />}
      {isActiveLayout && (mode === "static" || mode === "pending") && <GXFallback />}
    </div>
  );
}
