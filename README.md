# GraphikosX — V2 Website (Phase 2E)

Production codebase for the GraphikosX website rebuild. Every planned route is now live: homepage,
`/about`, `/services` (+ 15 service pages), `/industries` (+ 10 industry pages), `/free-audit`,
`/contact`, `/privacy` and `/terms`, plus the conversion, lead-capture and analytics architecture
behind the Free Audit and Contact forms. See "Phase 2 status" below for exactly what's built vs.
what still needs production credentials before launch.

## Purpose

GraphikosX is an AI-driven digital presence agency. This project is a ground-up rebuild of
graphikosx.in as a fast, crawlable, accessible, conversion-focused, SEO/AEO/GEO-optimized site —
replacing the previous single-page (one-pager) site with a real multi-page architecture.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** (CSS-based theme via `@theme` in `globals.css` — no `tailwind.config.js`)
- **Typography:** Manrope (display/headlines) + Inter (body/labels), via `@fontsource-variable/manrope`
  and `@fontsource-variable/inter` — self-hosted variable fonts, zero external font requests. See
  "Typography system" below.
- **Framer Motion** for scroll reveals and micro-interactions (transform/opacity only — no layout-thrashing animations)
- **React Three Fiber + Three.js** for the homepage's signature 3D hero, lazy-loaded and used nowhere else
- No CMS yet — content lives in typed local data files (see below) so it's easy to wire to a CMS later without touching components

## Local setup

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint     # ESLint
```

Node 20+ recommended (matches the Next.js 16 requirement).

## Environment variables

The site runs with **zero environment variables required** — the Free Audit and Contact forms work
out of the box in a development-safe way (see "Lead capture architecture" below). One optional
variable upgrades lead delivery without any code changes:

| Variable | Required? | Effect |
|---|---|---|
| `LEAD_WEBHOOK_URL` | No | If set, every Free Audit / Contact submission is also POSTed as JSON to this URL. Point it at a Zapier/Make/n8n webhook, a Google Sheets webhook, or a CRM's inbound webhook to start collecting leads durably with no further code changes. |

No API keys, credentials, or secrets are hard-coded anywhere in this codebase, and none are ever
exposed client-side — `LEAD_WEBHOOK_URL` is only read server-side, inside the `submitLead` Server
Action.

## Content & config — single source of truth

All company facts, services and industries live in one place. Update these files and the change
propagates everywhere (nav, footer, schema, metadata, sections):

- `src/lib/data/company.ts` — phone, WhatsApp, emails, socials, founder, canonical site URL
- `src/lib/data/services.ts` — the 15 canonical services (Build/Grow/Scale)
- `src/lib/data/industries.ts` — the 10 canonical industries
- `src/lib/data/service-details.ts` / `src/lib/data/industry-details.ts` — full per-page content for
  the 15 service and 10 industry pages
- `src/lib/data/free-audit-options.ts` — the Free Audit wizard's checkbox option sets (improvement
  areas, goals)
- `src/lib/seo.ts` — per-page metadata builder (title/description/canonical/OG/Twitter/noIndex)
- `src/lib/schema.ts` — JSON-LD graph builder (Organization / Person / WebSite / Service / FAQPage)
- `src/lib/leads/types.ts` — the canonical `Lead` type shared by the Free Audit and Contact forms
- `src/lib/freeAuditUrl.ts` — the two helpers every CTA uses to build attributed `/free-audit` and
  `/contact` links

**To change the business phone number, email, or add an industry/service, edit only these files.**
No contact info is hard-coded anywhere else in the codebase.

## Brand assets

- `public/brand/graphikosx-logo.png` — the official GX logo. This is a background-removed crop of
  the official logo artwork you provided (a 3D-rendered mockup on a studio-grey backdrop). Only the
  photographic backdrop was removed to make it usable as a transparent web asset — **the mark's
  geometry, proportions and color were not redrawn, distorted, or altered.** If you have a clean
  vector/flat export of the logo (SVG or a transparent PNG straight from your design file), swap it
  in at this exact path and everything (header, footer, schema, favicons) picks it up automatically.
- `public/brand/apple-touch-icon.png`, `public/brand/icon-192.png`, `public/brand/icon-512.png` —
  generated from the same logo for home-screen/app icons.
- `src/app/favicon.ico` — generated from the same logo, on a white tab-safe background.
- `public/og/graphikosx-og.png` — the 1200×630 social share image (logo + headline, black/white/blue).

Because the logo is black-on-transparent, it is never recolored to sit on dark backgrounds (that
would alter the artwork). On the dark footer, it sits inside a light rounded plate instead — a
layout treatment, not a color change to the asset itself.

## Typography system

- **Display headlines:** Manrope Variable, applied via the `.font-display` utility class — used for
  every H1/H2 and large statement across the site.
- **Body copy, labels, buttons:** Inter Variable (the default body font — no class needed).
- **Labels/eyebrows:** `.text-label` (Inter Variable, uppercase, tracked) for small kickers like
  section eyebrows.
- **Numerals:** `.font-numeric` (Inter Variable with tabular figures) for step numbers and indices.
- Both fonts are self-hosted npm packages (`@fontsource-variable/*`), imported once in
  `src/app/layout.tsx`. There is no dependency on fonts.googleapis.com or any external font request —
  this was a deliberate choice after Google Fonts' CDN was unreachable in the build sandbox, and it
  has the added benefit of being fully privacy- and performance-neutral in production too.

## SEO / AEO / GEO architecture

- Per-page metadata (title, description, canonical, OG, Twitter) is generated via `buildMetadata()`
  in `src/lib/seo.ts` — every future route calls this with its own unique title/description.
- `src/app/robots.ts` and `src/app/sitemap.ts` are dynamic Next.js route handlers, not static files —
  they will automatically include new routes as they're added in later phases.
- Canonical domain is `https://graphikosx.in` (non-www), matching the redirect already live on the
  current site.
- JSON-LD is emitted as a single `@graph` (Organization + Person/founder + WebSite) with stable
  `@id`s, so future pages (services, industries) can reference the same Organization node instead of
  creating duplicate/inconsistent entities.
- All homepage copy exists as real semantic HTML — nothing essential lives only inside the 3D canvas.
- **Indexability decisions (Phase 2E):** `/free-audit` and `/contact` are indexed and included in the
  sitemap — both carry unique, substantial copy and are pages people plausibly search for directly
  (e.g. "free digital marketing audit"). `/privacy` and `/terms` are set to `noindex, nofollow` via
  `buildMetadata({ noIndex: true })` and excluded from `sitemap.ts` — standard practice for legal
  boilerplate, which adds no search value and can dilute topical relevance if indexed. They are
  intentionally **not** blocked in `robots.ts`, since a robots.txt disallow would stop crawlers from
  ever reading the `noindex` tag in the first place; the meta tag alone is the correct mechanism.

## Lead capture architecture (Phase 2E)

Both the Free Audit wizard (`/free-audit`) and the Contact form (`/contact`) submit into one
canonical `Lead` type (`src/lib/leads/types.ts`) via a single server-side entry point,
`submitLead()` (`src/lib/leads/submit.ts`, a Next.js Server Action). This keeps both forms
provider-agnostic: nothing about the UI or the type system is coupled to any specific CRM/email
service, so connecting one later is a change in one file, not a rewrite.

**What happens on every submission, in order:**

1. **Honeypot check** — a hidden field (`src/components/ui/form/fields.tsx` → `Honeypot`) that is
   invisible to real visitors. If it arrives non-empty, the submission is silently accepted (so bots
   get no signal) but never delivered anywhere.
2. **Rate limiting** — `src/lib/leads/rateLimit.ts` caps submissions per client (by IP) to 5 per 10
   minutes, in-memory. This is best-effort: it resets on server restart and is **not** shared across
   multiple server instances or serverless cold starts. See the note in that file for the production
   upgrade path (a durable store like Upstash Redis) if this deploys to a serverless/multi-instance
   platform.
3. **Server-side re-validation and sanitization** — every field is re-checked and re-sanitized in
   `submit.ts` using `src/lib/validation/rules.ts`, regardless of what the client already validated.
   The client-submitted `sourcePage`, URLs, industry, email, phone and UTM values are never trusted
   as-is.
4. **Delivery** — the finished `Lead` object is handed to every enabled provider in
   `src/lib/leads/providers.ts`.

**BUILT today (no credentials required):**

- `consoleProvider` — every lead is logged server-side (`console.log`) so submissions are visible in
  server logs during development and after deployment.
- `webhookProvider` — if `LEAD_WEBHOOK_URL` is set, the lead is also POSTed there as JSON. This is
  the fastest path to durable storage: point it at a spreadsheet, automation platform or CRM webhook.

**PRODUCTION INTEGRATION STILL REQUIRED before this can be relied on as the only record of a lead:**

- **No leads are durably stored today unless `LEAD_WEBHOOK_URL` is configured.** The console logger
  is ephemeral server output, not a database — do not treat it as lead storage.
- **No transactional email notification** (e.g. via Resend/SendGrid) is sent to
  `sales@graphikosx.in` on a new lead yet. Add an `emailProvider` in `providers.ts` once an email API
  key exists.
- **No direct CRM integration.** If a specific CRM is chosen, add a provider for it in the same file
  rather than changing anything in the wizard, the Contact form, or the `Lead` type.

This split is intentional and was a specific requirement for this phase: no credentials were
invented, and nothing pretends to permanently store a lead when it does not.

## Analytics event architecture (Phase 2E)

`src/lib/analytics/track.ts` exports a single `track(event, payload)` helper used at every
conversion touchpoint. It checks for `window.gtag` and no-ops safely if it isn't present — **no GA4
(or other analytics) script is wired into the site yet**, so every call below currently does nothing
in production except (in development) log to the console. The moment a GA4 loader script is added
(typically in `src/app/layout.tsx`) and defines `window.gtag`, every one of these calls starts
firing with zero further code changes.

Events currently wired: `free_audit_started`, `free_audit_step_completed`, `free_audit_submitted`,
`contact_form_submitted`, `whatsapp_clicked`, `email_clicked`, `phone_clicked`,
`service_cta_clicked`, `industry_cta_clicked`.

## CTA attribution (source + UTM)

Every "Get a Free Audit" and "Contact" button site-wide links with a `?source=...` query param
identifying exactly which CTA was clicked (e.g. `homepage-hero`, `service-seo-cta`,
`industry-healthcare-hero`, `header`). Industry-page CTAs additionally pass `&industry=<slug>`,
which pre-fills (but never locks) the industry field on step 1 of the Free Audit wizard — visitors
can always change it. See `src/lib/freeAuditUrl.ts` for the two helpers (`freeAuditHref`,
`contactHref`) every CTA uses, and `src/components/ui/TrackedFreeAuditButton.tsx` for the
client-component wrapper that fires `service_cta_clicked` / `industry_cta_clicked` on click while
the page around it stays a Server Component.

Both forms also read standard `utm_source` / `utm_medium` / `utm_campaign` / `utm_content` /
`utm_term` query params on mount (client-side, via `window.location.search`, not the
`useSearchParams` hook — this keeps the pages statically rendered) and forward them into the `Lead`
object untouched aside from sanitization.

## WhatsApp behavior

Every WhatsApp link on the site (header is phone-only; footer, homepage CTA, Contact page, and the
Free Audit success screen) opens `wa.me` with a **pre-filled, contextual message** via
`whatsappLink()` in `src/lib/data/company.ts` — never a bare link with no context. Messages differ
by where the click happened (e.g. the Free Audit success screen's message references the business
name just submitted). All WhatsApp links open in a new tab (`target="_blank" rel="noopener
noreferrer"`) so a visitor never loses the GraphikosX tab they were on.

## Spam protection

No CAPTCHA is used (none was requested, and none was invented for this phase). Spam mitigation is:
a hidden honeypot field on both forms, and IP-based rate limiting on the server side. See "Lead
capture architecture" above for both, including the known limitation of in-memory rate limiting
across serverless cold starts.

## Privacy & legal pages

`/privacy` and `/terms` (`src/app/privacy/page.tsx`, `src/app/terms/page.tsx`) describe the actual
data flows above — what's collected, why, and how it's currently processed — rather than generic
boilerplate. They deliberately avoid: a specific office address or business hours (never provided,
never invented), guarantees about marketing outcomes, and any claim about infrastructure (encryption
standards, compliance certifications) that isn't true today. **These were drafted as accurate,
functional first versions, not by a lawyer** — recommend a legal review before relying on them in a
real dispute.

## 3D implementation

The homepage hero features a proprietary sculptural form derived from the GX mark's own geometry:
a flat arc band (echoing the G's outer curve) crossed by two angular extruded blades (echoing the X
strokes) — abstracted, not a redraw of the logo itself. Matte-metallic black material, electric-blue
(#1D4ED8) rim lighting, slow auto-rotation plus subtle pointer parallax.

- `src/components/three/GXScene.tsx` — the Three.js/R3F scene (client-only, lazy-loaded)
- `src/components/three/GXFallback.tsx` — a branded 2.5D SVG version of the same composition, with
  lightweight pointer-parallax (no WebGL), used when WebGL is unavailable, the device reports low
  memory, the viewport is small, or the user prefers reduced motion
- `src/components/three/GXHero.tsx` — the capability check that decides which of the two to render

The 3D canvas is never loaded outside the homepage hero and never blocks content — it fades in after
mount, and the fallback renders immediately in its place until/unless the 3D version is ready.

## Motion & reduced-motion behavior

- `src/components/motion/Reveal.tsx` wraps scroll-triggered fades used across every section.
- All Framer Motion usage in this project animates only `transform`/`opacity` (translate, scale,
  rotate, path length) — no animated `width`/`height`/`top`/`left` layout properties outside the two
  intentionally-lightweight exceptions (the Cost of Waiting bar fill and Build→Grow→Scale connector,
  both simple, low-frequency, one-time reveals).
- `globals.css` sets `prefers-reduced-motion: reduce` to collapse all CSS animation/transition
  durations to ~0, and every custom Framer Motion component reads `useReducedMotion()` and skips its
  motion (no translate/scale/rotate offset, instant reveal) when it's set.
- The GX 3D hero specifically checks `prefers-reduced-motion`, device memory, WebGL support and
  viewport width, and substitutes the static 2.5D fallback if any of them indicate it should.

## Build / deploy

Standard Next.js production build:

```bash
npm run build
npm run start
```

Deploys cleanly to Vercel or any Node hosting that supports Next.js 16. No environment variables or
external services are required for the current (homepage-only) scope.

## Phase 2 status

**Built (Phase 2A → 2E):** global design tokens, header, footer, homepage (all 16 sections),
`/about`, `/services` (+ all 15 service pages), `/industries` (+ all 10 industry pages),
`/free-audit` (6-step wizard), `/contact`, `/privacy`, `/terms`. SEO/schema foundation across every
page. Brand asset pipeline (logo, favicons, OG image). Self-hosted Manrope/Inter typography system.
Full lead-capture architecture (`Lead` type, `submitLead()` Server Action, honeypot, rate limiting,
console + webhook delivery). Centralized analytics event helper, wired at every conversion
touchpoint. Site-wide CTA attribution (`source` + optional `industry` params) and contextual
WhatsApp messaging. Every route is in `sitemap.ts` except `/privacy` and `/terms`, which are
`noindex`.

**Every planned Phase 2 route now exists — there are no more intentionally-404ing pages.**

**PRODUCTION INTEGRATION STILL REQUIRED before real launch** (see "Lead capture architecture" and
"Analytics event architecture" above for full detail):

- Durable lead storage — set `LEAD_WEBHOOK_URL`, or add a CRM/email provider in
  `src/lib/leads/providers.ts`. Without this, submitted leads only exist in server logs.
- An analytics script (GA4 or otherwise) that defines `window.gtag`, to make the already-wired
  `track()` calls actually send data anywhere.
- A legal review of `/privacy` and `/terms` — both are accurate first drafts, not lawyer-reviewed.
- If deployed to a serverless/multi-instance platform, the in-memory rate limiter in
  `src/lib/leads/rateLimit.ts` should be swapped for a durable store (e.g. Upstash Redis); it
  currently resets per server instance/cold start.

The full content graph is closed: every service page links to relevant, real industry pages and
vice versa, `/services` and `/industries` link to every one of their children, and there are no dead
`/services/*` or `/industries/*` links anywhere on the site. Every "Get a Free Audit" / "Contact" CTA
across the entire site (homepage, about, services hub + all 15 service pages, industries hub + all
10 industry pages, header, footer) was audited in Phase 2E and confirmed to point to a live,
correctly-attributed URL. The only remaining gap is any future `/insights` content (Phase 2F+).

**Service page content** lives in `src/lib/data/service-details.ts`. **Industry page content**
lives in `src/lib/data/industry-details.ts`. Both are structured, hand-written entries (not a
programmatic generator) — problem, definition/buyer-journey, trust signals, digital gaps, relevant
service/industry cross-links with stated reasoning, outcomes, an adapted 5-phase approach, an
ecosystem diagram, FAQs, CTA copy and metadata, all unique per entry. Industry pages additionally
carry a `visualStyle` bucket (technical / clarity / spatial / editorial / authority / local /
progress) used purely for a per-industry decorative motif and diagram orientation — never a new
brand color.

**Known limitations to revisit:**

- Typography uses self-hosted Manrope + Inter (via `@fontsource-variable`) rather than a licensed
  brand typeface — swap in licensed fonts via `next/font/local` if GraphikosX adopts specific ones later.
- No founder photograph is used anywhere (per instruction) — the Founder section is intentionally
  typography-led.
- The logo asset (`public/brand/graphikosx-logo.png`) is now sourced from your cleaner,
  pre-background-removed export — crisp edges, true transparency, no halo. It's still a raster crop
  of a 3D mockup render rather than a vector file; swap in a vector/flat export if one becomes
  available for the smallest possible file size at very large display sizes.
- The `/services` Build/Grow/Scale tab system renders all 15 services in the actual server-rendered
  HTML at all times (only the active tab's *visibility* is CSS-controlled) specifically so nothing
  is hidden from crawlers behind a click — worth knowing if you inspect the DOM and see all three
  groups present at once.
