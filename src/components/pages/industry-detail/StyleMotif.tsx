import type { VisualStyle } from "@/lib/data/industry-details";

/**
 * Per-style-bucket decorative SVG motif for industry pages — the "controlled
 * variation" layer (layout/diagram/typography, never new colors) that lets
 * each industry feel distinct while staying visibly GraphikosX.
 * technical  -> industrial-manufacturing-chemicals
 * clarity    -> healthcare ("Doctors & Clinics")
 * spatial    -> real-estate
 * editorial  -> architecture-interior
 * authority  -> legal-professional-services ("Legal, CA & Professional Services")
 * local      -> fitness-wellness ("Gyms & Fitness")
 * progress   -> education-coaching
 * luxury     -> jewellery-wedding (Phase 2H — faceted gem motif)
 * kinetic    -> automotive-ev (Phase 2H — directional speed-trail motif, split out from "technical" for stronger differentiation from industrial)
 * trust      -> financial-services-wealth-management (Phase 3 — shield-and-checkmark motif; replaces the retired "hospitality" industry, which previously used "local")
 */
export function StyleMotif({ style, className = "" }: { style: VisualStyle; className?: string }) {
  switch (style) {
    case "technical":
      return (
        <svg aria-hidden viewBox="0 0 400 400" className={className}>
          <rect x="70" y="70" width="260" height="260" fill="none" stroke="#1D4ED8" strokeWidth="8" />
          <rect x="130" y="130" width="140" height="140" fill="none" stroke="#1D4ED8" strokeWidth="4" />
          <line x1="70" y1="200" x2="330" y2="200" stroke="#1D4ED8" strokeWidth="2" />
          <line x1="200" y1="70" x2="200" y2="330" stroke="#1D4ED8" strokeWidth="2" />
        </svg>
      );
    case "clarity":
      return (
        <svg aria-hidden viewBox="0 0 400 400" className={className}>
          <circle cx="200" cy="200" r="130" fill="none" stroke="#1D4ED8" strokeWidth="6" />
          <path d="M 150 205 L 185 240 L 255 165" fill="none" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "spatial":
      return (
        <svg aria-hidden viewBox="0 0 400 400" className={className}>
          <rect x="60" y="180" width="140" height="140" fill="none" stroke="#1D4ED8" strokeWidth="6" />
          <rect x="180" y="100" width="160" height="160" fill="none" stroke="#1D4ED8" strokeWidth="6" />
        </svg>
      );
    case "editorial":
      return (
        <svg aria-hidden viewBox="0 0 400 400" className={className}>
          <line x1="80" y1="90" x2="320" y2="90" stroke="#1D4ED8" strokeWidth="4" />
          <line x1="80" y1="160" x2="320" y2="160" stroke="#1D4ED8" strokeWidth="4" />
          <line x1="80" y1="230" x2="220" y2="230" stroke="#1D4ED8" strokeWidth="4" />
        </svg>
      );
    case "authority":
      return (
        <svg aria-hidden viewBox="0 0 400 400" className={className}>
          <path d="M 100 300 L 100 140 L 180 140" fill="none" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round" />
          <path d="M 220 300 L 220 140 L 300 140" fill="none" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round" />
        </svg>
      );
    case "local":
      return (
        <svg aria-hidden viewBox="0 0 400 400" className={className}>
          <path d="M 200 80 C 140 80 100 125 100 180 C 100 250 200 320 200 320 C 200 320 300 250 300 180 C 300 125 260 80 200 80 Z" fill="none" stroke="#1D4ED8" strokeWidth="8" />
          <circle cx="200" cy="180" r="30" fill="#1D4ED8" />
        </svg>
      );
    case "luxury":
      return (
        <svg aria-hidden viewBox="0 0 400 400" className={className}>
          <path d="M 200 90 L 280 170 L 200 320 L 120 170 Z" fill="none" stroke="#1D4ED8" strokeWidth="6" strokeLinejoin="round" />
          <path d="M 120 170 L 280 170 M 160 130 L 240 130 M 200 90 L 160 130 M 200 90 L 240 130 M 200 320 L 160 170 M 200 320 L 240 170" fill="none" stroke="#1D4ED8" strokeWidth="2" />
        </svg>
      );
    case "kinetic":
      return (
        <svg aria-hidden viewBox="0 0 400 400" className={className}>
          <path d="M 60 260 L 220 260 L 260 200 L 340 200" fill="none" stroke="#1D4ED8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 60 200 L 160 200" fill="none" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          <path d="M 60 320 L 130 320" fill="none" stroke="#1D4ED8" strokeWidth="4" strokeLinecap="round" opacity="0.5" />
          <circle cx="340" cy="200" r="12" fill="#1D4ED8" />
        </svg>
      );
    case "trust":
      return (
        <svg aria-hidden viewBox="0 0 400 400" className={className}>
          <path d="M 200 70 L 300 110 L 300 200 C 300 270 255 320 200 340 C 145 320 100 270 100 200 L 100 110 Z" fill="none" stroke="#1D4ED8" strokeWidth="6" strokeLinejoin="round" />
          <path d="M 155 205 L 190 240 L 250 165" fill="none" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "progress":
    default:
      return (
        <svg aria-hidden viewBox="0 0 400 400" className={className}>
          <path d="M 70 320 L 150 250 L 220 280 L 330 100" fill="none" stroke="#1D4ED8" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="330" cy="100" r="14" fill="#1D4ED8" />
        </svg>
      );
  }
}
