/**
 * Centralized analytics event helper.
 *
 * GA4 is now wired in (GoogleAnalytics.tsx) but stays a safe no-op until
 * two conditions are both met: NEXT_PUBLIC_GA_MEASUREMENT_ID is set in the
 * hosting environment, AND the visitor has accepted the cookie banner
 * (CookieBanner.tsx / src/lib/consent.ts). Until then, `window.gtag` never
 * gets defined, so every track() call below safely no-ops — no further
 * code changes are needed once both conditions are satisfied.
 *
 * Every event name used across the site is declared here as the single
 * source of truth, so call sites can't silently typo an event name.
 */

export type AnalyticsEvent =
  | "free_audit_started"
  | "free_audit_step_completed"
  | "free_audit_submitted"
  | "contact_form_submitted"
  | "whatsapp_clicked"
  | "email_clicked"
  | "phone_clicked"
  | "service_cta_clicked"
  | "industry_cta_clicked"
  | "founder_instagram_clicked"
  | "founder_linkedin_clicked"
  | "popup_shown"
  | "popup_dismissed"
  | "popup_submitted"
  | "cookie_consent_accepted"
  | "cookie_consent_declined";

type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (command: "event", eventName: string, params?: AnalyticsPayload) => void;
  }
}

export function track(event: AnalyticsEvent, payload: AnalyticsPayload = {}): void {
  if (typeof window === "undefined") return;

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
    return;
  }

  // No analytics provider configured yet — fail safe, not silent-in-the-
  // dark during development, so it's obvious this is wired but unconnected.
  if (process.env.NODE_ENV === "development") {
    console.debug(`[analytics:noop] ${event}`, payload);
  }
}
