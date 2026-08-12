"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";
import { motion, useReducedMotion } from "framer-motion";

interface Point {
  x: number;
  y: number;
}

/**
 * Measures the real DOM position of a "hub" element and a set of "target"
 * elements relative to a shared container, so connector lines can be drawn
 * with genuine geometry (not guessed grid math) and stay correct across
 * breakpoints, font-loading reflow, and window resizes.
 */
function useConnectorGeometry(
  containerRef: RefObject<HTMLElement | null>,
  hubRef: RefObject<HTMLElement | null>,
  targetRefs: RefObject<(HTMLElement | null)[]>
) {
  const [hub, setHub] = useState<Point | null>(null);
  const [targets, setTargets] = useState<Point[]>([]);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      const hubEl = hubRef.current;
      if (!container || !hubEl) return;

      const containerRect = container.getBoundingClientRect();
      setSize({ width: containerRect.width, height: containerRect.height });

      const hubRect = hubEl.getBoundingClientRect();
      setHub({
        x: hubRect.left - containerRect.left + hubRect.width / 2,
        y: hubRect.top - containerRect.top,
      });

      const points = (targetRefs.current ?? [])
        .filter((el): el is HTMLElement => Boolean(el))
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top + rect.height,
          };
        });
      setTargets(points);
    };

    measure();

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", measure);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [containerRef, hubRef, targetRefs]);

  return { hub, targets, size };
}

/**
 * Draws animated connector lines from a hub element to each of a set of
 * target elements — the "GraphikosX connects the pieces" hub-box effect.
 * Lines draw in sequentially (staggered) when `active` becomes true and
 * retract when it becomes false. A small pulsing dot travels along each
 * active line to read as "energy", not just a static line appearing.
 */
export function HubConnectors({
  containerRef,
  hubRef,
  targetRefs,
  active,
}: {
  containerRef: RefObject<HTMLElement | null>;
  hubRef: RefObject<HTMLElement | null>;
  targetRefs: RefObject<(HTMLElement | null)[]>;
  active: boolean;
}) {
  const shouldReduceMotion = useReducedMotion();
  const { hub, targets, size } = useConnectorGeometry(containerRef, hubRef, targetRefs);

  if (!hub || targets.length === 0 || size.width === 0) return null;

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      width={size.width}
      height={size.height}
      viewBox={`0 0 ${size.width} ${size.height}`}
      aria-hidden
    >
      {targets.map((point, i) => (
        <g key={i}>
          <motion.line
            x1={hub.x}
            y1={hub.y}
            x2={point.x}
            y2={point.y}
            stroke="var(--gx-blue)"
            strokeWidth={1.5}
            strokeLinecap="round"
            initial={false}
            animate={active ? { pathLength: 1, opacity: 0.85 } : { pathLength: 0, opacity: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.55,
              delay: shouldReduceMotion || !active ? 0 : i * 0.1,
              ease: [0.22, 1, 0.36, 1],
            }}
          />
          {active && !shouldReduceMotion && (
            <motion.circle
              r={3}
              fill="var(--gx-blue-bright)"
              initial={{ opacity: 0 }}
              animate={{
                cx: [hub.x, point.x],
                cy: [hub.y, point.y],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.1,
                delay: i * 0.1 + 0.4,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: "easeInOut",
              }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}
