"use client";

import dynamic from "next/dynamic";
import type { TimelineStep } from "./ScrollActivationTimeline";

/**
 * Client boundary + `ssr:false` host for `ScrollScrubTimeline.tsx` — the
 * same three-layer split `Hero.tsx` -> `GXHero.tsx` -> `GXScene.tsx` already
 * uses for `@react-three/fiber`: `next/dynamic`'s `ssr: false` option is
 * only valid inside a Client Component, so the Server Component that wants
 * this (`CustomerJourney.tsx`) imports this small "use client" host
 * directly and normally, and this file is the one that does the
 * dynamic/ssr:false import — keeping every gsap/ScrollTrigger import out of
 * the server render pass entirely, not just out of other routes' bundles.
 *
 * The `loading` fallback reserves the timeline's approximate rendered
 * height (rather than rendering nothing, or duplicating this section's
 * step content here just for a fallback) so there's no layout shift while
 * the chunk loads — in practice a same-origin dynamic import like this one
 * resolves in well under 100ms, so this is rarely if ever visible.
 */
const ScrollScrubTimeline = dynamic(
  () => import("./ScrollScrubTimeline").then((m) => m.ScrollScrubTimeline),
  { ssr: false, loading: () => <div className="min-h-[112px]" aria-hidden /> },
);

export function ScrollScrubTimelineHost({ steps, className = "" }: { steps: TimelineStep[]; className?: string }) {
  return <ScrollScrubTimeline steps={steps} className={className} />;
}
