import Script from "next/script";

/**
 * Loads GA4 only when NEXT_PUBLIC_GA_MEASUREMENT_ID is actually set. Renders
 * nothing otherwise — there is no invented Measurement ID anywhere in this
 * codebase. The moment this env var is set in production, every existing
 * `track()` call (src/lib/analytics/track.ts) starts firing with zero
 * further code changes, since it already checks for `window.gtag`.
 *
 * NEXT_PUBLIC_-prefixed because the Measurement ID is not a secret — it is
 * always visible in the client-side gtag.js request anyway.
 */
export function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return null;

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
