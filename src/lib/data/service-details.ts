import type { ServiceGroup } from "./services";

export type ApproachPhase = { phase: "Discover" | "Audit" | "Strategize" | "Execute" | "Optimize"; description: string };
export type FAQ = { q: string; a: string };

export type ServiceDetail = {
  slug: string;
  group: ServiceGroup;
  headline: string;
  subhead: string;
  problem: string[];
  definitionAnswer: string;
  definitionExpansion: string;
  whenYouNeedIt: string[];
  approach: ApproachPhase[];
  deliverables: string[];
  outcomeHeadline: string;
  outcomeBody: string;
  ecosystem: string[];
  industries: string[];
  faqs: FAQ[];
  ctaSupportingCopy: string;
  metaTitle: string;
  metaDescription: string;
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "brand-strategy": {
    slug: "brand-strategy",
    group: "Build",
    headline: "Give the business a reason to be chosen, not just noticed.",
    subhead: "The positioning, narrative and decision-making framework everything else gets built on.",
    problem: [
      "Most businesses can describe what they do, but not why a customer should pick them over the next option in the same category. Without that answer, every website, ad and sales conversation ends up competing on price or convenience instead of on something the business actually controls.",
      "This usually is not a creativity problem. It is a sequencing problem — visual identity, websites and content get built before anyone has agreed on what the business stands for, who it is really for, and what it deliberately will not try to be.",
    ],
    definitionAnswer:
      "Brand strategy is the set of decisions — positioning, audience, narrative, differentiation — that determine what a business communicates and why, before any design or content work begins. It is the reasoning layer underneath the visual identity, not the visual identity itself.",
    definitionExpansion:
      "In practice, it means answering a small number of hard questions clearly: who is this genuinely for, what do they actually compare this business against, and what is true about this business that a competitor cannot credibly copy. Everything downstream — the website’s headline, the tone of the content, the industries a business chooses to focus on — inherits its logic from these answers.",
    whenYouNeedIt: [
      "The business has grown past its original pitch and the current messaging no longer fits who its customers actually are.",
      "Marketing decisions get relitigated every time because there is no shared reference point for what the brand stands for.",
      "Sales conversations rely entirely on the founder or a top salesperson to explain why the business is different.",
      "A rebrand, new website or expansion into a new industry is coming up and the underlying positioning has never been written down.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the business, its customers, and how buying decisions actually get made in its category." },
      { phase: "Audit", description: "Review existing messaging, competitors, and where the current positioning is vague, borrowed, or contradicted by the business itself." },
      { phase: "Strategize", description: "Define the positioning, narrative and differentiation the rest of the brand and website will be built around." },
      { phase: "Execute", description: "Translate the strategy into messaging guidelines, tone of voice, and a brief that visual identity and website work can build from directly." },
      { phase: "Optimize", description: "Pressure-test the positioning against real sales conversations and customer feedback, and refine what does not hold up." },
    ],
    deliverables: [
      "A written positioning statement and target audience definition",
      "Category and competitor differentiation analysis",
      "Core messaging pillars and tone-of-voice guidelines",
      "A strategic brief for visual identity, website and content work",
    ],
    outcomeHeadline: "Perception",
    outcomeBody:
      "A clear brand strategy changes what a prospect believes about the business in the first few seconds of contact — before a single feature has been explained. That shift in perception is what makes every later marketing pound work harder, because the website, ads and content are all reinforcing the same reason to believe, instead of each channel making its own case from scratch.",
    ecosystem: ["visual-identity", "business-websites", "content-production"],
    industries: ["real-estate", "healthcare", "jewellery-wedding"],
    faqs: [
      { q: "Do we need brand strategy before a new website?", a: "Generally yes. A website built without an agreed positioning tends to default to generic language, because there is no shared answer to what makes the business different." },
      { q: "How is this different from a logo or visual identity project?", a: "Visual identity is how the brand looks. Brand strategy is what the brand says and why — the reasoning that a logo, color palette or website design should be expressing, not replacing." },
      { q: "Can an existing brand be repositioned without a full rebrand?", a: "Often, yes. Positioning and messaging can shift meaningfully while keeping the existing visual identity, name and equity intact." },
      { q: "What if the business already has a mission statement?", a: "A mission statement and a market-facing positioning strategy usually answer different questions — internal purpose versus why a customer should choose this business over an alternative." },
      { q: "How long does a brand strategy engagement take?", a: "It depends on how much research and internal alignment is needed, but the output is a written strategy and brief, not an open-ended process." },
    ],
    ctaSupportingCopy: "Start with a free audit of how the business currently positions itself, and where that story breaks down.",
    metaTitle: "Brand Strategy — Positioning & Messaging | GraphikosX",
    metaDescription: "Brand strategy defining what a business stands for and why customers choose it — the positioning foundation every website and campaign is built around.",
  },
  "visual-identity": {
    slug: "visual-identity",
    group: "Build",
    headline: "Look as considered as the work actually is.",
    subhead: "A visual system that stays consistent from the website to a WhatsApp profile picture.",
    problem: [
      "Many businesses accumulate their visual identity by accident — a logo from one designer, a color scheme decided in a font-picker, templates from whichever tool was open that week. Individually each piece looks fine. Together, they read as inconsistent, which quietly undercuts credibility even when the underlying business is strong.",
      "The cost is not aesthetic embarrassment. It is that inconsistency forces a prospect to re-establish trust every time they encounter the brand somewhere new, instead of that trust compounding across touchpoints.",
    ],
    definitionAnswer:
      "Visual identity is the coordinated system of logo usage, color, typography and imagery that makes a brand recognizable and consistent everywhere it appears. It is built to be applied by more than one person, on more than one channel, without drifting.",
    definitionExpansion:
      "Done properly, it is not just a style guide — it is a decision-making tool. It tells whoever is building the next landing page, social post or presentation exactly which choices are on-brand and which are not, so consistency does not depend on one designer’s memory.",
    whenYouNeedIt: [
      "The logo, website and social presence look like they belong to three different companies.",
      "There is no reference document, so every new hire or freelancer makes their own visual decisions.",
      "The current identity was built quickly at launch and has not been revisited as the business matured.",
      "A brand strategy project has just defined a new positioning that the current visuals do not reflect.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the brand strategy and positioning the visual system needs to express." },
      { phase: "Audit", description: "Catalogue every current visual touchpoint and identify where consistency is breaking down." },
      { phase: "Strategize", description: "Define the visual direction — color, typography, imagery style — before producing final assets." },
      { phase: "Execute", description: "Build the logo system, color and type specifications, and templates for the highest-use touchpoints." },
      { phase: "Optimize", description: "Extend the system to new formats as they come up, without letting each one improvise." },
    ],
    deliverables: [
      "Logo usage guidelines and approved variations",
      "Color palette and typography specifications",
      "Imagery and iconography direction",
      "Templates for the highest-frequency touchpoints (social, presentations, documents)",
    ],
    outcomeHeadline: "Perception",
    outcomeBody:
      "Consistency is what makes a brand feel established rather than improvised. A visual identity system does not just make individual assets look better — it means every new thing the business publishes adds to the same recognizable presence instead of resetting it.",
    ecosystem: ["brand-strategy", "business-websites"],
    industries: ["architecture-interior", "hospitality", "jewellery-wedding"],
    faqs: [
      { q: "Do we need a brand strategy project first?", a: "It helps considerably — visual identity expresses positioning, so having that positioning defined first prevents the design from being guesswork." },
      { q: "Does this include a full rebrand or logo redesign?", a: "It can, but not every project requires a new logo. Sometimes the existing mark is sound and the gap is in how inconsistently it is applied." },
      { q: "Who uses the guidelines day to day?", a: "Anyone producing brand-facing material — internal team members, freelancers, or future agencies — so the brand stays consistent regardless of who is executing." },
      { q: "How often should a visual identity be revisited?", a: "There is no fixed schedule, but a meaningful shift in positioning, industry focus or business maturity is usually the right trigger." },
    ],
    ctaSupportingCopy: "Get a free audit of how consistent the current visual identity actually is across every touchpoint.",
    metaTitle: "Visual Identity Design Services | GraphikosX",
    metaDescription: "A consistent visual identity system — logo usage, color, typography and imagery — built to stay coherent across the website, social and every future touchpoint.",
  },
  "business-websites": {
    slug: "business-websites",
    group: "Build",
    headline: "Make the website do the work a salesperson would.",
    subhead: "Fast, crawlable, conversion-focused websites built as real digital infrastructure.",
    problem: [
      "A business website is often the only touchpoint a prospect encounters before deciding whether to make contact at all. When it is slow, dated, or unclear about what to do next, that decision gets made before a conversation ever starts — regardless of how good the underlying business is.",
      "Many websites were built once, for a smaller version of the business, and have not been revisited since. They accumulate pages nobody updates, forms nobody checks, and a design that no longer matches how the business actually presents itself elsewhere.",
    ],
    definitionAnswer:
      "A business website, in this context, is not a brochure — it is infrastructure: fast, crawlable by search engines, clear about what the business does, and built with a specific next step for the visitor in mind, whether that is a call, a form, or a WhatsApp message.",
    definitionExpansion:
      "That means treating performance, structure and calls-to-action as seriously as the design. A beautiful site that loads slowly or buries its contact information is not doing its job — the two have to be built together, not traded off against each other.",
    whenYouNeedIt: [
      "The current site was built years ago and does not reflect what the business does today.",
      "Visitors regularly ask questions the website should already answer.",
      "The site is slow, does not work well on mobile, or is difficult to update.",
      "There is no clear path from landing on the homepage to actually making contact.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the business, its offer, and what a visitor needs to know to take the next step." },
      { phase: "Audit", description: "Review the current site (if one exists) for performance, structure, content and conversion gaps." },
      { phase: "Strategize", description: "Define the site map, page priorities, and the specific action each page should drive." },
      { phase: "Execute", description: "Build the site with performance, accessibility and search visibility treated as requirements, not afterthoughts." },
      { phase: "Optimize", description: "Monitor real visitor behavior after launch and refine pages that are not converting as expected." },
    ],
    deliverables: [
      "A structured, fast-loading, mobile-responsive website",
      "Clear information architecture and calls-to-action on every page",
      "Technical SEO foundations (semantic HTML, sitemap, metadata)",
      "A content structure that is straightforward to update going forward",
    ],
    outcomeHeadline: "Credibility",
    outcomeBody:
      "A well-built website does two things at once: it makes the business look as credible as it actually is, and it removes friction between a visitor’s interest and their next action. Those two things compound — a credible site earns more visitors through search and referral, and a clear one converts more of the visitors it already gets.",
    ecosystem: ["seo", "landing-pages", "digital-infrastructure", "brand-strategy"],
    industries: ["healthcare", "legal-professional-services", "real-estate", "architecture-interior"],
    faqs: [
      { q: "How long does a business website project take?", a: "It depends on the number of pages and how much content needs to be developed, but it is scoped and timelined during the strategize phase, not left open-ended." },
      { q: "Will the new site be easy to update ourselves?", a: "Yes — the site is structured so routine content updates do not require ongoing developer involvement." },
      { q: "Does this include SEO?", a: "Technical SEO foundations are built in from the start. Ongoing search strategy and content are handled under the dedicated SEO service." },
      { q: "What if we already have a website that mostly works?", a: "Not every business needs a full rebuild — sometimes targeted fixes to performance, structure or conversion paths are the right scope, which the audit will clarify." },
      { q: "Is the website mobile-friendly?", a: "Yes, every site is built responsively and tested across device sizes as a baseline requirement, not an add-on." },
    ],
    ctaSupportingCopy: "Get a free audit of how your current website performs, loads and converts.",
    metaTitle: "Business Website Design & Development | GraphikosX",
    metaDescription: "Fast, crawlable, conversion-focused business websites built as real digital infrastructure — not a template brochure that stops working as the business grows.",
  },
  "landing-pages": {
    slug: "landing-pages",
    group: "Build",
    headline: "Send campaign traffic somewhere built to convert it.",
    subhead: "Campaign-specific pages built to convert a single, clear intent.",
    problem: [
      "Running ads or campaigns and sending that traffic to a general homepage is one of the most common ways marketing budget gets wasted. A homepage has to serve many different visitors with many different intents — a landing page only has to convert the one intent that brought someone there.",
      "Without a dedicated page, every campaign inherits the homepage’s compromises: too many competing messages, no single call to action, and no way to measure what specifically is or is not working.",
    ],
    definitionAnswer:
      "A landing page is a standalone page built around a single offer, audience or campaign, with one clear action for the visitor to take. It exists to convert a specific kind of intent, not to represent the entire business.",
    definitionExpansion:
      "That focus is what makes it effective — no navigation distractions, no competing messages, and content written specifically for the mindset of someone who clicked that particular ad or link, rather than a generic visitor.",
    whenYouNeedIt: [
      "Running paid ads or campaigns that currently point to the homepage.",
      "Launching a specific offer, service or event that needs its own conversion path.",
      "Wanting to measure how a specific campaign performs, separate from general site traffic.",
      "Testing a new market or industry positioning before committing it to the main site.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the specific offer, audience and campaign the page needs to support." },
      { phase: "Audit", description: "Review where current campaign traffic is being sent and where it is likely losing people." },
      { phase: "Strategize", description: "Define the single message and call to action the page will be built around." },
      { phase: "Execute", description: "Build a fast, focused page with no distractions from the one action it needs to drive." },
      { phase: "Optimize", description: "Test messaging and layout against real campaign performance data." },
    ],
    deliverables: [
      "A dedicated, fast-loading landing page per campaign or offer",
      "Copy and layout focused on a single conversion action",
      "Tracking set up to measure that specific page’s performance",
      "A structure that supports future A/B testing",
    ],
    outcomeHeadline: "Credibility",
    outcomeBody:
      "A landing page built for one intent converts more of the traffic that was already paid for, and makes it possible to see clearly which campaigns and messages are actually working — something a shared homepage can never isolate cleanly.",
    ecosystem: ["business-websites", "seo", "lead-generation-systems"],
    industries: ["real-estate", "education-coaching", "automotive-ev"],
    faqs: [
      { q: "How is this different from just adding a page to the main website?", a: "A landing page is deliberately narrower — no site navigation, no competing links, built to hold attention until the visitor takes one specific action." },
      { q: "Do we need one landing page per campaign?", a: "Generally yes, if the campaigns target different audiences or offers — a shared page dilutes the message for all of them." },
      { q: "Can landing pages be built to match our existing site design?", a: "Yes, they are built within the same visual identity, just with a different structural purpose." },
      { q: "Does this work for both paid ads and organic campaigns (email, social)?", a: "Yes, landing pages are useful anywhere traffic arrives with a specific, known intent, not only paid channels." },
    ],
    ctaSupportingCopy: "Get a free audit of where your current campaign traffic is landing, and where it is likely dropping off.",
    metaTitle: "Landing Page Design for Campaigns | GraphikosX",
    metaDescription: "Campaign-specific landing pages built to convert a single, clear intent — instead of sending paid traffic to a general homepage that was not built for it.",
  },
  "digital-infrastructure": {
    slug: "digital-infrastructure",
    group: "Build",
    headline: "Build the technical foundation once, correctly.",
    subhead: "Hosting, analytics, tracking and systems — done right from day one.",
    problem: [
      "Most businesses do not think about their technical foundation until something breaks — a domain that is about to expire, analytics that were never set up, a website that goes down with no one able to explain why. By then, the cost of not having it is already being paid in lost data, downtime or a scramble to fix things under pressure.",
      "This is rarely a visible problem, which is exactly why it tends to get skipped. But every other digital effort — the website, SEO, ad campaigns — sits on top of this foundation, and inherits its weaknesses.",
    ],
    definitionAnswer:
      "Digital infrastructure is the technical layer underneath a business’s online presence — hosting, domains, analytics, tracking and the systems that keep a website reliable and measurable. It is invisible when it works and expensive when it does not.",
    definitionExpansion:
      "In practice, this means reliable hosting, correctly configured analytics and tracking from day one, clear ownership of domains and accounts, and enough technical documentation that the business is not dependent on one person’s memory to keep things running.",
    whenYouNeedIt: [
      "No one on the team can clearly explain where the website is hosted or who owns the analytics accounts.",
      "There is no reliable data on website traffic, conversions, or campaign performance.",
      "The business has had unexplained downtime or lost access to a domain or account.",
      "Multiple freelancers or vendors have touched the technical setup with no consolidated documentation.",
    ],
    approach: [
      { phase: "Discover", description: "Map the current technical setup — hosting, domains, analytics, tracking — and who has access to what." },
      { phase: "Audit", description: "Identify gaps, risks and single points of failure in the existing setup." },
      { phase: "Strategize", description: "Define the infrastructure a business of this size and ambition actually needs, without over-engineering it." },
      { phase: "Execute", description: "Set up or consolidate hosting, analytics and tracking correctly, with clear ownership documented." },
      { phase: "Optimize", description: "Monitor reliability and data quality, and adjust as the business's technical needs grow." },
    ],
    deliverables: [
      "Reliable hosting and domain configuration with clear ownership",
      "Analytics and conversion tracking set up correctly from the start",
      "Documentation of the technical setup so it is not dependent on one person",
      "A foundation that other digital work (website, campaigns) can be built on reliably",
    ],
    outcomeHeadline: "Credibility",
    outcomeBody:
      "Solid infrastructure does not generate leads on its own, but it is what makes every number reported elsewhere trustworthy. Without reliable tracking, a business cannot actually know whether its website, SEO or campaigns are working — every other outcome depends on this being right first.",
    ecosystem: ["business-websites", "crm-integration"],
    industries: ["industrial-manufacturing-chemicals", "healthcare", "legal-professional-services"],
    faqs: [
      { q: "Is this only relevant for larger businesses?", a: "No — even a small business benefits from reliable hosting and correct analytics, since the risk of downtime or lost data does not scale with size." },
      { q: "Do we need this if our website already works fine?", a: "A working website can still sit on fragile infrastructure — this is about what happens when something changes or goes wrong, not just current appearances." },
      { q: "Will this slow down other projects like the website or SEO?", a: "No — it is typically set up alongside or ahead of a website project, since those efforts depend on this foundation being correct." },
      { q: "What does documentation actually mean here?", a: "A clear, accessible record of what accounts exist, who owns them, and how the technical setup works — so it does not live only in one person's head." },
    ],
    ctaSupportingCopy: "Get a free audit of your current hosting, analytics and tracking setup.",
    metaTitle: "Digital Infrastructure & Technical Setup | GraphikosX",
    metaDescription: "Reliable hosting, analytics and tracking set up correctly from day one — the technical foundation every other digital effort depends on.",
  },
  "social-media-management": {
    slug: "social-media-management",
    group: "Grow",
    headline: "Turn posting into a system, not a scramble.",
    subhead: "Consistent, on-strategy content and presence across the platforms your customers use.",
    problem: [
      "Social media is often the first thing that gets deprioritized when a business gets busy, which means the accounts that potential customers actually check go quiet at exactly the moments the business is doing well. Inconsistency reads as instability, even when the business itself is stable.",
      "The alternative failure mode is posting constantly without a strategy — content that doesn't build toward anything, chosen day-to-day based on what feels easy rather than what the audience actually needs to see.",
    ],
    definitionAnswer:
      "Social media management is the ongoing planning, creation and posting of content across the platforms a business's customers actually use, built around a consistent strategy rather than ad hoc daily decisions.",
    definitionExpansion:
      "That means choosing platforms deliberately rather than being present everywhere thinly, planning content in a way that reflects the brand's positioning, and maintaining a cadence that does not depend on someone remembering to post that day.",
    whenYouNeedIt: [
      "Posting happens in bursts — active for a few weeks, then silent for months.",
      "There is no clear reason behind what gets posted, beyond \"we should post something.\"",
      "Competitors have a stronger, more consistent presence on the platforms that matter for the industry.",
      "The business wants social proof and visibility to support other efforts like ads, SEO or a launch.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the audience, the platforms they actually use, and the brand's existing content, if any." },
      { phase: "Audit", description: "Review current social presence, performance and where consistency is breaking down." },
      { phase: "Strategize", description: "Define the content pillars, platform priorities and posting cadence for the brand." },
      { phase: "Execute", description: "Produce and publish content consistently, aligned with brand strategy and voice." },
      { phase: "Optimize", description: "Review what is resonating and adjust content direction based on actual engagement, not assumptions." },
    ],
    deliverables: [
      "A content strategy with defined pillars and platform priorities",
      "A consistent publishing calendar and cadence",
      "Content produced and published on-brand across chosen platforms",
      "Performance review to inform ongoing direction",
    ],
    outcomeHeadline: "Trust",
    outcomeBody:
      "Consistent social presence is one of the easiest things for a prospect to check before making contact, and one of the easiest things to get wrong by accident. A steady, on-strategy presence signals a business that is active and stable — the same signal an empty or erratic feed sends in reverse.",
    ecosystem: ["content-production", "linkedin-personal-branding"],
    industries: ["fitness-wellness", "hospitality", "automotive-ev", "jewellery-wedding"],
    faqs: [
      { q: "Which platforms should the business actually be on?", a: "Whichever platforms its actual customers use for research or discovery — this is decided during the strategy phase, not assumed by default." },
      { q: "Does this include content creation, or just posting?", a: "Both — strategy and posting without content behind it is not effective, so content production is part of the service." },
      { q: "How is success measured here?", a: "Against the goals defined in strategy — visibility, engagement, or supporting another channel like lead generation — not vanity metrics alone." },
      { q: "Can this work alongside an existing in-house social presence?", a: "Yes, this can supplement an internal team's efforts or run as the primary function, depending on what the business needs." },
    ],
    ctaSupportingCopy: "Get a free audit of your current social presence and where consistency is falling off.",
    metaTitle: "Social Media Management Services | GraphikosX",
    metaDescription: "Consistent, on-strategy social media management across the platforms your customers actually use — planned content, not sporadic posting.",
  },
  "seo": {
    slug: "seo",
    group: "Grow",
    headline: "Be findable for the searches that actually lead to business.",
    subhead: "Technical, content and authority SEO built for how search actually works today.",
    problem: [
      "SEO is not simply \"ranking on Google.\" The underlying problem it solves is that customers are actively searching for the exact thing a business offers, and the business is absent from the results they see — meaning the demand exists, but it is going to a competitor by default.",
      "This is compounding in the wrong direction the longer it goes unaddressed: competitors who already rank keep accumulating authority and traffic, making the gap harder to close the later a business starts.",
    ],
    definitionAnswer:
      "SEO (search engine optimization) is the practice of making a website easy for search engines to understand and rank well for the searches its customers actually perform, through technical structure, content and topical authority.",
    definitionExpansion:
      "It works on three levels at once: technical (can search engines crawl and understand the site), content (does the site actually answer what people are searching for), and authority (does the site have enough credible signals to be trusted for that topic). Weakness in any one limits what the others can achieve.",
    whenYouNeedIt: [
      "The business does not show up on the first page for searches its own customers would use to find it.",
      "Most new business currently comes from referrals or paid ads, with organic search contributing very little.",
      "Competitors consistently outrank the business for the same core searches.",
      "The website has grown but was never structured with search visibility in mind.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the business, its services, and the actual language customers use to search for them." },
      { phase: "Audit", description: "Assess technical SEO health, current rankings, content gaps and competitor positioning." },
      { phase: "Strategize", description: "Prioritize the technical fixes, content and authority-building work with the highest realistic impact." },
      { phase: "Execute", description: "Implement technical improvements and produce content built around real search intent." },
      { phase: "Optimize", description: "Track rankings and traffic, and refine the strategy based on what search engines are actually rewarding." },
    ],
    deliverables: [
      "Technical SEO audit and implementation (site structure, speed, crawlability)",
      "Keyword and search-intent research specific to the business",
      "SEO-structured content aligned with that research",
      "Ongoing tracking of rankings, traffic and search visibility",
    ],
    outcomeHeadline: "Discoverability",
    outcomeBody:
      "SEO is one of the few channels where the traffic keeps arriving without paying for each visit individually — the investment compounds instead of resetting every month. The realistic outcome is not an overnight jump to page one, but a steady increase in how often the business is the thing a searching customer actually finds.",
    ecosystem: ["business-websites", "content-production", "google-business-profile"],
    industries: ["healthcare", "legal-professional-services", "real-estate", "industrial-manufacturing-chemicals"],
    faqs: [
      { q: "How long does SEO take to show results?", a: "It varies by competitiveness and starting point, but SEO is a compounding channel, not an instant one — meaningful movement is typically measured in months, not weeks." },
      { q: "Does SEO include the Google Business Profile?", a: "Local visibility through Google Business Profile is closely related but handled as its own service, since it has a different mechanism from organic website SEO." },
      { q: "Do we need new content, or can existing pages be optimized?", a: "Usually both — existing pages are optimized where they already target relevant searches, and new content fills the gaps where nothing currently exists." },
      { q: "Is SEO a one-time project or ongoing work?", a: "Search rankings are not static — competitors keep publishing and algorithms keep changing, so SEO is generally ongoing rather than a single fix." },
      { q: "How do you decide which keywords to target?", a: "Based on actual search intent and realistic competitiveness for the business's specific offerings, not generic high-volume terms that do not convert." },
    ],
    ctaSupportingCopy: "Get a free audit of where the business currently stands in search, and what is realistically achievable.",
    metaTitle: "SEO Services — Search Engine Optimization | GraphikosX",
    metaDescription: "Technical, content and authority SEO built around how search actually works — findable for the searches that lead to real customers, not just traffic.",
  },
  "google-business-profile": {
    slug: "google-business-profile",
    group: "Grow",
    headline: "Win the moment a customer searches nearby.",
    subhead: "Local visibility and trust signals where most first impressions now happen.",
    problem: [
      "For any business that serves customers locally, the Google Business Profile is often the very first — and sometimes only — impression a prospect forms before deciding to visit, call, or keep scrolling. An unclaimed, outdated or sparse profile loses that decision before the website is ever opened.",
      "Many businesses either never claim their profile, let it go stale, or do not realize how much weight photos, categories, hours and reviews carry in a local search decision.",
    ],
    definitionAnswer:
      "Google Business Profile optimization is the process of claiming, completing and actively maintaining a business's Google listing — categories, photos, hours, posts and review management — so it performs as strongly as possible in local search and maps results.",
    definitionExpansion:
      "This is a distinct discipline from website SEO, because Google Maps and the local search results run on different signals — proximity, categories, completeness, and review activity matter more here than backlinks or page content.",
    whenYouNeedIt: [
      "The business serves customers in a specific location or service area.",
      "The Google listing is unclaimed, incomplete, or has not been updated in a long time.",
      "Competitors consistently appear above the business in local map results.",
      "Reviews exist but are not being responded to or actively encouraged.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the service area, categories and how customers currently search locally." },
      { phase: "Audit", description: "Review the current profile's completeness, accuracy and standing against local competitors." },
      { phase: "Strategize", description: "Define the profile categories, content and review approach that will move the needle locally." },
      { phase: "Execute", description: "Claim, complete and actively maintain the profile with photos, posts and accurate information." },
      { phase: "Optimize", description: "Monitor local ranking and review activity, adjusting categories and content as needed." },
    ],
    deliverables: [
      "A fully claimed, verified and completed Google Business Profile",
      "Accurate categories, service areas, hours and business information",
      "Regular photo and post updates to keep the profile active",
      "A structured approach to encouraging and responding to reviews",
    ],
    outcomeHeadline: "Discoverability",
    outcomeBody:
      "Local search is often high-intent — someone searching \"near me\" is frequently ready to act quickly. A well-maintained profile captures that intent at the exact moment it exists, which website SEO alone, with its longer consideration cycle, cannot reliably do.",
    ecosystem: ["seo", "content-production"],
    industries: ["fitness-wellness", "hospitality", "healthcare", "jewellery-wedding"],
    faqs: [
      { q: "Is this the same as SEO?", a: "It is related but distinct — Google Business Profile optimization governs local map results specifically, while SEO governs broader organic search rankings." },
      { q: "Do reviews actually affect ranking?", a: "Review quantity, recency and response activity are meaningful local ranking factors, not just a trust signal for customers." },
      { q: "What if the business does not have a physical storefront?", a: "Service-area businesses can still maintain a Google Business Profile without a public address, using defined service areas instead." },
      { q: "How often does the profile need to be updated?", a: "Regularly — inactive profiles with stale photos and no recent posts tend to underperform actively maintained ones." },
    ],
    ctaSupportingCopy: "Get a free audit of how your Google Business Profile currently looks to a nearby searching customer.",
    metaTitle: "Google Business Profile Optimization | GraphikosX",
    metaDescription: "Google Business Profile optimization — categories, photos, posts and reviews managed to win local search visibility right when a customer is searching nearby.",
  },
  "content-production": {
    slug: "content-production",
    group: "Grow",
    headline: "Make the expertise that already exists visible.",
    subhead: "Content built to demonstrate expertise, not just fill a calendar.",
    problem: [
      "Most businesses have real expertise that never becomes visible anywhere a prospect can find it before making contact. That expertise sits in the founder's head, in past client conversations, in institutional knowledge — but not in a form Google, AI search tools, or a skeptical prospect can encounter independently.",
      "The common failure mode is content produced to fill a calendar rather than to demonstrate anything specific — generic tips that could belong to any business in the category, which do little to build authority for this one.",
    ],
    definitionAnswer:
      "Content production, in this context, is creating articles, guides, videos or other material that demonstrates a business's actual expertise and answers the real questions its prospects are asking — built to establish authority, not just occupy a publishing schedule.",
    definitionExpansion:
      "That distinction matters: content built around real questions and real expertise supports SEO, social proof and even how AI search tools describe the business, because it is specific enough to be worth citing. Generic content rarely earns any of those outcomes.",
    whenYouNeedIt: [
      "The business has genuine expertise that is not visible anywhere online.",
      "Content is being published inconsistently or without a clear point of view.",
      "Prospects ask questions in sales conversations that should already be answered publicly.",
      "SEO or social media efforts are underperforming because there is no substantive content behind them.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the business's real expertise and the questions its prospects are actually asking." },
      { phase: "Audit", description: "Review existing content, if any, for gaps, inconsistency or generic messaging." },
      { phase: "Strategize", description: "Define content pillars and formats aligned with both expertise and search/social intent." },
      { phase: "Execute", description: "Produce content that demonstrates specific expertise, not generic category advice." },
      { phase: "Optimize", description: "Track which content actually builds authority and engagement, and produce more of what works." },
    ],
    deliverables: [
      "A content strategy built around genuine expertise and real prospect questions",
      "Articles, guides or video content produced on a consistent basis",
      "Content structured to support SEO and social distribution",
      "A content library that compounds in value over time",
    ],
    outcomeHeadline: "Authority",
    outcomeBody:
      "Content that demonstrates real expertise does two things generic content cannot: it gives search engines and AI tools something specific and citable to reference, and it gives a skeptical prospect a reason to trust the business before ever speaking to someone from it.",
    ecosystem: ["seo", "social-media-management", "linkedin-personal-branding", "brand-strategy"],
    industries: ["legal-professional-services", "industrial-manufacturing-chemicals", "jewellery-wedding"],
    faqs: [
      { q: "What formats does content production cover?", a: "Written articles and guides are the most common starting point, extending to video or other formats depending on where the audience actually spends attention." },
      { q: "How is this different from social media management?", a: "Content production creates the underlying material; social media management is one of the channels that material gets distributed through." },
      { q: "Does the business need to be the one writing this?", a: "No — the expertise comes from the business, but the research, writing and structuring is handled as part of the service." },
      { q: "How does this support SEO?", a: "Search engines reward content that genuinely answers what people are searching for — well-produced content is one of the main inputs SEO strategy depends on." },
    ],
    ctaSupportingCopy: "Get a free audit of how visible your business's actual expertise currently is online.",
    metaTitle: "Content Production & Strategy Services | GraphikosX",
    metaDescription: "Content built to demonstrate genuine expertise and answer real prospect questions — not generic material published to fill a calendar.",
  },
  "linkedin-personal-branding": {
    slug: "linkedin-personal-branding",
    group: "Grow",
    headline: "Put the founder's expertise where buyers are already looking.",
    subhead: "Founder and leadership visibility that compounds into business credibility.",
    problem: [
      "In many B2B and expertise-driven categories, buyers research the founder or leadership team as closely as they research the company — and often on LinkedIn specifically. A founder who is absent from that platform is invisible at exactly the moment a serious prospect is doing due diligence.",
      "The usual reason this gets skipped is not lack of expertise, it is lack of a system — no consistent posting habit, no content plan, and no time carved out to turn what the founder already knows into visible content.",
    ],
    definitionAnswer:
      "LinkedIn and personal branding is the practice of building a founder's or leader's professional visibility and credibility on the platforms their buyers actually use for research, primarily LinkedIn, through consistent, substantive content.",
    definitionExpansion:
      "This is not about becoming an influencer — it is about making sure that when a prospect looks up the person they are considering doing business with, they find someone credible, active and clearly knowledgeable in the relevant field.",
    whenYouNeedIt: [
      "The founder or leadership team has real expertise but little to no presence on LinkedIn.",
      "Prospects mention checking the founder's profile before a sales conversation.",
      "The business operates in a category where personal credibility strongly influences buying decisions.",
      "Competitors' founders have a stronger, more visible professional presence.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the founder's actual expertise, voice and what their buyers are researching them for." },
      { phase: "Audit", description: "Review the current profile and posting history, if any, for gaps and missed positioning." },
      { phase: "Strategize", description: "Define content themes and a realistic posting cadence built around the founder's actual availability." },
      { phase: "Execute", description: "Produce and publish content consistently under the founder's voice, not a generic corporate tone." },
      { phase: "Optimize", description: "Track engagement and refine which themes are actually building credibility with the right audience." },
    ],
    deliverables: [
      "An optimized, complete LinkedIn profile reflecting real positioning",
      "A content plan built around the founder's genuine expertise",
      "Consistent content production and publishing under the founder's voice",
      "Engagement tracking to refine what is resonating",
    ],
    outcomeHeadline: "Authority",
    outcomeBody:
      "Personal credibility compounds differently from company brand awareness — people trust people before they trust logos. A consistently visible, credible founder makes every other piece of company marketing land with more weight, because the person behind it has already established trust.",
    ecosystem: ["content-production", "social-media-management"],
    industries: ["architecture-interior", "legal-professional-services", "industrial-manufacturing-chemicals"],
    faqs: [
      { q: "Does the founder need to write the content themselves?", a: "No — the founder's expertise and voice drive the content, but the research, writing and posting logistics are handled as part of the service." },
      { q: "How much time does this require from the founder?", a: "Realistically some input is needed for authenticity, but the goal is a sustainable cadence, not a heavy ongoing time commitment." },
      { q: "Is this only relevant for solo founders?", a: "It applies to any leader whose credibility materially affects buying decisions, which includes founders, senior partners, and category specialists." },
      { q: "How is success measured?", a: "Against relevant engagement and reach among the right audience — connections and comments from people who could plausibly become customers or referrers, not vanity follower counts." },
    ],
    ctaSupportingCopy: "Get a free audit of how visible your leadership currently is where your buyers are researching.",
    metaTitle: "LinkedIn & Personal Branding Services | GraphikosX",
    metaDescription: "Founder and leadership visibility built on LinkedIn through consistent, substantive content — because buyers research the person before they trust the company.",
  },
  "ai-automation": {
    slug: "ai-automation",
    group: "Scale",
    headline: "Remove the repetitive work without removing the judgment.",
    subhead: "AI-accelerated workflows that remove repetitive work without removing judgment.",
    problem: [
      "As a business grows, the number of repetitive, low-judgment tasks grows with it — responding to routine inquiries, updating records, following up on the same kind of lead in the same way. Handling all of it manually does not scale, but it is also work that does not need a human doing it the same way every time.",
      "The risk on the other side is automating things that genuinely need judgment, which produces the generic, robotic experience that makes customers trust a business less, not more. The right scope for automation is specific, not total.",
    ],
    definitionAnswer:
      "AI automation is the use of AI-driven tools to handle repetitive, well-defined tasks — research, data entry, routine follow-ups, scheduling — so that human time is spent on the decisions and relationships that actually require it.",
    definitionExpansion:
      "The goal is acceleration, not replacement of judgment. AI handles the volume and repetition; a person still decides strategy, handles exceptions, and makes the calls that matter. Done well, this shows up as things simply happening faster and more reliably, not as a customer-facing experience that feels automated.",
    whenYouNeedIt: [
      "The team spends significant time on tasks that are repetitive and rule-based, not judgment-heavy.",
      "Response times to leads or customers are slow because someone has to manually handle each one.",
      "Growth is being limited by administrative capacity rather than demand.",
      "Data entry or research tasks are eating time that could go toward higher-value work.",
    ],
    approach: [
      { phase: "Discover", description: "Identify which tasks in the business are genuinely repetitive and rule-based versus which require human judgment." },
      { phase: "Audit", description: "Map current workflows to find where time is being spent inefficiently." },
      { phase: "Strategize", description: "Prioritize which processes to automate first, based on time saved versus complexity." },
      { phase: "Execute", description: "Implement the automation, integrated with existing tools rather than replacing them wholesale." },
      { phase: "Optimize", description: "Monitor for accuracy and refine the automation as the business's processes evolve." },
    ],
    deliverables: [
      "Automated workflows for well-defined, repetitive tasks",
      "Integration with existing tools and systems the business already uses",
      "Clear documentation of what is automated and how it works",
      "A framework for identifying future automation opportunities",
    ],
    outcomeHeadline: "Scalability",
    outcomeBody:
      "The realistic outcome of AI automation is not fewer people, it is more capacity from the same team — routine work stops competing for time with the judgment-heavy work that actually grows the business. That difference is what lets a business take on more without every extra unit of growth requiring proportionally more headcount.",
    ecosystem: ["crm-integration", "workflow-automation"],
    industries: ["industrial-manufacturing-chemicals", "real-estate", "education-coaching"],
    faqs: [
      { q: "Will this replace staff?", a: "The intent is to remove repetitive work from people's plates, not replace judgment-based roles — most engagements free up existing staff for higher-value work rather than reducing headcount." },
      { q: "What kinds of tasks are realistic to automate?", a: "Well-defined, repetitive processes — routine follow-ups, data entry, scheduling, initial inquiry responses — rather than anything requiring nuanced judgment or relationship handling." },
      { q: "Does this require replacing our existing software?", a: "Usually not — automation is typically built to integrate with tools the business already uses rather than requiring a full system replacement." },
      { q: "How do we know what to automate first?", a: "That is determined during the discover and audit phases, based on where time is actually being lost, not a generic checklist." },
    ],
    ctaSupportingCopy: "Get a free audit of where repetitive work is currently consuming time that could go elsewhere.",
    metaTitle: "AI Automation Services for Business Workflows | GraphikosX",
    metaDescription: "AI-accelerated automation for repetitive, well-defined business tasks — freeing up time for the judgment and relationships that actually grow the business.",
  },
  "crm-integration": {
    slug: "crm-integration",
    group: "Scale",
    headline: "Stop losing leads to a system that does not exist.",
    subhead: "Lead and customer systems connected so nothing falls through the cracks.",
    problem: [
      "CRM is not simply \"customer management software.\" The underlying problem it solves is that leads, follow-ups and customer information end up fragmented — some in a spreadsheet, some in someone's inbox, some only in a salesperson's memory — which means opportunities get missed not from lack of demand, but from lack of a system to track it.",
      "This tends to get worse with growth, not better: more leads flowing through an informal system means more of them slipping through, right at the moment the business can least afford to lose them.",
    ],
    definitionAnswer:
      "CRM integration is the process of setting up and connecting a customer relationship management system so that every lead, contact and follow-up lives in one place, visible to the team, instead of scattered across inboxes, spreadsheets and memory.",
    definitionExpansion:
      "The value is not the software itself — it is what having a single source of truth makes possible: knowing exactly where every lead stands, who owns the next action, and what has already been said to a given customer, without relying on any one person to remember it.",
    whenYouNeedIt: [
      "Leads currently live across spreadsheets, inboxes, and someone's personal notes.",
      "Follow-ups get missed because there is no system tracking whose turn it is to act.",
      "It is difficult to answer basic questions like how many leads came in last month or where they stalled.",
      "The business is growing and the informal system that used to work no longer keeps up.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the current sales and customer process, however informal it currently is." },
      { phase: "Audit", description: "Identify where leads and follow-ups are currently getting lost or delayed." },
      { phase: "Strategize", description: "Select and design the CRM structure around how the business actually sells, not a generic template." },
      { phase: "Execute", description: "Set up and integrate the CRM with existing tools, and migrate existing contact data into it." },
      { phase: "Optimize", description: "Refine the pipeline stages and automations as the sales process becomes clearer over time." },
    ],
    deliverables: [
      "A configured CRM system built around the business's actual sales process",
      "Integration with existing tools (website forms, email, phone/WhatsApp where possible)",
      "Migration of existing contact and lead data into one place",
      "Clear pipeline stages so lead status is visible to the whole team",
    ],
    outcomeHeadline: "Sales Efficiency",
    outcomeBody:
      "A properly integrated CRM does not create demand, it stops demand from leaking out of a broken process. The direct outcome is fewer leads going cold from missed follow-up, and a much clearer picture of where the sales process itself is actually losing people.",
    ecosystem: ["lead-generation-systems", "workflow-automation", "ai-automation"],
    industries: ["real-estate", "automotive-ev", "education-coaching", "fitness-wellness"],
    faqs: [
      { q: "Which CRM platform do you use?", a: "The right platform depends on the business's size, budget and existing tools — this is decided during the strategize phase rather than defaulting to one system for everyone." },
      { q: "Can existing lead data be migrated in?", a: "Yes, migrating existing contacts and history is part of the setup, so the business is not starting from zero." },
      { q: "Does this replace our sales team's judgment?", a: "No — a CRM organizes and tracks the process; the sales conversations and decisions still belong to the team." },
      { q: "How long does implementation take?", a: "It depends on the complexity of the current process and how much data needs to be migrated, scoped specifically during discovery." },
    ],
    ctaSupportingCopy: "Get a free audit of how leads currently move through your business, and where they are getting lost.",
    metaTitle: "CRM Integration & Setup Services | GraphikosX",
    metaDescription: "CRM systems set up and integrated around how a business actually sells, so leads and follow-ups stop living in scattered spreadsheets and inboxes.",
  },
  "workflow-automation": {
    slug: "workflow-automation",
    group: "Scale",
    headline: "Let the process scale without adding headcount to run it.",
    subhead: "Operational automation that lets your team focus on the parts that need a human.",
    problem: [
      "As a business grows, its internal processes tend to stay manual long after they should have become systems — the same onboarding steps repeated by hand, the same status updates sent manually, the same handoffs between people that depend on someone remembering to do them.",
      "This usually is not visible as a single big problem. It shows up as constant small friction — things taking longer than they should, information not reaching the right person, work quietly depending on one person's attentiveness.",
    ],
    definitionAnswer:
      "Workflow automation is the practice of connecting a business's tools and steps so that routine processes — onboarding, notifications, status updates, handoffs — happen automatically and consistently, instead of depending on someone remembering to do them manually.",
    definitionExpansion:
      "This is broader than any single tool — it is about mapping how work actually flows through the business and removing the manual steps that do not need a person doing them by hand every time, while keeping the steps that genuinely require judgment untouched.",
    whenYouNeedIt: [
      "The same manual process gets repeated for every new customer, lead or project.",
      "Work regularly stalls because it is waiting on someone to manually pass it to the next step.",
      "The team is growing and processes that worked informally are starting to break down.",
      "Mistakes happen because a manual step gets forgotten under normal workload.",
    ],
    approach: [
      { phase: "Discover", description: "Map how work currently flows through the business, step by step." },
      { phase: "Audit", description: "Identify where manual handoffs are causing delay, inconsistency or errors." },
      { phase: "Strategize", description: "Prioritize which workflows to automate first, based on impact and complexity." },
      { phase: "Execute", description: "Build the automation connecting the relevant tools, without disrupting what already works." },
      { phase: "Optimize", description: "Adjust the automated workflows as the business's processes and tools evolve." },
    ],
    deliverables: [
      "Mapped and documented core operational workflows",
      "Automated handoffs and notifications between tools and steps",
      "Reduced dependency on manual, memory-based processes",
      "A foundation that scales as transaction volume grows",
    ],
    outcomeHeadline: "Sales Efficiency",
    outcomeBody:
      "Automated workflows mean growth in volume does not automatically require growth in headcount just to keep the process running. The direct result is fewer things falling through operational cracks, and a team that spends its time on the parts of the work that actually need a person.",
    ecosystem: ["ai-automation", "crm-integration"],
    industries: ["industrial-manufacturing-chemicals", "healthcare", "real-estate"],
    faqs: [
      { q: "Is this the same as AI automation?", a: "They overlap — workflow automation focuses on connecting tools and steps in a process, while AI automation often handles a specific repetitive task within that workflow. They are frequently implemented together." },
      { q: "Will this disrupt how the team currently works?", a: "The goal is to remove friction, not force a new way of working — automation is built around existing processes, refined rather than replaced outright." },
      { q: "What tools does this work with?", a: "Whatever the business already uses — the goal is connecting existing tools more effectively, not necessarily replacing them." },
      { q: "How do you decide what to automate first?", a: "Based on where manual handoffs are causing the most delay or error, identified during the audit phase." },
    ],
    ctaSupportingCopy: "Get a free audit of where manual handoffs are currently slowing your operations down.",
    metaTitle: "Workflow Automation Services | GraphikosX",
    metaDescription: "Operational workflow automation that connects a business's tools and steps — reducing manual handoffs so growth does not require proportional headcount.",
  },
  "lead-generation-systems": {
    slug: "lead-generation-systems",
    group: "Scale",
    headline: "Build a pipeline that does not depend on referrals alone.",
    subhead: "Structured lead flow and follow-up systems, not one-off campaigns.",
    problem: [
      "Many businesses grow entirely on referrals and word of mouth — which works, until it doesn't scale predictably. There is no way to plan growth around a channel that depends on other people's goodwill and timing rather than a system the business controls.",
      "The alternative failure mode is running occasional lead-generation campaigns with no consistent system behind them — a burst of leads with no structured follow-up, which wastes much of the value the campaign created in the first place.",
    ],
    definitionAnswer:
      "A lead generation system is the combination of channels, landing pages and follow-up processes that consistently bring in and convert new prospects — built to run continuously, not as a one-off campaign that starts and stops.",
    definitionExpansion:
      "The word \"system\" is deliberate: a single ad campaign generates leads temporarily; a system generates them repeatedly, with a defined process for what happens the moment someone shows interest, so momentum is not lost between the campaign and the follow-up.",
    whenYouNeedIt: [
      "Growth currently depends almost entirely on referrals, with no predictable alternative.",
      "Past lead-generation campaigns produced leads that were never properly followed up on.",
      "There is no consistent process for what happens the moment a new lead comes in.",
      "The business wants predictable pipeline growth rather than relying on unpredictable inbound interest.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the business's ideal customer and where they can realistically be reached." },
      { phase: "Audit", description: "Review current lead sources and follow-up process for where leads are being wasted." },
      { phase: "Strategize", description: "Define the channels, landing pages and follow-up sequence the system will run on." },
      { phase: "Execute", description: "Build and launch the lead generation channels and connect them to a structured follow-up process." },
      { phase: "Optimize", description: "Track lead quality and conversion, and refine channels and messaging based on actual results." },
    ],
    deliverables: [
      "Defined lead generation channels matched to the ideal customer",
      "Landing pages built to convert that specific traffic",
      "A structured follow-up process connected to the CRM",
      "Ongoing tracking of lead volume, quality and conversion",
    ],
    outcomeHeadline: "Scalability",
    outcomeBody:
      "A lead generation system turns growth into something the business can plan around instead of hope for. The realistic outcome is a pipeline that keeps producing qualified conversations on a predictable basis, rather than one that surges and stalls with referral timing.",
    ecosystem: ["crm-integration", "landing-pages", "workflow-automation"],
    industries: ["real-estate", "automotive-ev", "education-coaching", "fitness-wellness"],
    faqs: [
      { q: "Is this the same as running ads?", a: "Ads can be one channel within the system, but the system also includes the landing pages, follow-up process and CRM connection that determine whether those leads actually convert." },
      { q: "How quickly will leads start coming in?", a: "It depends on the channels involved — some produce results faster than others — and is discussed realistically during strategy, not oversold upfront." },
      { q: "Does this work without paid advertising?", a: "Organic channels can be part of a lead generation system too, though they typically take longer to build momentum than paid channels." },
      { q: "What happens to leads once they come in?", a: "They flow into a structured follow-up process connected to the CRM, so response and nurturing happen consistently rather than depending on memory." },
    ],
    ctaSupportingCopy: "Get a free audit of how leads currently reach your business, and what happens to them after that.",
    metaTitle: "Lead Generation Systems for Businesses | GraphikosX",
    metaDescription: "Structured lead generation systems — channels, landing pages and follow-up built together — so pipeline growth stops depending on referrals alone.",
  },
  "marketing-consultation": {
    slug: "marketing-consultation",
    group: "Scale",
    headline: "Know what to prioritize before spending on any of it.",
    subhead: "Senior strategic guidance to prioritise what actually moves the business forward.",
    problem: [
      "Businesses often know they need \"more marketing\" without a clear view of which specific investment — a website, SEO, content, automation — would actually move things forward first. Without that clarity, budget tends to go toward whatever was pitched most recently, not what the business most needs.",
      "This is especially common with a long list of possible services in front of a business owner and no experienced perspective on sequencing — what to do first, what can wait, and what would be wasted money right now.",
    ],
    definitionAnswer:
      "Marketing consultation is senior strategic guidance — independent of any specific service being sold — to help a business understand where it stands, what is actually limiting its growth, and which investments would realistically move it forward first.",
    definitionExpansion:
      "This is often the right starting point for a business unsure which of GraphikosX's other services actually applies to them yet. It produces a clear, prioritized view of the situation, whether or not further work follows from it.",
    whenYouNeedIt: [
      "Unsure which of the services above would actually address the business's real bottleneck.",
      "Marketing spend so far has not produced a clear return, and it is unclear why.",
      "About to make a significant marketing decision (rebrand, new website, ad budget) and want an independent perspective first.",
      "Need a prioritized plan rather than a list of individually pitched services.",
    ],
    approach: [
      { phase: "Discover", description: "Understand the business, its goals, and its current marketing efforts in full." },
      { phase: "Audit", description: "Assess brand, digital presence and competitive position honestly, including what is already working." },
      { phase: "Strategize", description: "Build a prioritized roadmap based on what would actually move the business forward first." },
      { phase: "Execute", description: "Where applicable, guide implementation of the roadmap, whether led internally or by GraphikosX." },
      { phase: "Optimize", description: "Revisit the plan as the business and market conditions change." },
    ],
    deliverables: [
      "An honest assessment of current brand and digital presence",
      "A prioritized roadmap based on the business's specific situation",
      "Clear reasoning for what to invest in first, and what to defer",
      "Independent guidance not tied to selling a predetermined package",
    ],
    outcomeHeadline: "Scalability",
    outcomeBody:
      "The direct outcome of a good consultation is clarity — knowing precisely what the actual constraint on growth is, instead of guessing based on whichever service was pitched most recently. That clarity alone often saves more money than it costs, by preventing investment in the wrong thing first.",
    ecosystem: ["brand-strategy", "ai-automation"],
    industries: ["education-coaching", "industrial-manufacturing-chemicals"],
    faqs: [
      { q: "Does this commit us to a specific service afterward?", a: "No — the output is a prioritized roadmap; whether that work is done with GraphikosX, internally, or elsewhere is a separate decision." },
      { q: "How is this different from the Free Audit?", a: "The Free Audit is an initial, lighter-touch review; marketing consultation is a deeper, more structured engagement for businesses that want a full prioritized roadmap." },
      { q: "Who is this for?", a: "Business owners or leaders who are unsure which specific service actually addresses their situation, or who want an independent second opinion before committing budget." },
      { q: "Will the recommendation always include GraphikosX services?", a: "The recommendation is based on what the business actually needs — sometimes that overlaps with GraphikosX's services, sometimes it points toward a narrower or different scope." },
    ],
    ctaSupportingCopy: "Start with a free audit — a lighter first step before a full consultation.",
    metaTitle: "Marketing Consultation & Strategy | GraphikosX",
    metaDescription: "Independent marketing consultation to identify what is actually limiting growth and prioritize the right investment first — not a pitch for a preset package.",
  },
};
