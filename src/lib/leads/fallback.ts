import { company, whatsappLink } from "@/lib/data/company";
import type { Lead } from "./types";

/**
 * Builds a prefilled WhatsApp + mailto link carrying everything the visitor
 * already entered, keyed off the same Lead object providers.ts would have
 * delivered. Used only when durable delivery could not be confirmed (see
 * submit.ts) so a failed submission never costs the visitor their input —
 * they can hand it off in one tap instead of retyping it on WhatsApp/email.
 */
export function buildFallbackLinks(lead: Lead): { whatsappUrl: string; mailtoUrl: string } {
  const lines: string[] = [
    `Hi GraphikosX, I tried to submit ${lead.type === "free-audit" ? "a Free Audit request" : "the contact form"} on the website and it didn't go through. Here are my details:`,
    "",
    `Name: ${lead.name}`,
    `Business: ${lead.businessName}`,
    `WhatsApp/Phone: ${lead.whatsapp}`,
  ];
  if (lead.email) lines.push(`Email: ${lead.email}`);
  if (lead.type === "free-audit") {
    if (lead.industry) lines.push(`Industry: ${lead.industry}`);
    if (lead.biggestChallenge) lines.push(`Biggest challenge: ${lead.biggestChallenge}`);
    if (lead.goals.length) lines.push(`Goals: ${lead.goals.join(", ")}`);
  } else {
    lines.push(`Subject: ${lead.subject}`);
    if (lead.message) lines.push(`Message: ${lead.message}`);
  }

  const text = lines.join("\n");
  const whatsappUrl = whatsappLink(text);

  const subject = encodeURIComponent(
    lead.type === "free-audit" ? "Free Audit request (submitted via fallback)" : "Contact form (submitted via fallback)"
  );
  const body = encodeURIComponent(text);
  const mailtoUrl = `mailto:${company.salesEmail}?subject=${subject}&body=${body}`;

  return { whatsappUrl, mailtoUrl };
}
