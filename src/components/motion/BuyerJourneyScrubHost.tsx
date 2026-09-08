"use client";

import dynamic from "next/dynamic";

/**
 * Client boundary + `ssr:false` host for `BuyerJourneyScrub.tsx`, matching
 * `ScrollScrubTimelineHost.tsx`'s role exactly: `next/dynamic`'s `ssr: false`
 * option is only valid inside a Client Component, so `BuyerJourney.tsx`
 * (a Server Component, rendered on all 10 industry detail pages) imports
 * this small "use client" host directly, and this file is the one that
 * does the dynamic/ssr:false import — keeping gsap/ScrollTrigger out of the
 * server render pass and out of every other route's bundle.
 *
 * The `loading` fallback reserves the section's approximate rendered height
 * so there's no layout shift while the chunk loads.
 */
const BuyerJourneyScrub = dynamic(
  () => import("./BuyerJourneyScrub").then((m) => m.BuyerJourneyScrub),
  { ssr: false, loading: () => <div className="min-h-[120px]" aria-hidden /> },
);

export function BuyerJourneyScrubHost({ steps, className = "" }: { steps: string[]; className?: string }) {
  return <BuyerJourneyScrub steps={steps} className={className} />;
}
