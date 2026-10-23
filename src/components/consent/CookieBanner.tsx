"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useConsent, setConsent } from "@/lib/consent";
import { track } from "@/lib/analytics/track";

/**
 * Simple, non-blocking cookie-consent banner.
 *
 * - Shows only when no choice has been recorded yet (`useConsent() === null`
 *   — first visit, or storage was cleared). Never reappears after a choice
 *   is made, on this device, unless the visitor clears site data.
 * - Deliberately NOT a full-screen modal: the rest of the site stays fully
 *   usable and visible while this is up, and it never blocks scrolling or
 *   traps focus — consistent with how FirstVisitPopup.tsx (the only other
 *   first-visit UI on this site) is scoped to be dismissible, never forced.
 * - Positioned bottom-left with a generous bottom offset so it never
 *   overlaps the fixed bottom-right WhatsApp button (FloatingWhatsApp.tsx)
 *   at any breakpoint.
 * - "Accept" / "Decline" are the only two real choices. There is no
 *   "Manage preferences" granularity (no advertising/cross-site cookies
 *   exist on this site to grant separate consent for — see Privacy Policy
 *   §13) — the only gated behavior today is whether GA4 analytics loads
 *   (GoogleAnalytics.tsx reads this same choice via the same hook, so it
 *   re-renders and starts loading the instant "Accept" is clicked here).
 */
export function CookieBanner() {
  const consent = useConsent();
  const shouldReduceMotion = useReducedMotion();
  const visible = consent === null;

  const choose = (value: "accepted" | "declined") => {
    setConsent(value);
    track(value === "accepted" ? "cookie_consent_accepted" : "cookie_consent_declined");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          role="region"
          aria-label="Cookie consent"
          className="fixed bottom-24 left-4 right-4 z-50 rounded-2xl bg-ink p-5 text-paper shadow-2xl sm:bottom-6 sm:left-6 sm:right-auto sm:max-w-sm"
        >
          <p className="text-sm leading-relaxed text-grey-300">
            We use a minimal analytics cookie to understand how visitors use this site. No advertising or
            cross-site tracking. See our{" "}
            <Link href="/privacy-policy" className="underline hover:text-accent">
              Privacy Policy
            </Link>
            .
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              type="button"
              onClick={() => choose("accepted")}
              className="rounded-full bg-paper px-5 py-2 text-sm font-semibold text-ink transition-colors hover:bg-accent hover:text-paper"
            >
              Accept
            </button>
            <button
              type="button"
              onClick={() => choose("declined")}
              className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-grey-300 transition-colors hover:border-white/40 hover:text-paper"
            >
              Decline
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
