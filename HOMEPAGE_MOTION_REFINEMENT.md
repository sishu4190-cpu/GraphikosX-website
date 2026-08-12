# GraphikosX — Homepage Motion + Interaction + Logo Accuracy Refinement

This document covers the homepage-only refinement pass on top of the already-approved Phase 2F
build. Scope, per your instructions: Hero 3D logo accuracy, navbar balance, Customer Research
Timeline, Real Problem cards + hub connectors, Authority/Visibility/Trust cards, Vision journey
line, Philosophy cards, Industries radial network, Build→Grow→Scale rows, Process timeline, Why
GraphikosX cards, and one unified card motion grammar across all of the above. No other page,
route, copy, schema, or lead-capture logic was touched.

## 1. Files modified

- `src/app/globals.css` — added the `--gx-blue` canonical token alias, the shared `.gx-card` /
  `.gx-card--dark` glow-grammar CSS, the `gx-energy-dot` keyframes, and the `gx-journey-line`
  flowing-gradient keyframes (all additive; no existing rules changed).
- `src/components/three/GXScene.tsx` — full geometry rebuild (see §3).
- `src/components/three/GXFallback.tsx` — SVG geometry rebuilt to match the same traced source (§3).
- `src/components/layout/Header.tsx` — navbar logo/wordmark spacing and sizing rebalanced.
- `src/components/sections/CustomerJourney.tsx` — rebuilt on `ScrollActivationTimeline`.
- `src/components/sections/HowWeWork.tsx` — rebuilt on `ScrollActivationTimeline`.
- `src/components/sections/DigitalPresenceProblem.tsx` — cards on `GlowCard`, hub wired to
  `HubConnectors`.
- `src/components/sections/MeetGraphikosX.tsx` — pillars on `GlowCard` (dark tone).
- `src/components/sections/Philosophy.tsx` — lens cards on `GlowCard` (light tone).
- `src/components/sections/WhyGraphikosX.tsx` — reason cards on `GlowCard` (light tone).
- `src/components/sections/Vision.tsx` — added the full-width flowing journey line behind the pills.
- `src/components/sections/IndustriesTeaser.tsx` — one-line center label, radius-based connector
  geometry, energy-travel dot, `AnimatePresence` panel crossfade, touch/click support.
- `src/components/sections/BuildGrowScale.tsx` — rows on `GlowCard` with elevation/border-accent.

## 2. Files created

- `src/components/motion/GlowCard.tsx` — the single reusable "unified card motion grammar"
  primitive (see §7).
- `src/components/motion/ScrollActivationTimeline.tsx` — shared sequential-activation timeline used
  by both Customer Research Timeline and Process.
- `src/components/motion/HubConnectors.tsx` — DOM-measured animated connector lines from a hub
  element to a set of target elements, used by the Real Problem section.

Nothing else was created or deleted. No dependency was added or removed — everything above uses
`framer-motion`, `three`, and `@react-three/fiber`, all already in `package.json`.

## 3. Hero 3D reconstruction — how the official logo geometry was preserved

The old Hero used a hand-tuned, intentionally abstract arc-plus-blades approximation that never
matched the real mark. For this pass I treated your official logo PNG as ground truth and traced
it, rather than eyeballing it:

1. Loaded the PNG and isolated the dark-pixel silhouette (alpha + luminance threshold).
2. Ran connected-component analysis (`scipy.ndimage.label`) — this found 4 pixel blobs, not 3,
   because the two X strokes visually "weave" (one passes in front of the other with a thin gap at
   the crossing), splitting the longer stroke into two fragments.
3. Used PCA on each blob to get its dominant angle, which showed two fragments shared one
   orientation (the long stroke's top and bottom halves) and one blob was the second, unsplit
   stroke — confirming there are exactly three real strokes: the G ring, and two X blades.
4. Extracted true outlines with OpenCV: `findContours` + `approxPolyDP` for the ring (a single
   ~26-point closed polygon — an open "C" traces both its outer and inner edge as one path, so no
   separate hole shape was needed), and `convexHull` for the weave-split blade (recombines the two
   fragments into the one true parallelogram they belong to).
5. Rendered the extracted polygons back to a flat image and diffed them against the source PNG by
   eye — pixel-faithful match (see the QA screenshots referenced below).
6. Normalized all three polygons into one shared, centered coordinate space and hard-coded them as
   the `RING_OUTLINE` / `BLADE_A_OUTLINE` / `BLADE_B_OUTLINE` constants in `GXScene.tsx`, each
   extruded with `THREE.ExtrudeGeometry` (light bevel for edge highlights) and lit only by the
   existing blue rim lights — the body material itself stays matte black/dark metallic
   (`#0a0a0c`, low roughness-adjacent clearcoat), exactly as specified. No mesh needed manual
   position/rotation offsets, because all three shapes already share one real coordinate space —
   they're correct relative to each other by construction, not by hand-tuning.
7. `GXFallback.tsx` (the non-WebGL / reduced-motion / small-viewport SVG version) uses the same
   three traced polygons in their raw pixel-space coordinates (`viewBox="0 0 941 932"`, matching
   the source PNG's canvas), so the 3D and 2D fallback are pixel-faithful to each other, not just
   independently "close enough."

**Known limitation:** the source was a raster PNG, not a vector file, so the trace is
pixel-accurate to that PNG's resolution/anti-aliasing rather than to a true vector master. If you
have the original vector (AI/SVG/EPS) source, it could replace these coordinate arrays for
perfect sub-pixel fidelity, but visually the current result is indistinguishable from the source
at every size tested.

Rotation stayed slow (`rotation.y += delta * 0.09`) with the existing gentle pointer-parallax tilt
— no speed/behavior changes beyond the geometry itself.

## 4. Reusable motion components

- **`GlowCard`** — every hover-glow card on the homepage (Real Problem, Authority/Visibility/
  Trust, Philosophy, Why GraphikosX, Build/Grow/Scale rows) mounts one of these instead of each
  section wiring its own `mousemove` listener. It writes pointer position into two CSS custom
  properties (`--gx-glow-x/y`) via a single `requestAnimationFrame`-throttled write per frame,
  directly on the DOM node — no React re-render per mouse move. `tone="light"` gives the blue
  diffused glow (light backgrounds); `tone="dark"` gives the white diffused glow + blue accent
  ring (dark backgrounds) — the "non-negotiable" unified grammar from your spec, implemented once.
  Cleans up its rAF and tap-timeout on unmount.
- **`ScrollActivationTimeline`** — shared by Customer Research Timeline and Process. Fixes the
  original vertical-centering bug (see §5) and adds the sequential 01→05 scroll activation, with a
  built-in mobile vertical fallback.
- **`HubConnectors`** — measures real DOM positions (via `getBoundingClientRect` +
  `ResizeObserver`, not guessed grid math) of a hub element and a set of target elements, then
  draws animated SVG connector lines between them.

## 5. Customer Research Timeline / Process — the line-centering fix

Root cause: the connector `<svg>` had a `viewBox="0 0 1000 40"` but no explicit CSS height, so its
*rendered* height was derived from the browser's intrinsic aspect-ratio sizing rather than
actually being 40px — meaning the path drawn at internal `y=20` did not land at `y=20` of the
visible box, throwing the line off the circles' true center by roughly 15–20px depending on
viewport width.

Fix: the SVG now has an **explicit** `h-12` (48px) matching the circles' own `h-12` diameter
exactly, with the line drawn at internal `y=24` — the mathematically exact center of a 48px
circle whose top edge aligns with the container top. This is pixel-exact by construction, not by
approximation, and it's identical at every viewport width because the height is no longer
aspect-ratio-derived.

Sequential activation: the timeline crosses 50% visibility (via `framer-motion`'s `useInView`,
one boolean crossing — not a scroll-position listener firing every 2px) and then steps `activeCount`
from 0 to N with a fixed 200ms stagger; scrolling back out resets it, so re-entering replays the
sequence once, not on every pixel of scroll. `prefers-reduced-motion` shows the fully-active end
state immediately. Mobile switches to a vertical rail layout (`sm:hidden` / `hidden sm:block`
pair) rather than reusing the horizontal grid.

## 6. Hub connector implementation (Real Problem section)

`DigitalPresenceProblem.tsx` wraps the six problem cards and the hub box in one `relative`
container, gives each card and the hub a DOM ref, and passes those refs into `HubConnectors`.
Hovering, focusing, or tapping (mobile) the hub box toggles `connecting`, which draws six SVG
lines from the hub's real top-edge position to each card's real bottom-edge position (measured,
not guessed), staggered by 100ms with a `motion.line` `pathLength` draw-in, plus a small pulsing
dot that travels each active line to read as "energy" rather than a static line simply appearing.

## 7. Vision journey line

The "India → Global → Category Leadership" pills sit in front of a flowing gradient line
(`.gx-journey-line`, a CSS `background-position` keyframe animation — not a JS-positioned dot, so
no width measurement is needed and it's compositor-cheap). The line spans the section's full
width, not just the pills' content width, so the flow visibly continues past "Category
Leadership" into the section edge, per your spec. The pills got an opaque `bg-ink` background so
the line reads cleanly in the gaps between them rather than showing through the text.

## 8. Industries radial network — connector geometry calculation

- **One-line center label:** `GRAPHIKOS<br />X` → `GRAPHIKOSX` on one line, with the hub circle
  bumped from 112px to 128px diameter and the label set to `text-[13px]` with tight tracking so it
  fits cleanly at one line without the geometry looking cramped.
- **Radius-based connector trim:** previously every line was drawn `x1={CENTER} y1={CENTER}`
  straight to each node's center, passing visibly through both the hub circle and the node circles.
  Every node sits at exactly `ORBIT_RADIUS` (225px) from `CENTER` by construction (`nodePosition`
  uses `cos`/`sin` × `ORBIT_RADIUS`), so the fix computes the unit vector from center to each node
  and pulls both endpoints back along that same ray: the start point moves out to `HUB_RADIUS`
  (64px) from center, and the end point pulls back to `ORBIT_RADIUS − NODE_RADIUS` (225 − 32 =
  193px) from center. Both endpoints now land exactly on their respective circle's edge — verified
  visually (screenshot on file) with a clear gap between the line and both circle interiors.
- **Energy animation:** the active connector gets a small `motion.circle` animated between the
  same two trimmed endpoints, looping, in addition to the line itself.
- **Panel transitions:** replaced the `key`-remount `Reveal` (which produced an abrupt cut) with
  `AnimatePresence mode="wait"` + a small opacity/y crossfade, so switching industries reads as one
  continuous transition instead of a hard swap.
- **Touch/mobile:** added `onClick` to each node button alongside the existing `onMouseEnter`/
  `onFocus`, since tap doesn't fire `mouseenter`. The mobile breakpoint (`lg:hidden`) still uses the
  existing plain accessible list — that part of the design was already correct and untouched.

## 9. Global card interaction system

One CSS block in `globals.css` (`.gx-card` / `.gx-card--dark`) plus one component (`GlowCard`)
implement the entire "non-negotiable" unified grammar: light backgrounds get a blue diffused glow
that follows the pointer; dark backgrounds get a white diffused glow plus a small blue accent
inset ring. Keyboard users get the identical visual via CSS `:focus-within`/`:focus-visible`
(centered glow, no JS needed for that path). Touch users get it via a `pointerdown` handler that
sets the glow position and holds it ~1.6s. This is the same implementation reused by all six card
families in scope — no per-section reimplementation.

## 10. Mobile / touch behavior summary

- Hover → tap equivalents added everywhere hover previously was the only trigger: `GlowCard`
  (pointerdown), the hub box (click toggles connectors), Industries nodes (click selects).
- Customer Research Timeline / Process switch to a vertical rail layout below `sm`.
- Industries switches to the existing plain list below `lg` (unchanged from Phase 2F).
- No new horizontal scroll was introduced by anything in this pass — verified at 320/375/390/430px
  (see §12 for one *pre-existing, out-of-scope* exception found during this check).

## 11. Reduced-motion behavior summary

- Hero: unchanged existing logic already swaps to the static SVG fallback under
  `prefers-reduced-motion`; the fallback's own pointer-parallax effect also exits early under
  reduced motion.
- `ScrollActivationTimeline`: shows the fully-active end state immediately, no stagger, no
  stroke-dashoffset transition.
- `GlowCard`: the glow opacity transition is disabled (still shows on hover/focus/tap, just
  without the fade).
- `HubConnectors` / Industries energy dot: the traveling pulse is not rendered at all under
  reduced motion (verified via `useReducedMotion()` guard); lines still draw but with `duration: 0`.
- Vision journey line: animation disabled, static gradient shown instead.

Verified live with Chromium's `reducedMotion: 'reduce'` emulation — screenshots on file show the
Customer Research Timeline fully lit (all five nodes blue, full line) on first paint, no animation
in between.

## 12. Performance considerations

- Three.js/R3F remains hero-only, unchanged from Phase 2F (confirmed via network-request
  inspection: the Three.js bundle only loads when WebGL is actually available and the viewport
  is ≥640px).
- No new `mousemove` listeners on `window`/`document` — every glow/pointer listener is scoped to
  its own card element via React's synthetic pointer events.
- Glow effects use a `radial-gradient` positioned by CSS custom properties, not a `blur()` filter
  over a large area.
- The Vision journey line animates `background-position`, not a JS-positioned element.
- `HubConnectors` uses one `ResizeObserver` per mount (cleaned up on unmount), not a scroll or
  resize polling loop.

## 13. QA results

- `npm run lint` — **0 errors, 0 warnings.**
- `npx tsc --noEmit` — **0 errors.**
- `npm run build` — **succeeds**, all 38 routes generated (0 changed from Phase 2F — no routes
  were added or removed).
- `npm run start` smoke test — homepage loads with **zero console/page errors**; verified visually
  at 1440px, 390px, and 375px, and with `prefers-reduced-motion: reduce` emulated.
- Interaction QA (via automated pointer simulation): hub→cards connector draw confirmed, card glow
  cursor-follow confirmed, Industries node-to-node connector trim + panel crossfade confirmed,
  Customer Research Timeline sequential activation confirmed both with and without reduced motion.

## 14. Known limitations / found-but-out-of-scope

- **Hero geometry is traced from a raster PNG**, not a vector master (see §3) — visually exact at
  every size tested, but a true vector source would allow perfect infinite-resolution fidelity if
  you have one.
- **`src/components/sections/Ecosystem.tsx` (the "GraphikosX Ecosystem" section, later on the
  homepage) has a pre-existing horizontal-overflow bug**, found during this pass's responsive QA
  sweep but **not fixed**, because it is not one of the 29 sections in scope and the brief was
  explicit about not touching anything outside that list. Concretely: its radial diagram is a
  fixed `480×480px` block with no responsive/mobile fallback (unlike `IndustriesTeaser`, which
  already solves the identical problem with a `hidden lg:grid` + separate mobile list), so on any
  viewport narrower than ~504px the page gets a forced horizontal scrollbar. This predates this
  session — nothing in this pass touches `Ecosystem.tsx` or caused it. Flagging it here rather
  than silently fixing it, since a fix would mean modifying a component outside this task's stated
  scope; happy to fix it in a follow-up pass on your go-ahead (the natural fix mirrors
  `IndustriesTeaser`'s existing pattern almost exactly).

## Stop condition

Per your instructions, this pass stops here — homepage motion/interaction/logo refinement only.
No other phase, page, or route was started or touched.
