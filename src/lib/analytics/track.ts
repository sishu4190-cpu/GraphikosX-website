/**
 * Centralized analytics event helper.
 *
 * CURRENT STATE: no GA4 (or other analytics) script is wired into this
 * project yet — there is no measurement ID configured, so `window.gtag`
 * does not exist. track() checks for it defensively and no-ops safely
 * when it's absent, so every call site below can be wired up now without
 * waiting on analytics to be connected.
 *
 * PRODUCTION INTEGRATION STILL REQUIRED (see README):
 *  - Add the GA4 (or chosen analytics provider) loader script, typically
 *    in the root layout, gated behind a consent decision if required.
 *  - Once that script defines window.gtag, every track() call below
 *    starts firing with zero further code changes.
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
  | "founder_linkedin_clicked";

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
