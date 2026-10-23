/**
 * Cookie-consent storage — a single source of truth shared by
 * CookieBanner.tsx (sets it) and GoogleAnalytics.tsx (reads it).
 *
 * Deliberately simple: one localStorage key, two possible values
 * ("accepted" | "declined"). No cookie is actually SET to track this
 * choice itself — the choice lives in localStorage, which is standard
 * practice and avoids the circular problem of "a cookie to ask permission
 * for cookies."
 *
 * A same-tab CustomEvent is dispatched on every change so GoogleAnalytics
 * can react immediately (start loading GA4 the moment the visitor clicks
 * "Accept") without requiring a page reload.
 *
 * `useConsent()` below reads this through `useSyncExternalStore` rather
 * than a plain `useEffect` + `useState` — this is the pattern React itself
 * recommends for subscribing a component to an external store (here:
 * localStorage + a change event), and it avoids synchronously calling
 * setState from inside an effect body (flagged by the
 * react-hooks/set-state-in-effect lint rule this project runs).
 */

import { useSyncExternalStore } from "react";

export type ConsentValue = "accepted" | "declined";

const STORAGE_KEY = "gx_cookie_consent";
export const CONSENT_EVENT = "gx-cookie-consent-change";

export function getConsent(): ConsentValue | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    // localStorage unavailable (privacy mode, blocked storage, etc.) —
    // treat as "no decision yet" rather than throwing.
    return null;
  }
}

export function setConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Best-effort only. If storage is blocked, the banner will simply
    // reappear on the next visit — not ideal, but not broken either.
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onStoreChange);
  return () => window.removeEventListener(CONSENT_EVENT, onStoreChange);
}

function getServerSnapshot(): ConsentValue | null {
  // Server-rendered markup always assumes "no decision yet" — the real
  // value (if any) only exists in the browser's localStorage and is
  // picked up on the client via getSnapshot below, same as any other
  // client-only state in a server-rendered app.
  return null;
}

/**
 * Subscribes the calling component to the current consent value. Re-renders
 * automatically whenever `setConsent()` is called anywhere (same tab) —
 * no manual useEffect/useState wiring needed at call sites.
 */
export function useConsent(): ConsentValue | null {
  return useSyncExternalStore(subscribe, getConsent, getServerSnapshot);
}
