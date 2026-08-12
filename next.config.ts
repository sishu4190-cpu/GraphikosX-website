import type { NextConfig } from "next";

/**
 * Security headers — Phase 2F.
 *
 * Decisions and why (see DEPLOYMENT.md → "Security headers" for the full
 * write-up):
 *
 *  - CSP is static (evaluated at build/request time from env, not per-
 *    request nonces). A nonce-based CSP would require every page to call
 *    `headers()`, which opts every route out of static generation — a real
 *    performance regression for a site that is otherwise fully static (see
 *    the Phase 2F performance audit). Given every inline <script> on this
 *    site is our own build-time JSON-LD (never user-supplied content — no
 *    page on this site renders visitor input back into HTML), the residual
 *    risk from `'unsafe-inline'` on script-src is low. Revisit if the site
 *    ever renders user-generated content or adds a third-party inline
 *    script.
 *  - `style-src 'unsafe-inline'` is required for Framer Motion (writes
 *    inline `style` attributes for transform/opacity) and inline `style={{}}`
 *    usage (e.g. progress bars, the Cost of Waiting bar fill).
 *  - `connect-src` conditionally includes Google Analytics endpoints only
 *    when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is actually set — no dead
 *    allowances for services that aren't wired up.
 *  - No `frame-ancestors` exception is granted — the site is never meant to
 *    be iframed.
 *  - `X-Frame-Options: DENY` is kept alongside `frame-ancestors 'none'` for
 *    older browsers that predate the CSP directive.
 */
const analyticsConfigured = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);

const cspDirectives = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${analyticsConfigured ? " https://www.googletagmanager.com" : ""}`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data:`,
  `font-src 'self' data:`,
  `connect-src 'self'${analyticsConfigured ? " https://www.google-analytics.com https://www.googletagmanager.com" : ""}`,
  `frame-ancestors 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `object-src 'none'`,
];

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives.join("; ") },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  experimental: {
    serverActions: {
      // Free Audit / Contact are small text forms — 256kb is generous
      // headroom while still rejecting an arbitrarily large payload well
      // before it reaches submitLead()'s own per-field sanitization.
      bodySizeLimit: "256kb",
    },
  },
};

export default nextConfig;
