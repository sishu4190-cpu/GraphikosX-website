/** Minimal, recognizable Instagram glyph (single-path outline, currentColor
 * stroke) — used by the footer's founder social link. Same lightweight,
 * dependency-free pattern as WhatsAppIcon.tsx. */
export function InstagramIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true" focusable="false">
      <rect x="2.5" y="2.5" width="19" height="19" rx="5" />
      <circle cx="12" cy="12" r="4.6" />
      <circle cx="17.4" cy="6.6" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}
