"use client";

import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { company, whatsappLink } from "@/lib/data/company";
import { track } from "@/lib/analytics/track";

const eventMap = {
  whatsapp: "whatsapp_clicked",
  phone: "phone_clicked",
  email: "email_clicked",
} as const;

const channels = [
  {
    id: "whatsapp" as const,
    label: "WhatsApp",
    value: company.phoneDisplay,
    href: whatsappLink("Hi GraphikosX, I'd like to get in touch."),
    icon: (
      <path d="M12 2a10 10 0 00-8.6 15.1L2 22l5.1-1.3A10 10 0 1012 2z" stroke="currentColor" strokeWidth="1.6" fill="none" />
    ),
  },
  {
    id: "phone" as const,
    label: "Call",
    value: company.phoneDisplay,
    href: `tel:${company.phoneE164}`,
    icon: (
      <path
        d="M4 4h4l2 5-2.5 1.5a12 12 0 006 6L15 14l5 2v4a2 2 0 01-2 2C9.5 22 2 14.5 2 6a2 2 0 012-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
        strokeLinejoin="round"
      />
    ),
  },
  {
    id: "email" as const,
    label: "Email",
    value: company.salesEmail,
    href: `mailto:${company.salesEmail}`,
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" fill="none" />
        <path d="M4 7l8 6 8-6" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </>
    ),
  },
];

export function ContactChannels() {
  return (
    <section className="relative overflow-hidden bg-paper pb-16 md:pb-20">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <div className="grid gap-4 sm:grid-cols-3">
          {channels.map((channel, i) => (
            <Reveal key={channel.id} delay={i * 0.08}>
              <GlowCard tone="light" className="h-full rounded-2xl border border-ink/10 bg-grey-100/60 p-0">
                <a
                  href={channel.href}
                  onClick={() => track(eventMap[channel.id])}
                  target={channel.id === "whatsapp" ? "_blank" : undefined}
                  rel={channel.id === "whatsapp" ? "noopener noreferrer" : undefined}
                  className="group flex h-full flex-col justify-between p-6"
                >
                  <span aria-hidden className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper transition-colors duration-200 group-hover:bg-accent">
                    <svg viewBox="0 0 24 24" className="h-5 w-5">
                      {channel.icon}
                    </svg>
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-grey-500">{channel.label}</p>
                    <p className="mt-1 font-display text-lg font-bold text-ink">{channel.value}</p>
                  </div>
                </a>
              </GlowCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
