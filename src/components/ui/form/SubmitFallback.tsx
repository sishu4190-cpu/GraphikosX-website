"use client";

import { Button } from "@/components/ui/Button";
import { track } from "@/lib/analytics/track";

/**
 * Rendered only when submitLead() returns a recoverable failure with
 * fallback links (see src/lib/leads/submit.ts + fallback.ts). The visitor's
 * form data is never lost: these links carry everything they already typed,
 * pre-filled, so continuing on WhatsApp or email takes one tap instead of
 * retyping the whole thing.
 */
export function SubmitFallback({
  fallback,
  source,
}: {
  fallback: { whatsappUrl: string; mailtoUrl: string };
  source: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-ink/10 bg-grey-100/60 px-4 py-3">
      <p className="w-full text-xs text-grey-600">
        Nothing you entered is lost — continue the conversation directly instead:
      </p>
      <Button
        href={fallback.whatsappUrl}
        variant="secondary"
        external
        onClick={() => track("whatsapp_clicked", { source: `${source}-fallback` })}
      >
        Continue on WhatsApp
      </Button>
      <Button
        href={fallback.mailtoUrl}
        variant="ghost"
        external
        onClick={() => track("email_clicked", { source: `${source}-fallback` })}
      >
        Email us instead
      </Button>
    </div>
  );
}
