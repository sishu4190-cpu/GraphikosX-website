# GraphikosX — Meta & WhatsApp AI Compliance Review (Legal Phase 2)

**Prepared:** 17 September 2026. **Not legal advice.** This is a technical/product review of publicly
documented Meta and Indian regulatory requirements, written to help prepare the GraphikosX AI Assistant
for Meta Developer App publishing. Meta's WhatsApp AI policy changed materially as recently as October
2025 (effective 15 January 2026), and India's DPDP Act rules are still being phased in through 2027 —
both areas are actively moving. Have this reviewed by a lawyer familiar with Indian data protection law
and Meta's current platform terms before treating anything here as a compliance sign-off, especially
before the AI Assistant goes live with real customer conversations.

Every claim below is sourced from either this repository's own code (Phase 1's audit) or the public URLs
cited inline. Nothing here describes the WhatsApp AI Assistant's backend behavior first-hand — that code
has not been shared for review as of this writing (see "Open items" at the end).

---

## 1. What's already implemented (Phase 1 + Phase 2 frontend)

| Requirement | Status | Where |
|---|---|---|
| Privacy Policy at a stable, crawlable URL | ✅ Done | `/privacy-policy` |
| Terms of Service at a stable, crawlable URL | ✅ Done | `/terms-of-service` |
| A way for users to request data deletion, disclosed in the Privacy Policy | ✅ Done | `/data-deletion` |
| Privacy Policy discloses the AI Assistant, OpenAI processing, and WhatsApp's role | ✅ Done | `/privacy-policy` §6–7 |
| Terms disclose that AI responses aren't confirmed quotations/contracts | ✅ Done | `/terms-of-service` |
| On-site AI transparency note before a visitor starts a WhatsApp conversation | ✅ Done | `/contact` — WhatsApp card |
| robots.txt doesn't block Meta's (or any) crawler from these pages | ✅ Done | `src/app/robots.ts` |
| No secrets/API keys/tokens committed to the repo | ✅ Confirmed | See Legal Phase 3 (queued) for the full sweep |

These are the pieces Meta's app-review form actually asks for (see §2). Everything else below is either
a platform policy GraphikosX needs to operate within (not a URL to submit), or an Indian-law question that
sits outside what a website change can satisfy on its own.

## 2. Meta Developer App fields (for the "GraphikosX AI Bot" app)

| Field | Value |
|---|---|
| App domain | `graphikosx.in` |
| Privacy Policy URL | `https://www.graphikosx.in/privacy-policy` |
| Terms of Service URL | `https://www.graphikosx.in/terms-of-service` |
| User Data Deletion | Instructions URL: `https://www.graphikosx.in/data-deletion` |
| Category | Messaging |

On the Data Deletion field specifically: Meta's own app-dashboard documentation allows either an automated
**Data Deletion Request Callback URL** (a webhook Meta calls when a user asks Meta to delete their data via
their Facebook/Meta account settings) or a **Data Deletion Instructions URL** — a page telling users how to
request deletion directly from the business. [Meta's developer docs](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/)
confirm the instructions-URL route is an accepted alternative to building a callback endpoint, which is
what `/data-deletion` implements. A callback URL is *more* automated but requires backend work; it isn't
required to pass review.

Meta's [Privacy Policy Expectations](https://developers.facebook.com/docs/development/terms-and-policies/privacy-policy/)
page (checked directly) requires the policy to: state what information is collected, explain why it's
processed, give a clear way to request deletion, be clearly labeled as a privacy policy, be GraphikosX's
own policy (not a third party's), and be reachable by Meta's crawler without a login wall or geo-block —
`/privacy-policy` is `noindex` (kept out of *search* results, matching this site's existing practice for
legal boilerplate) but is not disallowed in `robots.txt` and returns a plain `200` with no auth required,
so Meta's reviewer/crawler can reach it.

## 3. WhatsApp's 2026 AI/chatbot policy — the one that actually matters most here

In October 2025, Meta updated the WhatsApp Business Messaging Policy to **prohibit general-purpose AI
chatbots** from the WhatsApp Business Platform, effective **15 January 2026**. This is a live, current
restriction, not a proposal. Reported consistently across multiple sources
([TechCrunch](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform/),
[respond.io](https://respond.io/blog/whatsapp-general-purpose-chatbots-ban),
[turn.io](https://learn.turn.io/l/en/article/khmn56xu3a-whats-app-s-2026-ai-policy-explained)):

- **Banned:** distributing a standalone, open-ended AI assistant (the ChatGPT/Perplexity pattern) *through*
  WhatsApp as a delivery channel — bots that will hold "open-ended or assistant-style conversations" on
  arbitrary topics, or that forward user messages to an external AI provider for purposes beyond serving
  that specific user (e.g., using conversations to train a model).
- **Allowed:** purpose-built business bots where AI is "incidental or ancillary" to a defined business
  function — customer support, FAQs, order tracking, appointment/meeting booking, lead qualification,
  notifications. TechCrunch quotes Meta's own framing: a "travel company running a bot for customer
  service" remains permitted; the API is meant for "businesses serving customers," not as an AI
  distribution channel.

**Why this matters for GraphikosX specifically:** the brief describes the AI Assistant as answering
enquiries, explaining services, collecting lead information, capturing meeting requests, and supporting
human handoff — that is squarely the *permitted* "purpose-built" category, not the banned one. The risk
isn't the concept, it's the implementation: if the assistant is built on a general-purpose model (OpenAI's
API) without topic guardrails, a visitor asking it something unrelated to GraphikosX ("write me a poem",
"what's the weather") and getting a normal, helpful answer is exactly the kind of "open-ended conversation"
behavior the new policy targets. **This is a backend/prompt-engineering decision, not something this
website repo can enforce** — recommend the system prompt explicitly scope the assistant to GraphikosX
enquiries and decline or redirect off-topic requests, and that this scoping be documented somewhere (even a
short internal note) in case Meta's app review asks about it.

## 4. Opt-in, consent, and messaging limits

Checked directly against Meta's own developer documentation for
[getting opt-in](https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in):
a business must (1) clearly state the person is opting in to receive messages from the business, (2)
clearly identify the business by name, and (3) comply with applicable law. Meta does **not** mandate
disclosing that responses may be automated as part of the opt-in itself — but this site's own AI-transparency
note (§1) and the Privacy Policy go further than the minimum for exactly that reason: it's good practice,
and likely expected under India's consent-transparency norms (§6) even where Meta doesn't require it.

**GraphikosX's current pattern is opt-in by design:** every WhatsApp entry point on this site (the floating
button, the footer link, the Contact page card) is *click-to-chat* — the visitor initiates the conversation
by clicking a `wa.me` link and sending the first message themselves. This self-initiated pattern is the
cleanest form of opt-in and needs no extra mechanism. The opt-in requirements above become relevant only if
GraphikosX (or the AI Assistant) ever starts messaging someone who *hasn't* first messaged in — for example,
a follow-up campaign to old leads. That would need its own explicit opt-in flow and is out of scope for
what exists today.

Meta also enforces standard [messaging limits](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits)
tied to phone-number quality rating, and a **24-hour customer service window**: once a user messages in,
the business (or its bot) can reply freely for 24 hours; messages outside that window generally need a
pre-approved message template. This is a backend/API integration detail for whoever builds the FastAPI
service, not something the website controls — flagging it here since the master brief didn't mention it and
it will affect how "capture meeting requests" and any proactive follow-up messages need to work.

## 5. Data privacy and security — what Meta's Cloud API does and doesn't cover

Checked directly against Meta's [Data Privacy & Security](https://developers.facebook.com/documentation/business-messaging/whatsapp/data-privacy-and-security/)
documentation: Meta acts only as a data processor for message transport, encrypts messages in transit and
at rest, and retains messages on its own infrastructure for a maximum of 30 days to support core delivery
functionality (retransmission, delivery status). **Meta's own retention limits don't cover what GraphikosX's
backend does after receiving a message** — sending message content to OpenAI's API to generate a response,
storing conversation history in SQLite, and however long that data is kept are entirely GraphikosX's own
responsibility and choice, governed by GraphikosX's own Privacy Policy (already disclosed in general terms —
see Privacy Policy §6, §8) rather than by anything Meta enforces. This is exactly the gap Legal Phase 1
flagged as pending the backend code review.

## 6. India — Digital Personal Data Protection Act, 2023 (DPDP Act)

**Status as of this writing:** the DPDP Act itself was enacted in 2023; substantive Rules were notified in
2025 with a phased rollout. Sources reviewed ([Shardul Amarchand Mangaldas](https://www.amsshardul.com/insight/enforcement-of-the-dpdp-act-and-notification-of-the-dpdp-rules/),
[TechPrescient](https://www.techprescient.com/blogs/dpdp-act-rules/)) describe a multi-year timeline —
commencement and Data Protection Board setup from November 2025, Consent Manager registration from
November 2026, and substantive obligations becoming fully mandatory by May 2027. In other words: **the Act
is live but not yet fully enforced**, and the exact compliance deadline for a business GraphikosX's size is
one of the least settled parts of this review — treat the dates above as directional, not confirmed, and
verify against the Ministry of Electronics & IT's own notifications before relying on them.

What the sources reviewed describe as applying broadly (not obviously size-exempted, though this specific
point is where professional legal advice matters most — the Act does distinguish "Significant Data
Fiduciaries" for *enhanced* obligations, but the baseline obligations below appear to apply to any entity
processing personal data of individuals in India):

- **Consent and notice:** a clear notice of what's collected and why, in plain language, before or at the
  point of collection. GraphikosX's Privacy Policy already does this for the website and, in general terms,
  for the AI Assistant.
- **Data principal rights:** a way for individuals to access, correct, or request erasure of their data.
  Implemented via `/data-deletion` and the Privacy Policy's rights section.
- **Grievance redressal:** a designated contact for data complaints, expected to respond within a
  reasonable period. `prakash@graphikosx.in` already serves this role in practice (used throughout the
  Privacy Policy and Data Deletion page) — worth formally naming a "Grievance Officer" once the business
  is ready to commit to that role in writing, but not blocking for now.
- **Breach notification:** report personal data breaches to the Data Protection Board and affected
  individuals. This is a process/operational commitment, not something a website page can implement —
  flagged for Prakash's awareness, not resolved here.
- **Retention of logs:** at least one source cited a requirement to retain personal data and associated
  logs for a minimum period (one year) after they're no longer needed, specifically to support grievance
  handling — this is a backend data-retention design question, tied to the same open item from Legal
  Phase 1 about the AI Assistant's exact retention schedule.

## 7. Consumer protection — a smaller, related flag

India's Consumer Protection Act, 2019 (and the E-Commerce Rules under it) prohibit unfair trade practices
and misleading claims, including automated ones. This is already reflected in this repo's existing Terms
of Service language ("no guarantee of results," AI responses aren't confirmed quotations) — worth keeping
in mind if the AI Assistant is ever tuned to sound more definitive about pricing, timelines, or outcomes
than the business can actually stand behind.

## 8. Summary — implemented vs. needs a decision vs. needs engineering

| Item | Status |
|---|---|
| Privacy Policy / Terms / Data Deletion pages | ✅ Implemented (Phase 1) |
| On-site AI transparency note | ✅ Implemented (Phase 2) |
| Meta Developer App field values | ✅ Ready to submit (see §2) |
| AI Assistant's opening-message disclosure (inside the actual WhatsApp chat) | ⏳ **Needs backend implementation** — copy suggested below |
| System prompt scoped to GraphikosX topics only (WhatsApp's Jan 2026 policy) | ⏳ **Needs backend implementation** — flagged in §3 |
| 24-hour messaging window / template handling | ⏳ **Needs backend implementation** — flagged in §4 |
| Exact data retention period for AI Assistant conversations | ⏳ **Needs founder/backend decision** — flagged since Phase 1 |
| DPDP grievance officer, formally named | ⏳ **Needs founder decision** (email already exists in practice) |
| DPDP breach-notification process | ⏳ **Needs founder decision/process**, not a code change |
| Governing-law venue in Terms of Service | ⏳ **Needs founder decision** — flagged since Phase 1 |
| Legal review of this whole document | ⏳ **Recommended before relying on it for Meta submission** |

### Suggested opening message for the AI Assistant (for whoever builds the backend)

For the actual in-WhatsApp disclosure — which this website cannot deliver, since the conversation is
handled by the separate FastAPI backend, not this frontend — here is suggested copy for the bot's first
automated message in a new conversation, adapted from the brief's own draft:

> Hi! You're chatting with the GraphikosX AI Assistant. I can help answer questions about our services —
> your messages may be processed using AI to generate a response. You can ask to speak with a person on
> our team at any time. Please avoid sharing sensitive personal information here. Privacy Policy:
> https://www.graphikosx.in/privacy-policy

This is a starting point, not a final/approved script — whoever implements the backend should confirm the
exact wording (and where in the conversation flow it fires) against however the bot actually behaves once
built.

## Sources

- [Meta — Data Deletion Callback](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/)
- [Meta — Privacy Policy Expectations](https://developers.facebook.com/docs/development/terms-and-policies/privacy-policy/)
- [Meta — Getting Opt-In (WhatsApp)](https://developers.facebook.com/documentation/business-messaging/whatsapp/getting-opt-in)
- [Meta — Messaging Limits (WhatsApp)](https://developers.facebook.com/documentation/business-messaging/whatsapp/messaging-limits)
- [Meta — Data Privacy & Security (WhatsApp)](https://developers.facebook.com/documentation/business-messaging/whatsapp/data-privacy-and-security/)
- [TechCrunch — WhatsApp bars general-purpose chatbots](https://techcrunch.com/2025/10/18/whatssapp-changes-its-terms-to-bar-general-purpose-chatbots-from-its-platform/)
- [respond.io — Not All Chatbots Are Banned](https://respond.io/blog/whatsapp-general-purpose-chatbots-ban)
- [turn.io — WhatsApp's 2026 AI Policy Explained](https://learn.turn.io/l/en/article/khmn56xu3a-whats-app-s-2026-ai-policy-explained)
- [Shardul Amarchand Mangaldas — DPDP Act enforcement & Rules notification](https://www.amsshardul.com/insight/enforcement-of-the-dpdp-act-and-notification-of-the-dpdp-rules/)
- [TechPrescient — DPDP Act Rules 2026 timeline](https://www.techprescient.com/blogs/dpdp-act-rules/)
