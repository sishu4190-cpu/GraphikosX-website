"use server";

import { headers } from "next/headers";
import type { FreeAuditLead, ContactLead, Lead, SubmitResult, UtmParams, PreferredContact } from "./types";
import {
  sanitizeText,
  isValidEmail,
  isValidPhone,
  isValidUrl,
  normalizePhone,
} from "@/lib/validation/rules";
import { isRateLimited } from "./rateLimit";
import { deliverLead, isProductionMode } from "./providers";
import { buildFallbackLinks } from "./fallback";
import { industries } from "@/lib/data/industries";
import { improvementAreas, auditGoals } from "@/lib/data/free-audit-options";

/**
 * submitLead() is the single server-side entry point for both the Free
 * Audit wizard and the Contact form. Everything the client sends is
 * treated as untrusted: it is re-validated, re-sanitized and, where the
 * field is a closed set (industry, improvement areas, goals), re-checked
 * against the canonical enum here — regardless of what client-side
 * validation already ran.
 *
 * PRODUCTION HONESTY GUARANTEE: this function decides success/failure by
 * asking deliverLead() (providers.ts) whether at least one *durable*
 * provider actually succeeded. In production mode, a lead is never
 * reported as successfully submitted unless it was durably delivered
 * somewhere outside this server process. If every durable provider is
 * unconfigured or fails, the visitor gets an honest, recoverable error with
 * a pre-filled WhatsApp/email fallback carrying everything they already
 * typed — never a false "success" screen. See providers.ts for the
 * dev/production contract in full.
 */

const MAX_RAW_KEYS = 40; // generous upper bound on the shape of a legitimate submission

interface RawLeadInput {
  type: "free-audit" | "contact";
  name: string;
  businessName: string;
  whatsapp: string;
  email?: string;
  preferredContact?: string;
  industry?: string;
  message?: string;
  sourcePage: string;
  utm?: UtmParams;
  honeypot?: string;
  // free-audit only
  improvementAreas?: string[];
  websiteUrl?: string;
  instagramUrl?: string;
  googleBusinessUrl?: string;
  linkedinUrl?: string;
  currentSituation?: string;
  biggestChallenge?: string;
  goals?: string[];
  goalsDetail?: string;
  // contact only
  subject?: string;
}

async function getClientKey(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : (h.get("x-real-ip") ?? "unknown");
  return ip;
}

function sanitizeUtm(utm: UtmParams | undefined): UtmParams {
  if (!utm || typeof utm !== "object") return {};
  const keys: (keyof UtmParams)[] = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
  ];
  const clean: UtmParams = {};
  for (const key of keys) {
    const value = utm[key];
    if (typeof value === "string" && value.trim()) {
      clean[key] = sanitizeText(value, 100);
    }
  }
  return clean;
}

/** Sanitizes a string array AND drops any value outside a known id set — defense against unexpected/forged enum values, not just oversized payloads. */
function sanitizeEnumArray(value: unknown, allowedIds: readonly string[], maxItems = 20): string[] {
  if (!Array.isArray(value)) return [];
  const allowed = new Set(allowedIds);
  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => sanitizeText(item, 60))
    .filter((item) => allowed.has(item))
    .slice(0, maxItems);
}

const SOURCE_PAGE_PATTERN = /^[a-z0-9][a-z0-9-]{0,59}$/;

function sanitizeSourcePage(value: unknown): string {
  const text = sanitizeText(value, 60).toLowerCase();
  return SOURCE_PAGE_PATTERN.test(text) ? text : "unknown";
}

export async function submitLead(raw: RawLeadInput): Promise<SubmitResult> {
  try {
    // Malformed-payload guard: a legitimate submission from either form has
    // a small, fixed shape. Reject anything wildly larger before touching
    // individual fields (defense in depth alongside Next.js's own Server
    // Action body-size limit).
    if (!raw || typeof raw !== "object" || Object.keys(raw).length > MAX_RAW_KEYS) {
      return { ok: false, error: "This submission couldn't be read. Please try again." };
    }

    // Honeypot: a real user never fills this hidden field. Silently accept
    // (report success) so bots get no signal, but never deliver the lead.
    if (raw.honeypot && String(raw.honeypot).trim().length > 0) {
      return { ok: true };
    }

    const clientKey = await getClientKey();
    if (await isRateLimited(clientKey)) {
      return {
        ok: false,
        recoverable: true,
        error: "Too many submissions from this connection. Please try again shortly, or reach us directly on WhatsApp.",
        fallback: {
          whatsappUrl: "https://wa.me/917984010393",
          mailtoUrl: "mailto:sales@graphikosx.in",
        },
      };
    }

    const name = sanitizeText(raw.name, 100);
    const businessName = sanitizeText(raw.businessName, 120);
    const whatsapp = sanitizeText(raw.whatsapp, 20);
    const email = raw.email ? sanitizeText(raw.email, 150) : undefined;
    const message = raw.message ? sanitizeText(raw.message, 1000) : undefined;
    const sourcePage = sanitizeSourcePage(raw.sourcePage);
    const industrySlugs = [...industries.map((i) => i.slug), "other"];
    const industry =
      raw.industry && industrySlugs.includes(sanitizeText(raw.industry, 60)) ? sanitizeText(raw.industry, 60) : undefined;

    if (!name) return { ok: false, error: "Name is required." };
    if (!businessName) return { ok: false, error: "Business name is required." };
    if (!whatsapp || !isValidPhone(whatsapp)) {
      return { ok: false, error: "Enter a valid WhatsApp or phone number." };
    }
    if (email && !isValidEmail(email)) {
      return { ok: false, error: "Enter a valid email address, or leave it blank." };
    }

    const preferredContact: PreferredContact | undefined =
      raw.preferredContact === "whatsapp" || raw.preferredContact === "phone" || raw.preferredContact === "email"
        ? raw.preferredContact
        : undefined;

    const base = {
      timestamp: new Date().toISOString(),
      name,
      businessName,
      whatsapp: normalizePhone(whatsapp),
      email,
      preferredContact,
      industry,
      message,
      sourcePage,
      utm: sanitizeUtm(raw.utm),
    };

    let lead: Lead;

    if (raw.type === "free-audit") {
      const websiteUrl = raw.websiteUrl ? sanitizeText(raw.websiteUrl, 200) : undefined;
      const instagramUrl = raw.instagramUrl ? sanitizeText(raw.instagramUrl, 200) : undefined;
      const googleBusinessUrl = raw.googleBusinessUrl ? sanitizeText(raw.googleBusinessUrl, 200) : undefined;
      const linkedinUrl = raw.linkedinUrl ? sanitizeText(raw.linkedinUrl, 200) : undefined;

      for (const [label, url] of [
        ["Website URL", websiteUrl],
        ["Instagram URL", instagramUrl],
        ["Google Business URL", googleBusinessUrl],
        ["LinkedIn URL", linkedinUrl],
      ] as const) {
        if (url && !isValidUrl(url)) {
          return { ok: false, error: `${label} doesn't look like a valid link. You can leave it blank instead.` };
        }
      }

      const goals = sanitizeEnumArray(
        raw.goals,
        auditGoals.map((g) => g.id)
      );
      if (goals.length === 0) {
        return { ok: false, error: "Select at least one goal." };
      }

      const freeAuditLead: FreeAuditLead = {
        ...base,
        type: "free-audit",
        improvementAreas: sanitizeEnumArray(
          raw.improvementAreas,
          improvementAreas.map((a) => a.id)
        ),
        websiteUrl,
        instagramUrl,
        googleBusinessUrl,
        linkedinUrl,
        currentSituation: raw.currentSituation ? sanitizeText(raw.currentSituation, 1000) : undefined,
        biggestChallenge: raw.biggestChallenge ? sanitizeText(raw.biggestChallenge, 1000) : undefined,
        goals,
        goalsDetail: raw.goalsDetail ? sanitizeText(raw.goalsDetail, 1000) : undefined,
      };
      lead = freeAuditLead;
    } else if (raw.type === "contact") {
      const subject = sanitizeText(raw.subject, 150) || "General enquiry";
      const contactLead: ContactLead = {
        ...base,
        type: "contact",
        subject,
      };
      lead = contactLead;
    } else {
      return { ok: false, error: "Invalid submission type." };
    }

    const delivery = await deliverLead(lead);

    if (isProductionMode()) {
      // The production honesty guarantee: never report success unless a
      // durable provider actually confirmed delivery. Console logging
      // (ephemeral server output) never counts on its own here.
      if (!delivery.anyDurableSucceeded) {
        const reason = !delivery.anyDurableConfigured
          ? "[GraphikosX Lead] BLOCKED: no durable provider is configured in production (LEAD_WEBHOOK_URL / EMAIL_API_KEY both unset). Lead was NOT stored — see DEPLOYMENT.md."
          : "[GraphikosX Lead] BLOCKED: every configured durable provider failed for this submission.";
        console.error(reason, JSON.stringify(delivery.results));

        return {
          ok: false,
          recoverable: true,
          error:
            "We couldn't confirm your submission went through on our end. Please try again in a moment, or continue directly on WhatsApp or email below: nothing you entered is lost.",
          fallback: buildFallbackLinks(lead),
        };
      }
    }
    // In development mode, reaching this point is always a success — the
    // console provider alone is sufficient for local testing, by design.

    return { ok: true };
  } catch (err) {
    console.error("[GraphikosX Lead] submitLead failed:", err);
    return {
      ok: false,
      recoverable: true,
      error: "Something went wrong submitting this. Please try again, or reach us directly on WhatsApp.",
      fallback: {
        whatsappUrl: "https://wa.me/917984010393",
        mailtoUrl: "mailto:sales@graphikosx.in",
      },
    };
  }
}
