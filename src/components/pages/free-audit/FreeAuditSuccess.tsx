"use client";

import { Button } from "@/components/ui/Button";
import { whatsappLink } from "@/lib/data/company";
import { track } from "@/lib/analytics/track";

export function FreeAuditSuccess({ name, businessName }: { name: string; businessName: string }) {
  const message = `Hi GraphikosX, I just submitted a Free Audit request for ${businessName || "my business"}. Looking forward to hearing from you.`;

  return (
    <div className="rounded-2xl border border-ink/10 bg-grey-100/60 p-8 text-center sm:p-12">
      <span aria-hidden className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-paper">
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
          <path d="M4 12.5l5 5L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
        Thank you{name ? `, ${name}` : ""} — your Free Audit request is in.
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-grey-700">
        We&rsquo;ll go through what you shared and get back to you with what we find. If you&rsquo;d rather not wait, message us
        directly on WhatsApp and we can pick up the conversation there.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Button href={whatsappLink(message)} variant="primary" external onClick={() => track("whatsapp_clicked", { source: "free-audit-success" })}>
          Message us on WhatsApp
        </Button>
        <Button href="/" variant="secondary">
          Back to Home
        </Button>
      </div>
    </div>
  );
}
