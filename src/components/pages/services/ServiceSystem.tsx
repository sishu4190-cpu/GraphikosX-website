"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { GlowCard } from "@/components/motion/GlowCard";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import { services, serviceGroups, type ServiceGroup } from "@/lib/data/services";

const groups: ServiceGroup[] = ["Build", "Grow", "Scale"];

export function ServiceSystem() {
  const [active, setActive] = useState<ServiceGroup>("Build");

  return (
    <section className="relative overflow-hidden bg-grey-100 py-20 md:py-28">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        {/* Progression indicator — always visible, ties the three stages together */}
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {groups.map((group, i) => (
            <div key={group} className="flex items-center gap-3 sm:gap-6">
              <button
                onClick={() => setActive(group)}
                aria-pressed={active === group}
                className={`rounded-full px-5 py-2.5 font-display text-sm font-bold uppercase tracking-wide transition-all duration-300 sm:px-7 sm:py-3 sm:text-base ${
                  active === group ? "bg-ink text-paper" : "bg-white text-grey-500 hover:text-ink"
                }`}
              >
                {group}
              </button>
              {i < groups.length - 1 && <span className="text-accent">&rarr;</span>}
            </div>
          ))}
        </div>

        {/*
          All three groups render in the actual HTML at all times — only CSS
          visibility toggles with the active tab. This keeps every one of the
          15 services present in server-rendered, crawlable markup (required
          for SEO/AEO/GEO) rather than mounted only after a client-side click.
        */}
        {groups.map((group) => {
          const isActive = group === active;
          const description = serviceGroups.find((g) => g.group === group)?.description;
          return (
            <div key={group} className={isActive ? "block" : "hidden"} aria-hidden={!isActive}>
              <p className="mx-auto mt-6 max-w-xl text-center text-sm text-grey-600">{description}</p>

              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services
                  .filter((s) => s.group === group)
                  .map((service) => (
                    <GlowCard key={service.slug} tone="light" className="rounded-xl border border-ink/10 bg-white p-0">
                      <div className="flex h-full flex-col p-6">
                        <p className="font-display text-base font-bold text-ink">{service.name}</p>
                        <p className="mt-2 text-sm leading-relaxed text-grey-700">{service.summary}</p>
                        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-accent">Business Outcome</p>
                        <p className="text-sm text-grey-700">{service.outcome}</p>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-accent">Who Needs This</p>
                        <p className="text-sm text-grey-700">{service.audience}</p>
                        <Link
                          href={`/services/${service.slug}`}
                          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-ink hover:text-accent"
                        >
                          Learn more <span aria-hidden>&rarr;</span>
                        </Link>
                      </div>
                    </GlowCard>
                  ))}
              </div>
            </div>
          );
        })}
      </Container>
    </section>
  );
}
