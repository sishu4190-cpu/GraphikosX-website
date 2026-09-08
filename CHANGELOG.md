# GraphikosX — Phase 2H Changelog

## Full Website Experience & 10-Industry Specialization

This phase extends the Phase 2G homepage visual/interaction system (cursor
atmosphere, card depth/glow, text reveal hierarchy, pill interaction, energy
sweeps) across the rest of the site — Industries hub, all 10 industry detail
pages, Services hub, all 15 service detail pages, About, and Contact — without
redesigning layouts, routes, copy structure, SEO/AEO/GEO metadata, schema,
sitemap, robots.txt, analytics, lead handling, forms, redirects, security, or
accessibility behavior already in place from Phase 2F/2G.

**Addendum (post-delivery follow-up):** Task 36's mobile/touch behavior was
revisited after initial delivery — see §2a below for the mobile static/slow
atmospheric drift added on top of the already-complete desktop cursor
tracking and sitewide `CursorAtmosphere` coverage.

---

## 1. Industry data model & content

- **`src/lib/data/industries.ts`** — rewritten to the exact 10 GraphikosX
  industries: Doctors & Clinics, Real Estate, Education & Coaching, Jewellery
  & Wedding, Industrial Manufacturing & Chemicals, Legal/CA/Professional
  Services, Gyms & Fitness, Cafes & Restaurants, Architecture & Interior,
  Automobile & EV.
- **`src/lib/data/industry-details.ts`** — rewritten (all 10 entries). New
  fields: `eyebrow`, `challenges` (exactly 5 sector-specific challenge
  objects, replacing the old free-text `digitalGaps`), `transformation`
  (before/after pair), `ctaHeadline` (industry-specific Free Audit framing).
  `VisualStyle` extended with `"luxury"` (jewellery-wedding) and `"kinetic"`
  (automotive-ev) for stronger visual differentiation.
- **`src/lib/data/service-details.ts`** — `industries[]` cross-link arrays
  fixed across 7 services (stale `founders-personal-brands` references
  removed, `jewellery-wedding` added where thematically relevant).

### Industry architecture explanation (route/slug decisions)

The user's requested industry list overlaps with, but doesn't exactly match,
the pre-existing industry set. To satisfy both "use exactly these 10
industries" and "don't unnecessarily rename existing routes / break SEO," the
following judgment calls were made:

| Slug (unchanged) | Old display name | New display name |
|---|---|---|
| `healthcare` | Healthcare | Doctors & Clinics |
| `legal-professional-services` | Legal & Professional Services | Legal, CA & Professional Services |
| `fitness-wellness` | Fitness & Wellness | Gyms & Fitness |
| `hospitality` | Hospitality | Cafes & Restaurants (content narrowed from general hospitality to cafes/restaurants specifically) |

`founders-personal-brands` was retired (not part of the user's 10) and
replaced with a new `jewellery-wedding` industry with fully original content.
All other 6 slugs (`real-estate`, `education-coaching`,
`industrial-manufacturing-chemicals`, `architecture-interior`,
`automotive-ev`, and the new `jewellery-wedding`) were already correctly
named or newly added. No industry that existed pre-2H lost its URL.

### Routes (all 10, statically generated)

- `/industries/healthcare`
- `/industries/real-estate`
- `/industries/education-coaching`
- `/industries/jewellery-wedding`
- `/industries/industrial-manufacturing-chemicals`
- `/industries/legal-professional-services`
- `/industries/fitness-wellness`
- `/industries/hospitality`
- `/industries/architecture-interior`
- `/industries/automotive-ev`

### 5 challenges per industry (summary)

Each industry page ships exactly 5 sector-specific challenge cards (title +
description), written to pass the test "if the industry name were removed
from the hero, the rest of the page still reveals the sector." Full text
lives in `src/lib/data/industry-details.ts`; representative titles:

- **Doctors & Clinics**: Trust Before the First Call · Thin Local
  Discoverability · Unmanaged Reviews · Communicating Expertise Ethically ·
  Appointment & Lead Leakage
- **Real Estate**: (project differentiation, buyer trust before site visit,
  listing fatigue, sales-cycle-length nurturing, broker/channel competition)
- **Education & Coaching**: (enrollment trust, outcome credibility,
  seasonal/cohort demand, comparison shopping, retention/referral)
- **Jewellery & Wedding**: (high-consideration purchase trust, craftsmanship
  communication, seasonal/wedding-calendar demand, showroom-to-online
  bridge, price-transparency anxiety)
- **Industrial Manufacturing & Chemicals**: (B2B technical credibility, long
  sales cycles, compliance/spec communication, procurement gatekeeping,
  discoverability for niche capability)
- **Legal, CA & Professional Services**: (trust and discretion, expertise
  signaling without overclaiming, referral-dependency, comparison
  difficulty, retainer/engagement clarity)
- **Gyms & Fitness**: (local competition density, membership churn,
  trial-to-signup conversion, community/energy communication online,
  seasonal demand swings)
- **Cafes & Restaurants**: (local discovery, review dependency, footfall vs.
  delivery-platform competition, ambience communication, repeat-visit
  loyalty)
- **Architecture & Interior**: (portfolio-led trust, long consideration
  cycles, budget-fit signaling, differentiation among visually similar
  competitors, project-to-lead conversion)
- **Automobile & EV**: (showroom-to-digital bridge, technical/spec trust,
  service vs. sales messaging, EV-specific education gap, local competitive
  density)

## 2. Global design system extension

- **`src/components/motion/CursorAtmosphere.tsx`** — mounted on every major
  section across Industries hub, all 10 industry detail pages, Services
  hub, all 15 service detail pages, About, and Contact, alternating
  `tone="light"`/`tone="dark"` to match each section's background.
  IntersectionObserver-gated, no React state on mousemove, respects
  `prefers-reduced-motion`.

### 2a. Task 36 follow-up — mobile/touch atmosphere

The initial Phase 2H delivery disabled the atmosphere layer entirely below
`lg` (1024px) — correct in that it never ran pointer-tracking JS on touch,
but it meant mobile/tablet visitors saw no atmosphere at all rather than a
lighter equivalent. This was revisited to match the fuller spec ("no heavy
pointer tracking on mobile — use static/slow atmospheric gradients
instead"):

- `CursorAtmosphere.tsx` now creates its `IntersectionObserver` unconditionally
  (previously only for fine-pointer devices), and uses it for **two**
  purposes depending on device: on fine-pointer devices it still gates the
  `pointermove`-driven CSS-var writes exactly as before; on touch/coarse-pointer
  devices it toggles an `is-in-view` class instead, with zero per-frame JS
  work — no listener is ever attached.
- `globals.css` gives touch/mobile (`max-width: 1023px`) a **static,
  very slow (32s), low-opacity `background-position` drift** between two
  fixed hotspots — the same blue-only palette and opacity range as the
  desktop glow, just not pointer-driven. It only plays
  (`animation-play-state: running`) while `is-in-view` is present, so
  off-screen sections do zero animation work, matching the "pause/reduce
  expensive effects when off-screen" requirement on mobile too, not just
  desktop.
- `prefers-reduced-motion: reduce` still hides the layer outright
  (`display: none`) on every device — unchanged, and verified against the
  new mobile path as well (see `FINAL_QA_REPORT.md` §5a).
- No hydration risk: the element renders identically server/client in every
  case; only a `classList` toggle happens post-mount inside `useEffect`,
  the same pattern `GlowCard.tsx`'s `is-glowing` class already used safely.
- **`src/components/motion/GlowCard.tsx`** (pre-existing, unchanged) — now
  wraps card-style content across Industry Challenges, Trust Signals,
  Relevant Services, Transformation, Outcomes, Ecosystem/FAQ blocks, Services
  hub's 15-service grid, About's Q&A cards, and Contact's 3 channel cards.
  `focusable` used only where the card has no natively focusable child (per
  the component's own WCAG 2.1.1 guidance); omitted where the card already
  wraps a `<Link>`/`<a>` to avoid duplicate keyboard focus stops (fixed one
  such case in `ContactChannels.tsx` during QA).
- **`src/app/globals.css`** — `.gx-card`/`.gx-card--dark` glow/ring overlay
  selectors extended to also trigger on plain CSS `:hover` (previously only
  JS-driven `.is-glowing` or `:focus-visible`/`:focus-within`), so the many
  new Phase 2H card usages that are plain elements with the `gx-card` class
  (not wrapped in `GlowCard`'s pointer-tracking JS) still show a centered
  glow on hover. Small, additive, site-wide benefit.
- **`.gx-pill`/`.gx-pill--light`/`.gx-pill--dark`** (pre-existing) — applied
  to industry eyebrow badges, About's input/output/journey pills, Services
  hub's ecosystem pills, Industries hub's "Different X" pills.
- **`.gx-sweep`/`.gx-sweep--vertical`** (pre-existing) — applied to
  Industry Transformation cards and Services' Outcomes Map rows (the latter
  required adding `relative` explicitly, since `.gx-sweep` alone only sets
  `overflow:hidden`, not `position:relative`).

## 3. Industries hub (`/industries`)

- **`src/components/pages/industries/IndustriesSystem.tsx`** — fixed the
  radial-network connector-line geometry bug: lines previously ran raw
  center-to-center (`x1/y1` = hub center, `x2/y2` = node center), visually
  passing through both circles. Now uses a `connectorSegment()` function
  that trims both endpoints along the unit vector from center by each
  circle's own radius (`HUB_RADIUS = 64`, `NODE_RADIUS = 40`), matching the
  already-correct pattern from the homepage's `IndustriesTeaser.tsx`. The
  active-node energy-dot animation now travels only between the trimmed
  endpoints, so it visibly stops at the node boundary rather than
  disappearing underneath it.
- Every node is now a real `<Link href="/industries/{slug}">` (previously a
  plain `<button>` with hover-preview only, no navigation) — every node and
  every mobile-list row now leads to its own dedicated industry page.
- `CursorAtmosphere`, `GlowCard`/`.gx-card` treatment added to the preview
  panel and mobile list rows.
- **`src/components/pages/industries/IndustriesAnswers.tsx`** — the "Which
  industries does GraphikosX serve?" FAQ answer was hardcoded and stale
  (listed a retired industry, missing Jewellery & Wedding). Now generated
  dynamically from the live `industries` array so it can never drift out of
  sync again.
- **`src/app/industries/page.tsx`** — stale meta description corrected to
  reflect the current industry list.
- `IndustriesHero.tsx`, `WhySpecialize.tsx` — cursor atmosphere + pill
  polish added.

## 4. Industry detail page template

New render order in **`src/app/industries/[slug]/page.tsx`**:

`IndustryHero → IndustryAnswer → IndustryChallenges → BuyerJourney →
TrustSignals → RelevantServices → IndustryTransformation → IndustryOutcomes
→ IndustryApproach → IndustryEcosystem → IndustryFAQ → IndustryCTA`

- **`IndustryChallenges.tsx`** (new) — exactly 5 challenge cards, numbered
  badges (`01`–`05`, no cartoon icons), `GlowCard`-based.
- **`IndustryTransformation.tsx`** (new) — single before/after card reusing
  the homepage Mission section's exact sweep/hover mechanism.
- **`DigitalGap.tsx`** — deleted (superseded by `IndustryChallenges.tsx`
  once `digitalGaps` was removed from the data model).
- **`IndustryHero.tsx`** — eyebrow now industry-specific (`detail.eyebrow`
  instead of the generic industry name); cursor atmosphere added.
- **`IndustryCTA.tsx`** — headline now industry-specific
  (`detail.ctaHeadline`), old generic sentence demoted to a supporting line;
  cursor atmosphere added.
- **`StyleMotif.tsx`** — two new SVG motifs added (`luxury` faceted-gem
  outline, `kinetic` speed-trail chevron), both using the existing
  blue-only (`#1D4ED8`) palette — no new colors introduced.
- `TrustSignals.tsx`, `RelevantServices.tsx`, `IndustryOutcomes.tsx`,
  `BuyerJourney.tsx`, `IndustryEcosystem.tsx`, `IndustryFAQ.tsx`,
  `IndustryApproach.tsx`, `IndustryAnswer.tsx` — cursor atmosphere added
  throughout; card/pill treatment applied where applicable, list semantics
  (`<li>`) preserved everywhere a `GlowCard` was nested inside one.

## 5. Services hub & service detail pages

- **`ServicesHero.tsx`, `AIPositioning.tsx`, `OutcomesMap.tsx`** — cursor
  atmosphere added; `OutcomesMap.tsx` rows got the sweep treatment +
  keyboard focusability.
- **`ServicesAnswers.tsx`** — rewritten to the same `GlowCard` Q&A pattern
  as Industries/About.
- **`ServiceSystem.tsx`** — the 15-service Build/Grow/Scale grid converted
  to `GlowCard`-wrapped cards.
- **`ServiceHero.tsx`, `ServiceDefinition.tsx`, `ServiceProblem.tsx`,
  `ServiceApproach.tsx`, `ServiceOutcome.tsx`, `ServiceFAQ.tsx`,
  `ServiceCTA.tsx`** — cursor atmosphere added.
- **`ServiceSignals.tsx`, `ServiceDeliverables.tsx`** — rewritten with
  `GlowCard` wrapping while preserving `<Reveal as="li">` list semantics.
- **`ServiceEcosystem.tsx`** — "Relevant Industries" section relabeled to
  **"Best Suited For" / "The industries this matters most in"** (this
  section already existed and read from `service-details.ts`'s
  `industries[]` field — spec's "Best suited for → industry links"
  requirement was satisfied by fixing/restyling existing functionality, not
  building new).

### Service → Industry linking map

Every service's `industries[]` array (in `service-details.ts`) drives the
"Best Suited For" section on that service's own detail page. Representative
mappings after the Phase 2H data fix:

- `brand-strategy` → Real Estate, Doctors & Clinics, Jewellery & Wedding
- `visual-identity` → Architecture & Interior, Cafes & Restaurants, Jewellery & Wedding
- `google-business-profile` → Gyms & Fitness, Cafes & Restaurants, Doctors & Clinics, Jewellery & Wedding
- `content-production` → Legal/CA/Professional Services, Industrial Manufacturing & Chemicals, Jewellery & Wedding
- `linkedin-personal-branding` → Architecture & Interior, Legal/CA/Professional Services, Industrial Manufacturing & Chemicals
- `marketing-consultation` → Education & Coaching, Industrial Manufacturing & Chemicals
- `social-media-management` → Gyms & Fitness, Cafes & Restaurants, Automobile & EV, Jewellery & Wedding
- (remaining 8 services unchanged from Phase 2G, no stale references found)

## 6. About page

All 9 components (`AboutHero`, `WhyExists`, `AboutVision`, `AboutMission`,
`WhatWeBelieve`, `AboutPhilosophy`, `AboutFounder`, `AboutAnswers`,
`AboutCTA`) received cursor atmosphere matching their background tone.
Additional polish:

- **`AboutVision.tsx`** — journey pills → `.gx-pill--dark`; the "Revenue
  builds the company" box → `.gx-card.gx-card--dark`.
- **`AboutMission.tsx`** — input/output pills → `.gx-pill--light`/`--dark`.
- **`WhatWeBelieve.tsx`** — list rows keyboard-focusable + subtle hover
  tint (required extending `Reveal.tsx` with an optional `tabIndex` prop).
- **`AboutPhilosophy.tsx`** — dark info box → `.gx-card.gx-card--dark`.
- **`AboutFounder.tsx`** — traits → `.gx-pill--light`; added a circular
  founder photo avatar (reusing the existing `/founder/prakash-pal.jpg`
  asset from Phase 2G) next to the founder's name — the "founder visual
  treatment" the spec asked for, no new photography needed.
- **`AboutAnswers.tsx`** — Q&A blocks → `GlowCard`.

No fabricated achievements, stats, or claims were added anywhere on this
page — all copy is the existing verified Phase 2F/2G content.

## 7. Contact page

- **`ContactHero.tsx`** — cursor atmosphere added.
- **`ContactChannels.tsx`** — the 3 WhatsApp/Call/Email cards converted to
  `GlowCard`-wrapped, preserving every `href`/`onClick`/`target`/`rel`
  attribute exactly.
- **`ContactForm.tsx`** — cursor atmosphere added to both the form section
  and the post-submit success section; the success confirmation box given
  the `.gx-card` treatment. **No changes to `handleSubmit`, `validate`,
  `submitLead`, honeypot, or UTM capture logic** — usability and lead
  delivery were prioritized over decoration per the spec's explicit
  instruction.
- **`src/components/ui/form/fields.tsx`** (shared by `ContactForm` and any
  other consumer, e.g. the multi-step Free Audit form) — focus-state style
  upgraded from a bare Tailwind ring utility to an explicit soft blue
  box-shadow (`focus:shadow-[0_0_0_4px_rgba(29,78,216,0.1)]`), matching
  error-state box-shadow added to keep validation visibility identical to
  before. All `aria-invalid`, `aria-describedby`, `autoComplete`, `required`
  wiring untouched.

## 8. WhatsApp visual overhaul

- **`src/components/ui/FloatingWhatsApp.tsx`** — default state changed from
  WhatsApp green (`bg-[#25D366]`) to `bg-ink`, hover state now uses the
  GraphikosX accent blue with a soft blue glow shadow
  (`hover:shadow-[0_10px_28px_-6px_rgba(29,78,216,0.55)]`), matching the
  Instagram/LinkedIn footer link treatment. URL, `target="_blank"`,
  `aria-label`, and the existing idle "breathe" animation are all
  unchanged. Confirmed zero remaining `#25D366` references anywhere in the
  codebase. **Not** re-added to the navbar (per explicit instruction — only
  the floating widget was ever WhatsApp-branded).

## 9. Reusable architecture note

No industry got a hand-built one-off page component. All 10 industry pages
render through the single `src/app/industries/[slug]/page.tsx` template,
driven entirely by structured data in `industry-details.ts`. All 15 service
pages likewise render through one `src/app/services/[slug]/page.tsx`
template. Content is plain data (server-rendered, crawlable) — none of it
lives only inside client-side animation objects. This is what let all 10
industries + 15 services generate as static HTML at build time (see
`FINAL_QA_REPORT.md`).

## 10. What was explicitly NOT touched

Per the spec's "not a redesign" instruction: existing routes, copy voice,
SEO/AEO/GEO metadata structure, JSON-LD schema, `sitemap.xml`,
`robots.txt`, analytics event names, lead-handling/submission logic, form
validation, redirects, security headers, accessibility landmarks, and
`prefers-reduced-motion` handling were all left as Phase 2F/2G shipped them
— this phase only extended the homepage's visual/interaction language onto
the same underlying structure and content.

---

**PENDING IMPLEMENTATION TASKS: 0**
**GRAPHIKOSX PHASE 2H STATUS: READY FOR USER REVIEW**

---

# Phase 3 — "Wow Factor" Upgrade

## Phase 0 — Industries data swap: Cafes & Restaurants → Financial Services & Wealth Management

Done as a standalone data-only step before any of Phase 3's animation/interaction
work (Lenis, GSAP/ScrollTrigger, page transitions, hero shader rebuild, etc.),
since it touches business content rather than the visual/interaction system.

**What changed and why:** the 10-industry list for this engagement replaces
"Cafes & Restaurants" (the `hospitality` slug) with a new "Financial Services
& Wealth Management" industry. Unlike the four Phase 2H display-name
refinements (Healthcare → "Doctors & Clinics", etc.), which kept their
original slugs because they're the same business vertical under a sharper
name, this is a genuinely different vertical with different search intent —
so the `hospitality` slug is retired rather than repurposed, with a
permanent redirect to `/industries` for anyone who has the old URL bookmarked
or indexed.

- **`src/lib/data/industries.ts`** — replaced the `hospitality` entry with
  `financial-services-wealth-management` (new slug, name, shortLabel,
  challenge, opportunity). Updated the file's header comment accordingly.
- **`src/lib/data/industry-details.ts`** — removed the `hospitality` detail
  block; added a fully original `financial-services-wealth-management` block
  (eyebrow, headline, hero copy, exactly 5 sector-specific challenges, buyer
  journey, trust signals, relevant-service cross-links, outcomes, 5-phase
  approach, ecosystem, before/after transformation, 4 FAQs, CTA framing,
  meta title/description). No hospitality-specific copy, imagery references
  or testimonials were carried over — written fresh, mirroring the
  trust/credibility/compliance-conscious tone already established by the
  `legal-professional-services` entry (the closest existing analog), while
  keeping every claim non-committal about returns or outcomes, matching how
  the `healthcare` entry stays careful about medical claims.
- **`VisualStyle` type** (same file) — added a new `"trust"` variant for this
  industry, rather than reusing `hospitality`'s old `"local"` bucket (a
  neighbourhood/map-pin motif doesn't fit a financial-services page) or the
  existing `"authority"` bucket used by legal (kept visually distinct).
- **`src/components/pages/industry-detail/StyleMotif.tsx`** — added the
  `"trust"` case: a shield-and-checkmark motif (security/credibility,
  deliberately not a growth-chart/upward-arrow shape, to avoid any visual
  implication of promised returns). Updated the style-bucket mapping comment.
- **`src/lib/data/service-details.ts`** — removed `hospitality` from the 3
  services that referenced it (`visual-identity`, `social-media-management`,
  `google-business-profile` — none of which are a strong fit for financial
  services, being visual/local-discovery-driven). Added
  `financial-services-wealth-management` to the 5 services that mirror its
  closest analog, `legal-professional-services`'s own cross-links:
  `business-websites`, `seo`, `content-production`,
  `linkedin-personal-branding`, `digital-infrastructure`.
- **`next.config.ts`** — added a `redirects()` block: permanent redirect from
  `/industries/hospitality` to `/industries`.
- **`public/llms.txt`** — updated the Hospitality line to Financial Services
  & Wealth Management. Note: this file was already out of sync with the
  Phase 2H industry list before this change (missing `jewellery-wedding`,
  still lists the retired `founders-personal-brands`, uses pre-2H display
  names) — that pre-existing drift was left alone here as out of scope for
  this step, and is worth a dedicated cleanup pass separately.
- **No changes** to `sitemap.ts` — it derives industry routes from
  `industries.ts` at build time, so the new route is picked up automatically
  and the old one drops out on its own.

**PHASE 3 / STEP 0 STATUS: READY FOR USER REVIEW**

---

## Phase 1 — Lenis smooth scroll (sitewide)

Tier 1, item 1 of the Phase 3 "wow factor" plan. Adds sitewide smooth
scrolling for wheel/desktop input, with no change to touch-device scroll
behavior and a full opt-out under `prefers-reduced-motion`.

- **`package.json`** — added `lenis` (`^1.3.26`) as a dependency. Uses the
  package's official `lenis/react` entry point (`ReactLenis`, `useLenis`)
  rather than hand-rolling a RAF loop.
- **`src/components/motion/SmoothScrollProvider.tsx`** (new) — mounts
  `<ReactLenis root>` in `root` mode, which attaches Lenis to the
  window/document scroll directly and renders zero wrapper DOM — `children`
  passes straight through a context provider. This is what keeps every
  existing scroll-position-dependent thing working unmodified:
  `Header.tsx`'s own `window.scrollY` listener, every `IntersectionObserver`
  in `CursorAtmosphere`/`GXHero`/`ScrollActivationTimeline`, and
  framer-motion's `useInView`/`whileInView` all still read the real final
  scroll position every frame — Lenis only smooths the wheel *input*, not
  the position it produces. `syncTouch` is left at its default (`false`),
  so touch scroll is completely untouched, consistent with
  `CursorAtmosphere.tsx`'s existing "no heavy custom behavior on touch"
  rule.
  `prefers-reduced-motion` is checked once, client-side, inside an effect —
  the same decide-after-mount pattern `GXHero.tsx` and
  `CursorAtmosphere.tsx` already use. When reduced motion is on, Lenis is
  never instantiated (not instantiated-then-disabled) — `children` renders
  completely unwrapped, giving native/instant scroll. Both branches render
  identical DOM, so flipping this after mount carries no hydration-mismatch
  risk.
- **`src/app/layout.tsx`** — wraps `<Header/><main/><Footer/><FloatingWhatsApp/>`
  in `<SmoothScrollProvider>`. `GoogleAnalytics` stays outside it (no reason
  for it to need scroll context). `layout.tsx` remains a Server Component —
  only `SmoothScrollProvider` itself is a client boundary.
- **`src/components/pages/free-audit/FreeAuditWizard.tsx`** — **bug found
  and fixed during testing, not a planned change.** The wizard's existing
  `goToStep()` scrolled to top via a raw `window.scrollTo({ top: 0,
  behavior: "smooth" })` on every step change. Once Lenis is smoothing
  wheel-driven scroll sitewide, that raw call gets fought/overridden by
  Lenis's own RAF loop mid-animation — verified with an automated
  browser test: after this file was left unchanged, scrolling down and
  advancing a wizard step left the page at `scrollY ≈ 600` instead of `0`.
  Fixed by reading the active instance via `useLenis()` and calling
  `lenis.scrollTo(0, { duration: 1 })` when Lenis is mounted, falling back
  to the original native call when it isn't (i.e. under
  `prefers-reduced-motion`, where behavior is completely unchanged from
  before this phase). This is the one lead-capture-adjacent file touched in
  Phase 3 so far, and only because Lenis's introduction silently broke its
  existing behavior — the wizard's validation, submission and analytics
  logic are untouched.

**Verification performed (not just planned — actually run):** `tsc
--noEmit` clean; `next build` succeeds, all 38 routes including all 10
industry pages still statically generate; an automated Playwright suite
against the production build confirmed (1) Lenis mounts (`html.lenis`
class present) under normal motion, (2) `window.scrollY` advances correctly
on wheel scroll and `Header.tsx`'s scrolled-state background transition
still fires, (3) Lenis does **not** mount under `prefers-reduced-motion`,
and (4) the free-audit wizard's scroll-to-top on step change works
correctly (confirmed broken before the `FreeAuditWizard.tsx` fix, confirmed
fixed after). Lenis's shared chunk measured at ~8.4 KB gzipped, loaded once
sitewide via the root layout.

**PHASE 3 / STEP 1 STATUS: READY FOR USER REVIEW**

---

## Phase 2 — GSAP + ScrollTrigger (pilot, CustomerJourney only)

Tier 1, item 2 of the Phase 3 plan. Two decisions were confirmed with the
user before writing any code, since the plan itself didn't cover them:

1. **Scope**: `ScrollActivationTimeline.tsx` (the original time-based reveal)
   turned out to be shared by both `CustomerJourney` (homepage SEARCH →
   DECIDE) and `HowWeWork` (homepage Discover → Optimize) — the plan's
   "pilot on one section" language assumed a single owner. Decision: fork a
   new component for `CustomerJourney` only; `HowWeWork` keeps
   `ScrollActivationTimeline` completely untouched until this pilot is
   approved to roll out further.
2. **Pin behavior**: scroll-scrub (steps light up tied to scroll position,
   page keeps scrolling normally) rather than scroll-pin (section freezes
   in place). Chosen for lower mobile Safari risk and to keep the heaviest
   scrollytelling techniques reserved for Tier 2, per the user's own stated
   preference.

- **`package.json`** — added `gsap` (`^3.15.0`). Note on licensing: GSAP's
  own registry metadata lists it under their "Standard no-charge license"
  (gsap.com/standard-license) — since Webflow's 2024 acquisition this
  covers ScrollTrigger and effectively all plugins for standard commercial
  use at no cost (no more "Club GreenSock" paywall); it is not a literal
  MIT/OSS license, so if GraphikosX redistributes GSAP's *source* as part
  of a resellable template/product rather than using it to build this one
  site, it's worth a quick read of that license page — for building and
  operating this site itself, it applies with no restriction relevant here.
- **`src/lib/gsap.ts`** (new) — single shared registration point:
  `registerGsapScrollTrigger()` calls `gsap.registerPlugin(ScrollTrigger)`
  exactly once (idempotent-guarded), and every component re-exports
  `gsap`/`ScrollTrigger` from here rather than importing the `gsap` package
  directly, so there's one place that knows which plugins this project uses.
- **`src/components/motion/ScrollScrubTimeline.tsx`** (new) — the pilot
  itself. Same visual markup/Tailwind classes as `ScrollActivationTimeline`
  (visually identical at rest), but activation is driven by a
  `ScrollTrigger` in `scrub` mode instead of a fixed-time stagger: scroll
  down and a step lights up at the matching scroll position; scroll back up
  and it un-lights at that same point (verified bidirectional in testing).
  No pin, per the confirmed decision. Performance discipline matches
  `CursorAtmosphere.tsx`/`GlowCard.tsx`: zero React state on scroll —
  `onUpdate` writes the connector line's `stroke-dashoffset` and each
  circle's classList directly via refs, and only touches a circle's
  classList when its active/inactive state actually changes, not on every
  tick. Also forwards Lenis's own scroll tick to `ScrollTrigger.update()`
  via `useLenis()` (the integration GSAP's and Lenis's docs recommend),
  without requiring `SmoothScrollProvider.tsx` — a sitewide Tier-1 file — to
  import GSAP at all. `prefers-reduced-motion` skips ScrollTrigger entirely
  and shows the fully-active end state immediately, matching
  `ScrollActivationTimeline`'s existing reduced-motion behavior exactly.
- **`src/components/motion/ScrollScrubTimelineHost.tsx`** (new) — the
  `next/dynamic(..., { ssr: false })` client boundary for the component
  above, mirroring the existing `Hero.tsx` → `GXHero.tsx` → `GXScene.tsx`
  three-layer split for `@react-three/fiber`: `ssr: false` is only valid
  inside a Client Component, so this small "use client" host is what lets
  `CustomerJourney.tsx` stay a plain Server Component while still getting
  gsap/ScrollTrigger excluded from the server render pass and from every
  other route's bundle. Its `loading` fallback reserves the timeline's
  approximate height (no content duplication, no layout shift) while the
  chunk loads — in practice under 100ms for a same-origin chunk.
- **`src/components/sections/CustomerJourney.tsx`** — now renders
  `ScrollScrubTimelineHost` instead of `ScrollActivationTimeline`. Nothing
  else in this file changed.
- **`src/components/motion/ScrollActivationTimeline.tsx`** and
  **`src/components/sections/HowWeWork.tsx`** — **not touched**, per the
  confirmed scope decision above.

**Verification performed (not just planned):** `tsc --noEmit` and `eslint`
both clean; `next build` succeeds, all 38 routes unchanged. Bundle
isolation confirmed three independent ways — (1) exactly one build chunk
contains gsap/ScrollTrigger (44 KB gzipped), (2) that chunk's id appears
ONLY in the homepage's own `react-loadable-manifest.json`, checked against
every other route's manifest with zero matches, (3) the rendered HTML of
`/contact`, `/industries/healthcare` and `/services/seo` references it
nowhere. A Playwright suite against the production build then confirmed:
zero console/page errors on the homepage, on reduced-motion, on the three
other-route checks above, and under iPhone 13 viewport emulation; the GSAP
chunk is actually requested and loads (200) on the homepage and is never
requested on the other three routes; the active-step count genuinely rises
as the section scrolls into view (1 → 5) and falls again scrolling back up
(5 → 2), confirming true bidirectional scroll-scrubbing rather than a
one-shot reveal; reduced motion shows all 5 steps active immediately with
no scrolling; and `HowWeWork` (untouched) still reveals its own steps
correctly on scroll-into-view, independently re-confirmed after an initial
test-script selector bug on my end (not a code issue) briefly suggested
otherwise.

**Known gap, not fixed in this phase:** WebKit/Safari isn't installable in
this environment, so mobile Safari — the specific browser this plan
flagged as the highest-risk one for ScrollTrigger — was only checked via
Chromium's mobile-viewport emulation (iPhone 13 dimensions/touch, not the
real WebKit engine). Real-device Safari testing is called out explicitly
in the "tests to run yourself" for this phase.

**PHASE 3 / STEP 2 (PILOT) STATUS: READY FOR USER REVIEW**

## Hotfix — Keyboard/scrollbar scroll fighting Lenis on `<html>`

**Reported by the user:** after testing Phase 2 locally, the homepage
appeared to stop scrolling partway down — "page niche scroll ho hi nahi
raha" ("the page just isn't scrolling further"), reported with screenshots
mid-scroll on `localhost:3000`.

**Root cause found:** `src/app/globals.css` had a pre-existing rule —
`html { scroll-behavior: smooth; }` — that predates this project's changes
entirely (it made anchor-link jumps glide instead of snap, back when
nothing else on the page was moving `window.scrollY`). Once Phase 1 mounted
Lenis in `root` mode, Lenis began driving `window.scrollTo()` itself, every
animation frame, for wheel-driven scrolling. Any scroll Lenis does **not**
originate — pressing PageDown/Space/Home/End, or dragging the scrollbar
thumb — still falls through to the browser's own default scroll behavior,
and that CSS rule made the *browser* animate those scrolls too. Two
independent smoothing animations fighting over the same scroll position,
every frame, is what made keyboard/scrollbar scrolling feel like it
stalled. Plain mouse-wheel/trackpad scrolling was never affected, because
Lenis intercepts wheel input directly and never hands it to the browser's
native smooth-scroll path in the first place — which is why this was easy
to miss in my own first pass of Phase 1/2 testing (all done by
mouse-wheel-driven Playwright scripts).

**Fix:** removed `html { scroll-behavior: smooth; }` (and its now-dead
`prefers-reduced-motion` override) from `globals.css`. Lenis's own
`duration`/`easing` options (`SmoothScrollProvider.tsx`, unchanged) are now
the only thing that makes scrolling feel smooth on this site — keyboard and
scrollbar scrolling become instant (not "smooth-animated"), which is the
correct, un-fought behavior; wheel scrolling is unaffected either way.

**Verified:** a repeated-PageDown press test that previously covered only
a third of the homepage's height now covers meaningfully more ground, with
no change to wheel-scroll behavior (confirmed already-perfect before and
after). `tsc --noEmit` clean, `next build` succeeds.

**Also investigated, NOT fixed here (flagged for a separate decision):**
this same repeated-PageDown-press test still doesn't reach the very bottom
of the homepage as cleanly as a plain page would. Bisecting this
line-by-line (temporarily reverting Phase 2's GSAP component back to the
original, testing with `prefers-reduced-motion` forced on, testing with the
homepage's WebGL hero forced into its static fallback, and finally
rebuilding the homepage exactly as it was *before Phase 0* to test the
original baseline) traced this to something present on this exact homepage
**before any Phase 1/2/3 work started** — it is not a Lenis or GSAP
regression. It shows up only under a rapid, repeated-keypress stress test
that isn't representative of how someone actually scrolls (mouse wheel,
trackpad, and a single PageDown/End press all reach the true bottom
correctly, every time, in every version tested). The most likely
contributor is the homepage's WebGL hero animation, which currently
renders continuously and never pauses even once scrolled off-screen —
disabling it measurably (not completely) reduced the effect in testing.
Left as-is pending the user's input, since the real fix there (pausing the
hero's render loop off-screen) is a separate, deliberate performance change
outside this bug report's scope, not a one-line CSS fix.

**Files changed:**
- `src/app/globals.css` — removed the conflicting `scroll-behavior: smooth`
  rule and its dead reduced-motion override; added an explanatory comment
  in its place.

**HOTFIX STATUS: READY FOR USER REVIEW**

## Phase 2b — Scroll-scrub rollout: HowWeWork + BuyerJourney (all 10 industry pages)

Approved after the Phase 2 pilot (CustomerJourney) tested well. Rolls the
same scroll-scrubbed activation out to the two other places identified in
the original plan: `HowWeWork.tsx` (homepage) and `BuyerJourney.tsx` (one
shared component, rendered identically on all 10 industry detail pages —
so this is a single file change, not 10 separate ones).

**`src/components/sections/HowWeWork.tsx`** — swapped
`ScrollActivationTimeline` for `ScrollScrubTimelineHost`, the exact same
component `CustomerJourney.tsx` already uses (its steps data already
matches the same `{id, number, label, detail}` shape, so no new component
was needed here — a straight import swap). `CustomerJourney.tsx`'s comment
was updated to reflect that `ScrollActivationTimeline` is no longer used
anywhere in the codebase after this change (it's left in place, unused by
any page, in case a future section wants the fixed-time reveal instead).

**`src/components/pages/industry-detail/BuyerJourney.tsx`** — converted
from a Client Component (Framer Motion `whileInView`, once, on first
scroll into view) to a plain Server Component, matching the
`CustomerJourney.tsx` / `HowWeWork.tsx` pattern. It now renders a new
`BuyerJourneyScrubHost`, keeping its own `SectionHeader`/`Container`/
`CursorAtmosphere` unchanged.

**`src/components/motion/BuyerJourneyScrub.tsx`** (new) — a dedicated fork
(not a shared component with `ScrollScrubTimeline.tsx`), because
`detail.buyerJourney` is a plain `string[]` (not step objects) and the
original layout was a single responsive grid, not two separate desktop/
mobile blocks. That original layout — the connector SVG hidden on mobile,
the row-then-column responsive step cards — is kept pixel-for-pixel;
only the activation mechanism changes, from a one-shot `whileInView`
reveal to a GSAP `ScrollTrigger` `scrub: 0.4`, no pin, exactly mirroring
the pilot. One deliberate visual addition, called out explicitly rather
than treated as incidental: steps now show a "not yet reached" numbered
state before you scroll into them (matching `ScrollScrubTimeline`'s
established look) instead of being invisible until their one-time reveal.
`prefers-reduced-motion` skips ScrollTrigger and shows the fully-active
end state immediately, matching the pilot.

**`src/components/motion/BuyerJourneyScrubHost.tsx`** (new) — the
`next/dynamic(..., { ssr: false })` client boundary for the component
above, identical in role to `ScrollScrubTimelineHost.tsx`: keeps gsap out
of the server render pass and out of every route except the ones that
actually use it.

**Verification performed:** `tsc --noEmit` and `eslint` both clean;
`next build` succeeds, all 38 routes generate correctly (all 10 industry
pages statically prerendered as before). Bundle isolation re-confirmed:
exactly one build chunk contains gsap/ScrollTrigger, and it's referenced
in only two route manifests — `/` (homepage: CustomerJourney + HowWeWork)
and `/industries/[slug]` (BuyerJourney) — confirmed absent from `/about`,
`/contact`, `/services`, `/services/[slug]`, and `/free-audit`'s manifests
and never requested over the network on those routes. A Playwright pass
against the production build confirmed: HowWeWork's steps light up
scrolling down and un-light scrolling back up, with zero console/page
errors; all 10 industry pages' BuyerJourney sections show active steps
with zero errors after scrolling into view; reduced motion shows the full
end state immediately on both; and a mobile viewport screenshot of
BuyerJourney confirmed the numbered-circle layout and active-state
highlighting both render correctly at phone width.

**PHASE 2b STATUS: READY FOR USER REVIEW**

## Phase 3 — Magnetic cursor + context-aware cursor states

Two independent pieces, both extending the existing `CursorAtmosphere`
architecture and performance discipline rather than building a parallel
system, per the plan.

**1. Magnetic pull on buttons/CTAs**

- **`src/components/motion/useMagneticHover.ts`** (new) — a hook that
  writes a direct `element.style.transform` translate toward the cursor,
  at most once per animation frame, no React state. One `window`-level
  `pointermove` listener per mounted instance (the same pattern
  `CursorAtmosphere.tsx` already uses once per section — not a new
  architecture). Pull begins slightly before the cursor reaches the
  element's real edges (`MAGNETIC_PADDING = 24px`) without changing the
  element's actual clickable/focusable hit area at all. Desktop-only
  (`pointer: fine`) and skipped entirely under `prefers-reduced-motion` —
  the listener is never attached, not attached-then-suppressed. Disabled
  buttons are explicitly excluded even though the hook itself doesn't know
  which element is "the button."
- **`src/components/ui/Button.tsx`** — now a Client Component (first time;
  it's a leaf UI primitive, safe everywhere it's used) that applies
  `useMagneticHover` to both its `<Link>` and `<button>` render paths, and
  adds a static `data-cursor="button"` marker to each (used by item 2
  below). This automatically covers every "nav CTA" too, since
  `Header.tsx`'s "Get a Free Audit" buttons already render this same
  shared component — no separate change needed there.

**2. Context-aware cursor states (default / hover-link / hover-button)**

Deliberately does **not** hide the native OS cursor anywhere in this phase
— that stays reserved for Tier 2's two pages (hero + showcase), so text
selection, resize cursors, and every other native cursor affordance stay
completely intact sitewide.

- **`src/components/motion/CursorState.tsx`** (new) — a small ring that
  follows the pointer and changes scale/tint depending on what it's
  hovering (plain default / a link / a button). Mounted exactly **once**,
  sitewide, in `layout.tsx` — unlike `CursorAtmosphere`, which mounts once
  per section, hover state is a single global concept. Two listeners: a
  rAF-throttled `pointermove` (position only, direct CSS custom-property
  writes) and a single delegated `pointerover` on `document` (reads
  `event.target.closest('[data-cursor="button"]')` / `closest("a")` to
  classify the hover target, rather than attaching a listener to every
  link/button on the page). Same gating as the magnetic hook: `pointer:
  fine` only, `prefers-reduced-motion` skips attaching anything.
- **`src/app/layout.tsx`** — mounts `<CursorState />` once, alongside
  `<GoogleAnalytics />`, outside `SmoothScrollProvider` (it tracks the
  pointer, not scroll).
- **`src/app/globals.css`** — new `.gx-cursor-ring` rules. Position uses
  the standalone `translate` CSS property (not `transform`) with zero
  transition for instant, tight cursor-follow; `scale` and border/
  background color changes on hover use their own independent transition —
  splitting these is what lets position update every frame while state
  changes still animate smoothly, without one fighting the other's timing.
  Hidden outright under `pointer: coarse` and `prefers-reduced-motion`, as
  the render-agnostic CSS guarantee matching `gx-cursor-atmosphere`'s
  existing pattern.

**Verification performed:** `tsc --noEmit` and `eslint` clean; `next
build` succeeds, all 38 routes unchanged. A Playwright suite against the
production build confirmed: the header CTA's transform changes when the
cursor enters its padded zone and resets cleanly to nothing when the
cursor moves away; the cursor ring correctly reads "default" over empty
page area, "link" over a plain nav link, and "button" over the CTA
(activating only after a genuine pointer move); reduced motion produces
zero transform changes and `display: none` on the ring; an emulated
touch/coarse-pointer device also gets `display: none` on the ring (and,
by construction, never attaches the magnetic listener); keyboard Tab
navigation still reaches the header CTA with a visible native focus
outline (`outline-style: auto`) — magnetic/hover effects are not the only
affordance, per WCAG 2.4.7; a dense-CTA industry page and the free-audit
form both loaded with zero console/page errors; hovering across five CTAs
on the same page produced zero header layout shift (measured height
identical before/after, confirming the effect is a pure `transform`/
`translate` change with no layout impact).

**PHASE 3 STATUS: APPROVED** — including a follow-up touch/mobile
verification pass before approval: traced the two unrelated pointer-event
call sites a Playwright listener-count check turned up on an emulated
iPhone 13 (React's own delegated `pointerover`/`pointerout`/`pointermove`
listeners at `document`, present because pre-existing Phase 1/2 components
`GXScene.tsx` and `GlowCard.tsx` use `onPointerMove`/`onPointerLeave` JSX
props; and the WebGL hero canvas library's own internal `pointermove`
listener) back to their exact source via stack traces, confirming neither
originates from `useMagneticHover.ts` or `CursorState.tsx` — both correctly
return before attaching anything on a coarse pointer. A real `.tap()` on a
live button confirmed no transform/ring artifact, and a screenshot after
the tap showed the ring never rendering.

## Phase 4 — Page transitions

**Goal:** a short, content-only fade/settle between route navigations
(homepage, industries, services, about, contact, free-audit) — not a full
page morph, and never at the risk of a form getting stuck mid-transition.

**Approach chosen (per the plan's two options): Framer Motion
`AnimatePresence`**, not the native View Transitions API — Framer is
already a dependency and already used for exit animations elsewhere
(`IndustriesTeaser`'s `AnimatePresence mode="wait"`), and it behaves
identically across all 10 industry + 15 service detail routes today,
rather than depending on partial browser support for
`<ViewTransition>`/native View Transitions (no Firefox/Safari parity yet).

**Files changed:**
- **`src/components/motion/PageTransition.tsx`** (new) — the client "shell"
  boundary the plan calls for, since `app/layout.tsx` itself is a Server
  Component. Wraps `{children}` in `AnimatePresence mode="wait"` keyed by
  `usePathname()` (not the full URL, so a search-param-only change doesn't
  retrigger a page fade). 200ms duration (inside the plan's 150–250ms
  window), small opacity + 8px vertical settle, same easing curve
  (`[0.22, 1, 0.36, 1]`) and the same null-safe `shouldReduceMotion ? 0 : n`
  pattern already used throughout the codebase. `initial={false}` on
  `AnimatePresence` scopes the fade to actual client-side navigations only —
  first page load renders at full opacity immediately, so this doesn't put
  anything in front of LCP measurement on `/`.
- **`src/app/layout.tsx`** — `{children}` inside `<main>` is now wrapped in
  `<PageTransition>`. `Header`, `Footer`, and `FloatingWhatsApp` deliberately
  stay outside it, so nav/footer never flicker or re-animate on navigation —
  only the routed page content transitions.

**Verification performed:** `next build` succeeds, all 38 routes unchanged.
A 16-check Playwright suite against the production build confirmed: a
normal nav click actually swaps the content and settles at full opacity
(never stuck mid-fade); rapid back-to-back navigation (three routes fired
without waiting between them) still lands cleanly on the final route with
zero console errors; the browser back button pressed mid-transition
resolves to a sane URL and a fully-settled page rather than a stuck state;
`prefers-reduced-motion` collapses the transition to near-instant
(opacity 1 within 80ms); `next/link` prefetching still fires on hover
(confirmed via `next-router-prefetch` request headers); the `/contact` and
`/free-audit` forms — both same-route, state-driven (no `redirect()`/
`router.push` on submit) — keep their pathname unchanged and error-free
while being filled in, confirming `PageTransition` never remounts them
mid-interaction; first load shows full opacity immediately, not a fade-in
from zero. Also spot-checked scroll behavior with Lenis active: scrolling
partway down the homepage and then navigating correctly resets to the top
of the new page, no regression from wrapping `{children}`. Screenshots of
a transition in flight (content faded, header/nav fully stable) and fully
settled both look correct.

**PHASE 4 STATUS: APPROVED**

## Phase 5 — First-load intro (logo build-in)

**Goal:** a one-time "logo build-in" shown before the homepage's own
content, on a genuinely first-time visit only, that never blocks
interaction and never hurts LCP.

**Files changed:**
- **`src/components/motion/IntroSequence.tsx`** (new) — rendered exactly
  once, in `app/page.tsx` (the homepage route only), never in
  `layout.tsx`. Reuses `GXFallback.tsx`'s traced "G ring" / "X blades"
  polygon points verbatim (same coordinate space, same viewBox) — existing
  data, not a new asset. Contains a synchronous inline `<script>` (the same
  `dangerouslySetInnerHTML` mechanism every `page.tsx` already uses for its
  JSON-LD block) that runs *before the browser's first paint* — this is
  the piece that makes a "show once" intro possible without a flash in
  either direction: a `useEffect`-based decision always runs after first
  paint, which would mean either a first-time visitor sees the real hero
  flash before the intro covers it, or a repeat visitor sees the intro
  flash before JS removes it. The script decides not to show the intro
  when the pathname isn't "/" (defensive — should already be unreachable
  given where this component is mounted, but costs nothing to also check
  directly), the visitor prefers reduced motion, or `sessionStorage`
  already has the "shown" flag — and it's `sessionStorage`, not
  `localStorage`, so the intro replays the next time the browser itself is
  reopened but never again on internal navigation back to "/" within one
  visit. The flag is written the moment the script decides to show the
  intro, not after it finishes, so closing the tab mid-animation still
  counts as "shown."
- **`src/app/globals.css`** — the `.gx-intro` curtain + keyframes. Hidden
  by default (`opacity:0; visibility:hidden; pointer-events:none`) on
  every route, every repeat visit, and under reduced motion; only becomes
  visible when `html.gx-intro-pending` is present, which the inline script
  above adds before paint. Three CSS stages, entirely animation-driven (no
  GSAP/JS orchestration): stroke draw-on for the ring and both blades
  (`stroke-dasharray`/`stroke-dashoffset` set to each shape's real
  perimeter, computed from the actual point data, not guessed), then a
  fill fade-in over the completed outline, then — after a hold — the whole
  curtain fades out to reveal the homepage underneath. `pointer-events:
  none` stays on the overlay throughout, so the real page underneath is
  interactive and scrollable from frame one, whether or not the intro is
  still playing; nothing here ever touches `<body>`.
- **`src/app/page.tsx`** — mounts `<IntroSequence />` first, before the
  JSON-LD script and `<Hero />`, so its inline script runs before Hero's
  markup exists in the DOM.

**Verification performed:** `next build` succeeds, all 38 routes
unchanged. A 17-check Playwright suite against the production build
confirmed: a genuinely first-time visit gets the `gx-intro-pending` class
and a visible overlay; the overlay's own `pointer-events: none` and an
untouched `<body>` mean the page scrolls and its nav links stay clickable
*while the intro is still animating*, confirmed by actually scrolling and
checking link state mid-sequence rather than assuming; the sequence tears
itself down automatically (DOM node removed, no lingering full-viewport
element) and sets the session flag at the right time; a repeat visit
within the same tab/session, a pre-set session flag, `prefers-reduced-
motion`, and a deep link straight to `/industries/healthcare` all
correctly skip it entirely — the deep-link case doubly so, since the
component isn't even in the DOM on any route but the homepage, not just
CSS-hidden; a `PerformanceObserver` LCP check confirmed the actual LCP
candidate on `/` is the hero's own description text, not the intro
overlay. Also recorded and frame-extracted a real video of a homepage
load to visually confirm the sequence draws on, fills, and crossfades
into the real page correctly — worth noting the *exact* wall-clock timing
of that recording ran slower than the CSS durations specify, which traced
back to this sandbox's own resource contention (multiple concurrent test
processes) delaying when the browser got to execute the inline script,
not a bug in the sequence itself; the automated suite's explicit waits
already account for this and passed consistently across repeated runs,
and the relative order/duration of each stage (draw → fill → hold →
fade) was visually confirmed correct regardless of the absolute delay
before it started.

**PHASE 5 STATUS: READY FOR USER REVIEW**

---

## Phase 5b — Smooth logo curves, loading counter, zoom reveal

**Goal (from Prakash's feedback on Phase 5, with a reference logo image and
a reference preloader image):** (1) fix the G ring's edges, which read as
faceted/angular instead of smoothly curved, on both the homepage's 3D hero
and the first-load intro; (2) add a 1→100 loading counter with a progress
bar, bottom-left, styled after the reference preloader, running for the
length of the intro; (3) once the counter reaches 100, the logo should zoom
in and grow to fill the whole screen as the reveal, instead of a plain fade.

**Root cause of the "not curved" complaint:** `GXFallback.tsx`'s ring is 26
points traced directly from the logo PNG's silhouette, and both it and
`IntroSequence.tsx` (which reused the same point data) rendered that ring as
an SVG `<polygon>` — which can only connect points with straight lines. That
straight-line approximation is exactly what read as faceted. The 3D hero
(`GXScene.tsx`) never had this problem because it already runs the same
point data through `smoothShapeFromOutline()`, a Catmull-Rom spline, before
extruding it.

**Files changed:**
- **`src/components/motion/IntroSequence.tsx`** — the ring is now an SVG
  `<path>` (`RING_PATH`), not a `<polygon>`. `RING_PATH` is a from-scratch
  port of `GXScene.tsx`'s exact Catmull-Rom-to-cubic-Bezier technique,
  applied to the same 26 traced points and the same two genuinely sharp
  corners at the G's terminus (which stay hard straight joints, not
  smoothed away) — same shape, same source data, just curved between the
  points instead of straight-lined. The stroke-draw-on's dasharray/
  dashoffset (1582) was re-measured numerically against the new path
  rather than reusing the old polygon's perimeter. The X blades are
  unchanged `<polygon>`s — they're genuinely straight-sided in the source
  logo. Added the counter: a `requestAnimationFrame` loop writes the
  percentage text and progress-bar scale straight to their DOM nodes via
  refs (the same "no `setState` on every animation frame" discipline
  already used by `CursorAtmosphere`/`CursorState`/`GlowCard`, since
  nothing else in the tree reads this value on every tick). The one thing
  that *is* React state is `revealing`, which flips once, the instant the
  counter reaches 100 — that state change adds a `.gx-intro-revealing`
  class, and CSS takes it from there with no animation-delay, so the
  reveal starts at exactly the moment the counter finishes rather than a
  fixed delay that could drift out of sync with it.
- **`src/app/globals.css`** — the old fixed-delay curtain fade
  (`animation-delay: 1500ms`) is gone; the curtain now holds indefinitely
  until `.gx-intro-revealing` is added by JS, at which point two
  animations start together with no delay: the curtain itself fades out
  (`gx-intro-curtain-out`, unchanged keyframe, just re-triggered
  differently), and a new `gx-intro-mark-zoom` keyframe scales the mark up
  18× while fading it to `opacity: 0` — the "zoom in and fill the screen"
  effect. Added the counter/progress-bar styling (bottom-left, matching
  the reference preloader's layout: a large tabular-nums percentage above
  a thin horizontal bar that fills left-to-right).
- **`src/components/three/GXFallback.tsx`** (the low-power/reduced-motion/
  no-WebGL homepage fallback) — same fix as the intro: the G ring became a
  `<path>` using the identical `RING_PATH` data instead of a `<polygon>`.
  This wasn't reported directly in the feedback screenshots, but it's the
  same straight-line-polygon problem, on the same source data, so it would
  have shown the same faceting to any visitor who lands on this fallback
  instead of the 3D scene.
- **`src/components/three/GXScene.tsx`** — increased extrusion tessellation
  (`curveSegments` 64→96, `bevelSegments` 10→14) as a defensive,
  low-cost/no-downside pass in case the 3D hero's ring was contributing to
  what read as roughness in the screenshots. Note on confidence: my own
  test renders of the 3D hero, at several angles, did not reproduce an
  obvious geometric facet — the ring there was already going through
  `smoothShapeFromOutline()` before this change, unlike the intro/fallback
  ring, which had no curve fitting applied at all. It's possible what read
  as "not curved" in that screenshot was a specular-highlight streak across
  an already-smooth surface rather than a genuine facet (the code's own
  prior comments already anticipated this class of issue). This tessellation
  bump is cheap insurance either way; if the edge still looks rough on your
  device after this delivery, a zoomed screenshot at the same angle would
  let me pin down whether it's geometry or lighting rather than guessing
  further.

**Verification performed:** `next build` succeeds, all 38 routes unchanged.
The new smooth `RING_PATH` was checked with a standalone side-by-side
render against the old straight-polygon version before going into the
components, confirming the curve fix directly rather than assuming the math
was right. For the counter and reveal, screenshot-based timing checks
proved unreliable in this sandbox once again (the same resource-contention
timing drift noted in the Phase 5 verification above — a fixed wall-clock
delay before a screenshot can land anywhere from "too early" to "already
torn down"), so verification instead polled the live DOM directly every
~50ms via `page.evaluate()` and logged the actual sequence as data rather
than trying to catch one visual frame. That log conclusively confirms all
three pieces work: the counter genuinely ticks through real intermediate
values (001 → 006 → 010 → 019 → 023 → 026 → 029 → 030 → 053 → 100, not a
jump straight to 100); `.gx-intro-revealing` is added at the exact instant
the counter hits 100; the mark's computed `transform` and `opacity` are
then observed progressing live, mid-transition (scale climbing from 1×
toward the 18× target, opacity falling from 1 toward 0) — proving the zoom
reveal is a real running animation, not a static end-state; and the whole
overlay, counter included, is fully removed from the DOM shortly after,
confirming clean teardown.

**PHASE 5B STATUS: READY FOR USER REVIEW**

---

## Phase 5c — True circular ring arcs, larger counter, thinner bar

**Goal (from Prakash's follow-up on Phase 5b):** the ring's curve still
didn't read as a genuine circular arc — "jo ARC hai c type jo properly ek
circle k arc jaisa lage bich mei edges dekh kr aisa na lage k ye properly
curvy arc nahi hai" — on both the first-load intro and (by extension) the
homepage's 3D rotating logo. Also: make the loading counter's number bigger,
and make the bar underneath it read as a clean thin rectangle.

**Root cause:** Phase 5b's fix (a Catmull-Rom spline through the 26 traced
outline points) removed the polygon *facets*, but a spline through
traced/auto-detected points still follows whatever small tracing noise is in
those points — a few hundredths of a unit of wobble per point — and that
noise stays visible as a not-quite-constant curvature. A real logo's "C"
ring is almost always two concentric circular arcs, not a hand-fit curve
through noisy samples, which is exactly what the reference image showed and
what this round builds instead.

**Files changed:**
- **`src/components/three/GXScene.tsx`** — the ring is now built from two
  true circular arcs (`RING_ARC` + `ringShapeFromArcs()`, replacing
  `smoothShapeFromOutline()`), not a spline. The two arcs' center and radii
  were found by least-squares-fitting a circle through each of the ring's
  two curved point-runs (points 9-21 for the inner edge, 22-8 for the outer
  edge — the same split Phase 5b already used to separate "curved" from
  "flat cut corner"); the two fitted centers were only ~0.03 units apart out
  of a ~1-unit radius, confirming the source tracing was already very close
  to circular and this is a cleanup, not a reshape. The four corner points
  (the G's genuinely flat cut faces) were snapped onto their respective
  circle at their existing angle — moved by roughly 0.03 units, imperceptible
  — so the straight cut edges meet the arcs with zero kink. Built with
  `THREE.Shape.absarc()`, so the curve Three.js extrudes is a mathematically
  exact circle, not an approximation of one.
- **`src/components/motion/IntroSequence.tsx`** and
  **`src/components/three/GXFallback.tsx`** — same fix, expressed as native
  SVG arc commands (`A rx ry 0 large-arc-flag sweep-flag x y`) in the same
  pixel-space coordinates these two already shared, fit from the same 26
  traced points via the same method. `RING_PATH_LENGTH` was recomputed
  exactly (two straight segments + `radius × angle` for each arc) rather
  than sampled, since both curved runs are now exact circles.
- **`src/app/globals.css`** — the loading counter's number is now
  `clamp(2.75rem, 6vw, 4.5rem)` (was `1.5rem`) with `line-height: 1` so it
  reads as the dominant element in that corner, matching the reference
  preloader. The progress bar underneath was widened (120px → 200px) and
  its unfilled track darkened slightly so it reads as a clear thin
  rectangle rather than a hairline at a glance.

**Verification performed:** the exact arc parameters (center, radii, corner
angles, arc-direction flags) were derived offline via a least-squares
circle fit script, then checked two ways before going into the components:
a standalone SVG render of just the new ring path (confirming a clean,
correctly-directed arc with no self-intersection or wrong-way sweep), and a
render of the ring plus both X blades together (confirming the full mark's
proportions still match the reference logo). `next build` succeeds, all 38
routes unchanged, `tsc --noEmit` clean. Re-ran the same DOM-polling
verification from Phase 5b against the rebuilt server — the counter still
ticks through real intermediate values up to 100, `.gx-intro-revealing`
still fires at the right instant, and the zoom/fade transform still
progresses live — confirming this round's changes didn't regress that
mechanism. Screenshotted the live 3D hero after these changes: the G ring's
curve is now visibly a clean, even arc under the scene's lighting, with no
kink at the point Prakash's screenshot had flagged.

**PHASE 5C STATUS: READY FOR USER REVIEW**

---

## Font-swap CLS fix (Tier 1 exit checklist follow-up)

**Goal:** the Tier 1 exit checklist's Lighthouse run found a layout-shift
score of 0.218 on the homepage (0.147 on the real-estate industry page),
both traced to the same single cause: the Inter/Manrope variable fonts
swapping in after first paint and reflowing text, since the fonts were
loaded via a plain CSS `@font-face` import
(`@fontsource-variable/{inter,manrope}`) that gives the browser no
information about the real font's metrics ahead of time.

**Files changed:**
- **`src/fonts/inter-variable-latin.woff2`**, **`.../manrope-variable-
  latin.woff2`** (new) — the exact same font files the site already used,
  copied from `@fontsource-variable/{inter,manrope}`'s own `files/` output
  (latin subset only — the only subset this site has ever actually
  requested, confirmed from the Lighthouse network trace) into the repo, so
  the build no longer depends on reaching into `@fontsource-variable`'s
  internal file layout.
- **`src/app/layout.tsx`** — replaced the two `import "@fontsource-variable/
  ..."` CSS imports with `next/font/local`, pointed at those same two files
  (`weight: "100 900"` for Inter, `"200 800"` for Manrope — each family's
  real variable axis range, so every weight already used via Tailwind's
  font-weight classes keeps working). `next/font/local` measures the real
  font's metrics at build time and generates a matching fallback font
  (synthetic `@font-face` with `ascent-override`/`descent-override`/`size-
  adjust`), so the space reserved for headline/paragraph text is already
  correct on first paint — before the real font has even finished
  downloading. The swap itself still happens (`display: "swap"`,
  unchanged); only the layout-shifting side effect of it is gone. The two
  generated CSS variables (`--font-inter`, `--font-manrope`) are applied via
  `className` on `<html>`.
- **`src/app/globals.css`** — `--font-display`/`--font-body` (the tokens
  every heading/body-text rule in the site ultimately reads) now resolve to
  `var(--font-manrope)`/`var(--font-inter)` instead of the literal `"Manrope
  Variable"`/`"Inter Variable"` family-name strings fontsource's CSS used to
  register.
- **`package.json`** — removed `@fontsource-variable/inter` and
  `@fontsource-variable/manrope` (no longer imported anywhere).

This is a loading-mechanism change only — same two font files (confirmed by
identical content hashes in the built output before and after), same
weights, same visual typography. Nothing about how the site looks changes;
only that text stops moving once the fonts finish loading.

**Verification performed:** `next build` succeeds, all 38 routes unchanged,
`tsc --noEmit` clean. Confirmed via the built HTML that both fonts are now
automatically `<link rel="preload">`ed and served under the identical
content-hash filenames as before (i.e. byte-identical files, not a font
change). Screenshotted the homepage after the change — visually identical
to before. Checked `getComputedStyle` on `<h1>`/`<body>` in a real browser
to confirm both families resolve correctly with next/font's fallback
classes applied, and confirmed zero console errors. Re-ran Lighthouse
mobile on the same two pages the checklist flagged:

| Page | CLS before | CLS after | Performance before | after |
|---|---|---|---|---|
| Homepage | 0.218 | **0** | 77 | 80 |
| /industries/real-estate | 0.147 | **0** | 88 | 89 |

**FONT-SWAP CLS FIX STATUS: READY FOR USER REVIEW**

## Phase 6 — Hero shader atmosphere

**Goal:** per the Phase 3 "wow factor" plan, add a liquid-noise background
glow and a drifting particle field behind the existing 3D GX mark in the
hero — an atmosphere layer, not a change to the mark itself. The mark's
geometry, material, lighting, and idle-rotation/pointer-tilt behavior are
untouched by this phase.

**Files changed:**
- **`src/components/three/GXScene.tsx`** — added two new hand-rolled GLSL
  `THREE.ShaderMaterial`s, following the same raw-shader pattern the file
  already uses for `useReflectionMaterial()` (no new npm dependency):
  - A hash-based value-noise + 4-octave fbm (fractal Brownian motion) GLSL
    helper, with the input coordinates domain-warped by a second noise
    lookup before the final sample — the standard technique for making
    blobby noise read as "flowing liquid" instead of static blobs. This is
    a deliberately hand-rolled noise function rather than a ported
    Simplex/Perlin implementation, both to avoid the risk of a subtly-wrong
    port and because at the very low opacity and blur this effect is used
    at, the visual difference is not perceptible.
  - `useAtmosphereMaterial()` — a large background plane (positioned behind
    the mark, `z: -3`) whose fragment shader samples the warped noise
    field, fades to transparent radially toward the plane's edges, and is
    tinted the site's existing brand blue (`#1D4ED8`) at very low alpha
    (~0.10 peak).
  - `useParticleGeometry()` / `useParticleMaterial()` — 180 `THREE.Points`
    scattered in a loose ring around the mark, each with a random phase
    offset (`aSeed`) so they drift independently via `sin`/`cos` of
    `uTime + aSeed` in the vertex shader, sized with camera-distance
    attenuation, and rendered as soft circular falloff dots in the
    fragment shader.
  - Both materials use `transparent: true`, `depthWrite: false`, and
    `THREE.AdditiveBlending`, so they read as soft light/glow rather than
    opaque surfaces, and correctly composite behind the opaque
    (depth-writing) mark via Three.js's standard transparent-object sort.
  - Both materials' `uTime` uniform is written directly from
    `state.clock.elapsedTime` inside the existing `useFrame` callback (not
    React state — consistent with the project's existing rule that no
    per-frame-changing value should go through `setState`).
  - The new plane and points are mounted outside the mark's rotating
    `<group>`, so they don't inherit its rotation/tilt — they're a fixed
    atmosphere the mark rotates in front of, not a part of the mark.
  - `GXHero.tsx`'s existing capability gate (WebGL support → device memory
    → `prefers-reduced-motion` → small screen) is unchanged and sits in
    front of this entire file, so reduced-motion, low-memory, and
    small-screen visitors never reach this new shader code at all — they
    get `GXFallback.tsx` exactly as before.
- **`src/components/three/GXFallback.tsx`** / **`src/app/globals.css`** — a
  small companion change so the *fallback* (pure-CSS, non-WebGL) hero
  doesn't look comparatively flatter now that the 3D version has more
  depth behind it: one extra `radial-gradient` glow layer
  (`.gx-hero-glow-secondary`), positioned and timed differently from the
  existing `.gx-hero-glow`, with its own slow drift `@keyframes` animation.
  Stays pure CSS on purpose — never a WebGL fallback for a WebGL fallback —
  and its animation is disabled under `prefers-reduced-motion: reduce`,
  matching the sitewide rule the existing glow layer already follows.

**Verification performed:** `tsc --noEmit` clean, `next build` clean (all
38 routes). Loaded the homepage in a real browser: zero console errors,
two screenshots 2.5s apart confirm the idle rotation is unaffected and the
particles/glow are genuinely animating (not a static image). Forced the
`prefers-reduced-motion` fallback path and confirmed in the same way
(`GXFallback.tsx` renders, no `<canvas>` present, zero console errors, the
new `.gx-hero-glow-secondary` layer renders and correctly goes static under
reduced motion).

Frame-time cost: sampled 240 `requestAnimationFrame` deltas on the homepage
before and after this phase, back to back on the same machine (this
sandbox has no real GPU, so absolute fps numbers here are not
representative of a real device — only the relative delta is meaningful):
average frame time rose from 179ms to 221ms, roughly a 20% increase — a
reasonable, expected cost for one extra full-screen shader pass plus 180
particles, and in line with the plan's note that GPU frame time on a
mid-range device is this phase's main risk to watch.

Lighthouse mobile (simulated throttling) on the homepage, run three times
each on the pre- and post-Phase-6 build back to back to check for a real
regression (this sandbox's Lighthouse runs have shown high run-to-run
variance before, including in the original Tier 1 checklist numbers):

| Run | Before (perf / LCP) | After (perf / LCP) |
|---|---|---|
| 1 | 80 / 1.6s | 68 / 3.3s |
| 2 | 77 / 3.3s | 87 / 3.1s |
| 3 | 82 / 3.2s | 88 / 3.2s |
| **avg** | **~80 / ~2.7s*** | **~81 / ~3.2s** |

\* run 1's 1.6s is an outlier inconsistent with every other before/after
run and with the original Tier 1 checklist's own homepage baseline (LCP
3.0s); excluding it, "before" LCP is ~3.25s, statistically the same as
"after". Across all three runs the two builds trade places on which scores
higher — the swings are within this sandbox's normal noise band, not a
consistent, reproducible regression. A real-device or PageSpeed Insights
check post-deploy is still worth doing, since this sandbox cannot fully
reproduce real mobile GPU behavior for WebGL-heavy content.

**PHASE 6 STATUS: READY FOR USER REVIEW**

## Phase 7 — Postprocessing

**Goal:** per the plan, add `@react-three/postprocessing` to the hero's
`EffectComposer` for bloom, subtle chromatic aberration, and film grain —
kept to exactly three effects on purpose, since each composited pass is
real extra GPU cost on mobile.

**Files changed:**
- **`package.json`** — added `@react-three/postprocessing` (peer-compatible
  with the existing `@react-three/fiber@^9.7.0`) and its own peer
  dependency `postprocessing`. No `drei` dependency, consistent with the
  rest of the codebase.
- **`src/components/three/GXScene.tsx`** — added an `<EffectComposer>`
  inside the existing `<Canvas>`, after `<GXForm>`, with three effects:
  - `Bloom` — catches genuinely bright pixels (the specular highlights the
    blue point lights already put on the mark's metal bevel, and the
    Phase 6 additive atmosphere/particles where they overlap densely) and
    gives them a soft glow halo. `luminanceThreshold` is deliberately not
    near zero, so the scene's transparent background and matte body stay
    untouched — only real highlights bloom.
  - `ChromaticAberration` — a fractions-of-a-pixel RGB channel offset for
    a touch of lens realism, tuned subtle on purpose (not a glitch effect).
  - `Noise` — very low-opacity film grain over the whole canvas.
  No extra `SMAA`/`FXAA` pass was added purely for anti-aliasing — the
  Canvas already requests GL-level MSAA (`antialias: true`), and a 4th
  composited pass just for that isn't worth the frame-time cost per the
  plan's "keep the effect stack short" guidance.

This only touches `GXScene.tsx`, which was already only ever reached
through `GXHero.tsx`'s `dynamic(..., { ssr: false })` import (an isolated,
homepage-only chunk since before Phase 6) — so `@react-three/postprocessing`
inherits that same isolation with no additional wiring needed.

**Verification performed:** `tsc --noEmit` clean, `next build` clean (all
38 routes). Zero console errors on both the 3D and (unaffected) fallback
paths. Screenshots confirm the effect is visible but tasteful: a soft glow
on the mark's rim highlights and reflection, faint grain texture across the
background, no visible color fringing at normal viewing size.

Per the plan's own two required checks for this phase:

1. **Bundle isolation — the single most important check.** Loaded `/`,
   both industry pages, both service pages, `/about`, `/contact`, and
   `/free-audit` in a real browser, scrolled each fully (to trigger any
   `IntersectionObserver`-gated imports), and inspected every JS chunk
   actually requested by the network — not just static bundle analysis.
   `@react-three/postprocessing`'s code appears in exactly one chunk, and
   that chunk loads only on `/`. Zero trace of it on any other route.
2. **Frame-time cost, isolated.** Same before/after `requestAnimationFrame`
   sampling method as Phase 6, run back to back on the same machine
   immediately before and after adding this phase's changes (git-stashed
   the Phase 7 diff to get a clean "before"): average frame time went from
   288ms to 684ms — roughly 2.4x — in this sandbox's software-rendered
   (no real GPU) environment. That's a real, reproducible, non-noise
   result (unlike Phase 6's Lighthouse variance), and it matches the
   plan's own explicit warning that three composited passes is "already a
   meaningful frame-time cost on mobile GPUs." The absolute multiplier
   here is inflated by software rendering — a real device's GPU does
   render-to-texture passes far more cheaply than SwiftShader does — but
   the relative cost is real and worth knowing before this ships broadly.
   If it's ever felt too heavy on real mid-range mobile hardware, the
   cheapest lever is dropping `ChromaticAberration` (the pass adding the
   least visual value of the three) before touching `Bloom` or `Noise`.

**PHASE 7 STATUS: READY FOR USER REVIEW**

## Phase 8 — "Our Work" showcase page

**Goal:** per the plan, a new `/work` route with a WebGL project grid in the
spirit of Lusion's featured-work pages. The plan explicitly flagged two
decision points rather than assuming an answer, and this session had zero
real portfolio content in the codebase to build from (no project images, no
case-study copy) — both were resolved with Prakash before writing any code:

- **Content:** GraphikosX has exactly one full-scope engagement completed
  so far (a chemicals manufacturer's website, product catalogue, and brand
  identity work). Rather than fabricate placeholder "client" logos or
  invented case studies, the page is built around that one real engagement,
  broken into its three genuine facets. Every scope line in
  `src/lib/data/work.ts` describes work that was actually done — no
  invented results/metrics.
- **Anonymity:** the client asked not to be named or shown. Nothing on the
  page identifies them — no client name, no real screenshots of their
  actual site/logo. The three "project" visuals are original abstract
  compositions (browser-mockup wireframe, catalogue-spread wireframe, brand
  exploration board) built from scratch to represent each facet, not
  screenshots of the real deliverables.
- **Route:** `/work` (Prakash's choice from the three options offered).

**Files added:**
- **`src/lib/data/work.ts`** — the case study data: client industry
  (anonymized), and three facets (website, catalogue, brand identity) each
  with a title, category, summary, an original representative image, and
  real scope bullets.
- **`public/work/case-study-{website,catalogue,brand}.jpg`** — the three
  original abstract compositions, designed and rendered specifically for
  this page (not real client screenshots).
- **`src/components/pages/work/WorkHero.tsx`** — honest framing ("one real
  case study, not a wall of logos") rather than a generic agency-portfolio
  opener, using the same `MaskReveal`/`CursorAtmosphere` pattern as
  `AboutHero.tsx`.
- **`src/components/pages/work/WorkScene.tsx`** — the WebGL grid: three
  textured planes with a hand-rolled GLSL hover-distortion shader (a radial
  UV ripple whose amplitude eases toward the hovered tile, same "no drei,
  raw ShaderMaterial" discipline as `GXScene.tsx`), a manual `TextureLoader`
  hook with a real placeholder-color state while each image decodes (the
  plan's explicit test for this phase), and Phase 7's `EffectComposer`
  effects reused but re-tuned: same three effects (Bloom, ChromaticAberration,
  Noise), but this scene's tiles are dense, light-background artwork filling
  the whole frame rather than the hero's mostly-transparent canvas, so
  Bloom's threshold is much higher (only genuinely bright spots catch it,
  not every white background pixel) and ChromaticAberration's offset is
  much smaller (the homepage's offset read as a visible colored outline
  around these tiles' hard edges — tuned down until it stopped being
  individually noticeable). Clicking a tile smooth-scrolls to its real
  content below via the sitewide Lenis instance, same
  `useLenis()`-with-native-fallback pattern `FreeAuditWizard.tsx` already
  uses for its own scroll-to-top.
- **`src/components/pages/work/WorkShowcase.tsx`** — capability gate
  wrapping `WorkScene.tsx` (WebGL support / device memory /
  prefers-reduced-motion / a 768px width floor — wider than the hero's
  640px, since three side-by-side tiles need more room to read as a grid).
  Deliberately duplicates `GXHero.tsx`'s small capability check rather than
  extracting a shared hook, matching this project's established preference
  for touching only what a given phase actually needs. Unlike `GXHero.tsx`,
  there's no dedicated static-fallback visual here — see next item.
- **`src/components/pages/work/WorkCaseStudy.tsx`** — the real, always-
  rendered content, addressing the plan's SEO note and accessibility test
  in one section: real server-rendered text, real `next/image` elements
  (responsive `sizes`, lazy-loaded, no CLS — exactly what the plan noted
  WebGL textures don't give you for free) with descriptive `alt` text, and
  real DOM anchors (`id="work-<slug>"`) reachable by keyboard, screen
  reader, or a WebGL tile click alike. This is why `WorkShowcase.tsx` above
  needs no separate fallback visual: capable devices get the WebGL grid as
  a decorative (`aria-hidden`) layer on top; everyone else just goes
  straight to this section, with nothing missing.
- **`src/components/pages/work/WorkCTA.tsx`** — same structure as
  `AboutCTA.tsx`, tailored copy, `source: "work"` attribution.
- **`src/app/work/page.tsx`** — the route: metadata, schema
  (`WebPage` + breadcrumb), renders the four components above in order.

**Files changed:**
- **`src/lib/data/company.ts`** — added `{ label: "Our Work", href: "/work" }`
  to `primaryNav` (consumed by both `Header.tsx` and `Footer.tsx`, so one
  change updates both).
- **`src/app/sitemap.ts`** — added `/work`.

**Verification performed:** `tsc --noEmit` and `next build` both clean (39
routes, up from 38). Zero console errors across every path tested. The
plan's two required checks for this phase:

1. **Bundle isolation.** Live browser network capture (not just static
   bundle analysis) across `/`, `/work`, both industry pages, both service
   pages, `/about`, `/contact`, and `/free-audit`: `@react-three/fiber` and
   `@react-three/postprocessing` code loads only on `/` and `/work` (the
   two routes that actually use it — sharing one chunk between them is
   normal, correct Next.js behavior, not a leak) and never appears on any
   other route.
2. **Loading/placeholder state.** Throttled network in a real browser and
   confirmed the three tiles show a solid neutral placeholder color while
   their images are still downloading, then fade to the real artwork —
   never a blank/invisible plane.

Plus this phase's own accessibility test: confirmed via DOM inspection
that turning off the WebGL layer (`prefers-reduced-motion`, and again at a
420px-wide viewport) still renders the full case study — all three facet
headings, all three images with real `alt` text — with nothing missing,
and confirmed a normal desktop view does render the canvas (the gate
correctly resolves both ways). Also verified the click-to-scroll
interaction (clicking a WebGL tile lands the corresponding real section in
view) and the mobile responsive layout of the real content section.

**PHASE 8 STATUS: READY FOR USER REVIEW**

## Phase 9 — Full custom cursor

**Goal:** per the plan, a full custom-cursor replacement (native `cursor:
none`) scoped to exactly two pages — `/` and `/work` — with three named
states: view / drag / play. The plan named the three states but didn't map
them to specific page elements, so that mapping below is this session's own
reasoned interpretation, flagged as such rather than assumed silently.

**Files changed:**
- `src/components/motion/GXCursor.tsx` (new) — the cursor component itself.
- `src/app/globals.css` — new `.gx-cursor*` rules (dot, expanding state
  pill, `body.gx-cursor-active { cursor: none }`, and the one line that
  suppresses `CursorState.tsx`'s ring while this component is active).
- `src/app/page.tsx`, `src/app/work/page.tsx` — mount `<GXCursor />`.
- `src/components/three/GXScene.tsx` — added `data-gx-cursor="drag"` to the
  existing hero pointer-tilt hit-area div (no other change to that file).
- `src/components/pages/work/WorkShowcase.tsx` — added
  `data-gx-cursor="play"` to the WebGL grid's wrapping `<section>` (no
  other change to that file).

**Architecture — why the cursor structurally cannot leak onto other
routes:** `GXCursor` is mounted directly inside `app/page.tsx` and
`app/work/page.tsx`'s own component trees, not sitewide in `layout.tsx`.
Route-scoping is therefore guaranteed by React's component tree, not by a
runtime `usePathname()` check: the component simply does not exist in the
DOM on any other route. This holds for both a hard navigation (full page
reload, fresh tree) and `PageTransition.tsx`'s client-side
`AnimatePresence` swap (which destroys and recreates the whole page tree on
every route change, this component included) — the component's cleanup
effect always runs before any other route's tree mounts, reverting `cursor:
none` on `<body>` every time.

**State mapping (this session's interpretation of the plan's named-but-
unmapped states):**
- **view** (default) — everywhere else on both pages. Renders as a small
  10px dot.
- **drag** — the homepage hero's existing pointer-tilt hit area
  (`GXScene.tsx`), where moving the mouse orbits the traced GX mark.
- **play** — the `/work` WebGL showcase grid (`WorkShowcase.tsx`), where
  hovering morphs a tile and clicking scrolls to its real case-study
  section.

**Honesty-in-affordance decision, self-imposed (not requested):** the
on-screen label for the drag/play states does not say the literal words
"DRAG" or "PLAY". Nothing on this site is actually click-and-drag (the hero
mark responds to continuous pointer position, not a drag gesture) or media
playback (the /work tiles scroll to real content on click — nothing
plays). Labelling them that way would promise an interaction the site
doesn't have, the same reasoning already applied to Phase 8's case-study
copy. The pill instead reads **"Orbit"** and **"Explore"** — what a visitor
can actually do — while the underlying `data-gx-cursor-state` attribute
values stay exactly the plan's own vocabulary (`view` / `drag` / `play`),
so the plan's naming is preserved in code even though the UI wording
differs.

**Coexistence with `CursorState.tsx` (Phase 3's sitewide, lighter hover
ring):** rather than reopening that already-shipped file, `GXCursor`
toggles one class, `gx-cursor-active`, on `<body>` while mounted, and a
single new CSS rule hides `.gx-cursor-ring` for as long as that class is
present. `CursorState.tsx` itself has zero edits.

**Capability gate — true non-mount, not an invisible one:** unlike
`GXHero.tsx`'s three-way "pending → 3d/static" pattern (which always
renders *something*), `GXCursor` resolves `pointer: fine` AND NOT
`prefers-reduced-motion` once in an effect after mount, and returns `null`
outright when either check fails — no DOM node, no `cursor: none` ever
applied, matching the plan's explicit requirement. Verified: touch/coarse-
pointer devices get no `.gx-cursor` element and no `body.gx-cursor-active`
class at all; `prefers-reduced-motion` visitors get the same (still see the
plain native cursor, which the plan calls acceptable).

**Position tracking — a deliberate departure from `CursorState.tsx`'s own
discipline:** `CursorState.tsx` writes position only once per genuine
`pointermove` event (no continuous loop). `GXCursor` instead runs a light,
always-on `requestAnimationFrame` loop that lerps toward the last known
pointer position (factor 0.22/tick) for as long as it's mounted, giving the
now-fully-hidden native cursor's replacement a trailing, physical feel
rather than a rigid 1:1 reskin. This only ever runs on these two
capability-gated, fine-pointer-desktop pages, so the extra per-frame cost
is contained to exactly where the plan wants the heavier treatment.

**Verification performed:**
- `tsc --noEmit` clean; `next build` clean (Turbopack, no new warnings).
- A 21-assertion Playwright suite, all passing:
  - `/` and `/work`: `.gx-cursor` mounts, `body.gx-cursor-active` is set,
    `body`'s computed `cursor` is `none`, and `.gx-cursor-ring` is
    `display: none` while active.
  - `/about` via a **hard navigation**: no `.gx-cursor` element, no body
    class, native cursor restored.
  - `/` → `/about` via a **client-side `AnimatePresence` transition**
    (clicking the nav link): cursor correctly present before the click,
    fully torn down after — no leak through the client-side router either.
    Reverse direction (`/about` → `/`) correctly re-activates it.
  - State wiring: hovering the hero hit-area flips the state to `drag`;
    hovering the `/work` grid flips it to `play`; everywhere else on both
    pages reads `view`.
  - Touch emulation (`hasTouch`/`isMobile`): no `.gx-cursor` element, no
    body class — genuine non-mount confirmed, not just an invisible one.
  - `prefers-reduced-motion: reduce`: no `.gx-cursor` element, native
    cursor still visible.
- Bundle check: inspected the raw server-rendered HTML for `/about`,
  `/services`, `/industries`, `/contact`, and `/free-audit` directly (the
  same method Phase 7/8 used) — none of their own `<script>` tags reference
  GXCursor's chunk. A naive runtime network capture *does* pick up that
  chunk being fetched on those pages a moment after load, but that's
  Next.js's own standard Link-prefetch behavior (every page's sitewide nav
  links to `/` and `/work`, so Next quietly prefetches those routes' code
  in the background for instant future navigation) — not a Phase 9-specific
  leak, not new to this phase, and not a meaningful size concern given
  `GXCursor.tsx` has no dependencies of its own.
- Visual check via screenshots: the default dot, the "Orbit" pill over the
  hero mark, and the "Explore" pill over the `/work` grid all render
  legibly with the state pill correctly expanding/collapsing.

**PHASE 9 STATUS: READY FOR USER REVIEW**

---

## Site-wide fixes — Timeline alignment + em-dash removal

Not a numbered phase; a two-part side task requested between Phase 9 and
Phase 10, spotted on the live `/industries/real-estate` build.

### 1. BuyerJourney numbered-step timeline alignment

`BuyerJourneyScrub.tsx` (the "How Buyers Decide" 1–5 step timeline used on
every industry detail page) positioned its connecting-line SVG with a
`top-6` offset and no explicit height, so the line's actual rendered
position depended on the SVG's implicit aspect-ratio-derived height instead
of the circles' real geometry — the line sat visibly below the circle
centers instead of through them.

Fixed by giving the SVG an explicit `h-11` (44px, matching the numbered
circles) and positioning it `top-0` (flush with the circles' own top, since
there's no padding above them). With that height fixed, the line's
viewBox y=20-of-40 is exactly 50%, landing on the true center for any
rendered width.

The homepage's `HowWeWork`/`CustomerJourney` sections use a sibling
component, `ScrollScrubTimeline.tsx`, which already uses this exact
explicit-height technique correctly (`h-12` circles, viewBox 0 0 1000 48,
line at y=24) — confirmed via screenshot as already correctly aligned, so
no change was needed there.

- **Changed:** `src/components/motion/BuyerJourneyScrub.tsx`

### 2. Em-dash removal from body copy

Every em-dash ("—") joining two clauses mid-sentence in visible site copy
has been rewritten with ordinary punctuation (colon, period, or comma,
chosen to preserve the original meaning), site-wide.

**Scope:** headings, paragraphs, FAQ answers, form labels/placeholders/error
text, and page `<title>`/meta-description strings. **Out of scope (left
untouched on purpose):** code comments (`//`, `/* */`, `{/* */}` — the
codebase's own comment style uses em-dashes heavily and always has) and
strings never seen by a site visitor (a server-side `console.error`
diagnostic string in `leads/submit.ts`, and the internal lead-notification
email subject line in `leads/providers.ts`, which lands in the agency's own
inbox, not a client's).

**Method:** `grep -rn "—" src --include="*.ts" --include="*.tsx"` (535 raw
matches) → filtered out comment-only and comment-continuation lines →
manually classified the remainder → rewrote each instance in place, with the
two large content files (`industry-details.ts`, `service-details.ts`)
handled via a verified find/replace script rather than one-by-one edits. A
final re-grep confirmed zero remaining em-dashes outside comments and the
two internal-only strings noted above.

**Result: 264 em-dash instances found and fixed** across the files below.

- **Changed (content/data files):** `src/lib/data/industry-details.ts` (71),
  `src/lib/data/service-details.ts` (105), `src/lib/data/industries.ts` (2),
  `src/lib/data/services.ts` (1), `src/lib/data/free-audit-options.ts` (1),
  `src/lib/data/work.ts` (3)
- **Changed (page metadata — title/description):**
  `src/app/layout.tsx`, `src/app/about/page.tsx`, `src/app/contact/page.tsx`,
  `src/app/free-audit/page.tsx`, `src/app/industries/page.tsx`,
  `src/app/services/page.tsx`, `src/app/work/page.tsx`,
  `src/app/terms/page.tsx`, `src/app/privacy/page.tsx`,
  `src/app/not-found.tsx`, `src/lib/seo.ts` (OG image alt text)
- **Changed (body copy in components):** `src/components/layout/Header.tsx`
  (logo `aria-label`), `src/app/error.tsx`,
  `src/components/ui/form/SubmitFallback.tsx`,
  `src/components/pages/contact/ContactForm.tsx`,
  `src/components/pages/contact/ContactHero.tsx`,
  `src/components/pages/free-audit/FreeAuditHero.tsx`,
  `src/components/pages/free-audit/FreeAuditSuccess.tsx`,
  `src/components/pages/free-audit/steps/StepPresence.tsx`,
  `src/components/pages/free-audit/steps/StepGoals.tsx`,
  `src/components/pages/work/WorkHero.tsx`,
  `src/components/pages/service-detail/ServiceEcosystem.tsx`,
  `src/components/pages/industry-detail/IndustryChallenges.tsx`,
  `src/components/pages/industry-detail/RelevantServices.tsx`,
  `src/components/pages/industries/IndustriesAnswers.tsx`,
  `src/components/pages/industries/IndustriesSystem.tsx` (`sr-only` label),
  `src/components/pages/services/ServicesAnswers.tsx`,
  `src/components/pages/about/AboutAnswers.tsx`
- **Changed (non-visitor-facing string, fixed for consistency even though
  out of the visible-copy scope):** `src/lib/leads/submit.ts` (the
  user-facing submission-error message on that file was in scope and fixed;
  its separate internal `console.error` diagnostic string was left as-is)

### Verification performed

- `npx tsc --noEmit` — clean.
- `npm run build` (Turbopack) — clean, all 39 routes generated successfully.
- Final `grep -rn "—" src` re-check — zero remaining instances outside code
  comments and the two internal-only strings noted above.
- Screenshots confirming: the industry-page timeline line now passes through
  the circle centers (`/industries/real-estate`), and the homepage
  `HowWeWork` timeline (unchanged) still renders correctly.

**SITE-WIDE FIXES STATUS: READY FOR USER REVIEW**

---

## Phase 10 — SEO/AEO/GEO gap fixes + first-visit callback popup

Scoped, reviewed and approved section-by-section before any code was
written (see the scoping discussion for the full trade-off reasoning). The
Work/case-study showcase upgrade (partial client info) and Phase 4/5 page
transitions/intro sequence are explicitly NOT part of this phase — held
separately per the user's own bucketing decision.

### 1. FAQPage schema on hub pages

`/industries`, `/services` and `/about` each render a visible Q&A block
(`IndustriesAnswers`, `ServicesAnswers`, `AboutAnswers`) that was never
wrapped in `FAQPage` structured data, unlike the industry/service detail
pages, which already did this correctly. Each component's `qa` array is now
exported and fed into `faqPageSchema()` in the corresponding `page.tsx`, so
the exact same array drives both the visible copy and the structured data —
they can't drift apart.

- **Changed:** `src/components/pages/industries/IndustriesAnswers.tsx`,
  `src/components/pages/services/ServicesAnswers.tsx`,
  `src/components/pages/about/AboutAnswers.tsx` (each now exports `qa`)
- **Changed:** `src/app/industries/page.tsx`, `src/app/services/page.tsx`,
  `src/app/about/page.tsx` (each now injects `faqPageSchema(qa)`)

### 2. `llms.txt` refresh

Flagged as stale back in Phase 0. It still listed the retired
"Founders & Personal Brands" industry and was missing "Jewellery & Wedding"
(which replaced it), plus three display names had drifted from the site's
actual current names. Rewritten to match `industries.ts` exactly, and added
the `/work` page to the primary-pages list (previously missing).

- **Changed:** `public/llms.txt`

### 3. Meta-description length fix

`/industries`' meta description was 172 characters — past Google's
~155-160 char safe display length, so it was getting truncated in search
snippets. Trimmed to 155 characters, same meaning intact.

- **Changed:** `src/app/industries/page.tsx`

### 4. First-visit "quick callback" popup

Scoped and approved trade-off by trade-off before any code was written:

- **Trigger:** scroll depth ≥ 50% AND ≥ 8 seconds elapsed (whichever is
  satisfied last) — not a blind timer, not exit-intent (no signal on
  mobile).
- **First-time detection:** a `localStorage` flag. Known, accepted
  limitation: clearing site data or incognito shows it again.
- **Dismissal:** X button, Escape key, or backdrop click — never a forced
  modal.
- **Coexistence with Free Audit:** suppressed entirely on `/free-audit` and
  `/contact`; everywhere else it uses a lighter "quick callback" framing
  (name/phone/business only) distinct from the Free Audit's fuller wizard.
- **Re-trigger suppression:** submitting sets a permanent flag (never shows
  again). Dismissing without submitting sets a 21-day cooldown instead.
- **Delivery:** routes through the exact same `submitLead()` pipeline as
  the Contact form (`type: "contact"`, fixed `subject: "Quick callback
  request (popup)"`, `sourcePage: "popup-quick-callback"` so it's
  distinguishable from a real Contact submission in whatever inbox/sheet/
  CRM receives it) — no new destination, no new plumbing.

- **New:** `src/components/ui/FirstVisitPopup.tsx`
- **Changed:** `src/app/layout.tsx` (mounted sitewide, alongside
  `FloatingWhatsApp`), `src/lib/analytics/track.ts` (added `popup_shown` /
  `popup_dismissed` / `popup_submitted` events)

### Verification performed

- `npx tsc --noEmit` — clean. `npm run build` (Turbopack) — clean, all 39
  routes generated. `npm run lint` — no new findings (the 11 pre-existing
  `GXScene.tsx` errors are unrelated and untouched by this phase).
- Confirmed via raw HTML inspection that `/industries`, `/services` and
  `/about` now emit `"@type":"FAQPage"` in their JSON-LD, and that the
  trimmed meta description renders correctly.
- Confirmed `/llms.txt` serves the corrected content.
- Playwright end-to-end pass on the popup: opens after scroll+time-floor on
  a normal page; closes via Escape, the X button, and a backdrop click;
  sets the 21-day cooldown flag on dismiss and correctly suppresses on the
  next page visited within that cooldown (same browser storage); stays
  fully suppressed on `/contact` and `/free-audit` regardless of scroll/
  time; and a real submission correctly reaches `submitLead()` — verified
  by the honest "couldn't confirm this went through" fallback message
  appearing (this sandbox has no `LEAD_WEBHOOK_URL`/`EMAIL_API_KEY`
  configured, so this is the same fallback the Contact form itself would
  show here — proof the popup shares its exact delivery pipeline, not a
  bug).

**PHASE 10 STATUS: READY FOR USER REVIEW**

---

## Post-Phase-10 fix — Digital Ecosystem arrow alignment

User-reported, spotted on `/industries/education-coaching`'s "Digital
Ecosystem" section (`IndustryEcosystem.tsx` — the 6-step, dark-themed
`→`-connected diagram, present on every industry detail page). Separate
component from the already-fixed `BuyerJourneyScrub.tsx` timeline; not
caught by that earlier fix.

Root cause: each `→` arrow is a flex sibling of its preceding
circle-plus-label column (`items-center` on the row). Since the label text
sits below the circle and can wrap to two lines, the column is taller than
the circle alone — `items-center` was centering the arrow against that
whole column, not the circle itself, landing it visibly below the circle's
true center. Measured directly (not eyeballed): arrows were 14px below the
circles' center before the fix.

Fixed with `md:self-start md:mt-2` on the arrow: anchors it to the top of
the column with a fixed offset (half the circle's own height minus half the
arrow's own line height), so it lines up with the circle's center
regardless of how many lines the label below wraps to. Verified via a
direct DOM measurement script (not a screenshot eyeball): every arrow's
center now matches its adjacent circle's center exactly, across all 6
circles.

Also checked (per the same report) the "Website → Credibility"-style rows
on `/services` (`OutcomesMap.tsx`): measured already perfectly centered,
tool/arrow/outcome all sharing the same vertical center on every row — no
change needed there.

- **Changed:** `src/components/pages/industry-detail/IndustryEcosystem.tsx`

## "Our Work" — real client reveal (Mangalam Acid and Chemicals / MAAC)

The client behind the one case study on `/work` was originally shown
anonymized at their own request (see the Phase 8 changelog entry). They
have since confirmed it's fine to name and show them, supplied their real
logo file, their real downloadable product catalogue PDF (10 pages), and
their real one-page company profile sheet, and asked for a bigger hero plus
a gallery while keeping the existing 3-facet page structure.

**What changed:**

- `src/lib/data/work.ts` — `client` no longer has `anonymized`/withheld-note
  fields; it now carries the real name ("Mangalam Acid and Chemicals
  (MAAC)"), industry, and website. Facet `summary`/`scope` copy is
  unchanged in substance (it already described real, accurate work) but
  now names the client directly instead of "the manufacturer". Added a new
  `gallery` array (6 items: logo, catalogue cover, an inside catalogue
  page, the About Us plant photo, the industries-served photo strip, and
  the one-page company profile sheet) feeding the new gallery section
  below.
- Real images processed from the three supplied source files (PDF pages
  rendered via `pdftoppm`, cropped/composed with Pillow) and dropped into
  `public/work/`: a clean background-removed logo (`gallery-logo.png`), the
  real catalogue cover cropped to portrait for the "catalogue" facet
  (`case-study-catalogue.jpg`), the real "product portfolio" brand artwork
  composed with the logo for the "brand" facet (`case-study-brand.jpg`),
  and six further images for the new gallery grid.
- **Website facet is an interim placeholder, not a final image.** I could
  not capture a real screenshot of the live site from this environment
  (direct fetch to the domain is blocked here, and no browser tool was
  connected) — `case-study-website.jpg` is a branded card built from MAAC's
  own logo and product imagery instead. The user has agreed to send real
  screenshots; swapping them in is a small follow-up once received, not a
  new phase.
- `src/components/pages/work/WorkHero.tsx` — headline now names MAAC
  directly instead of the earlier anonymized hedge ("One real case study,
  not a wall of logos" → "One real case study: Mangalam Acid and Chemicals
  (MAAC)."); added a bigger real-photography banner (`hero-banner.jpg`,
  cropped from the client's own catalogue cover) below the intro copy, per
  the user's "bigger hero" request.
- `src/components/pages/work/WorkGallery.tsx` (**new**) — a real-reference
  gallery grid (logo, catalogue cover, an inside catalogue page, the About
  Us photo, the industries-served strip, the profile sheet), each captioned,
  mounted between the hero and the existing WebGL showcase. Satisfies the
  user's "gallery" request while leaving the existing case-study section
  (`WorkCaseStudy.tsx`, `WorkShowcase.tsx`/`WorkScene.tsx`) structurally
  untouched, per "keep current layout, refresh visuals".
- `src/components/pages/work/WorkCaseStudy.tsx` — the section description
  now reads "Client: Mangalam Acid and Chemicals (MAAC). ..." instead of
  "Industry: Chemicals manufacturing. ...".
- `src/app/work/page.tsx` — page `<title>`/meta description now name MAAC
  (also a small AEO/GEO win, consistent with Phase 10's naming-things-
  directly approach); mounted the new `WorkGallery` section.
- `public/llms.txt` — the `/work` entry now names MAAC instead of the
  generic "a real, full-scope GraphikosX client engagement" line.

**Deliberately not added:** client certifications (ISO 9001:2015, ISO
45001:2018, MSME, D&B, IndiaMART TrustSeal) were considered as credibility
proof points and then explicitly declined by the user — none of that
appears anywhere on the page.

**Verification performed:** `npx tsc --noEmit` clean; `npm run build`
clean (39 routes, "Finished TypeScript"); `npm run lint` shows the same 13
pre-existing errors as the unmodified baseline commit (confirmed via `git
stash` + re-lint), all in `GXScene.tsx`/`WorkScene.tsx`/`IntroSequence.tsx`/
`FreeAuditWizard.tsx` — none in any file this change touched, and none
introduced by it. Full page walkthrough via a headless-Chromium script at
desktop (1280×900) and mobile (390×844) viewports: hero banner, all 6
gallery cards (including a fix for the wide "Industries served" image,
which was initially cropping off the first/last photo labels under
`object-cover` — switched that one card to `object-contain` with a
matched-aspect frame), and all three case-study facet images render
correctly with no console errors and no horizontal overflow on mobile.

## "Our Work" — privacy fix: contact details cropped out of MAAC images

User-requested audit: every MAAC image on `/work` had to have address,
phone number, and email cropped out — site-wide, not just images already
flagged. MAAC's real marketing material (catalogue PDF, company profile
sheet) puts a contact footer — address, three phone numbers, two-to-three
email addresses, a QR code — at the bottom of nearly every page, and four
of the images added in the previous "real client reveal" pass included
that footer:

- `public/work/case-study-catalogue.jpg` (the "Digital product catalogue"
  case-study facet image) — re-cropped from the source catalogue cover to
  end well above the footer (previously cut the crop just late enough to
  catch the top of the contact block).
- `public/work/gallery-catalogue-cover.jpg` — same source page, same fix:
  footer band cropped off, rest of the cover (logo, headline, product
  list, hero banner) unchanged.
- `public/work/gallery-product-page.jpg` — the real catalogue's "Industrial
  & Textile Chemicals" page; footer band cropped off, product list and
  application icons unchanged.
- `public/work/gallery-profile-sheet.jpg` — the one-page company profile;
  cropped above the bottom contact/QR bar. Certifications, product
  portfolio, and "industries served" content (which sit above the footer)
  are unchanged, so the alt text and caption still describe the image
  accurately.

Checked and confirmed clean, no change needed: `gallery-logo.png` (logo
only), `gallery-plant.jpg` and `gallery-industries.jpg` (tightly cropped
photos, no text), `case-study-website.jpg` and `case-study-brand.jpg`
(composed from regions of the source material well above any footer),
`hero-banner.jpg` (cropped from the cover's middle banner, also above the
footer). Also grepped the rest of the codebase for any other MAAC
reference outside `/work` — none found, so this is the complete set.

**Caught during verification, not shipped:** the first rebuild after
copying the fixed images still showed the old contact-footer image in a
headless-browser screenshot. Root cause was this environment's local
`next start` disk cache (`.next/cache/images`) serving a stale
transformed copy of `case-study-catalogue.jpg` under the same URL/size
key from an earlier build, despite the source file on disk already being
the corrected one (confirmed via checksum). A full `rm -rf .next && npm
run build` resolved it, and a re-verification pass (both a direct fetch
of the Next.js image-optimizer endpoint and a fresh full-page headless
screenshot) confirmed every image on the page is now clean. This is a
local build-cache quirk in this environment, not a defect in the shipped
files — a normal `npm install && npm run build` in a clean folder (which
is how every delivery so far has been tested) never has a stale
`.next/cache` to begin with. Flagging only so that if this project is ever
redeployed by rebuilding on top of an existing `.next` folder rather than
a clean one, a `rm -rf .next` first is the safe move.

**Verification performed:** `npx tsc --noEmit` and `npm run build` clean
(no code changed, only image files); full-page headless-browser screenshot
of `/work` reviewed section by section post-clean-rebuild — no address,
phone number, or email visible anywhere on the page.

## Liquid-glass nav bar

The header was already sticky with a backdrop-blur past a 24px scroll
threshold; this replaces the hard on/off flip with a continuous ramp and a
stronger, more "liquid glass" (iOS 17/18 style) effect.

- `src/app/globals.css` — new `.gx-header-glass` rule: background alpha,
  blur radius, and saturation are all driven by a single `--gx-nav-progress`
  custom property (0 at the top of the page, 1 by 120px of scroll) via
  `calc()`, plus a border/shadow that fades in over the same range. Both
  `backdrop-filter` and `-webkit-backdrop-filter` are written explicitly.
  New `.gx-header-glass-panel` rule applies the same glass treatment to the
  mobile dropdown menu.
- `src/components/layout/Header.tsx` — the scroll listener now also writes
  `--gx-nav-progress` straight to the header's own style from a
  rAF-throttled callback (same direct-DOM-write pattern `CursorAtmosphere.tsx`
  already uses for its pointer-tracked glow) instead of only flipping a
  Tailwind class at one threshold. The existing `scrolled` boolean state is
  unchanged and still drives the discrete height/logo-size shrink.

**Verification performed:** `npx tsc --noEmit` and `npm run build` clean;
`npm run lint` shows the same pre-existing unrelated errors as before, none
in this file; headless-browser check confirms `--gx-nav-progress` ramps
continuously from 0 to 1 between scrollY 0 and 120px and clamps at 1 beyond
that, at both mobile (390px) and desktop (1280px) viewports, with page
content visibly blurred-through underneath the bar once scrolled and no
console errors.

## Mobile/tablet 3D hero — "lite" touch-interactive 3D + touch glow trail

Phones (screens under 640px) previously fell straight back to the static
branded SVG (`GXFallback.tsx`), same as reduced-motion/low-memory/no-WebGL
devices. This unit gives phones a real, simplified 3D hologram instead —
auto-rotating and touch-draggable — while leaving tablets, desktop,
reduced-motion, low-memory, and no-WebGL devices completely unchanged from
before. It also adds real touch-drag interactivity to the existing
(previously mouse-only) desktop/tablet 3D scene.

- `src/components/three/useHeroTouchControl.ts` (new) — shared touch-drag
  hook: a persistent Y-axis "spin" that never springs back (swipe further,
  it rotates further, layered on top of the existing idle auto-rotation)
  and an X-axis "tilt" that reuses the existing mouse-tilt's damped
  spring-back mechanism, just fed from the finger's vertical movement.
  Pointer capture is taken on touch-down so a drag stays attached to the
  hologram even if the finger wanders outside its hit region mid-drag.
- `src/components/three/GXTouchGlow.tsx` (new) — the touch-drag equivalent
  of `CursorAtmosphere.tsx`'s mouse glow: a small, concentrated radial
  gradient (not a real blur filter) that follows the finger, visible only
  while a drag is actually in progress. Respects `prefers-reduced-motion`.
- `src/components/three/GXScene.tsx` (existing desktop/tablet scene) — now
  consumes the shared touch hook (idle rotation refactored into a
  persistent `idleAngle` accumulator so touch spin can add on top of it
  every frame), mounts `GXTouchGlow`, and scopes `touch-action: none` to
  just its small hit region so dragging the hologram never fights with
  page scroll. This is the part that gives tablets — which had zero touch
  interactivity before — working touch-drag for the first time; nothing
  about its visuals (atmosphere shader, postprocessing, particle count,
  `dpr`) changed.
- `src/components/three/GXSceneLite.tsx` (new) — the phone tier. Same
  traced GX-mark geometry, material, lighting, and touch interaction as
  `GXScene.tsx`, but drops the two most GPU-expensive subsystems entirely
  rather than turning them down: the full-screen domain-warped noise
  "atmosphere" plane, and the `EffectComposer` postprocessing stack
  (Bloom/ChromaticAberration/Noise). Also caps `dpr` lower (`[1, 1.2]` vs.
  `[1, 1.6]`) and roughly halves the particle count (90 vs. 180) as two
  smaller extra-margin cuts. Visual/geometry code is deliberately
  duplicated from `GXScene.tsx` rather than shared (this project's existing
  convention — see `WorkScene.tsx`'s WebGL-check comment); the touch
  interaction logic is the one thing shared via `useHeroTouchControl.ts`,
  since that's the part where a second hand-copied version would risk an
  actual behavioral bug, not just a different look.
- `src/components/three/GXHero.tsx` — capability gate is now three-way:
  `static` (reduced motion / low memory / no WebGL — unchanged), `lite`
  (phones, <640px — new), `full` (tablets and desktop, ≥640px — unchanged,
  still `GXScene.tsx`). Also fixes a real, pre-existing double-render bug
  found while testing this: `Hero.tsx` mounts `<GXHero>` twice (a ≥1024px
  side-by-side copy and a <1024px full-width copy, toggled with CSS only),
  and previously BOTH copies independently ran the same capability check
  and could both mount a full WebGL canvas even though only one was ever
  visually on screen — a `display: none` canvas doesn't paint, but its
  render loop (`requestAnimationFrame`-driven) keeps running regardless, so
  this was silently doubling the real GPU/CPU cost. `GXHero` now takes a
  `layout: "lg-up" | "below-lg"` prop (passed from `Hero.tsx`) and only
  mounts anything beyond the decorative glow when it's actually the
  on-screen copy for the current viewport width.
- `src/components/sections/Hero.tsx` — passes the new `layout` prop to each
  of its two `<GXHero>` mounts (no other change).
- `src/app/globals.css` — new `.gx-touch-glow` rule (small radial-gradient,
  `is-active`-gated, `prefers-reduced-motion` respected), same
  direct-custom-property architecture as the existing `.gx-cursor-atmosphere`
  rule.

**Honest performance assessment, as promised before writing any code:**
this sandbox cannot produce a trustworthy real mobile-GPU frame-rate number
— headless testing here renders WebGL in software, not on real phone
silicon, and a fabricated number would be worse than useless. What WAS
verified here: simulated touch-drag gestures combined with simultaneous
page scroll (the explicitly requested worst case) at four viewport widths
(360px, 390px, 820px, 1440px) produce zero console/page errors, exactly one
WebGL canvas is ever mounted per viewport (confirming the double-render fix
above), the touch spin/tilt/glow-trail all respond correctly to a
simulated drag, and native page scroll is never blocked by the drag. As a
relative (not absolute) signal, the same synthetic drag+scroll load produces
roughly 3x less main-thread blocking time on the phone-tier "lite" scene
than on the tablet-tier "full" scene under identical software rendering —
consistent with dropping the atmosphere shader and postprocessing stack,
though this ratio should not be read as a real-device frame-rate prediction
either way.

**Where the fallback line was drawn, and why:** reduced-motion, low-memory
(`navigator.deviceMemory < 4`, Chrome/Android only — this API doesn't exist
on iOS Safari, so it never excludes iPhones specifically), and no-WebGL
devices still go straight to the static SVG — those are exactly the
signals that real 3D isn't a good idea on that device, "lite" mode
included, and nothing here forces it. Every phone that clears those three
checks gets "lite" 3D rather than static, on the basis that "lite" drops
enough (both the heaviest shader and the whole postprocessing stack) that
it should be meaningfully cheaper than the existing "full" scene tablets
already run today — but this is a reasoned judgment call from code-level
analysis, not a real-device measurement, which is why it is NOT being
treated as fully approved yet.

**Real-device check still required before this counts as approved,** per
your own condition when you signed off on this approach — this delivery is
the implementation ready for that check, not a claim that it's already
verified smooth on real phone hardware. Please try it on an actual
mid-range Android phone (drag the hologram while also scrolling past it —
the worst-case combination) and let me know if anything feels laggy or
janky; if it does, tell me specifically what and I'll adjust rather than
ship it as-is.

**Verification performed:** `npx tsc --noEmit` and `npm run build` clean;
`npm run lint` shows the same pre-existing unrelated errors as before, plus
the same category of pre-existing false-positive (`react-hooks/purity` /
`react-hooks/immutability`, which don't understand react-three-fiber's
imperative `useFrame`/`useMemo` patterns — already present in the untouched
`GXScene.tsx`) newly appearing in `GXSceneLite.tsx` too, since it
deliberately duplicates that same established pattern; headless-browser
verification across 360px/390px/820px/1440px viewports (touch simulated at
the first three) confirms: exactly one canvas mounted per viewport, correct
mode selection at each width, simulated touch-drag correctly spins/tilts
the mark and activates the glow trail, native scroll is never blocked
during a simultaneous drag, reduced-motion still renders zero canvases, and
zero console errors throughout.

## Real-device follow-up — mobile 3D hero quality/reflection, hero background-shape sweep, table arrow fix

Four fixes from a real-phone testing pass, delivered together.

### 1. Mobile 3D hero — render quality (`GXSceneLite.tsx`)

Root cause of the reported blur: the phone-tier canvas capped
`devicePixelRatio` at `[1, 1.2]`. Real phones commonly report a
`devicePixelRatio` of 2–3, so the browser was rendering the WebGL buffer at
roughly half the phone's native resolution and then upscaling it to fill
the CSS-pixel-sized canvas — that upscale is what read as overall softness.
This is a different mechanism from anti-aliasing (`gl.antialias`, which was
already correctly enabled in both `GXScene.tsx` and `GXSceneLite.tsx`, and
needed no change) — antialiasing only smooths edges of an already-correct
render; it can't fix a render that's the wrong resolution to begin with.

Raised the cap to `[1, 2]` — higher than even the desktop/tablet "full"
scene's `[1, 1.6]`. That's intentional, not an oversight: the phone tier
already drops its two most expensive subsystems entirely (the full-screen
noise-shader atmosphere plane, and the Bloom/ChromaticAberration/Noise
postprocessing stack — see that file's own header comment), which buys
back exactly this kind of resolution headroom. The shaders actually running
at the higher resolution are cheap ones — a lit metal material, a small
baked-gradient plane, a low-poly particle field — not the expensive
noise-based atmosphere shader.

**Smoothness — an honest caveat, not a confirmed number.** This sandbox
has no hardware GPU: WebGL here runs on a software rasterizer, so absolute
frame rate measured in this environment (single digits even at the old,
cheaper `1.2` cap) is not representative of any real device and can't be
reported as a phone's frame rate. What the sandbox *can* show is a relative
comparison: under identical conditions (same software renderer, same
interaction script — simulated touch-drag plus a scroll-past), the `[1,2]`
build ran at roughly 70% of the frame rate of the `[1,1.2]` build. Whether
that ratio matters on a real phone depends on how much fill-rate headroom
that phone's GPU has — which this sandbox cannot measure. Given the
subsystem cuts already in place for this tier, `[1, 2]` is the reasoned
choice, not a guess, but it has **not** been confirmed smooth on real
mid-range hardware. If it stutters on an actual phone, the fallback is a
one-line change (drop the cap back toward `1.5`, or make it depend on
`navigator.deviceMemory`/a UA-based tier) — flag it and it'll be adjusted
rather than shipped as a forced tradeoff.

### 2. Reflection under the logo — thin line → rounded pool (`GXScene.tsx` + `GXSceneLite.tsx`)

Root cause: the old reflection was a genuine 3D mesh — a vertically
mirrored copy of the mark's own ring/blade geometry — nested inside the
*same rotating group* as the mark itself. A flat, angular shape like that
foreshortens to almost nothing from most rotation angles, exactly like a
coin turned edge-on, which is why it read as "a thin line" rather than a
pool during normal idle rotation or a drag. It also was never round to
begin with — it was the letter-shaped silhouette, mirrored, so even
face-on it never looked like a reflection pool.

Replaced it with the same technique the (correctly-behaving) contact
shadow already uses one mesh below it: a flat, camera-facing billboard
plane textured with a baked, heavily-blurred radial-gradient canvas
texture (blue-tinted, to read as the mark's own light pooling rather than
a second shadow). A billboard plane can't foreshorten to a line no matter
how the mark rotates, and a radial gradient is round/oval by construction
— both problems fixed at the root, not by tuning opacity or size on the
old approach. Applied identically to both the desktop/tablet scene and the
phone scene, consistent with this project's convention of duplicating
scene code between those two files rather than sharing it.

### 3. Decorative background shapes removed from every hero — sitewide sweep

You'd found four manually (Industries, Services, About, Contact). A full
grep-based sweep across every hero-bearing page found **seven** removal
sites, not four — the extra three were a shared "motif" component used
across page *templates*, which is exactly the "one component used across
heroes" you suspected existed:

- `AboutHero.tsx` — inline SVG arc/circle, removed
- `ContactHero.tsx` — inline SVG polygon, removed
- `IndustriesHero.tsx` — inline SVG dashed circle, removed
- `ServicesHero.tsx` — inline SVG triangle, removed
- `FreeAuditHero.tsx` — inline SVG circle (not in your list — caught by
  the sweep, not by manual browsing)
- `IndustryHero.tsx` — usage of `StyleMotif`, a shared component with 10
  shape variants (one per industry `visualStyle`), used on **all 10**
  `/industries/[slug]` pages. This is almost certainly the pattern you
  noticed repeating.
- `ServiceHero.tsx` — usage of `GroupMotif`, the services-side equivalent,
  used on **all ~15** `/services/[slug]` pages.

`StyleMotif.tsx` and `GroupMotif.tsx` themselves were left in place (dead
code, unused after these edits) rather than deleted, matching the
minimal-footprint approach used elsewhere in this fix — only the usage
that rendered them on a hero was removed. Confirmed clean, no edit needed:
`WorkHero.tsx`, `LegalHero.tsx`, the homepage hero (`Hero.tsx`). One
unrelated decorative glow was found on `Vision.tsx` (a homepage *content*
section, not a hero) and deliberately left alone as out of scope for "hero
background shapes."

Nothing else on any of these seven files changed — headline, breadcrumbs,
CTAs, and page content are untouched; each edit was a pure deletion of the
decorative element (and its now-unused import, for the two motif-component
cases).

### 4. `/services` "Why This Grouping" table — arrow centering (`OutcomesMap.tsx`)

Root cause: the row used `flex justify-between`, which only pins the
*first* and *last* child to the row's edges and splits the leftover space
across the two gaps — it visually centers the middle item (the arrow) only
on rows where the left and right text happen to be the same width. Since
"AI Automation" and "SEO" aren't the same width, the arrow drifted off
-center.

Restructured the row as a fixed-track CSS Grid
(`grid-cols-[1fr_auto_1fr]`) with the arrow in the `auto` middle column.
That column is always the row's true horizontal center regardless of how
long the flanking text is — a structural fix, not a breakpoint-specific
one, so it holds at every viewport width automatically rather than needing
separate mobile/desktop logic. This directly answers the concern that past
arrow-alignment fixes were checked on desktop and broke on mobile: this one
was measured, not just eyeballed, at both.

**Verification performed:** `npx tsc --noEmit` and a full `npm run build`
both clean. `npm run lint` shows the same pre-existing, unrelated
`react-hooks/purity`/`react-hooks/immutability` false-positives already
present in the untouched files (`GXScene.tsx`, `WorkScene.tsx`,
`FreeAuditWizard.tsx`, `IntroSequence.tsx`) — nothing new introduced by
these changes. Headless-browser screenshots taken at 390×844 (mobile) and
1440×900 (desktop) for all seven hero-shape pages plus one industry-detail
and one service-detail page, confirming no shape remains and nothing else
shifted. Arrow-centering measured programmatically (not just eyeballed) at
both widths: all 7 table rows measured exactly 0px offset from the row's
true center, both mobile and desktop. Reflection pool visually confirmed
as a rounded blue-tinted shape (not a line) at multiple rotation angles,
both scene tiers.

