/**
 * Builds the /free-audit link used by every CTA across the site. Appends a
 * `source` param for attribution and, where the visitor's industry is
 * already known (an industry page), an `industry` param that pre-selects
 * that option on step 1 of the wizard — the field remains a normal select
 * the visitor can change, it is never locked.
 */
export function freeAuditHref({ source, industry }: { source: string; industry?: string }): string {
  const params = new URLSearchParams({ source });
  if (industry) params.set("industry", industry);
  return `/free-audit?${params.toString()}`;
}

export function contactHref(source: string): string {
  return `/contact?source=${encodeURIComponent(source)}`;
}
