"use client";

import Image from "next/image";
import Link from "next/link";
import { company, primaryNav, whatsappLink } from "@/lib/data/company";
import { track } from "@/lib/analytics/track";
import { Container } from "@/components/ui/Container";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { LinkedInIcon } from "@/components/ui/LinkedInIcon";

export function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <Container className="grid gap-12 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          {/* Logo is black by design — shown on a light plate rather than recolored, so the
              official artwork is never altered to fit a dark background. */}
          <div className="inline-flex items-center gap-3 rounded-xl bg-paper px-4 py-3">
            <Image src="/brand/graphikosx-logo.png" alt="GraphikosX" width={122} height={96} className="h-8 w-auto" />
            <span className="font-display text-base font-extrabold tracking-tight text-ink">
              GRAPHIKOS<span className="text-accent">X</span>
            </span>
          </div>
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-grey-300">{company.description}</p>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">Navigate</p>
          <ul className="space-y-2 text-sm">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-grey-300 transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">Direct Line</p>
          <ul className="space-y-2 text-sm">
            <li>
              <a href={`tel:${company.phoneE164}`} onClick={() => track("phone_clicked", { source: "footer" })} className="text-grey-300 transition-colors hover:text-accent">
                {company.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={whatsappLink("Hello GraphikosX, I'd like to talk about my business.")} onClick={() => track("whatsapp_clicked", { source: "footer" })} target="_blank" rel="noopener noreferrer" className="text-grey-300 transition-colors hover:text-accent">
                WhatsApp
              </a>
            </li>
            <li>
              <a href={`mailto:${company.salesEmail}`} onClick={() => track("email_clicked", { source: "footer" })} className="text-grey-300 transition-colors hover:text-accent">
                {company.salesEmail}
              </a>
            </li>
            <li>
              <a href={company.instagramUrl} className="text-grey-300 transition-colors hover:text-accent">
                {company.instagramHandle}
              </a>
            </li>
          </ul>
        </div>
      </Container>

      {/* Founder social links (Phase 2G refinement, spec item 17) — kept as
          its own thin strip rather than folded into "Direct Line" above,
          since that column is already the business's own contact channels
          (including the business Instagram, company.instagramUrl) and these
          two are specifically the founder's personal profiles
          (company.founder.instagramUrl/linkedinUrl). Existing footer
          content/layout above is otherwise untouched. */}
      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-grey-500">Follow the Founder</p>
          <div className="flex items-center gap-3">
            <a
              href={company.founder.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${company.founder.name} on Instagram`}
              onClick={() => track("founder_instagram_clicked", { source: "footer" })}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-grey-300 transition-all duration-300 hover:scale-110 hover:border-accent/50 hover:text-accent"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href={company.founder.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${company.founder.name} on LinkedIn`}
              onClick={() => track("founder_linkedin_clicked", { source: "footer" })}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-grey-300 transition-all duration-300 hover:scale-110 hover:border-accent/50 hover:text-accent"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
          </div>
        </Container>
      </div>

      <div className="border-t border-white/10 py-6">
        <Container className="flex flex-col items-center justify-between gap-2 text-xs text-grey-500 md:flex-row">
          <p>&copy; {new Date().getFullYear()} GraphikosX · Founded by {company.founder.name}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-accent">Privacy</Link>
            <Link href="/terms" className="hover:text-accent">Terms</Link>
          </div>
        </Container>
      </div>
    </footer>
  );
}
