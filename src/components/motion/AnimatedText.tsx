"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * ONE reusable homepage text-motion system, reused by every section instead
 * of bespoke per-section text animation. Hierarchy, per spec:
 *   EYEBROW -> HEADLINE -> DESCRIPTION -> CTA -> supporting elements.
 * Every piece triggers once when it enters the viewport (`whileInView` +
 * `viewport: { once: true }`) — nothing here replays while the user is
 * simply reading, and everything collapses to an instant, static end-state
 * under prefers-reduced-motion.
 */

const EASE = [0.22, 1, 0.36, 1] as const;

const HEADLINE_TAGS = { h1: motion.h1, h2: motion.h2, h3: motion.h3 } as const;
type HeadlineTag = keyof typeof HEADLINE_TAGS;

/** EYEBROW — fade-up with a very subtle blur-to-sharp transition. */
export function EyebrowReveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 8, filter: shouldReduceMotion ? "blur(0px)" : "blur(5px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.p>
  );
}

/**
 * HEADLINE — masked, word-by-word staggered reveal (each word slides up out
 * of an overflow-hidden mask — a clip-path-equivalent reveal per word).
 * `lines` lets callers keep manual line breaks (e.g. a two-line hero
 * headline) without losing per-word stagger across the whole heading.
 * Screen readers get the full heading text once via `aria-label`; the
 * per-word markup is `aria-hidden`.
 *
 * Implementation note: viewport tracking (`whileInView`/`viewport`) lives on
 * the OUTER heading element only; each word's reveal is driven by Framer
 * Motion variant propagation + `staggerChildren`, not by its own
 * `whileInView`. A per-word `whileInView` was the first approach and doesn't
 * work: each word's target element sits inside its own overflow-hidden mask
 * wrapper (that's the mask the word slides out of), and before it animates
 * in it's positioned fully outside that wrapper's visible box — Chrome's
 * IntersectionObserver factors in ancestor clipping when computing
 * intersection, so a fully-clipped target never reports as intersecting and
 * the reveal never fires. Tracking intersection on the unclipped heading
 * element instead sidesteps that failure mode entirely.
 */
export function HeadlineReveal({
  lines,
  as = "h2",
  className = "",
  delay = 0,
  wordStagger = 0.03,
}: {
  lines: string[];
  as?: HeadlineTag;
  className?: string;
  delay?: number;
  /** Seconds between each word's reveal. Spec range: 20-40ms. */
  wordStagger?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = HEADLINE_TAGS[as];

  // IMPORTANT: this always renders the exact same word-span DOM structure
  // regardless of `shouldReduceMotion` — only the animation prop VALUES
  // below differ (matching the pattern every other primitive in this file
  // already uses). `useReducedMotion()` resolves to `false` during SSR and
  // the very first client render, then updates after mount — an early
  // `return` here with a *different* tree (plain text vs. nested spans)
  // reads as mismatched text content between server and client and throws
  // a hydration error (found and fixed during this pass — see CHANGELOG).
  // Keeping one structure and only swapping prop values hydrates safely.
  const wordVariants = {
    hidden: { y: shouldReduceMotion ? "0%" : "115%", opacity: shouldReduceMotion ? 1 : 0 },
    visible: { y: "0%", opacity: 1, transition: { duration: shouldReduceMotion ? 0 : 0.6, ease: EASE } },
  };

  return (
    <MotionTag
      className={className}
      aria-label={lines.join(" ")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={{
        hidden: {},
        visible: { transition: { delayChildren: shouldReduceMotion ? 0 : delay, staggerChildren: shouldReduceMotion ? 0 : wordStagger } },
      }}
    >
      {lines.map((line, li) => {
        const words = line.split(" ");
        return (
          <span key={li} className="block" aria-hidden>
            {words.map((word, wi) => (
              // Word spacing is a margin on the (non-clipped) outer wrapper,
              // not a literal trailing space character inside the
              // overflow-hidden/inline-block mask — a trailing space as the
              // last character inside an inline-block box gets silently
              // collapsed away by normal CSS whitespace rules, which read as
              // "words with no gaps between them".
              <span
                key={wi}
                className={`inline-block overflow-hidden pb-[0.1em] align-top ${wi < words.length - 1 ? "mr-[0.28em]" : ""}`}
              >
                <motion.span className="inline-block" variants={wordVariants}>
                  {word}
                </motion.span>
              </span>
            ))}
          </span>
        );
      })}
    </MotionTag>
  );
}

/** DESCRIPTION — plain fade-up with a slight delay (paragraphs sit behind
 * the headline in the reveal sequence). Thin wrapper so call sites read
 * consistently alongside Eyebrow/Headline/CTA even though the mechanics are
 * shared with the general-purpose `Reveal` primitive. */
export function DescriptionReveal({
  children,
  className = "",
  delay = 0.15,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.p
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.p>
  );
}

/** CTA — fade-up + a subtle scale from ~0.98 -> 1, last in the reveal
 * sequence. Wrap a button/CTA row (or any supporting element) with this. */
export function CTAReveal({
  children,
  className = "",
  delay = 0.3,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 14, scale: shouldReduceMotion ? 1 : 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.55, delay: shouldReduceMotion ? 0 : delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Blue-highlighted words: ONE subtle gradient light sweep across the text,
 * once, after the headline reveals — not a looping shimmer. Implemented as
 * a background-clip:text gradient whose position framer-motion animates
 * from off-screen-right to off-screen-left exactly once when in view.
 */
export function ShineText({
  children,
  className = "",
  delay = 0.5,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.span
      className={`gx-shine ${className}`}
      initial={{ backgroundPosition: "150% 0" }}
      whileInView={shouldReduceMotion ? { backgroundPosition: "0% 0" } : { backgroundPosition: ["150% 0", "-50% 0"] }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 1.1, delay: shouldReduceMotion ? 0 : delay, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}
