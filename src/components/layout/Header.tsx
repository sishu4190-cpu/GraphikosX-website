"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { company, primaryNav } from "@/lib/data/company";
import { freeAuditHref } from "@/lib/freeAuditUrl";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Single threshold drives both the glass background AND the height
    // reduction together — one state, no separate "scrolling down" vs
    // "scrolled" listeners fighting each other. Returns smoothly to the
    // original transparent/full-height state near the top.
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-[background-color,backdrop-filter,border-color] duration-300 ease-out ${
        scrolled ? "border-ink/10 bg-paper/90 backdrop-blur-md" : "border-transparent bg-transparent"
      }`}
    >
      <Container
        className={`flex items-center justify-between transition-[height] duration-300 ease-out ${
          scrolled ? "h-16" : "h-20"
        }`}
      >
        <Link href="/" className="flex items-center gap-3" aria-label="GraphikosX — Home">
          {/*
            Logo mark sized up ~20–30% over the previous h-10/h-11 render size
            (40px → 48px mobile, 44px → 56px desktop) so the GX symbol reads
            with real presence in the navbar. Intrinsic width/height bumped to
            match (same 1.2727 aspect ratio as the source asset) so next/image
            still serves a crisp asset at the larger display size — the PNG
            itself is untouched, only the render size changed.
          */}
          <Image
            src="/brand/graphikosx-logo.png"
            alt="GraphikosX"
            width={178}
            height={140}
            priority
            className={`w-auto shrink-0 transition-[height] duration-300 ease-out ${scrolled ? "h-10 md:h-12" : "h-12 md:h-14"}`}
          />
          <span className="hidden font-display text-xl font-extrabold tracking-[-0.01em] text-ink sm:inline">
            GRAPHIKOS<span className="text-accent">X</span>
          </span>
        </Link>

        {/*
          Breakpoint moved from md (768px) to lg (1024px) for the full
          desktop nav: the larger logo/wordmark made the previous md
          threshold too tight — nav links, the button and the wordmark
          started overlapping on tablet widths (768–1023px). Kept at lg even
          after the navbar WhatsApp icon (Phase 2G refinement, spec item 15)
          was removed below — the logo/wordmark size is what actually needed
          the extra room, not the icon, so reverting this would risk
          reintroducing that overlap without benefit. Below lg, the
          hamburger menu (also switched to lg:hidden below) takes over, same
          as it already did below md before.
        */}
        <nav className="hidden items-center gap-8 lg:flex">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-ink/80 transition-colors hover:text-ink after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:w-0 after:bg-accent after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Navbar WhatsApp icon removed per Phase 2G refinement spec item 15
            — navbar returns to logo / nav / Get a Free Audit only. The
            floating WhatsApp button (FloatingWhatsApp.tsx, mounted once in
            layout.tsx) is unaffected and remains the site's WhatsApp entry
            point, still reading from the same centralized
            company.whatsappNumber/whatsappLink() config. */}
        <div className="hidden items-center gap-4 lg:flex">
          <Button href={freeAuditHref({ source: "header" })} variant="primary" className="!py-2.5">
            Get a Free Audit
          </Button>
        </div>

        <button
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 lg:hidden"
        >
          <span className="sr-only">Menu</span>
          <div className="space-y-1.5">
            <span className={`block h-[1.5px] w-5 bg-ink transition-transform ${open ? "translate-y-[3px] rotate-45" : ""}`} />
            <span className={`block h-[1.5px] w-5 bg-ink transition-transform ${open ? "-translate-y-[3px] -rotate-45" : ""}`} />
          </div>
        </button>
      </Container>

      {open && (
        <div className="border-t border-ink/10 bg-paper lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-medium text-ink hover:bg-grey-100"
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2">
              <Button href={freeAuditHref({ source: "header-mobile" })} variant="primary" className="w-full justify-center">
                Get a Free Audit
              </Button>
            </div>
            <a href={`tel:${company.phoneE164}`} className="mt-2 px-2 text-sm text-grey-700">
              {company.phoneDisplay}
            </a>
          </Container>
        </div>
      )}
    </header>
  );
}
