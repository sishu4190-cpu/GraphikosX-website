"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = "div",
  tabIndex,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /**
   * Element Reveal renders as. Defaults to "div". Use "li" when Reveal
   * itself is the direct child of a <ul>/<ol> — wrapping an <li> in a
   * motion.div instead breaks the list/listitem parent-child relationship
   * assistive tech relies on (WCAG 1.3.1 / axe "list"/"listitem" rules).
   */
  as?: "div" | "li";
  /** Optional — forwarded when Reveal's own element is the interactive/focusable one (e.g. a hoverable row), rather than a link/button nested inside it. */
  tabIndex?: number;
}) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = as === "li" ? motion.li : motion.div;

  return (
    <MotionTag
      className={className}
      tabIndex={tabIndex}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: shouldReduceMotion ? 0 : 0.6, delay: shouldReduceMotion ? 0 : delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </MotionTag>
  );
}
