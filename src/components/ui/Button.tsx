"use client";

import Link from "next/link";
import clsx from "clsx";
import { ReactNode, Ref } from "react";
import { useMagneticHover } from "@/components/motion/useMagneticHover";

type Variant = "primary" | "secondary" | "ghost";

/**
 * Phase 3, item 1 — every Button (and therefore every nav CTA, since
 * `Header.tsx`'s "Get a Free Audit" buttons already render this same shared
 * component) gets a magnetic pull toward the cursor via `useMagneticHover`.
 * See that hook for the full perf/gating discipline. This also makes
 * Button a Client Component ("use client") for the first time — it's a
 * leaf UI primitive used only inside JSX trees, so this is safe; no page
 * depends on it being server-rendered.
 *
 * `data-cursor="button"` is a static marker (zero runtime cost, present in
 * the server-rendered HTML too) that Phase 3 item 2's `CursorState.tsx`
 * reads via delegated `pointerover` to show the "hovering a button" cursor
 * state, distinct from a plain link.
 */
export function Button({
  href,
  children,
  variant = "primary",
  className,
  onClick,
  type = "button",
  disabled = false,
  external = false,
}: {
  href?: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  external?: boolean;
}) {
  const magneticRef = useMagneticHover<HTMLAnchorElement | HTMLButtonElement>();
  const base = clsx(
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-all duration-300 ease-out",
    disabled && "pointer-events-none opacity-50"
  );
  const styles: Record<Variant, string> = {
    primary: "bg-ink text-paper hover:bg-accent hover:text-paper",
    secondary: "border border-ink/20 text-ink hover:border-accent hover:text-accent",
    ghost: "text-ink/80 hover:text-accent",
  };

  const content = (
    <>
      <span>{children}</span>
      <span aria-hidden className="inline-block translate-x-0 transition-transform duration-300 ease-out group-hover:translate-x-1">
        →
      </span>
    </>
  );

  if (href) {
    return (
      <Link
        ref={magneticRef as Ref<HTMLAnchorElement>}
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        data-cursor="button"
        className={clsx(base, styles[variant], className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={magneticRef as Ref<HTMLButtonElement>}
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-cursor="button"
      className={clsx(base, styles[variant], className)}
    >
      {content}
    </button>
  );
}
