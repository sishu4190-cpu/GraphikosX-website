"use client";

import { useCallback, useEffect, useRef } from "react";
import type { FocusEvent, MouseEvent, ReactNode, PointerEvent as ReactPointerEvent } from "react";

type Tone = "light" | "dark";

interface GlowCardProps {
  /** light = diffused blue glow (light backgrounds). dark = diffused white glow + blue accent ring (dark backgrounds). */
  tone?: Tone;
  className?: string;
  children: ReactNode;
  /**
   * Makes the card keyboard-focusable even when it contains no natively
   * focusable element, so the hover glow has a real keyboard equivalent
   * (WCAG 2.1.1). Leave false when the card already contains a link/button —
   * double focus stops on the same card would hurt keyboard navigation more
   * than it helps.
   */
  focusable?: boolean;
  /** Optional escape hatch so a parent can measure/position relative to this
   * card's DOM node (e.g. the hub-connector geometry in DigitalPresenceProblem). */
  elementRef?: (el: HTMLElement | null) => void;
  /** Optional pass-through interaction handlers, merged alongside the glow's
   * own pointer handlers — e.g. the hub box additionally triggers connector
   * lines on hover/focus/tap. */
  onMouseEnter?: (event: MouseEvent) => void;
  onMouseLeave?: (event: MouseEvent) => void;
  onFocus?: (event: FocusEvent) => void;
  onBlur?: (event: FocusEvent) => void;
  onClick?: (event: MouseEvent) => void;
}

/**
 * Shared "unified card motion grammar" primitive — the single reusable
 * implementation behind every homepage hover-glow card (Real Problem,
 * Authority/Visibility/Trust, Philosophy, Why GraphikosX, Build/Grow/Scale
 * rows). Rather than each section wiring its own mousemove listener, every
 * card mounts one instance of this component, which:
 *   - Tracks pointer position and writes it to CSS custom properties
 *     (--gx-glow-x/--gx-glow-y) via requestAnimationFrame, throttled to one
 *     write per frame, directly on the DOM node (no React re-render per
 *     mousemove).
 *   - Cancels the pending rAF and clears the tap timeout on unmount so nothing
 *     leaks.
 *   - Provides the mobile/touch equivalent (tap sets the glow position and
 *     holds it briefly) since hover doesn't exist on touch devices.
 *   - Keyboard equivalent is handled entirely in CSS (:focus-within /
 *     :focus-visible in globals.css) — no JS needed for that path.
 */
export function GlowCard({
  tone = "light",
  className = "",
  children,
  focusable = false,
  elementRef,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  onClick,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafId = useRef<number | null>(null);
  const tapTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setRef = useCallback(
    (el: HTMLDivElement | null) => {
      ref.current = el;
      elementRef?.(el);
    },
    [elementRef]
  );

  const writeGlowPosition = useCallback((x: number, y: number) => {
    const el = ref.current;
    if (!el) return;
    if (rafId.current !== null) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(() => {
      el.style.setProperty("--gx-glow-x", `${x}px`);
      el.style.setProperty("--gx-glow-y", `${y}px`);
    });
  }, []);

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent) => {
      if (event.pointerType === "touch") return; // touch uses handlePointerDown below
      const rect = event.currentTarget.getBoundingClientRect();
      writeGlowPosition(event.clientX - rect.left, event.clientY - rect.top);
      ref.current?.classList.add("is-glowing");
    },
    [writeGlowPosition]
  );

  const handlePointerLeave = useCallback(() => {
    ref.current?.classList.remove("is-glowing");
  }, []);

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent) => {
      if (event.pointerType !== "touch") return;
      const rect = event.currentTarget.getBoundingClientRect();
      writeGlowPosition(event.clientX - rect.left, event.clientY - rect.top);
      ref.current?.classList.add("is-glowing");
      if (tapTimeout.current) clearTimeout(tapTimeout.current);
      tapTimeout.current = setTimeout(() => ref.current?.classList.remove("is-glowing"), 1600);
    },
    [writeGlowPosition]
  );

  useEffect(
    () => () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current);
      if (tapTimeout.current) clearTimeout(tapTimeout.current);
    },
    []
  );

  return (
    <div
      ref={setRef}
      className={`gx-card ${tone === "dark" ? "gx-card--dark" : ""} ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      onClick={onClick}
      tabIndex={focusable ? 0 : undefined}
    >
      <div className="gx-card-content">{children}</div>
    </div>
  );
}
