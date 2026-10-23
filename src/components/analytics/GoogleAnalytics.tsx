"use client";

import Script from "next/script";
import { useConsent } from "@/lib/consent";

/**
 * Loads GA4 only when BOTH are true:
 *   1. NEXT_PUBLIC_GA_MEASUREMENT_ID is actually set — there is no invented
 *      Measurement ID anywhere in this codebase.
 *   2. The visitor has accepted the cookie banner (CookieBanner.tsx /
 *      src/lib/consent.ts). `useConsent()` subscribes to that choice live,
 *      so clicking "Accept" starts loading GA4 immediately without a page
 *      reload — and clicking "Decline" (or never deciding) means the
 *      gtag.js script never loads at all, not just "loads but doesn't
 *      report."
 *
 * The moment both conditions are satisfied, every existing `track()` call
 * (src/lib/analytics/track.ts) starts firing with zero further code
 * changes, since it already checks for `window.gtag`.
 *
 * NEXT_PUBLIC_-prefixed because the Measurement ID is not a secret — it is
 * always visible in the client-side gtag.js request anyway.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const consent = useConsent();

  if (!id || consent !== "accepted") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
