# GraphikosX — Deployment Guide (Phase 2F)

This is the production deployment checklist for graphikosx.in. Written for Vercel (the natural
fit for Next.js 16), but everything here applies to any Node hosting that supports Next.js
Server Actions and the App Router.

## 1. Environment variables

Copy `.env.example` and set real values in your hosting provider's environment variable
dashboard (Vercel: Project Settings → Environment Variables). **None of these are required for
the site to build or run** — every one is additive. See `src/lib/leads/providers.ts` and
`src/lib/leads/rateLimit.ts` for exactly how each is used.

| Variable | Required for launch? | Effect |
|---|---|---|
| `LEAD_WEBHOOK_URL` | **Recommended — see §2** | POSTs every Free Audit / Contact submission as JSON to this URL (Zapier/Make/n8n/Sheets/CRM). |
| `EMAIL_API_KEY` | **Recommended — see §2** | Resend API key. Enables the email-notification backup provider. |
| `EMAIL_FROM` | Required alongside `EMAIL_API_KEY` | Verified Resend sender, e.g. `"GraphikosX Leads <leads@graphikosx.in>"`. |
| `EMAIL_TO` | No | Overrides the notification recipient (defaults to `sales@graphikosx.in`). |
| `RATE_LIMIT_REDIS_URL` / `RATE_LIMIT_REDIS_TOKEN` | No (see §4) | Upstash Redis REST credentials for distributed-safe rate limiting. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No | GA4 Measurement ID. Loads GA4 and activates every existing `track()` call with zero code changes. |

## 2. Lead delivery — configure at least one durable provider before real launch

This is the single most important item on this checklist. As of Phase 2F, `submitLead()`
(`src/lib/leads/submit.ts`) will **never report a form submission as successful in production
unless a durable provider (webhook or email) actually confirmed delivery.** If neither
`LEAD_WEBHOOK_URL` nor `EMAIL_API_KEY`/`EMAIL_FROM` is set, the site is *safe* — no visitor is
ever shown a false success screen — but the Free Audit and Contact forms will not capture a
single lead, because every submission ends in the honest "we couldn't confirm this went
through" fallback (pre-filled WhatsApp/email links, nothing typed is lost). **Safe is not the
same as functional.** Set at least one of `LEAD_WEBHOOK_URL` or `EMAIL_API_KEY`+`EMAIL_FROM`
before sending real traffic to `/free-audit` or `/contact`.

Recommended: configure both. They are independent — a webhook outage doesn't stop email, and
vice versa (`deliverLead()` in `providers.ts` runs every provider with `Promise.allSettled`, and
`submitLead()` only needs one durable success to report `ok: true`).

**Fastest path to `LEAD_WEBHOOK_URL`:** a Zapier/Make/n8n "Catch Webhook" trigger, or a Google
Sheets webhook (e.g. via Sheet.best or a simple Apps Script Web App), pasted in as-is.

**Fastest path to email:** create a Resend account, verify a sending subdomain for
graphikosx.in (e.g. `mail.graphikosx.in`), create an API key, set `EMAIL_API_KEY` and
`EMAIL_FROM="GraphikosX Leads <leads@graphikosx.in>"`.

## 3. DNS and redirects

Canonical domain: `https://graphikosx.in` (non-www). At the DNS/hosting level, configure
**permanent (301/308) redirects**:

- `http://graphikosx.in` → `https://graphikosx.in`
- `https://www.graphikosx.in` → `https://graphikosx.in`
- `http://www.graphikosx.in` → `https://graphikosx.in`

On Vercel: add both `graphikosx.in` and `www.graphikosx.in` as domains on the project, set
`graphikosx.in` as the Primary Domain — Vercel automatically 308-redirects the www host and all
HTTP traffic to it. On any other host, configure equivalent permanent redirects at the load
balancer/reverse-proxy level (not inside the Next.js app) so redirects happen before a Node
process is even invoked.

## 4. Rate limiting

The Free Audit and Contact server actions rate-limit by IP (5 submissions / 10 minutes). Without
`RATE_LIMIT_REDIS_URL`/`RATE_LIMIT_REDIS_TOKEN`, this is enforced with an in-memory counter — it
works, but each serverless instance/region has its *own* counter, so the real-world limit on a
platform like Vercel is effectively higher than 5/10min per visitor. This is not a launch
blocker (the honeypot + server-side re-validation still hold), but for meaningful abuse
protection at scale, create a free Upstash Redis database and set both Redis env vars — no code
changes needed (`src/lib/leads/rateLimit.ts` picks it up automatically).

## 5. Search Console

1. Verify domain ownership in [Google Search Console](https://search.google.com/search-console)
   (DNS TXT record recommended — covers all subdomains/protocols at once). No verification token
   is hard-coded anywhere in this codebase; get a real one from Search Console at verification
   time.
2. Submit `https://graphikosx.in/sitemap.xml` under Sitemaps.
3. Use URL Inspection on `/`, `/services`, `/industries` and a couple of service/industry pages
   post-launch to confirm Google can render and index them.
4. Monitor the Core Web Vitals report over the following weeks — lab data (this document) is not
   the same as real-user field data.

## 6. Analytics

No GA4 Measurement ID is invented anywhere in this codebase. To enable analytics: create a GA4
property, set `NEXT_PUBLIC_GA_MEASUREMENT_ID`, redeploy. `src/components/analytics/GoogleAnalytics.tsx`
loads the GA4 script only when that variable is present; every `track()` call already wired
throughout the site (`src/lib/analytics/track.ts`) starts firing immediately, no further code
changes.

## 7. Security headers

Configured centrally in `next.config.ts` (`headers()`), applied to every route: a static
Content-Security-Policy, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`,
`Permissions-Policy`. See the comment block at the top of `next.config.ts` for the reasoning
(notably: why the CSP is static rather than nonce-based, and why `style-src`/`script-src` allow
`'unsafe-inline'`). Revisit if the site starts rendering user-generated content or adding
third-party embeds.

## 8. Production build & deploy

```bash
npm install
npm run build     # must succeed with 0 TypeScript errors, 0 ESLint errors
npm run start      # smoke-test the production build locally before deploying
```

On Vercel: connect the repo, no special build settings needed (`next build` / `next start` are
the defaults). Set the environment variables from §1 in the Vercel dashboard before the first
production deploy that expects to receive real leads.

## 9. Post-deployment smoke test

After deploying, manually verify on the live domain:

- `/`, `/about`, `/services`, `/industries`, `/free-audit`, `/contact` all return 200 with no
  console errors.
- Submit a real test lead through both `/free-audit` and `/contact` and confirm it arrives via
  whichever provider(s) were configured in §2.
- `https://graphikosx.in/sitemap.xml` and `/robots.txt` are reachable and correct.
- `https://www.graphikosx.in` and `http://graphikosx.in` both redirect (301/308) to
  `https://graphikosx.in`.
