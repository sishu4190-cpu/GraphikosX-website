import Link from "next/link";
import clsx from "clsx";
import { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

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
        href={href}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={clsx(base, styles[variant], className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} disabled={disabled} className={clsx(base, styles[variant], className)}>
      {content}
    </button>
  );
}
