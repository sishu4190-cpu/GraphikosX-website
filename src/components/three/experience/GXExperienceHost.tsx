"use client";

import dynamic from "next/dynamic";

/**
 * Client boundary + `ssr:false` host for `GXExperience.tsx` — the same
 * three-layer split `ScrollScrubTimelineHost.tsx` and `BuyerJourneyScrubHost.tsx`
 * already use for gsap/ScrollTrigger, and the same `dynamic(..., { ssr: false,
 * loading: () => null })` treatment `WorkShowcase.tsx` already gives its own
 * Three.js scene (`WorkScene.tsx`). `Hero.tsx` is a Server Component, and
 * `next/dynamic`'s `ssr: false` option is only valid inside a Client
 * Component, so `Hero.tsx` imports this small "use client" host directly and
 * normally, and this file is the one that does the dynamic/ssr:false import.
 *
 * Why this matters here specifically: `GXExperience.tsx` was previously
 * imported statically into `Hero.tsx` — which meant three.js,
 * @react-three/fiber and @react-three/postprocessing (the heaviest JS on the
 * whole site) were parsed and evaluated as part of the homepage's initial,
 * blocking bundle for every visitor, including "static"-mode visitors
 * (reduced-motion / low-memory / no-WebGL) who never render a single WebGL
 * frame. A live Lighthouse audit of the homepage (post-launch, see
 * CHANGELOG) measured ~1.4s of script-evaluation time attributable to that
 * one bundle alone, and Total Blocking Time of 1,230ms overall — this was
 * the single largest fixable contributor. Moving the import behind this
 * dynamic/ssr:false boundary defers that cost to right after hydration
 * instead of inside the critical rendering path; every visitor still gets
 * the exact same eventual full/lite/static experience GXExperience.tsx
 * already decides internally (nothing about that logic changes), just
 * resequenced so it no longer competes with first paint and the text-reveal
 * animations for main-thread time.
 *
 * `loading: () => null` (not a placeholder) matches `WorkScene.tsx`'s own
 * identical choice for the same reason: GXExperience's own `wrapperRef` div
 * is `fixed inset-0` and purely decorative/`pointer-events-none` at this
 * layer (see Hero.tsx's anchor divs, which already provide their own laid-
 * out box via Tailwind classes), so there is no layout to reserve and
 * nothing to shift — a same-origin dynamic import resolves quickly enough
 * that this is rarely if ever visible, exactly as ScrollScrubTimelineHost.tsx
 * documents for its own case.
 */
const GXExperience = dynamic(
  () => import("@/components/three/experience/GXExperience").then((m) => m.GXExperience),
  { ssr: false, loading: () => null },
);

export function GXExperienceHost() {
  return <GXExperience />;
}
