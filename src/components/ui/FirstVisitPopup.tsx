"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TextField, Honeypot } from "@/components/ui/form/fields";
import { Button } from "@/components/ui/Button";
import { isValidPhone } from "@/lib/validation/rules";
import { submitLead } from "@/lib/leads/submit";
import { track } from "@/lib/analytics/track";

/**
 * Phase 10, item 7 — first-time-visitor lead-capture popup.
 *
 * Scoped and approved before any code was written (see CHANGELOG.md for the
 * full trade-off discussion). Summary of the decisions this component
 * implements:
 *
 *  - TRIGGER: scroll depth >= 50% of the page AND at least 8 seconds have
 *    elapsed since mount — whichever condition is satisfied last. Not a
 *    blind timer (which risks Google's intrusive-interstitial penalty on
 *    mobile) and not exit-intent (no signal at all on touch devices, which
 *    are most of this site's traffic).
 *  - "FIRST-TIME" DETECTION: a `localStorage` flag, not true unique-visitor
 *    tracking. Clearing site data or an incognito window will show it
 *    again — a known, accepted limitation, not an oversight.
 *  - DISMISSAL: X button, Escape key, or clicking the backdrop. Never a
 *    forced/blocking modal — submitting the form is never the only way out.
 *  - COEXISTENCE with the Free Audit flow: suppressed entirely on
 *    `/free-audit` and `/contact`, since a visitor there is already mid-
 *    conversion. Everywhere else it uses a lighter "quick callback" framing
 *    (name/phone/business only) deliberately distinct from the Free Audit's
 *    more considered multi-step wizard, so the two don't read as
 *    duplicates of the same ask.
 *  - RE-TRIGGER SUPPRESSION: submitting sets a permanent "never show again"
 *    flag. Dismissing without submitting sets a 21-day cooldown instead —
 *    a middle ground between "gone forever" and "annoying on every visit."
 *
 * DELIVERY: routes through the exact same `submitLead()` pipeline as the
 * Contact form (`type: "contact"`), so a popup submission lands in the same
 * webhook/email destination as every other lead — no separate plumbing.
 * `sourcePage` is set to a fixed "popup-quick-callback" value (rather than
 * the actual page the visitor was on) so it's clearly distinguishable from
 * a real /contact submission in whatever inbox/sheet/CRM receives it.
 */

const SUBMITTED_KEY = "gx_popup_submitted";
const DISMISSED_UNTIL_KEY = "gx_popup_dismissed_until";
const DISMISS_COOLDOWN_MS = 21 * 24 * 60 * 60 * 1000; // 21 days
const TIME_FLOOR_MS = 8000; // 8 seconds
const SCROLL_THRESHOLD_PERCENT = 50;

// Pages where the popup would compete with an existing, more considered
// conversion flow already on-screen.
const SUPPRESSED_PATHS = new Set(["/free-audit", "/contact"]);

function readLocalStorage(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    // Privacy mode / storage disabled: fail safe by treating it as unset
    // rather than throwing.
    return null;
  }
}

function writeLocalStorage(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Best-effort only — a visitor who blocks storage just sees the popup
    // again next time, which is an acceptable degradation, not a crash.
  }
}

function isSuppressedForThisVisit(): boolean {
  if (readLocalStorage(SUBMITTED_KEY) === "1") return true;
  const dismissedUntilRaw = readLocalStorage(DISMISSED_UNTIL_KEY);
  if (dismissedUntilRaw) {
    const dismissedUntil = Number(dismissedUntilRaw);
    if (!Number.isNaN(dismissedUntil) && Date.now() < dismissedUntil) return true;
  }
  return false;
}

function currentScrollPercent(): number {
  const doc = document.documentElement;
  const scrollable = doc.scrollHeight - doc.clientHeight;
  if (scrollable <= 0) return 100; // page doesn't scroll — treat as fully seen
  return (window.scrollY / scrollable) * 100;
}

interface PopupFormState {
  name: string;
  businessName: string;
  whatsapp: string;
  honeypot: string;
}

const initialForm: PopupFormState = { name: "", businessName: "", whatsapp: "", honeypot: "" };

export function FirstVisitPopup() {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<PopupFormState>(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [submitError, setSubmitError] = useState<string | undefined>();

  const update = <K extends keyof PopupFormState>(key: K, value: PopupFormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  // Trigger watcher: scroll-depth + time-floor, re-evaluated fresh on every
  // route change (each page needs its own genuine engagement signal), but
  // the localStorage checks below mean it only ever actually opens once per
  // cooldown/submission regardless of how many pages are visited.
  useEffect(() => {
    if (!pathname || SUPPRESSED_PATHS.has(pathname)) return;
    if (isSuppressedForThisVisit()) return;

    const mountTime = Date.now();
    let triggered = false;

    const maybeTrigger = () => {
      if (triggered) return;
      const elapsed = Date.now() - mountTime;
      if (elapsed >= TIME_FLOOR_MS && currentScrollPercent() >= SCROLL_THRESHOLD_PERCENT) {
        triggered = true;
        setIsOpen(true);
        track("popup_shown", {});
        cleanup();
      }
    };

    const onScroll = () => maybeTrigger();
    window.addEventListener("scroll", onScroll, { passive: true });
    const timeoutId = window.setTimeout(maybeTrigger, TIME_FLOOR_MS);

    function cleanup() {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timeoutId);
    }

    return cleanup;
  }, [pathname]);

  // Escape-to-close, only wired while actually open.
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleDismiss();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // Body scroll lock while open, and focus the first field so keyboard/
  // screen-reader users land straight in the form. Queried by id rather
  // than a ref forwarded through TextField, since that shared component
  // doesn't expose one and this is the only place that needs it.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.getElementById("popup-name")?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function handleDismiss() {
    writeLocalStorage(DISMISSED_UNTIL_KEY, String(Date.now() + DISMISS_COOLDOWN_MS));
    track("popup_dismissed", {});
    setIsOpen(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!form.name.trim()) nextErrors.name = "Please enter your name.";
    if (!form.businessName.trim()) nextErrors.businessName = "Please enter your business name.";
    if (!form.whatsapp.trim() || !isValidPhone(form.whatsapp)) {
      nextErrors.whatsapp = "Enter a valid WhatsApp or phone number.";
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setStatus("submitting");
    setSubmitError(undefined);
    try {
      const result = await submitLead({
        type: "contact",
        name: form.name,
        businessName: form.businessName,
        whatsapp: form.whatsapp,
        subject: "Quick callback request (popup)",
        sourcePage: "popup-quick-callback",
        honeypot: form.honeypot,
      });

      if (result.ok) {
        writeLocalStorage(SUBMITTED_KEY, "1");
        track("popup_submitted", {});
        setStatus("success");
      } else {
        setStatus("idle");
        setSubmitError(result.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("idle");
      setSubmitError("Something went wrong submitting this. Please try again, or reach us directly on WhatsApp.");
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) handleDismiss();
          }}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="gx-popup-title"
            className="relative w-full max-w-md rounded-2xl border border-ink/10 bg-paper p-6 shadow-2xl sm:p-8"
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <button
              type="button"
              onClick={handleDismiss}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-grey-500 transition-colors duration-200 hover:bg-grey-100 hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {status === "success" ? (
              <div className="text-center">
                <span aria-hidden className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none">
                    <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <h2 id="gx-popup-title" className="font-display text-xl font-bold text-ink">
                  Got it, thanks{form.name ? `, ${form.name}` : ""}.
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-grey-700">We&rsquo;ll call or message you back shortly.</p>
                <Button onClick={handleDismiss} variant="secondary" className="mt-6">
                  Close
                </Button>
              </div>
            ) : (
              <>
                <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-accent">Quick Callback</p>
                <h2 id="gx-popup-title" className="font-display text-xl font-bold leading-tight text-ink sm:text-2xl">
                  Want us to reach out to you instead?
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-grey-700">
                  Leave your number and we&rsquo;ll get in touch, no forms to fill out on your end.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                  <TextField
                    label="Your name"
                    name="popup-name"
                    value={form.name}
                    onChange={(v) => update("name", v)}
                    required
                    autoComplete="name"
                    maxLength={100}
                    error={errors.name}
                  />
                  <TextField
                    label="WhatsApp or phone number"
                    name="popup-whatsapp"
                    value={form.whatsapp}
                    onChange={(v) => update("whatsapp", v)}
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    error={errors.whatsapp}
                  />
                  <TextField
                    label="Business name"
                    name="popup-businessName"
                    value={form.businessName}
                    onChange={(v) => update("businessName", v)}
                    required
                    autoComplete="organization"
                    maxLength={120}
                    error={errors.businessName}
                  />

                  <Honeypot value={form.honeypot} onChange={(v) => update("honeypot", v)} />

                  {submitError && (
                    <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                      {submitError}
                    </p>
                  )}

                  <Button type="submit" variant="primary" disabled={status === "submitting"} className="w-full justify-center">
                    {status === "submitting" ? "Sending…" : "Request a Callback"}
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
