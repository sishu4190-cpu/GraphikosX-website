/**
 * Canonical Lead shape. Both the Free Audit wizard and the Contact form
 * submit into this one interface so downstream delivery (CRM, email,
 * webhook, spreadsheet) only ever has to integrate against a single,
 * stable structure — never coupled to one specific provider.
 */
export type LeadType = "free-audit" | "contact";

export type PreferredContact = "whatsapp" | "phone" | "email";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
}

export interface LeadBase {
  type: LeadType;
  timestamp: string; // ISO 8601, set server-side — never trust a client-supplied timestamp
  name: string;
  businessName: string;
  whatsapp: string;
  email?: string;
  preferredContact?: PreferredContact;
  industry?: string; // canonical industry slug, or "other"
  message?: string;
  sourcePage: string; // e.g. "homepage", "service-seo", "industry-healthcare"
  utm: UtmParams;
  honeypot?: string; // must arrive empty — presence of content flags spam
}

export interface FreeAuditLead extends LeadBase {
  type: "free-audit";
  improvementAreas: string[];
  websiteUrl?: string;
  instagramUrl?: string;
  googleBusinessUrl?: string;
  linkedinUrl?: string;
  currentSituation?: string;
  biggestChallenge?: string;
  goals: string[];
  goalsDetail?: string;
}

export interface ContactLead extends LeadBase {
  type: "contact";
  subject: string;
}

export type Lead = FreeAuditLead | ContactLead;

export interface SubmitResult {
  ok: boolean;
  error?: string;
  /**
   * true when the failure is a delivery/infrastructure problem (rate limit,
   * no durable provider configured, every durable provider failed) rather
   * than a field-validation problem. The UI uses this to decide whether to
   * offer the WhatsApp/email fallback below in addition to "try again" —
   * validation failures don't need it, since fixing the field and
   * resubmitting is enough.
   */
  recoverable?: boolean;
  /**
   * Pre-filled WhatsApp / email links carrying everything the visitor
   * already typed, so a failed submission never loses their input — they
   * can continue the conversation in one tap instead of retyping anything.
   * Only present when recoverable is true.
   */
  fallback?: {
    whatsappUrl: string;
    mailtoUrl: string;
  };
}
