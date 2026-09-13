export interface PointerTarget {
  x: number;
  y: number;
  active: boolean;
}

/**
 * Where the currently-active anchor box (Hero.tsx's `#gx-hero-anchor-desktop`
 * or `#gx-hero-anchor-mobile`, whichever is laid out at the current
 * breakpoint) sits on screen, refreshed every animation frame by
 * GXExperience.tsx's own rAF loop and kept in a ref — never React state, for
 * the same "continuous value, not a discrete UI change" reason every other
 * per-frame value in this codebase is a ref (see ScrollDirector.tsx's own
 * comment for the general rule).
 *
 * Phase 2 note: this exists because the persistent canvas (GXCanvas.tsx) now
 * spans the whole Hero section rather than a dedicated per-layout box the
 * way the old two separately-mounted GXHero canvases did — so the scene
 * itself has to know where on screen the mark is supposed to sit.
 *
 *  - nx/ny: the anchor's center, normalized to the shared canvas's own
 *    -1..1 NDC space (Y already flipped to Three's up-is-positive
 *    convention) — used to offset the scene root so its content renders at
 *    the anchor's screen position.
 *  - widthPx/heightPx: the anchor's own raw pixel size — used to recover
 *    "what the mark's scale would have been inside a canvas sized to just
 *    this box" (see each scene's scaleFactorValue) now that the one shared
 *    canvas's own aspect ratio no longer matches either the desktop or
 *    mobile anchor box's aspect ratio.
 */
export interface AnchorState {
  nx: number;
  ny: number;
  widthPx: number;
  heightPx: number;
  visible: boolean;
}

/**
 * The persistent 3D experience's "chapters" — the sections whose DOM `id`
 * a chapter scene is keyed to. Deliberately not every section on the
 * homepage. Phase 3 added Customer Journey, the Problem section, and
 * Ecosystem alongside Hero (wired in Phase 2); Phase 4 added Industries;
 * Phase 5 added Build/Grow/Scale and the final CTA (FreeAuditCTA), the
 * last two chapters per the master plan's own phased breakdown — there is
 * no Phase 6 chapter, Phase 6 is mobile/accessibility/performance QA on
 * everything above.
 *
 * In page order: Hero, Journey, Problem, Industries, BuildGrowScale,
 * Ecosystem, FinalCTA. Adjacent pairs with NO gap between them: Hero/
 * Journey, and Industries/BuildGrowScale (IndustriesTeaser is immediately
 * followed by BuildGrowScale in the DOM). Every other pair has a real gap:
 * CostOfWaiting sits between Journey/Problem; MeetGraphikosX/Vision/
 * Mission/Philosophy sit between Problem/Industries; BusinessOutcomes sits
 * between BuildGrowScale/Ecosystem; HowWeWork/WhyGraphikosX/FounderSection
 * sit between Ecosystem/FinalCTA. See ScrollDirector.tsx's
 * `useChapterVisibility` for how the gaps are handled.
 */
export type ChapterId =
  | "gx-hero-section"
  | "gx-journey-section"
  | "gx-problem-section"
  | "gx-industries-section"
  | "gx-buildgrowscale-section"
  | "gx-ecosystem-section"
  | "gx-finalcta-section";

export const CHAPTER_IDS: readonly ChapterId[] = [
  "gx-hero-section",
  "gx-journey-section",
  "gx-problem-section",
  "gx-industries-section",
  "gx-buildgrowscale-section",
  "gx-ecosystem-section",
  "gx-finalcta-section",
];
