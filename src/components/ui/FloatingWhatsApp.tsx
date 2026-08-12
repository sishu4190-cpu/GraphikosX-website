"use client";

import { whatsappLink } from "@/lib/data/company";
import { track } from "@/lib/analytics/track";
import { WhatsAppIcon } from "@/components/ui/WhatsAppIcon";

/**
 * Site-wide floating WhatsApp button, fixed bottom-right. Mounted once in
 * the root layout (not per-page) so it's consistent everywhere. Uses the
 * same centralized `whatsappLink()` config as the navbar icon and footer
 * link — one number, defined once in `src/lib/data/company.ts`.
 *
 * Visual treatment (Phase 2H spec §5/§28): the button no longer uses
 * WhatsApp's dominant brand green — it now matches the same black/white/blue
 * language as the footer's Instagram/LinkedIn icons: a dark surface by
 * default, activating to GraphikosX blue on hover/focus. The glyph itself
 * stays recognizable so it's still unmistakably "chat on WhatsApp."
 *
 * `gx-whatsapp-breathe` (globals.css) is a slow, subtle idle scale pulse —
 * not a bounce — and is disabled entirely under prefers-reduced-motion via
 * the site-wide reduced-motion rule in globals.css.
 */
export function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink("Hello GraphikosX, I'd like to talk about my business.")}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("whatsapp_clicked", { source: "floating-button" })}
      aria-label="Chat with us on WhatsApp"
      className="gx-whatsapp-breathe group fixed right-5 bottom-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white shadow-lg shadow-black/30 ring-1 ring-white/10 transition-all duration-300 ease-out hover:scale-110 hover:bg-accent hover:shadow-[0_10px_28px_-6px_rgba(29,78,216,0.55)] hover:ring-[rgba(124,156,255,0.5)] focus-visible:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:right-7 sm:bottom-7"
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span
        role="tooltip"
        className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-xs font-medium text-paper opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100 sm:block"
      >
        Chat with us on WhatsApp
      </span>
    </a>
  );
}
