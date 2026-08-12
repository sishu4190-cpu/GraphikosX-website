import clsx from "clsx";
import { EyebrowReveal, HeadlineReveal, DescriptionReveal } from "@/components/motion/AnimatedText";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  tone = "light",
  /**
   * Opt-in only — defaults to `false` so every existing call site (inner
   * pages under `components/pages/**`) keeps its exact previous static
   * markup/behavior untouched. The homepage section components under
   * `components/sections/**` pass `animate` explicitly to get the shared
   * eyebrow -> headline(word-stagger) -> description entrance sequence from
   * `AnimatedText.tsx` — the "ONE reusable text-animation system" reused
   * across the homepage instead of a bespoke reveal per section.
   */
  animate = false,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  animate?: boolean;
}) {
  if (!animate) {
    return (
      <div className={clsx("max-w-3xl", align === "center" && "mx-auto text-center")}>
        {eyebrow && (
          <p className={clsx("mb-3 text-xs font-semibold uppercase tracking-[0.2em]", tone === "dark" ? "text-accent" : "text-accent")}>
            {eyebrow}
          </p>
        )}
        <h2 className={clsx("font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl", tone === "dark" ? "text-paper" : "text-ink")}>
          {title}
        </h2>
        {description && (
          <p className={clsx("mt-4 text-base leading-relaxed md:text-lg", tone === "dark" ? "text-grey-300" : "text-grey-700")}>
            {description}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={clsx("max-w-3xl", align === "center" && "mx-auto text-center")}>
      {eyebrow && (
        <EyebrowReveal className={clsx("mb-3 text-xs font-semibold uppercase tracking-[0.2em]", tone === "dark" ? "text-accent" : "text-accent")}>
          {eyebrow}
        </EyebrowReveal>
      )}
      <HeadlineReveal
        as="h2"
        lines={[title]}
        delay={0.08}
        className={clsx("font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl", tone === "dark" ? "text-paper" : "text-ink")}
      />
      {description && (
        <DescriptionReveal
          delay={0.3}
          className={clsx("mt-4 text-base leading-relaxed md:text-lg", tone === "dark" ? "text-grey-300" : "text-grey-700")}
        >
          {description}
        </DescriptionReveal>
      )}
    </div>
  );
}
