export type VisualStyle = "technical" | "clarity" | "spatial" | "editorial" | "authority" | "local" | "progress" | "luxury" | "kinetic" | "trust";
export type ApproachPhase = { phase: "Discover" | "Audit" | "Strategize" | "Execute" | "Optimize"; description: string };
export type FAQ = { q: string; a: string };
export type RelevantService = { slug: string; why: string };
export type Challenge = { title: string; description: string };
export type Transformation = { before: string; after: string };

export type IndustryDetail = {
  slug: string;
  visualStyle: VisualStyle;
  /** Short, sector-specific line shown above the hero headline. */
  eyebrow: string;
  headline: string;
  heroApproach: string;
  aeoAnswer: string;
  /** Exactly 5 genuinely sector-specific current challenges (spec: Phase 2H §3/§12). */
  challenges: Challenge[];
  buyerJourney: string[];
  buyerJourneyNote: string;
  trustSignals: string[];
  relevantServices: RelevantService[];
  outcomes: string[];
  approach: ApproachPhase[];
  ecosystem: string[];
  transformation: Transformation;
  faqs: FAQ[];
  /** Industry-specific Free Audit CTA framing (spec §20), e.g. "Audit Your Clinic's Digital Presence". */
  ctaHeadline: string;
  ctaSupportingCopy: string;
  metaTitle: string;
  metaDescription: string;
};

export const industryDetails: Record<string, IndustryDetail> = {
  "healthcare": {
    slug: "healthcare",
    visualStyle: "clarity",
    eyebrow: "Trusted Before the First Appointment",
    headline: "Build trust before the first appointment.",
    heroApproach:
      "GraphikosX approaches doctors and clinics with a trust-first lens: a clear, professional website, accurate local presence, and patient education content, built to support a patient's decision without making treatment claims or promises GraphikosX has no basis to make.",
    aeoAnswer:
      "GraphikosX helps doctors, clinics and healthcare practices by strengthening the trust signals patients actually look for before booking: a clear website, credentials, reviews, and local visibility, so the practice is easy to find and easy to trust during the research stage that happens before every appointment.",
    challenges: [
      { title: "Trust Before the First Call", description: "Patients decide whether a practice is worth booking almost entirely from how credible it looks online, long before any consultation happens." },
      { title: "Thin Local Discoverability", description: "Many clinics are hard to find in local and map search against competitors that have simply claimed and completed their Google Business Profile." },
      { title: "Unmanaged Reviews", description: "Reviews exist but are rarely monitored or responded to, so a handful of old complaints can quietly outweigh years of good care." },
      { title: "Communicating Expertise Ethically", description: "Practices struggle to demonstrate real expertise online without slipping into medical claims or promises that responsible marketing shouldn't make." },
      { title: "Appointment & Lead Leakage", description: "Enquiries arrive by phone, WhatsApp and web form with no shared system tracking them, so some are simply never followed up." },
    ],
    buyerJourney: ["Recommendation or Search", "Reviews", "Credentials Check", "Trust", "Appointment"],
    buyerJourneyNote:
      "A patient typically starts from either a personal recommendation or a search, then checks reviews and credentials before deciding whether to trust a provider enough to book. That trust-building step happens almost entirely online, well before any in-person interaction.",
    trustSignals: [
      "Clearly displayed credentials and qualifications",
      "Genuine patient reviews and how they are managed",
      "A clear, professional website that explains services in plain language",
      "Accurate, complete Google Business Profile",
      "Patient education content that demonstrates expertise without overstepping into medical advice",
    ],
    relevantServices: [
      { slug: "business-websites", why: "A clear, professional website is often the first real trust signal a prospective patient encounters." },
      { slug: "google-business-profile", why: "Local search is frequently the starting point for patients searching for a nearby provider." },
      { slug: "seo", why: "Being found for relevant, non-clinical search terms means being present at the research stage." },
      { slug: "content-production", why: "Patient education content builds credibility without crossing into medical advice or promises." },
      { slug: "linkedin-personal-branding", why: "Where a practice is closely tied to its practitioners, their professional visibility reinforces credibility." },
      { slug: "crm-integration", why: "A clear system for enquiries and follow-up reduces the friction between interest and a booked appointment." },
    ],
    outcomes: ["Higher patient trust", "Stronger local discoverability", "A clearer appointment journey", "Better-managed online reputation"],
    approach: [
      { phase: "Discover", description: "Understand the practice, its specialties, and how patients currently find and evaluate it." },
      { phase: "Audit", description: "Review the website, Google Business Profile and review presence against what a searching patient sees today." },
      { phase: "Strategize", description: "Prioritize the trust signals and content that matter most for this specific practice and specialty." },
      { phase: "Execute", description: "Build out the website, local presence and educational content with a professional, trust-focused tone throughout." },
      { phase: "Optimize", description: "Monitor local visibility and review activity, and refine content as the practice evolves." },
    ],
    ecosystem: ["Google Search", "Clinic/Practice Website", "Reviews", "Educational Content", "Appointment Journey", "CRM / Follow-Up"],
    transformation: { before: "A clinic patients have to call just to learn the basics.", after: "A practice patients already trust before they dial the number." },
    faqs: [
      { q: "How should a clinic build trust online?", a: "Through clear credentials, genuine reviews, a professional website, and patient education content: the same signals a patient would look for in person, made visible before they ever call." },
      { q: "Does a doctor or clinic need SEO?", a: "Yes, particularly for non-branded searches, since patients often search by symptom, specialty or location rather than a practice's name, and visibility there matters." },
      { q: "What digital presence matters most for a clinic?", a: "A clear, accurate website and a complete, actively managed Google Business Profile tend to matter most, since they are usually the first two things a searching patient checks." },
      { q: "Can GraphikosX help with patient reviews?", a: "GraphikosX can help structure how reviews are requested and responded to, within the bounds of what is appropriate for healthcare marketing, not by fabricating or incentivizing reviews." },
      { q: "Does this include medical advice or treatment marketing?", a: "No. GraphikosX focuses on trust, discoverability and clarity of information, not medical advice, treatment claims, or guarantees about patient outcomes." },
    ],
    ctaHeadline: "Audit Your Clinic's Digital Presence",
    ctaSupportingCopy: "Get a free audit of how your practice currently appears to a patient searching online.",
    metaTitle: "Digital Presence for Doctors & Clinics | GraphikosX",
    metaDescription: "GraphikosX helps doctors and clinics build patient trust online through clear websites, local visibility and educational content, with no medical claims.",
  },

  "real-estate": {
    slug: "real-estate",
    visualStyle: "spatial",
    eyebrow: "Built to Be Compared and Chosen",
    headline: "Make the project hard to ignore.",
    heroApproach:
      "GraphikosX treats each real estate project as its own story, with a distinct website and content presence that helps a high-consideration purchase stand out from the near-identical listings it is being compared against.",
    aeoAnswer:
      "GraphikosX helps real estate businesses and developers by giving each project a distinct, high-quality digital presence: dedicated pages, strong visuals and a structured enquiry process, so the project is clearly differentiated during the lengthy comparison stage that precedes a site visit.",
    challenges: [
      { title: "Trust in the Developer, Not Just the Project", description: "Buyers research who is actually building and delivering the project at least as closely as they research the project itself." },
      { title: "Low-Quality Lead Volume", description: "Broad ad campaigns generate enquiries that were never seriously qualified, wasting sales time on browsers, not buyers." },
      { title: "Project Differentiation", description: "Near-identical listings across portals make one project hard to distinguish from the next on specs alone." },
      { title: "Long Decision Cycles", description: "A high-value purchase unfolds over weeks or months, with long silent stretches of independent research in between." },
      { title: "Follow-Up & CRM Leakage", description: "Interested buyers go quiet not because they lost interest, but because follow-up depended on memory rather than a system." },
    ],
    buyerJourney: ["Discovery", "Project Research", "Comparison", "Site Visit", "Decision"],
    buyerJourneyNote:
      "Real estate is a high-consideration purchase, so buyers research extensively before ever visiting a site, comparing multiple projects on similar criteria before narrowing down to the handful worth an in-person visit.",
    trustSignals: [
      "High-quality project photography and presentation",
      "Transparent, complete project details rather than vague marketing language",
      "Developer or agent reputation and track record",
      "Proof from genuinely completed past projects, where available",
      "A clear, low-friction enquiry process",
    ],
    relevantServices: [
      { slug: "business-websites", why: "A structured site with dedicated project pages presents each project on its own terms, not as one of many identical listings." },
      { slug: "landing-pages", why: "Project launches and campaigns need a dedicated page built to convert that specific audience, not a shared homepage." },
      { slug: "visual-identity", why: "Consistent, premium presentation signals credibility for a high-value purchase decision." },
      { slug: "content-production", why: "Project storytelling, not just specifications, is what helps a buyer connect with a specific development." },
      { slug: "lead-generation-systems", why: "A structured enquiry pipeline captures interest generated by marketing before it goes cold." },
      { slug: "crm-integration", why: "The long consideration cycle in real estate requires organized, consistent follow-up." },
    ],
    outcomes: ["Stronger project differentiation", "Higher-quality enquiries", "Improved visual perception", "More consistent enquiry follow-up"],
    approach: [
      { phase: "Discover", description: "Understand each project's specific positioning, target buyer and competitive set." },
      { phase: "Audit", description: "Review current project presentation, visuals and enquiry handling against buyer expectations." },
      { phase: "Strategize", description: "Define how each project should be presented distinctly, rather than through a shared template." },
      { phase: "Execute", description: "Build project-specific pages, campaigns and a structured enquiry and follow-up process." },
      { phase: "Optimize", description: "Track enquiry quality and adjust presentation and targeting as each project progresses." },
    ],
    ecosystem: ["Search & Discovery", "Project Website/Pages", "Visual Content", "Enquiry Capture", "Site Visit Scheduling", "CRM / Follow-Up"],
    transformation: { before: "One listing among a dozen identical ones.", after: "The project buyers remember and compare everything else against." },
    faqs: [
      { q: "Should every project have its own website or page?", a: "Generally yes: a dedicated page lets a project be evaluated on its own merits rather than being diluted inside a general company site." },
      { q: "How important is photography and visual content?", a: "Very. Real estate is a highly visual purchase decision, and low-quality or generic visuals actively undermine perceived project quality." },
      { q: "Can this help with enquiry follow-up, not just marketing?", a: "Yes. CRM and lead generation systems are part of the relevant service set specifically because generating interest without following it up wastes the investment." },
      { q: "Does this apply to individual agents as well as developers?", a: "The same principles apply at a smaller scale: clear presentation, credible proof and organized follow-up matter regardless of portfolio size." },
    ],
    ctaHeadline: "Audit Your Project's Digital Visibility",
    ctaSupportingCopy: "Get a free audit of how your current projects are presented and followed up on.",
    metaTitle: "Digital Presence for Real Estate & Developers | GraphikosX",
    metaDescription: "GraphikosX helps real estate businesses and developers differentiate each project online with dedicated pages, strong visuals and structured lead follow-up.",
  },

  "education-coaching": {
    slug: "education-coaching",
    visualStyle: "progress",
    eyebrow: "Where Outcomes Become Visible",
    headline: "Make the outcome visible before the enrollment.",
    heroApproach:
      "GraphikosX approaches education and coaching businesses around one question a prospective learner is always asking: will this actually get me the outcome I want. The digital presence is built to answer that clearly, not to oversell it.",
    aeoAnswer:
      "GraphikosX helps education and coaching businesses by making their outcomes, credibility and social proof clearly visible online, and by building a structured enrollment funnel, so prospective learners can evaluate fit and commit with confidence instead of enquiring into an unclear process.",
    challenges: [
      { title: "Unclear Outcomes", description: "Programs are often described in aspirational language without stating what a learner will actually be able to do afterward." },
      { title: "Scattered Social Proof", description: "Genuine testimonials exist but sit buried in old screenshots and posts a new visitor will never actually find." },
      { title: "Enrollment Funnel Gaps", description: "Interest doesn't reliably become enrollment because the next step after \"interested\" is never made obvious." },
      { title: "Instructor/Coach Credibility", description: "Real expertise exists but isn't visibly demonstrated anywhere a prospective learner would naturally look." },
      { title: "Cohort & Seasonal Demand Swings", description: "Enquiry volume spikes sharply around enrollment windows, with no system built to handle the surge without dropping leads." },
    ],
    buyerJourney: ["Discovery", "Outcome Research", "Social Proof Check", "Enquiry", "Enrollment"],
    buyerJourneyNote:
      "A prospective learner typically discovers a program, then researches whether it actually delivers the outcome they want, checks social proof to validate that claim, and only enquires once reasonably convinced. Enrollment follows a structured decision, not an impulse.",
    trustSignals: [
      "Clear communication of what the program or coaching actually delivers",
      "Instructor or coach credibility and visible expertise",
      "Genuine learner social proof, where it exists",
      "Clarity about curriculum, format and time commitment",
      "Content that demonstrates real teaching quality, not just marketing claims",
    ],
    relevantServices: [
      { slug: "business-websites", why: "A clear program page answering real learner questions reduces uncertainty at the point of decision." },
      { slug: "landing-pages", why: "Cohort launches and enrollment windows need a dedicated page focused on one enrollment decision." },
      { slug: "content-production", why: "Content demonstrating real teaching quality and outcomes builds more trust than promotional claims alone." },
      { slug: "social-media-management", why: "Consistent presence supports both credibility and ongoing community engagement with learners." },
      { slug: "lead-generation-systems", why: "A structured enquiry-to-enrollment pipeline captures interest before it cools." },
      { slug: "crm-integration", why: "Tracking enquiries through to enrollment prevents interested prospects from being lost to follow-up gaps." },
    ],
    outcomes: ["Clearer communication of outcomes", "A stronger enrollment funnel", "More visible, organized social proof", "Better lead quality"],
    approach: [
      { phase: "Discover", description: "Understand the program's actual outcomes and who it is genuinely built for." },
      { phase: "Audit", description: "Review current messaging, content and enrollment process for clarity gaps." },
      { phase: "Strategize", description: "Define how outcomes and social proof should be communicated and where the enrollment funnel needs structure." },
      { phase: "Execute", description: "Build out the program pages, content and enrollment funnel with clarity as the priority." },
      { phase: "Optimize", description: "Track enquiry-to-enrollment conversion and refine messaging based on what learners actually respond to." },
    ],
    ecosystem: ["Discovery (Search/Social)", "Program Website", "Social Proof", "Enquiry", "Enrollment Funnel", "CRM / Follow-Up"],
    transformation: { before: "A program described in promises.", after: "A program proven by outcomes a prospective learner can actually see." },
    faqs: [
      { q: "How should a coaching business communicate results without overpromising?", a: "By describing the process and what participants typically work on or achieve, backed by genuine examples where they exist, rather than guaranteeing specific outcomes." },
      { q: "Does SEO matter for education and coaching businesses?", a: "Yes, particularly for people actively searching for a solution to a specific problem the program addresses, since that is often a strong-intent search moment." },
      { q: "What is the biggest digital gap for most coaching businesses?", a: "Usually an unclear enrollment funnel: a prospective learner is interested, but the path from that interest to actually enrolling is not obvious or is inconsistent." },
      { q: "Can this help organize existing testimonials and social proof?", a: "Yes. One common fix is simply making already-existing genuine social proof visible and organized, rather than scattered across old posts and screenshots." },
    ],
    ctaHeadline: "Audit Your Program's Enrollment Journey",
    ctaSupportingCopy: "Get a free audit of how clearly your program's outcomes come across to a new visitor today.",
    metaTitle: "Digital Presence for Education & Coaching | GraphikosX",
    metaDescription: "GraphikosX helps education and coaching businesses communicate outcomes clearly and build a structured enrollment funnel, from discovery through to enrollment.",
  },

  "jewellery-wedding": {
    slug: "jewellery-wedding",
    visualStyle: "luxury",
    eyebrow: "Crafted Trust, Presented Right",
    headline: "Present craftsmanship the way the occasion deserves.",
    heroApproach:
      "GraphikosX approaches jewellery and wedding businesses around the reality that this is a high-emotion, high-trust purchase: the digital presence is built to convey craftsmanship, authenticity and occasion together, not just show product photos at a price point.",
    aeoAnswer:
      "GraphikosX helps jewellery and wedding businesses by presenting craftsmanship, authenticity and the emotional context of the occasion together online, through premium visual presentation, trust signals around materials and certification, and a clear path to a showroom visit or consultation, so the business competes on trust and taste, not price alone.",
    challenges: [
      { title: "Generic Product-First Presentation", description: "Pieces are often shown as commodity product photos rather than as part of an occasion and a story, which is how the buyer actually experiences the decision." },
      { title: "Trust in Authenticity & Craftsmanship", description: "A high-value purchase needs visible confidence in materials, certification and craftsmanship before a buyer will commit, and that confidence rarely comes through online." },
      { title: "Price-Led Competition", description: "Without a distinct story or point of view, the comparison defaults to price against every other jeweller or boutique nearby." },
      { title: "Seasonal, Occasion-Driven Demand", description: "Wedding season and festive-season enquiry spikes are rarely matched by a system built to handle the surge without losing leads." },
      { title: "Showroom Visit Friction", description: "The path from browsing a collection online to actually booking an in-person viewing or consultation is often unclear or missing entirely." },
    ],
    buyerJourney: ["Discovery", "Collection Research", "Trust & Authenticity Check", "Consultation Request", "Showroom Visit"],
    buyerJourneyNote:
      "A jewellery or wedding purchase is high-emotion and high-consideration at once. A prospective buyer discovers a collection, researches craftsmanship and authenticity closely, and only requests a consultation once genuinely convinced, since the actual decision is usually made in person.",
    trustSignals: [
      "High-quality, consistent photography that reflects the craftsmanship, not just the product",
      "Clear information about materials, certification and provenance where relevant",
      "Genuine client stories and completed work, not stock imagery",
      "A distinct visual identity that signals the business's specific taste and positioning",
      "A clear, low-friction way to book a consultation or showroom visit",
    ],
    relevantServices: [
      { slug: "visual-identity", why: "A distinct, premium visual identity is often the first signal of taste and craftsmanship a prospective buyer evaluates." },
      { slug: "brand-strategy", why: "Clear positioning determines whether the business competes on story and craftsmanship or defaults to competing on price." },
      { slug: "content-production", why: "Storytelling around craftsmanship and occasion builds far more trust than product photography alone." },
      { slug: "social-media-management", why: "Visually-driven platforms are where jewellery and wedding businesses are most naturally discovered and compared." },
      { slug: "google-business-profile", why: "Local and occasion-based search is frequently where a nearby showroom visit begins." },
    ],
    outcomes: ["Stronger perceived craftsmanship and trust", "Less price-only competition", "Higher-quality consultation requests", "A more distinct visual identity"],
    approach: [
      { phase: "Discover", description: "Understand the collections, craftsmanship story and the occasions the business is actually built around." },
      { phase: "Audit", description: "Review current photography, positioning and consultation-booking process against buyer expectations." },
      { phase: "Strategize", description: "Define how craftsmanship, authenticity and occasion should be presented to move the comparison away from price alone." },
      { phase: "Execute", description: "Build out the visual identity, content and consultation-booking path with premium presentation as the standard." },
      { phase: "Optimize", description: "Adjust presentation and content around seasonal and occasion-driven demand as it happens." },
    ],
    ecosystem: ["Discovery (Search/Social)", "Collection Presentation", "Trust & Authenticity Content", "Consultation Request", "Showroom Visit", "Client Follow-Up"],
    transformation: { before: "A product photo competing on price.", after: "A piece of craftsmanship worth the visit and the story." },
    faqs: [
      { q: "How can a jewellery brand compete on more than price?", a: "By making craftsmanship, authenticity and the story behind a piece genuinely visible, so the comparison shifts from a price line item to a trust and taste decision." },
      { q: "Does this apply to smaller, single-showroom businesses as well as larger brands?", a: "Yes. The same principles of clear photography, authenticity signals and a low-friction consultation path apply regardless of scale." },
      { q: "How should seasonal demand around weddings and festivals be handled?", a: "With a system that captures and organizes enquiries during peak periods, so interest generated during a demand spike doesn't quietly go unanswered." },
      { q: "Can this help drive showroom visits, not just online engagement?", a: "Yes. The entire journey is built around a clear next step, since most jewellery and wedding purchases are ultimately confirmed in person." },
    ],
    ctaHeadline: "Audit Your Showroom's Digital Presence",
    ctaSupportingCopy: "Get a free audit of how your collections and craftsmanship currently come across to someone browsing online.",
    metaTitle: "Digital Presence for Jewellery & Wedding Businesses | GraphikosX",
    metaDescription: "GraphikosX helps jewellery and wedding businesses present craftsmanship, authenticity and occasion online, moving the decision beyond price alone.",
  },

  "industrial-manufacturing-chemicals": {
    slug: "industrial-manufacturing-chemicals",
    visualStyle: "technical",
    eyebrow: "Engineered for Procurement Trust",
    headline: "Turn technical capability into digital authority.",
    heroApproach:
      "GraphikosX treats industrial and chemical businesses as B2B, not consumer brands: the website, content and search presence are built around technical credibility and procurement research, not lifestyle marketing.",
    aeoAnswer:
      "GraphikosX helps industrial manufacturing and chemical businesses by building a website and search presence structured around how procurement teams actually evaluate suppliers: technical clarity, product and specification pages, and LinkedIn authority, so the business appears credible during the research and evaluation stage, before an RFQ is ever sent.",
    challenges: [
      { title: "Technical Capability Invisible Online", description: "Real capability exists on the factory floor, but there are no product or specification pages a procurement researcher can actually evaluate without a phone call." },
      { title: "Procurement Trust", description: "Buyers vet a supplier's credibility long before any RFQ is issued, often with nothing structured online to check it against." },
      { title: "Documentation & Specification Discoverability", description: "Technical documentation, where it exists, is rarely structured or indexed for search or self-service review." },
      { title: "International Buyer Credibility", description: "Cross-border buyers have no easy way to verify legitimacy and capability without a direct referral or existing relationship." },
      { title: "Inquiry & RFQ Follow-Up Systems", description: "Enquiries and RFQs are frequently tracked informally, so nothing catches a stalled or forgotten opportunity." },
    ],
    buyerJourney: ["Research", "Technical Evaluation", "Supplier Credibility Check", "RFQ", "Negotiation"],
    buyerJourneyNote:
      "Industrial buying decisions are rarely impulsive. A procurement team or technical evaluator typically researches suppliers over weeks or months, checks technical fit before anything else, and only sends a request for quotation once credibility has already been established, often well before any direct contact happens.",
    trustSignals: [
      "Clear, accurate technical documentation and specifications",
      "Product and capability pages that answer an evaluator's real questions",
      "A professional, current LinkedIn presence for the business and its leadership",
      "A website that loads reliably and presents information without friction",
      "Clarity about how enquiries and RFQs are handled",
    ],
    relevantServices: [
      { slug: "business-websites", why: "A structured site with real product and capability pages is what lets a technical evaluator assess fit without a phone call." },
      { slug: "seo", why: "Procurement searches use specific technical and product terms, and visibility there means being found during research, not after." },
      { slug: "content-production", why: "Technical explainers and capability content demonstrate expertise to an audience that evaluates substance, not slogans." },
      { slug: "linkedin-personal-branding", why: "B2B buyers research the people behind a supplier, and leadership visibility on LinkedIn builds credibility before contact." },
      { slug: "digital-infrastructure", why: "Reliable systems matter when enquiries and RFQs need to be tracked and responded to without delay." },
      { slug: "crm-integration", why: "Long sales cycles need a system tracking every enquiry, not memory or a shared inbox." },
    ],
    outcomes: ["Stronger technical credibility", "Better-qualified enquiries", "Higher visibility for procurement-relevant searches", "Clearer supplier trust signals"],
    approach: [
      { phase: "Discover", description: "Understand the business's actual technical capabilities and who its buyers and evaluators typically are." },
      { phase: "Audit", description: "Review the current website, content and LinkedIn presence against what a procurement researcher would expect to find." },
      { phase: "Strategize", description: "Prioritize the technical content and pages that would most improve credibility during evaluation." },
      { phase: "Execute", description: "Build out product/capability pages, technical content and a consistent LinkedIn presence." },
      { phase: "Optimize", description: "Track enquiry quality and search visibility, refining content as new capabilities or products are added." },
    ],
    ecosystem: ["Search", "Technical Website", "Product/Spec Pages", "LinkedIn", "RFQ", "CRM"],
    transformation: { before: "Real capability with no way to prove it online.", after: "Technical credibility a procurement team can verify before the call." },
    faqs: [
      { q: "Does SEO actually work for B2B manufacturing?", a: "Yes. Procurement teams search using specific technical and product terms, and ranking for those searches means being found during the research stage rather than relying only on referrals." },
      { q: "How can an industrial manufacturer generate qualified enquiries online?", a: "By making technical capability genuinely visible: product pages, specifications and content that let a buyer self-qualify before reaching out, rather than a generic homepage that requires a call to learn anything." },
      { q: "What should a chemical or industrial supplier's website actually include?", a: "Clear capability and product pages, technical documentation where appropriate, and a straightforward way to submit an enquiry or RFQ, built for a technical evaluator, not a general consumer audience." },
      { q: "Is LinkedIn actually relevant for industrial businesses?", a: "Very much so. B2B buyers frequently research the leadership and technical team behind a potential supplier before engaging, making LinkedIn a credibility signal, not a marketing afterthought." },
      { q: "How long does it take to see results in this industry?", a: "Industrial sales cycles are inherently long, and digital visibility compounds gradually. This is a channel built for sustained credibility, not a quick campaign." },
    ],
    ctaHeadline: "Audit Your Industrial Digital Presence",
    ctaSupportingCopy: "Get a free audit of how your technical capability actually presents itself to a procurement researcher today.",
    metaTitle: "Digital Presence for Manufacturing & Chemicals | GraphikosX",
    metaDescription: "GraphikosX helps manufacturing and chemical businesses build B2B digital credibility through technical websites, procurement SEO and LinkedIn authority.",
  },

  "legal-professional-services": {
    slug: "legal-professional-services",
    visualStyle: "authority",
    eyebrow: "Authority Before the Consultation",
    headline: "Authority starts before the consultation.",
    heroApproach:
      "GraphikosX approaches legal, CA and professional services firms around credibility and clarity: a precise, authoritative digital presence built to inform good decisions, not to promise outcomes it cannot guarantee.",
    aeoAnswer:
      "GraphikosX helps legal, CA and professional services firms build authority and clarity online, through precise service explanations, thought leadership content and a credible digital presence, so a prospective client already trusts the firm's expertise before the first consultation, without relying on promised outcomes.",
    challenges: [
      { title: "Generic Practice-Area Listings", description: "Services are often listed in generic terms that don't demonstrate the actual depth of expertise behind them." },
      { title: "Absent Thought Leadership", description: "The content that would build authority for the specific questions a future client is already searching is simply missing." },
      { title: "Confidentiality-Compatible Visibility", description: "The profession's expectations around discretion make many firms cautious to the point of being effectively invisible online." },
      { title: "Partner & Practitioner Credibility", description: "Individual expertise, whether a partner, a CA, or a senior associate, rarely has any visible presence of its own for a prospective client to check." },
      { title: "Consultation Request Friction", description: "A prospective client who is ready to act often can't find a clear, low-friction way to actually request a consultation." },
    ],
    buyerJourney: ["Need Arises", "Search or Referral", "Credibility Check", "Consultation Request", "Engagement"],
    buyerJourneyNote:
      "A need typically arises first, followed by either a search or a referral. Before requesting a consultation, a prospective client checks the firm's credibility via its website, content and professional presence, since legal, financial and professional decisions carry real consequences and are rarely made on trust alone.",
    trustSignals: [
      "Clear, precise explanation of practice areas and services",
      "Thought leadership content demonstrating real expertise",
      "Professional credentials and firm reputation",
      "A website that reads as considered and credible, not templated",
      "Visible partner or practitioner authority, including on LinkedIn",
    ],
    relevantServices: [
      { slug: "business-websites", why: "A precise, professional website is often the first credibility check a prospective client performs." },
      { slug: "seo", why: "Being visible for specific practice-area searches means being found while a need is actively being researched." },
      { slug: "content-production", why: "Thought leadership content is one of the clearest ways to demonstrate expertise before a consultation." },
      { slug: "linkedin-personal-branding", why: "Partner and practitioner visibility on LinkedIn reinforces the firm's collective authority." },
      { slug: "digital-infrastructure", why: "A reliable, secure technical foundation matters where client confidentiality and professionalism are expected." },
    ],
    outcomes: ["Greater perceived authority", "Higher discoverability for relevant practice areas", "Clearer service positioning", "Stronger professional credibility"],
    approach: [
      { phase: "Discover", description: "Understand the firm's practice areas, target clients and existing reputation." },
      { phase: "Audit", description: "Review the current website and content for clarity, precision and search visibility." },
      { phase: "Strategize", description: "Prioritize the thought leadership content and positioning that build the most credibility for this specific practice." },
      { phase: "Execute", description: "Build the website and content with precision and professionalism as the standard throughout." },
      { phase: "Optimize", description: "Track visibility and refine content and positioning as the practice evolves." },
    ],
    ecosystem: ["Search or Referral", "Firm Website", "Thought Leadership Content", "LinkedIn Authority", "Consultation Request", "Engagement"],
    transformation: { before: "A firm that's invisible until someone is referred.", after: "A practice whose expertise is visible before the consultation." },
    faqs: [
      { q: "Can a law firm or CA practice advertise results or promise outcomes?", a: "GraphikosX does not build messaging around promised outcomes or results. The focus stays on clearly communicating expertise, experience and process, consistent with professional advertising norms." },
      { q: "Does SEO work for legal, CA and professional services?", a: "Yes. Prospective clients frequently search for specific legal, financial or professional questions before ever contacting a firm, making that visibility valuable." },
      { q: "How does thought leadership content help a firm?", a: "It demonstrates depth of expertise in a way a generic service page cannot, which is often what actually earns trust before a consultation." },
      { q: "Is LinkedIn really relevant for a law firm, CA practice or consultancy?", a: "For many professional services, individual partner or practitioner credibility carries real weight, and LinkedIn is where that credibility is most visibly built." },
    ],
    ctaHeadline: "Audit Your Firm's Digital Authority",
    ctaSupportingCopy: "Get a free audit of how clearly your firm's expertise currently comes across online.",
    metaTitle: "Digital Presence for Legal, CA & Professional Firms | GraphikosX",
    metaDescription: "GraphikosX helps legal, CA and professional services firms build authority and clarity online through precise positioning, thought leadership and a credible presence.",
  },

  "fitness-wellness": {
    slug: "fitness-wellness",
    visualStyle: "local",
    eyebrow: "Local. Trusted. Recognizable.",
    headline: "Turn local visibility into consistent membership.",
    heroApproach:
      "GraphikosX approaches gyms and fitness businesses as local, trust-driven and community-oriented: the digital presence is built to win the local search moment and then support the retention that follows.",
    aeoAnswer:
      "GraphikosX helps gyms and fitness businesses by strengthening local search visibility, reviews and social presence, the signals that most directly influence whether someone nearby chooses to try a class or membership, and by supporting the community engagement that keeps them coming back.",
    challenges: [
      { title: "Inconsistent Local Presence", description: "An incomplete Google Business Profile and irregular social activity quietly undercut a decision that's fundamentally about what's nearby." },
      { title: "Unmanaged Reviews", description: "Reviews are one of the first things a nearby prospect checks before trying a class, and unmanaged ones can cost trial visits." },
      { title: "Trial-to-Membership Drop-off", description: "A trial visit doesn't reliably convert to membership because there's no structured follow-up after it." },
      { title: "Retention, Not Just Acquisition", description: "Most marketing effort goes toward new sign-ups, with little system actually supporting existing member retention." },
      { title: "Unclear Schedules & Offerings", description: "Class schedules, pricing and membership options are often outdated or hard to find online, adding friction right when someone has decided to try." },
    ],
    buyerJourney: ["Local Search or Referral", "Reviews", "Trial Visit", "Comparison", "Membership"],
    buyerJourneyNote:
      "Someone typically finds a gym or fitness business through local search or a referral, checks reviews to validate it, and often visits a trial class before comparing it against nearby alternatives. Membership follows once that comparison favors the business.",
    trustSignals: [
      "Genuine, actively managed reviews",
      "Trainer or practitioner credibility",
      "Clear, current class schedules and facility presentation",
      "Visible community and social proof",
      "A complete, accurate local (Google) presence",
    ],
    relevantServices: [
      { slug: "google-business-profile", why: "Local search is frequently the first and most decisive step for someone nearby looking for a class or gym." },
      { slug: "social-media-management", why: "Community and social proof are core to how gyms and fitness businesses build local trust." },
      { slug: "content-production", why: "Educational and motivational content supports both discovery and member retention." },
      { slug: "crm-integration", why: "Tracking trial visits and membership follow-up prevents interested prospects from drifting away." },
      { slug: "lead-generation-systems", why: "A structured trial-to-membership pipeline converts more of the interest already being generated locally." },
    ],
    outcomes: ["Stronger local visibility", "Better trial-to-membership conversion", "Improved reputation management", "Higher community engagement"],
    approach: [
      { phase: "Discover", description: "Understand the business's specific offering, community and local competitive landscape." },
      { phase: "Audit", description: "Review the current local presence, reviews and social activity for gaps." },
      { phase: "Strategize", description: "Prioritize the local and social signals that matter most for this specific business and location." },
      { phase: "Execute", description: "Build out the local presence, content and trial-to-membership process consistently." },
      { phase: "Optimize", description: "Monitor local visibility and conversion, adjusting as classes, offers or seasons change." },
    ],
    ecosystem: ["Local Search", "Google Business Profile", "Reviews", "Social Content", "Trial Visit", "CRM / Membership Follow-Up"],
    transformation: { before: "A gym competing purely on proximity.", after: "A local brand people choose, join and stay with." },
    faqs: [
      { q: "How important are reviews for a gym or studio?", a: "Very. Reviews are frequently one of the first things a nearby prospect checks before deciding to try a class, and unmanaged reviews can quietly cost trial visits." },
      { q: "Does social media actually drive memberships?", a: "It contributes mainly to trust and community proof rather than direct sign-ups. Most memberships still follow a trial visit, which social presence helps encourage in the first place." },
      { q: "What is the most common digital gap in this industry?", a: "An incomplete or inconsistent local presence: an outdated Google Business Profile or unmanaged reviews are common, easy-to-fix gaps." },
      { q: "Can this help with member retention, not just new sign-ups?", a: "Yes. Content and CRM follow-up support ongoing engagement with existing members, not only the initial acquisition." },
    ],
    ctaHeadline: "Audit Your Gym's Local Presence",
    ctaSupportingCopy: "Get a free audit of how your business currently appears to someone searching nearby.",
    metaTitle: "Digital Presence for Gyms & Fitness | GraphikosX",
    metaDescription: "GraphikosX helps gyms and fitness businesses win local search, manage reviews and build the social presence that drives trial visits and membership.",
  },

  "financial-services-wealth-management": {
    slug: "financial-services-wealth-management",
    visualStyle: "trust",
    eyebrow: "Trust Before the First Meeting",
    headline: "Trust is earned before the first meeting.",
    heroApproach:
      "GraphikosX approaches financial services and wealth management firms around a simple reality: money decisions are high-consequence and rarely made on trust alone. The digital presence has to demonstrate credibility, compliance-conscious clarity and a credible process before a prospective client ever agrees to a conversation, without promising returns GraphikosX has no basis or authority to promise.",
    aeoAnswer:
      "GraphikosX helps financial advisors, wealth managers and financial services firms build the credibility a prospective client looks for before trusting someone with their money, through a precise, compliance-conscious website, visible credentials and educational content, so trust is established well before the first conversation, without relying on promised returns.",
    challenges: [
      { title: "Trust Before Any Number Is Discussed", description: "A prospective client has to trust a firm with something deeply personal, their money, long before any actual conversation about numbers takes place, and most firms' digital presence does little to earn that trust in advance." },
      { title: "Credentials That Are Hard to Verify", description: "Registrations, certifications and qualifications that matter enormously to a cautious prospect are often buried, outdated or missing from the website altogether." },
      { title: "Compliance-Safe Messaging", description: "Firms are rightly cautious about what they can say about performance or outcomes, which often leads to messaging so vague it fails to build any confidence at all." },
      { title: "Referral Dependency", description: "Much of the business still arrives through personal referral, leaving the firm with little presence for the much larger pool of prospects who don't already know someone to ask." },
      { title: "Discretion vs. Discoverability", description: "Client confidentiality and a low-key professional culture can tip into the firm being effectively invisible to the people actively searching for exactly what it offers." },
    ],
    buyerJourney: ["Life Event or Need", "Search or Referral", "Credibility Check", "Consultation Request", "Engagement"],
    buyerJourneyNote:
      "A need for financial or wealth advice is often triggered by a specific life event, such as a bonus, an inheritance, a career change, or retirement planning, after which a prospect searches or asks for a referral, then carefully checks credentials and reputation before ever requesting a consultation. That credibility check happens almost entirely online, and it's the stage most firms invest in least.",
    trustSignals: [
      "Clearly displayed registrations, certifications and credentials",
      "A precise, compliance-conscious explanation of services offered",
      "Educational content that builds understanding without promising returns",
      "Genuine client testimonials and reputation, handled within regulatory limits",
      "A professional digital presence that reads as established, not templated",
    ],
    relevantServices: [
      { slug: "business-websites", why: "A precise, professional website is often the first credibility check a prospective client performs before trusting a firm with their finances." },
      { slug: "seo", why: "Being visible for specific financial and wealth-planning searches means being found while a need is actively being researched." },
      { slug: "content-production", why: "Educational content demonstrates real expertise and builds understanding without ever promising returns." },
      { slug: "linkedin-personal-branding", why: "Individual advisor credibility carries real weight in this industry, and LinkedIn is where that credibility is most visibly built." },
      { slug: "digital-infrastructure", why: "A secure, reliable technical foundation matters where client trust and confidentiality are non-negotiable." },
    ],
    outcomes: ["Greater perceived credibility", "Higher discoverability for relevant financial searches", "Clearer, compliance-conscious positioning", "Stronger advisor or firm reputation"],
    approach: [
      { phase: "Discover", description: "Understand the firm's services, target clients and the regulatory considerations that shape what it can say." },
      { phase: "Audit", description: "Review the current website, credentials and content for clarity, precision and compliance-conscious messaging." },
      { phase: "Strategize", description: "Prioritize the credibility signals and educational content that build the most trust for this specific practice." },
      { phase: "Execute", description: "Build the website and content with precision and compliance-conscious professionalism as the standard throughout." },
      { phase: "Optimize", description: "Track visibility and refine content and positioning as offerings and regulations evolve." },
    ],
    ecosystem: ["Search or Referral", "Firm/Advisor Website", "Credentials & Compliance", "Educational Content", "Consultation Request", "Engagement"],
    transformation: { before: "A firm prospects only trust once someone vouches for it.", after: "A firm whose credibility is already visible before the first conversation." },
    faqs: [
      { q: "Can a financial advisor or wealth management firm advertise returns or performance?", a: "GraphikosX does not build messaging around promised returns or performance. The focus stays on clearly communicating credentials, process and expertise, consistent with standard financial-services advertising norms." },
      { q: "Does SEO work for financial services and wealth management?", a: "Yes. Prospective clients frequently search for specific financial questions and planning needs long before contacting a firm, making that visibility valuable." },
      { q: "How does educational content help a financial advisory firm?", a: "It demonstrates real expertise and builds understanding in a way a generic services page cannot, which is often what actually earns trust before someone discusses their finances with a stranger." },
      { q: "Is personal branding relevant for an individual financial advisor?", a: "Often more than for the firm itself. Many clients are choosing to trust a specific advisor, and a visible, credible personal presence directly supports that decision." },
    ],
    ctaHeadline: "Audit Your Firm's Digital Credibility",
    ctaSupportingCopy: "Get a free audit of how clearly your firm's credibility and expertise currently come across online.",
    metaTitle: "Digital Presence for Financial Services & Wealth Management | GraphikosX",
    metaDescription: "GraphikosX helps financial advisors, wealth managers and financial services firms build credibility and trust online through precise, compliance-conscious positioning and content.",
  },

  "architecture-interior": {
    slug: "architecture-interior",
    visualStyle: "editorial",
    eyebrow: "Presented at the Level of the Work",
    headline: "Present the portfolio at the level of the work.",
    heroApproach:
      "GraphikosX treats architecture and interior design as a portfolio-first, credibility-driven category: the website and content are built to match the design quality of the work itself, not undersell it.",
    aeoAnswer:
      "GraphikosX helps architecture and interior design studios by presenting their portfolio and process with the same design quality as their actual work, since for this category the website itself is often judged as evidence of design taste, not just a place to view past projects.",
    challenges: [
      { title: "Portfolio Undersells the Work", description: "A generic template with inconsistent photography and pacing can quietly undercut work that is genuinely excellent." },
      { title: "Unclear Design Process", description: "Prospective clients often aren't sure what working with the studio actually involves before committing to a consultation." },
      { title: "Project-Type & Client Fit", description: "Without clear positioning, enquiries arrive for the kind of project the studio doesn't actually want more of." },
      { title: "Range vs. Focus Tension", description: "Studios struggle to show the breadth of their capability without diluting a clear, recognizable point of view." },
      { title: "Referral-Only Growth Ceiling", description: "Word-of-mouth works well until it doesn't, and there's no system extending reach beyond the studio's existing network." },
    ],
    buyerJourney: ["Discovery", "Portfolio Review", "Process/Fit Evaluation", "Consultation", "Engagement"],
    buyerJourneyNote:
      "A prospective client discovers a studio, then reviews the portfolio closely, often judging design taste from the site itself, before evaluating whether the studio's process and personality fit their project, and only then requesting a consultation.",
    trustSignals: [
      "Portfolio presentation quality: photography, layout, pacing",
      "A clearly explained design process",
      "Consistency between the studio's visual identity and the work it produces",
      "Evidence of the range of project types and scales handled",
      "A clear sense of the studio's specific point of view",
    ],
    relevantServices: [
      { slug: "visual-identity", why: "For a design-led business, visual identity consistency is itself a credibility signal." },
      { slug: "business-websites", why: "A portfolio site needs to be as considered as the projects it presents: pacing, photography and layout all matter." },
      { slug: "content-production", why: "Explaining process and project stories builds trust beyond the finished photographs alone." },
      { slug: "brand-strategy", why: "Clear positioning helps attract the specific type of client and project the studio actually wants." },
      { slug: "social-media-management", why: "Visually-driven platforms are a natural extension of a portfolio-first business." },
    ],
    outcomes: ["A portfolio presented at the level of the work", "Stronger client-project fit", "Clearer process perception", "Higher-quality enquiry volume"],
    approach: [
      { phase: "Discover", description: "Understand the studio's design point of view and the type of client and project it wants more of." },
      { phase: "Audit", description: "Review the current portfolio presentation against the actual quality of the work." },
      { phase: "Strategize", description: "Define how the portfolio and process should be presented to reflect the studio's actual standard." },
      { phase: "Execute", description: "Build the portfolio site and supporting content with design quality treated as non-negotiable." },
      { phase: "Optimize", description: "Update the portfolio and content as new projects complete, keeping the presentation current." },
    ],
    ecosystem: ["Discovery", "Portfolio Website", "Process Content", "Consultation Request", "Engagement", "Referral Loop"],
    transformation: { before: "A portfolio that undersells the work.", after: "A portfolio judged at the level of the work itself." },
    faqs: [
      { q: "How important is the website compared to word-of-mouth referrals?", a: "Even referral-driven clients typically check the website before reaching out. It either reinforces or undermines the recommendation they already received." },
      { q: "Should every project be included in the portfolio?", a: "Usually not. A smaller, well-curated set that reflects the studio's actual direction tends to build more confidence than an exhaustive, uneven archive." },
      { q: "Does this include photography of the projects themselves?", a: "GraphikosX works with existing project photography and can advise on presentation, though arranging new professional photography is typically a separate, project-specific consideration." },
      { q: "How does this differ from a generic portfolio template?", a: "A generic template treats every studio the same; this is built around the specific point of view and project types that particular studio wants to attract." },
    ],
    ctaHeadline: "Audit Your Studio's Portfolio Presence",
    ctaSupportingCopy: "Get a free audit of how your current portfolio presents the actual quality of your work.",
    metaTitle: "Digital Presence for Architecture & Interior | GraphikosX",
    metaDescription: "GraphikosX helps architecture and interior design studios present their portfolio and process with the same design quality as the work itself.",
  },

  "automotive-ev": {
    slug: "automotive-ev",
    visualStyle: "kinetic",
    eyebrow: "The Showroom Buyers Expect Today",
    headline: "Build the digital showroom buyers actually expect.",
    heroApproach:
      "GraphikosX approaches automobile and EV dealerships around how thoroughly buyers now research vehicles online before ever visiting in person: the digital presence is built as a genuine showroom, not an afterthought to the physical one.",
    aeoAnswer:
      "GraphikosX helps automobile and EV dealerships by building a digital showroom: clear specifications, comparison-ready content and a responsive enquiry process, so buyers who have already researched extensively online arrive at the dealership already leaning toward a decision.",
    challenges: [
      { title: "Outdated Digital Showroom", description: "The website often doesn't reflect current inventory or specifications clearly, forcing a buyer to visit in person just to get information that should already be online." },
      { title: "Specification & Comparison Content Gaps", description: "Buyers want to compare models and specifications online before ever visiting, and that content is frequently missing or thin." },
      { title: "EV-Specific Research Burden", description: "EV buyers tend to research even more heavily than combustion buyers, given the category is still newer to many of them, and clear answers are often hard to find." },
      { title: "Slow Enquiry Follow-Up", description: "A buyer actively comparing dealerships is usually enquiring with more than one at the same time, and slow follow-up quietly loses that comparison." },
      { title: "Local & Model-Specific Search Visibility", description: "Dealerships are often invisible for the exact model and location searches their buyers are actively using." },
    ],
    buyerJourney: ["Research", "Specification Comparison", "Reviews", "Dealership Visit", "Purchase Decision"],
    buyerJourneyNote:
      "Vehicle buyers typically research extensively online first, comparing specifications and reading reviews, before ever visiting a dealership, meaning much of the purchase decision is already shaped before an in-person conversation happens.",
    trustSignals: [
      "Clear, accurate vehicle specifications and comparisons",
      "Transparent pricing and process information where applicable",
      "Genuine customer reviews",
      "A modern, easy-to-navigate digital showroom",
      "Responsive handling of online enquiries",
    ],
    relevantServices: [
      { slug: "business-websites", why: "A modern digital showroom is what buyers now expect before ever visiting in person." },
      { slug: "seo", why: "Model and specification-based searches capture buyers early in their research." },
      { slug: "content-production", why: "Comparison and specification content supports the research stage buyers are already doing." },
      { slug: "lead-generation-systems", why: "A structured enquiry pipeline ensures interest is followed up quickly, before a buyer moves to a competitor." },
      { slug: "crm-integration", why: "Tracking enquiries through a longer consideration cycle prevents leads from going cold." },
      { slug: "social-media-management", why: "Visibility for new launches and offers supports both awareness and consideration." },
    ],
    outcomes: ["A stronger digital showroom presence", "Better-qualified enquiries", "Higher visibility for model-specific searches", "Faster enquiry response"],
    approach: [
      { phase: "Discover", description: "Understand the dealership's inventory, brand relationships and typical buyer profile." },
      { phase: "Audit", description: "Review the current website, specification content and enquiry handling for gaps." },
      { phase: "Strategize", description: "Prioritize the digital showroom features and content that matter most for this dealership's inventory." },
      { phase: "Execute", description: "Build out the website, content and enquiry pipeline with responsiveness as a priority." },
      { phase: "Optimize", description: "Track enquiry response times and conversion, adjusting as inventory and offers change." },
    ],
    ecosystem: ["Research", "Digital Showroom (Website)", "Specification Content", "Enquiry", "CRM / Follow-Up", "Dealership Visit"],
    transformation: { before: "A showroom buyers visit to get basic information.", after: "A digital showroom that's already done the persuading." },
    faqs: [
      { q: "How important is the website compared to the physical dealership?", a: "Increasingly central. Most buyers form a strong opinion before ever visiting, meaning the website is often doing more of the persuasion than the showroom floor." },
      { q: "Does SEO work for local dealerships?", a: "Yes, particularly for model and location-specific searches, which capture buyers who are actively comparing dealerships in their area." },
      { q: "How quickly should online enquiries be followed up?", a: "As quickly as realistically possible, since buyers actively comparing vehicles are often enquiring with more than one dealership at the same time." },
      { q: "Does this apply to EV dealerships specifically?", a: "Yes. EV buyers tend to research even more extensively given the category is newer to many buyers, making clear, accurate information especially important." },
    ],
    ctaHeadline: "Audit Your Dealership's Digital Showroom",
    ctaSupportingCopy: "Get a free audit of how your dealership's digital showroom currently compares to buyer expectations.",
    metaTitle: "Digital Presence for Automobile & EV Dealers | GraphikosX",
    metaDescription: "GraphikosX helps automobile and EV dealerships build a digital showroom with specs, comparison content and fast enquiry follow-up for research-heavy buyers.",
  },
};
