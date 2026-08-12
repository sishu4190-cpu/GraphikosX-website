import { company } from "@/lib/data/company";
import type { Lead } from "./types";

/**
 * Lead delivery is provider-agnostic by design: submitLead() (see submit.ts)
 * never talks to a specific CRM/email API directly. It hands the finished
 * Lead object to every provider below and inspects the result (see
 * deliverLead) to decide whether the submission can honestly be reported as
 * successful.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * DEVELOPMENT MODE vs PRODUCTION MODE (NODE_ENV)
 * ─────────────────────────────────────────────────────────────────────────
 * DEVELOPMENT (`NODE_ENV !== "production"`, i.e. `next dev`):
 *   - consoleProvider alone is treated as sufficient. This lets every form
 *     be exercised locally with zero configuration.
 *
 * PRODUCTION (`NODE_ENV === "production"`, i.e. `next build && next start`,
 * or any real deployment):
 *   - consoleProvider is NOT sufficient on its own. It still runs (server
 *     logs are useful for debugging), but it is marked `durable: false` and
 *     never counts toward a successful submission.
 *   - The submission is only reported as successful if at least one
 *     `durable: true` provider that is actually configured succeeds.
 *   - See submit.ts for exactly how this is enforced — that is the single
 *     place a user-facing success/failure decision is made.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * PROVIDERS
 * ─────────────────────────────────────────────────────────────────────────
 *  - consoleProvider   — always runs, never durable. Ephemeral server log.
 *  - webhookProvider    — durable. Enabled by setting LEAD_WEBHOOK_URL to a
 *    Zapier / Make / n8n / Google Sheets / CRM inbound webhook URL. Zero
 *    code changes needed beyond the environment variable.
 *  - emailProvider      — durable. Sends a transactional email to
 *    sales@graphikosx.in via the Resend API (chosen because it needs no SDK
 *    dependency — a single authenticated fetch() call — and has a
 *    generous free tier). Enabled by setting EMAIL_API_KEY. Requires a
 *    verified sending domain in Resend; see EMAIL_FROM below and
 *    .env.example for the full list of required variables. To use a
 *    different provider (SendGrid, Postmark, SES, etc.), replace the body
 *    of `deliver()` below — the rest of the architecture (submit.ts,
 *    deliverLead, the durable/production contract) does not need to change.
 *
 * No credentials are invented anywhere in this file. If EMAIL_API_KEY /
 * LEAD_WEBHOOK_URL are unset, those providers simply report
 * `configured: false` and are skipped — they never fake a delivery.
 */

export function isProductionMode(): boolean {
  return process.env.NODE_ENV === "production";
}

interface ProviderResult {
  name: string;
  durable: boolean;
  configured: boolean;
  ok: boolean;
  error?: string;
}

interface LeadProvider {
  name: string;
  /** Durable providers count toward "was this lead actually captured?" in production. */
  durable: boolean;
  /** Whether this provider has the environment/config it needs to run at all. */
  isConfigured(): boolean;
  deliver(lead: Lead): Promise<void>;
}

const consoleProvider: LeadProvider = {
  name: "console",
  durable: false,
  isConfigured: () => true,
  async deliver(lead) {
    console.log("[GraphikosX Lead]", JSON.stringify(lead));
  },
};

const webhookProvider: LeadProvider = {
  name: "webhook",
  durable: true,
  isConfigured: () => Boolean(process.env.LEAD_WEBHOOK_URL),
  async deliver(lead) {
    const url = process.env.LEAD_WEBHOOK_URL;
    if (!url) return; // isConfigured() guards real calls; this is just a type-safety fallback
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(lead),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      throw new Error(`Webhook responded ${res.status}`);
    }
  },
};

/**
 * Transactional email notification via the Resend API
 * (https://resend.com/docs/api-reference/emails/send-email). Required env
 * vars (see .env.example):
 *   - EMAIL_API_KEY   — Resend API key (secret)
 *   - EMAIL_FROM      — verified sender, e.g. "GraphikosX Leads <leads@graphikosx.in>"
 *   - EMAIL_TO        — optional override; defaults to company.salesEmail
 * If EMAIL_API_KEY is unset, this provider reports `configured: false` and
 * is skipped — it never pretends to send an email it didn't send.
 */
const emailProvider: LeadProvider = {
  name: "email",
  durable: true,
  isConfigured: () => Boolean(process.env.EMAIL_API_KEY && process.env.EMAIL_FROM),
  async deliver(lead) {
    const apiKey = process.env.EMAIL_API_KEY;
    const from = process.env.EMAIL_FROM;
    if (!apiKey || !from) return; // isConfigured() guards real calls

    const to = process.env.EMAIL_TO || company.salesEmail;
    const subjectLabel = lead.type === "free-audit" ? "New Free Audit request" : "New contact form message";
    const bodyLines = Object.entries(lead)
      .filter(([, v]) => v !== undefined && v !== "" && !(Array.isArray(v) && v.length === 0))
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : typeof v === "object" ? JSON.stringify(v) : v}`);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `${subjectLabel} — ${lead.businessName}`,
        text: bodyLines.join("\n"),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      throw new Error(`Email API responded ${res.status}`);
    }
  },
};

const providers: LeadProvider[] = [consoleProvider, webhookProvider, emailProvider];

export interface DeliveryReport {
  results: ProviderResult[];
  /** At least one durable provider has valid configuration present. */
  anyDurableConfigured: boolean;
  /** At least one durable, configured provider reported success. */
  anyDurableSucceeded: boolean;
}

/**
 * Runs every provider independently — one provider's failure (or being
 * unconfigured) never stops another from being attempted, so e.g. webhook
 * failing still lets email attempt delivery, and vice versa. Returns a
 * structured report rather than throwing, so submit.ts can make an honest
 * production success/failure decision.
 */
export async function deliverLead(lead: Lead): Promise<DeliveryReport> {
  const settled = await Promise.allSettled(
    providers.map(async (p): Promise<ProviderResult> => {
      const configured = p.isConfigured();
      if (!configured) {
        return { name: p.name, durable: p.durable, configured: false, ok: false };
      }
      try {
        await p.deliver(lead);
        return { name: p.name, durable: p.durable, configured: true, ok: true };
      } catch (err) {
        console.error(`[GraphikosX Lead] ${p.name} delivery failed:`, err);
        return {
          name: p.name,
          durable: p.durable,
          configured: true,
          ok: false,
          error: err instanceof Error ? err.message : String(err),
        };
      }
    })
  );

  const results = settled.map((s) =>
    s.status === "fulfilled" ? s.value : { name: "unknown", durable: false, configured: false, ok: false, error: "unexpected rejection" }
  );

  const durableResults = results.filter((r) => r.durable);

  return {
    results,
    anyDurableConfigured: durableResults.some((r) => r.configured),
    anyDurableSucceeded: durableResults.some((r) => r.configured && r.ok),
  };
}
