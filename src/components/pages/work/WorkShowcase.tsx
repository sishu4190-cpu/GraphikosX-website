"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";

const WorkScene = dynamic(() => import("@/components/pages/work/WorkScene"), { ssr: false, loading: () => null });

// Same WebGL-capability check as GXHero.tsx (Phase 6/7's homepage hero) —
// deliberately duplicated locally rather than extracted into a shared hook.
// GXHero.tsx is already-shipped, approved code from an earlier phase; this
// project's own convention throughout has been to touch only what a given
// phase actually needs, so a small, self-contained duplicate here is safer
// than reopening that file for a refactor this phase doesn't require.
function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

/**
 * Phase 8 — capability-gated wrapper around the WebGL showcase grid
 * (WorkScene.tsx). Unlike GXHero.tsx, there is no dedicated static-fallback
 * component here: WorkCaseStudy.tsx (rendered unconditionally by
 * app/work/page.tsx, right after this component) already carries the full,
 * real content — real images, real text, real DOM anchors — regardless of
 * whether this WebGL layer renders at all. So the gate here is simpler:
 * capable devices get the extra visual layer on top; everyone else just
 * gets the real content one section down, with nothing missing. Defaults to
 * `false` for both the server render and the first client render (so there
 * is no hydration mismatch to reconcile — "don't show the enhancement yet"
 * is a valid rendered state on its own, not a placeholder needing a swap).
 *
 * `aria-hidden` on the whole section: this grid is a decorative, hover-
 * driven visual on top of content that already exists in full below it, so
 * assistive tech skips straight to the real thing rather than announcing a
 * redundant, WebGL-only "canvas" element.
 */
export function WorkShowcase() {
  const [show3d, setShow3d] = useState(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lowMemory = "deviceMemory" in navigator && (navigator as unknown as { deviceMemory: number }).deviceMemory < 4;
    // Higher threshold than GXHero's 640px: three side-by-side tiles need
    // real width to read as a grid rather than three cramped slivers.
    const narrowViewport = window.innerWidth < 768;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow3d(!prefersReducedMotion && !lowMemory && !narrowViewport && supportsWebGL());
  }, []);

  if (!show3d) return null;

  return (
    // `data-gx-cursor="play"` is Phase 9's full-custom-cursor state hook
    // (GXCursor.tsx, mounted in app/work/page.tsx) — read via delegated
    // `pointerover`, so this is a plain data attribute with no behavior of
    // its own, same pattern as GXScene.tsx's `data-gx-cursor="drag"`.
    <section aria-hidden data-gx-cursor="play" className="relative overflow-hidden bg-paper pb-6 pt-2">
      <Container>
        <WorkScene />
        <p className="mt-5 text-center text-xs uppercase tracking-[0.15em] text-grey-500">
          Hover to explore &middot; click a tile to read the case study
        </p>
      </Container>
    </section>
  );
}
