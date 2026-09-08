"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Shared GSAP + ScrollTrigger registration point (Phase 3, Tier 1 item 2).
 *
 * Every component that uses ScrollTrigger should import `gsap`/`ScrollTrigger`
 * from here (not directly from the `gsap` package) and call
 * `registerGsapScrollTrigger()` once before creating any ScrollTrigger
 * instance, rather than each component calling `gsap.registerPlugin()`
 * itself — `registerPlugin` is idempotent so duplicate calls aren't
 * *unsafe*, but centralizing it means there's exactly one place that knows
 * which GSAP plugins this project uses.
 *
 * This module (and everything that imports it) must only ever be reached
 * through a component loaded via `next/dynamic(..., { ssr: false })` —
 * matching the existing `GXHero.tsx` -> `GXScene.tsx` pattern for
 * `@react-three/fiber`. That guarantees this code, and GSAP/ScrollTrigger
 * themselves, are never included in a page's server-rendered payload and
 * never evaluated during SSR, and — just as importantly for Tier 1's "must
 * not increase page weight" constraint — that this stays a separate,
 * lazily-loaded chunk rather than inflating the shared/root bundle that
 * every page (including every industry and service page) pays for.
 *
 * Framer Motion is not being replaced by this — see each component's own
 * comments for why a given animation uses one library or the other. This
 * module exists for the specific thing Framer's `whileInView` doesn't cover
 * well: choreography whose progress is tied directly to scroll position
 * (scrubbing) or that pins a section in place while the user scrolls
 * through it.
 */
let registered = false;

export function registerGsapScrollTrigger() {
  if (registered) return;
  gsap.registerPlugin(ScrollTrigger);
  registered = true;
}

export { gsap, ScrollTrigger };
