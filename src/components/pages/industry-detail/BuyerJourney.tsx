"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CursorAtmosphere } from "@/components/motion/CursorAtmosphere";
import type { IndustryDetail } from "@/lib/data/industry-details";

export function BuyerJourney({ detail }: { detail: IndustryDetail }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-grey-100 py-16 md:py-24">
      <CursorAtmosphere tone="light" />
      <Container className="relative">
        <SectionHeader eyebrow="How Buyers Decide" title="The buying journey in this industry." description={detail.buyerJourneyNote} />

        <div className="relative mt-14">
          <svg viewBox="0 0 1000 40" className="absolute inset-x-0 top-6 hidden w-full sm:block" preserveAspectRatio="none" aria-hidden>
            <motion.path
              d={`M 40 20 ${detail.buyerJourney.slice(1).map((_, i) => `L ${40 + ((i + 1) * 920) / (detail.buyerJourney.length - 1)} 20`).join(" ")}`}
              fill="none"
              stroke="#1D4ED8"
              strokeWidth="2"
              strokeDasharray="1 10"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: shouldReduceMotion ? 0 : 1.2, ease: "easeInOut" }}
            />
          </svg>

          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-5">
            {detail.buyerJourney.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: shouldReduceMotion ? 0 : i * 0.12 }}
                className="flex flex-row items-center gap-3 sm:flex-col sm:items-center sm:text-center"
              >
                <span className="font-numeric flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-bold text-paper ring-4 ring-grey-100">
                  {i + 1}
                </span>
                <p className="font-display text-sm font-bold text-ink">{step}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
