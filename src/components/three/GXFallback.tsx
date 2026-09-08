"use client";

import { useEffect, useRef } from "react";

/**
 * Branded 2.5D fallback for the GX hero — used when WebGL is unavailable,
 * the device is low-power, the viewport is small, or the user prefers
 * reduced motion. Renders the exact same traced silhouette as the 3D scene
 * (GXScene.tsx) — the ring and blade points below come from the same
 * source-of-truth extraction against the official logo PNG, just kept in
 * their original pixel-space coordinates (viewBox matches the source
 * canvas) instead of the 3D scene's normalized/centered units. Layered SVG
 * with a lightweight pointer-parallax effect instead of a Three.js canvas.
 *
 * The ring is a `<path>`, not a `<polygon>`, using the same arc-based path
 * data as `IntroSequence.tsx`'s `RING_PATH` — two true circular arcs (SVG
 * `A` commands) for the ring's curved inner/outer edges, joined by two
 * straight cut faces at the G's terminus, fit from the same 26 traced
 * points as `GXScene.tsx`'s `RING_ARC` uses for the 3D hero. See that file's
 * doc comment for the full derivation (why a plain spline through the
 * traced points still didn't read as a *true* circle, and how the arcs were
 * fit). The X blades stay `<polygon>`s — they're genuinely straight-sided
 * in the source logo.
 */
export function GXFallback() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const layersRef = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let raf = 0;
    let tx = 0;
    let ty = 0;

    const onMove = (e: PointerEvent) => {
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();
      tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const animate = () => {
      layersRef.current.forEach((layer, i) => {
        if (!layer) return;
        const depth = (i + 1) * 3.2;
        layer.style.transform = `translate(${tx * depth}px, ${ty * depth}px)`;
      });
      raf = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", onMove);
    raf = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Phase 6 (hero atmosphere) note: the 3D hero gained a soft
          liquid-noise glow + drifting particle field behind the mark
          (GXScene.tsx). This fallback stays pure CSS on purpose — never a
          WebGL fallback for a WebGL fallback — but a single extra, slower,
          differently-positioned radial layer keeps it from reading as
          comparatively flat now that the 3D version has more depth behind
          it. Purely decorative (aria-hidden), respects the sitewide
          prefers-reduced-motion rule in globals.css exactly like the
          existing `.gx-hero-glow` this sits alongside. */}
      <div aria-hidden className="gx-hero-glow-secondary" />
      <svg viewBox="0 0 941 932" className="h-[72%] w-[72%] max-w-lg" aria-hidden>
        <defs>
          <linearGradient id="gxRimLine" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0" />
            <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.95" />
          </linearGradient>
          <filter id="gxSoftShadow" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#000000" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* G ring — smooth traced outline (see file doc comment), deepest
            parallax layer */}
        <g ref={(el) => { layersRef.current[0] = el; }} filter="url(#gxSoftShadow)">
          <path
            d="M 341.73,626.68 L 388.55,572.31 A 152.07 152.07 0 1 1 518.60,318.80 L 595.86,319.31 A 215.30 215.30 0 1 0 341.73,626.68 Z"
            fill="#0a0a0c"
            stroke="url(#gxRimLine)"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>

        {/* X blades — traced outlines, mid layer */}
        <g ref={(el) => { layersRef.current[1] = el; }} filter="url(#gxSoftShadow)">
          <polygon points="793,221 423,664 343,664 724,221" fill="#0a0a0c" stroke="url(#gxRimLine)" strokeWidth="1.5" />
          <polygon points="369,386 413,441 481,442 669,664 746,663 519,387" fill="#0a0a0c" stroke="url(#gxRimLine)" strokeWidth="1.5" />
        </g>

        {/* Rim-light glow accent, top layer for parallax depth */}
        <g ref={(el) => { layersRef.current[2] = el; }} opacity="0.5">
          <circle cx="260" cy="600" r="90" fill="#1D4ED8" opacity="0.12" />
        </g>
      </svg>
    </div>
  );
}
