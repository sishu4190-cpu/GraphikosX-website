import type { ServiceGroup } from "@/lib/data/services";

/**
 * Lightweight, per-group decorative SVG motif — the "controlled variation"
 * between Build (architectural/grid), Grow (movement/expansion) and Scale
 * (systems/nodes) visual language. Same black/white/blue palette throughout;
 * only the geometry changes. No new colors, no 3D.
 */
export function GroupMotif({ group, className = "" }: { group: ServiceGroup; className?: string }) {
  if (group === "Build") {
    return (
      <svg aria-hidden viewBox="0 0 400 400" className={className}>
        <rect x="60" y="60" width="280" height="280" fill="none" stroke="#1D4ED8" strokeWidth="10" />
        <line x1="60" y1="200" x2="340" y2="200" stroke="#1D4ED8" strokeWidth="4" />
        <line x1="200" y1="60" x2="200" y2="340" stroke="#1D4ED8" strokeWidth="4" />
      </svg>
    );
  }
  if (group === "Grow") {
    return (
      <svg aria-hidden viewBox="0 0 400 400" className={className}>
        <path d="M 60 320 Q 160 340 200 240 T 340 80" fill="none" stroke="#1D4ED8" strokeWidth="10" strokeLinecap="round" />
        <circle cx="340" cy="80" r="14" fill="#1D4ED8" />
      </svg>
    );
  }
  return (
    <svg aria-hidden viewBox="0 0 400 400" className={className}>
      <circle cx="200" cy="200" r="16" fill="#1D4ED8" />
      {[0, 60, 120, 180, 240, 300].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x = 200 + 140 * Math.cos(rad);
        const y = 200 + 140 * Math.sin(rad);
        return (
          <g key={deg}>
            <line x1="200" y1="200" x2={x} y2={y} stroke="#1D4ED8" strokeWidth="3" />
            <circle cx={x} cy={y} r="8" fill="#1D4ED8" />
          </g>
        );
      })}
    </svg>
  );
}
