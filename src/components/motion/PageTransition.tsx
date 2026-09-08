"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

/**
 * Phase 4 — page transitions. Per the plan: `app/layout.tsx` is a Server
 * Component with no transition wrapper, so this is the small client "shell"
 * boundary that goes around `{children}` there. Framer Motion's
 * `AnimatePresence`, not the native View Transitions API — Framer is already
 * a dependency and already used for exit animations elsewhere
 * (`IndustriesTeaser`'s `AnimatePresence mode="wait"`, whose duration/easing/
 * reduced-motion pattern this mirrors), and it works identically across all
 * 10 industry + service routes today rather than depending on partial
 * browser support for `<ViewTransition>`/View Transitions.
 *
 * Deliberately content-only: a short fade + small vertical settle, not a
 * full-page morph. `Header`/`Footer`/`FloatingWhatsApp` stay outside this
 * component entirely (see `layout.tsx`) — only the routed page content
 * transitions, so nav/footer never flicker or re-animate on navigation.
 *
 * `usePathname()` (not the full URL) is the `AnimatePresence` key, so a
 * search-param-only change (e.g. a filter in the query string) does not
 * retrigger a page-level fade — only an actual route change does.
 *
 * `initial={false}` on `AnimatePresence` is what keeps this scoped to
 * *navigations*: without it, the very first page load would also animate in
 * from opacity 0, which risks delaying/confusing the LCP measurement on a
 * page like `/` (see Phase 5's intro-sequence LCP note for why that's worth
 * avoiding proactively rather than discovering it later at the Tier 1 exit
 * checklist). With it, first load renders at full opacity immediately and
 * only subsequent client-side route changes get the fade.
 *
 * `mode="wait"` (matching the existing `IndustriesTeaser` convention): the
 * leaving page finishes its exit before the entering page starts, so two
 * pages' content never overlaps mid-transition. Duration is 200ms — inside
 * the plan's 150–250ms window — so the brief gap that `mode="wait"` implies
 * stays short enough not to read as a stall.
 *
 * `useReducedMotion()` returns `null` until after mount; the ternaries below
 * follow the same null-safe `shouldReduceMotion ? 0 : n` pattern already
 * used throughout the codebase (e.g. `IndustriesTeaser`, `BuyerJourneyScrub`)
 * rather than introducing a new one — reduced motion collapses this to an
 * instant, no-offset swap once the client determines the preference, exactly
 * per the plan's test criteria.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -8 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
