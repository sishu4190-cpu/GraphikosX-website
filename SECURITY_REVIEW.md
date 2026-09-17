# GraphikosX — Security Review & Meta App Readiness (Legal Phase 3)

**Prepared:** 17 September 2026. Final unit of the Legal & Meta compliance initiative (Phase 1: the three
required pages; Phase 2: AI disclosure + compliance write-up; Phase 3: this document — secrets/security
audit, validation, and deployment readiness).

## 1. Secrets and credentials audit

Checked, not assumed. Methodology and results:

| Check | Method | Result |
|---|---|---|
| Real `.env`/`.env.local`/`.env.production` files present in the working tree | `find` for any `.env*` file | Only `.env.example` exists — no real env file with values is present |
| Any env file ever committed to git history (even if later deleted) | `git log --all --full-history` on every `.env*` filename | None found |
| `.gitignore` actually excludes real env files | Inspected `.gitignore` | `.env*` is ignored, with an explicit `!.env.example` exception — correct |
| Hardcoded API keys, tokens, or credential-shaped strings anywhere in tracked source | `git grep` across the whole repo for key/secret/token patterns and common provider key formats (OpenAI `sk-…`, AWS `AKIA…`, Slack `xox…`, PEM private-key headers) | None found — only documentation lines *describing* that no secrets are hardcoded |
| Credential-named files (`.pem`, `.key`, `credentials.json`, service-account files) ever committed | `git log --all` for filename patterns | None found |
| Sensitive server-only env vars (`LEAD_WEBHOOK_URL`, `EMAIL_API_KEY`, `EMAIL_FROM`, `EMAIL_TO`, `RATE_LIMIT_REDIS_URL`, `RATE_LIMIT_REDIS_TOKEN`) read only in server-only code, never a `"use client"` file | Read `src/lib/leads/providers.ts` and `src/lib/leads/rateLimit.ts` directly | Confirmed server-only — neither file has a `"use client"` directive |
| Those same variable names or values present in the **built client bundle** (`.next/static`) | `grep` the actual production build output, not just the source | Not found anywhere in client-side output |
| Any provider-key-shaped string anywhere in the built client bundle | Broad pattern scan (`sk-…`, `AKIA…`, `xox…`, PEM headers) across all of `.next/static` | None found |
| The one intentionally-public variable, `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Confirmed this is the *only* `NEXT_PUBLIC_`-prefixed variable in the codebase | Correct — GA4 measurement IDs are meant to be public; nothing sensitive carries this prefix |

**No credential was found exposed anywhere — in source, git history, or the built client bundle — so
there is nothing to flag for rotation.** No backend credentials were touched or modified as part of this
review.

This audit covers this Next.js repository only. It does not and cannot cover the WhatsApp AI Assistant's
separate FastAPI backend, its `.env` handling, or its OpenAI/Meta API key storage — that code has not been
shared for review (flagged since Legal Phase 1). The same class of checks above (real env files gitignored,
no hardcoded keys, keys never sent to a browser) should be applied there before it goes live, and a
production Meta App Secret / WhatsApp access token should never be committed, logged in plaintext, or
returned in any API response.

## 2. Validation and testing

- **`npx tsc --noEmit`** — clean, no errors.
- **`npx eslint .`** — 18 errors / 2 warnings, unchanged from the pre-existing baseline (all in
  `HeroSceneLite.tsx`, part of the 3D redesign work and unrelated to Legal Phases 1–3).
- **`npx next build`** — clean production build, all routes compile.
- **Automated tests:** none are configured for this project (`package.json` has `dev`/`build`/`start`/`lint`
  only, no test runner, no `*.test.*`/`*.spec.*` files). Nothing to run here — noted rather than silently
  skipped.
- **Route + link crawl** (`scripts/crawl.mjs`, an existing Phase 2F QA script, updated this phase to check
  the new `/privacy-policy`, `/terms-of-service`, `/data-deletion` paths instead of the retired
  `/privacy`/`/terms`): ran against a real production build on `localhost`. Every one of 36 routes checked
  returned `200` (the one intentionally-invalid QA route correctly returned `404`); **zero broken internal
  links** out of 43 discovered across the whole site.
- **Metadata check** (same crawl script): all three legal pages have a unique `<title>`, a meta description,
  a correct self-referencing canonical URL, an `<h1>`, Open Graph title/image, and two JSON-LD blocks
  (WebPage + breadcrumb schema) each — matching every other page on the site.
- **Mobile responsiveness:** covered per-phase already — Phase 1's screenshots and overflow checks across
  360–1920px (including catching and fixing the footer/WhatsApp-button overlap regression), Phase 2's
  Contact-page checks at 1440×900 and 390×844. Not repeated wholesale here since nothing in Phase 3 touched
  layout.
- **Client-bundle secret check:** see §1 — folded into the same audit rather than a separate pass.

## 3. Deployment

This repository has no direct connection to your live GitHub remote or Vercel project from this session —
every phase of this project (the 3D redesign and this legal/compliance work alike) has shipped as a zip of
the exact changed files, applied to your local clone (`graphikosx-live-clone`) and pushed by you. That
pattern continues here: nothing in Phases 1–3 has been deployed anywhere yet. Once you've reviewed all
three zips locally and are ready to push:

1. Copy the changed files from all three phase zips into `graphikosx-live-clone` (same relative paths).
   **Delete** `src/app/privacy/page.tsx` and `src/app/terms/page.tsx` — Phase 1 retires them in favor of the
   new pages, so they don't get copied, they get removed.
2. `npm run build` locally to confirm it's clean in your own environment too.
3. `git add -A && git commit` (with a message covering all three phases, or one commit per phase — your
   call) and `git push origin main`.
4. Confirm your hosting provider (Vercel, per `DEPLOYMENT.md`) picks up the push and redeploys.

**No new environment variables are required for any of Legal Phases 1–3** — everything shipped is either a
static page, a redirect, or a small on-site note. `DEPLOYMENT.md`'s existing environment-variable table is
unaffected.

### Important finding — the live site does not currently match this repository

Checked `https://graphikosx.in/` directly as part of this phase's "verify before confirming ready for
Meta" step, expecting to at least see the 3D redesign (Phases 2–5) and the current footer/contact
information, since your session notes describe that work as pushed and live already. What's actually live
right now does not match:

- The homepage headline reads *"India has thousands of digital marketing agencies. But no one owns the top
  position"* — this doesn't correspond to any phase of the 3D redesign work in this repo (no 3D canvas,
  no "Cost of Waiting"/"Ecosystem"/"Build Grow Scale" sections were found).
- The live footer has no Privacy/Terms/Data Deletion links at all, and lists a different phone number
  (`+91 87340 96841`) than what's in this repository's `company.ts` (`+91 79840 10393`).
- `https://graphikosx.in/privacy-policy` returns a `404` (expected, since nothing has been pushed there
  yet — but `https://graphikosx.in/privacy` — the page this repo retired in Phase 1 — would be worth
  checking too, to see which version of the site is actually serving).

**This means the live domain is showing an older snapshot than even the pre-3D-redesign codebase**, not
just "hasn't gotten Legal Phases 1–3 yet." Before any of this — the 3D redesign or the legal pages — can be
considered live, it's worth checking directly (not something I can diagnose from here without access to
your Vercel dashboard or DNS settings):

- Is `graphikosx.in`'s DNS actually pointed at the Vercel project connected to
  `github.com/sishu4190-cpu/GraphikosX-website`?
- In that Vercel project, did the `02c06c9` push (or later) actually deploy successfully, and was it
  promoted to Production (as opposed to sitting as a Preview deployment)?
- Is there possibly a *different* GitHub repo or Vercel project actually serving the live domain?

This isn't something to guess at further from this sandbox — worth a direct look at the Vercel dashboard
before pushing anything else.

## 4. Meta Developer App — final field values

| Field | Value | Verified live? |
|---|---|---|
| App domain | `graphikosx.in` | — |
| Privacy Policy URL | `https://www.graphikosx.in/privacy-policy` | ❌ Not yet — currently 404s (see §3) |
| Terms of Service URL | `https://www.graphikosx.in/terms-of-service` | ❌ Not yet |
| User Data Deletion Instructions URL | `https://www.graphikosx.in/data-deletion` | ❌ Not yet |
| Category | Messaging | — |

**Do not submit these URLs to Meta's App Dashboard yet.** They're correct and ready in this repository —
verified against a real local production build (§2) — but Meta will fetch the *live* URL during app review,
and right now that URL doesn't exist on the public internet. Once you've deployed (§3) and resolved the
live-site discrepancy above, I'm glad to re-check all three URLs directly and confirm before you submit.

## 5. Consolidated open items (all three phases)

| Item | Raised in | Status |
|---|---|---|
| WhatsApp AI Assistant backend (FastAPI/OpenAI/SQLite) code review | Phase 1 | Still not shared — several items below depend on it |
| Exact data-retention period for AI Assistant conversations | Phase 1 | Left general in the Privacy Policy pending backend review |
| Terms of Service governing-law venue (city/court) | Phase 1 | Left as "laws of India" only — no venue specified |
| Whether GA4/analytics is actually live on Vercel | Phase 1 | You weren't sure — Privacy Policy currently says "not confirmed to be active" |
| AI Assistant's in-chat opening disclosure message | Phase 2 | Suggested copy provided; needs backend implementation |
| System prompt scoped to GraphikosX topics (WhatsApp's Jan 2026 policy) | Phase 2 | Flagged as a real compliance risk if the bot can go off-topic; needs backend implementation |
| 24-hour WhatsApp customer-service messaging window handling | Phase 2 | Flagged for backend design; not addressed here |
| DPDP Act grievance officer, formally named | Phase 2 | `prakash@graphikosx.in` already serves this role in practice |
| DPDP Act breach-notification process | Phase 2 | Operational/process item, not a code change |
| **Live site not matching this repo at all** | Phase 3 | **New finding — needs your Vercel/DNS check before anything can go live** |
| Legal review of `META_WHATSAPP_COMPLIANCE.md` and the live-readiness plan | Phase 3 | Recommended before relying on any of this for the actual Meta submission |

None of these block Phases 1–3 from being *correct and ready to deploy* — they're real gaps, but every one
of them is either already flagged with honest, non-invented placeholder language, or is an operational
decision that's explicitly yours to make, not something to guess at on your behalf.
