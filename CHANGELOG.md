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
