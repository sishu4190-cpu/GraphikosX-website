"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { GXFallback } from "@/components/three/GXFallback";

const GXScene = dynamic(() => import("@/components/three/GXScene"), { ssr: false, loading: () => null });

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

export function GXHero() {
  const [mode, setMode] = useState<"pending" | "3d" | "static">("pending");

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowMemory = "deviceMemory" in navigator && (navigator as unknown as { deviceMemory: number }).deviceMemory < 4;
    const smallScreen = window.innerWidth < 640;

    // One-time client-only capability check (matchMedia / WebGL / deviceMemory are
    // unavailable during SSR, so this genuinely can't be computed at render time).
    // We intentionally render the branded fallback first and swap after mount so the
    // server and first client paint match exactly, avoiding a hydration mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMode(prefersReducedMotion || lowMemory || !supportsWebGL() || smallScreen ? "static" : "3d");
  }, []);

  return (
    <div className="relative h-full w-full">
      {/* Extremely subtle blue atmospheric glow behind the mark — creates
          depth against the white background without reading as a neon
          effect. Pure CSS (radial-gradient + a slow compositor-friendly
          transform drift), not a `filter: blur()` over a large area, so it
          costs nothing on the main thread. Shared by both the 3D canvas and
          the static/reduced-motion fallback below, and frozen by the global
          prefers-reduced-motion rule in globals.css. */}
      <div aria-hidden className="gx-hero-glow" />
      {mode === "3d" && <GXScene />}
      {(mode === "static" || mode === "pending") && <GXFallback />}
    </div>
  );
}
