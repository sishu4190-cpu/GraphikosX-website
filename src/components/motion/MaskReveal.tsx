"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

const MOTION_TAGS = {
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  p: motion.p,
  span: motion.span,
} as const;

type TagName = keyof typeof MOTION_TAGS;

/**
 * A clip-path "mask wipe" reveal for large editorial headlines on inner
 * pages — the lighter, GX-inspired alternative to the homepage's 3D moment.
 * Pure transform/clip-path, no WebGL, respects prefers-reduced-motion.
 */
export function MaskReveal({
  children,
  as = "div",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: TagName;
  delay?: number;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = MOTION_TAGS[as];

  return (
    <MotionTag
      className={className}
      initial={{ clipPath: shouldReduceMotion ? "inset(0 0 0 0)" : "inset(0 0 100% 0)", opacity: shouldReduceMotion ? 1 : 0.001 }}
      animate={{ clipPath: "inset(0 0 0% 0)", opacity: 1 }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.9, delay: shouldReduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
