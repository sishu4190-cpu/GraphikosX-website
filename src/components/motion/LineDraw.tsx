"use client";

import { motion, useReducedMotion } from "framer-motion";

/** A thin horizontal accent line that draws in on scroll — used as a light,
 * non-3D GX-inspired motif to separate sections on inner pages. */
export function LineDraw({ className = "" }: { className?: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`block h-px bg-accent ${className}`}
      initial={{ scaleX: shouldReduceMotion ? 1 : 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      style={{ transformOrigin: "left" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.7, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}
