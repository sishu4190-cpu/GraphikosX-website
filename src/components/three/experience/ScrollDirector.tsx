"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { ScrollTrigger, registerGsapScrollTrigger } from "@/lib/gsap";
import type { ChapterId } from "@/components/three/experience/types";

/**
 * Phase 3: reports which one of the persistent 3D experience's four
 * "chapters" (see types.ts's ChapterId/CHAPTER_IDS) is currently close
 * enough to the viewport to be the one GXCanvas should be showing, or
 * `null` when none of them are — the "gap" sections between chapters
 * (CostOfWaiting between Journey/Problem; the run of six sections between
 * Problem/Ecosystem). Per the "fade out between chapters" decision, a gap
 * means `null`: GXCanvas fades its opacity to 0 and pauses its render loop
 * rather than leaving the previous chapter's scene sitting behind content
 * it was never designed for.
 *
 * Deliberately NOT the same generous `top bottom+=20% / bottom top-=20%`
 * margins `useSectionVisibility` below uses for its one-off "is this
 * roughly near the viewport" check: those margins are wider than
 * CostOfWaiting (the gap between Journey and Problem) is tall at common
 * viewport heights, so with them, Journey's window and Problem's window
 * overlap THROUGH the entire gap and the canvas never actually goes dark —
 * caught in verification by scrubbing through the gap and finding the
 * canvas still at full opacity the whole way across. Each chapter here
 * instead uses `top center` / `bottom center` — active exactly while the
 * viewport's own vertical midpoint falls inside that section. Since
 * sections stack with no overlap, the viewport's midpoint is always inside
 * exactly one section (a chapter, or a gap section outside `chapterIds`),
 * so at most one chapter trigger is ever active at a time — no priority
 * tie-break needed, and every gap, however short, reliably produces a real
 * `null` stretch.
 *
 * Same `useLenis(() => ScrollTrigger.update())` sync as `useSectionVisibility`
 * below, just fanned out across several ScrollTriggers instead of one.
 * `activeChapter` is state (not a ref) for the same reason `active` is
 * below — it changes rarely (a handful of times per page visit) and gates
 * a discrete decision (which scene GXCanvas mounts), never a per-frame value.
 *
 * First-pass caveat: Hero and Journey are directly adjacent on the page
 * (no gap section between them), so the hand-off there is still an instant
 * cut from HeroScene to JourneyScene at their shared boundary rather than a
 * cross-fade — there's no dark gap to fade through. Every other transition
 * (Journey->Problem via CostOfWaiting; Problem->Ecosystem via the six
 * sections between them) passes through a real `null` stretch and fades
 * cleanly both ways.
 */
export function useChapterVisibility(chapterIds: readonly ChapterId[]) {
  const [activeChapter, setActiveChapter] = useState<ChapterId | null>(chapterIds[0] ?? null);
  const activeSetRef = useRef<Set<ChapterId>>(new Set(chapterIds[0] ? [chapterIds[0]] : []));
  const reducedRef = useRef(false);

  useLenis(() => {
    if (!reducedRef.current) ScrollTrigger.update();
  });

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedRef.current) return;

    registerGsapScrollTrigger();

    const recompute = () => {
      const next = chapterIds.find((id) => activeSetRef.current.has(id)) ?? null;
      setActiveChapter((prev) => (prev === next ? prev : next));
    };

    const triggers: ScrollTrigger[] = [];
    chapterIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      triggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) activeSetRef.current.add(id);
            else activeSetRef.current.delete(id);
            recompute();
          },
        })
      );
    });

    return () => triggers.forEach((t) => t.kill());
  }, [chapterIds]);

  return activeChapter;
}

/**
 * First piece of the "ScrollDirector" the Phase 1 plan called for: reports
 * whether a DOM section is close enough to the viewport to be worth
 * rendering, plus a continuously-updated scroll-progress ref for later
 * scroll-driven choreography (Phase 3+ — Journey/Problem/Ecosystem scene
 * transitions, Industries sequence, etc.). Nothing here drives any
 * choreography yet; Phase 2's only job for this hook is deciding when
 * GXCanvas's render loop should run at all.
 *
 * `active` is deliberately the ONLY piece of state that triggers a React
 * re-render — it changes rarely (a handful of times per page visit, each
 * time the tracked section crosses fully in/out of a generous margin around
 * the viewport) and gates a discrete decision (mount/pause the canvas).
 * `progress` is a ref, never state, because ScrollTrigger can report it many
 * times per second while scrolling and nothing here should re-render that
 * often — the same "refs for continuous values, state for discrete ones"
 * rule GXForm's/HeroScene's own useFrame already follows for rotation/
 * position.
 *
 * Synced to the sitewide Lenis instance via `useLenis`, exactly the
 * established convention documented in SmoothScrollProvider.tsx (each
 * component that owns a ScrollTrigger instance wires its own
 * `useLenis(() => ScrollTrigger.update())` rather than a new global sync
 * mechanism) — the same pattern ScrollScrubTimeline.tsx and
 * BuyerJourneyScrub.tsx already use.
 */
export function useSectionVisibility(sectionId: string) {
  // Hero is the very first section on the page, so it's visible on first
  // paint by default — this avoids a one-frame flash where the canvas
  // starts paused before ScrollTrigger's own initial measurement lands.
  const [active, setActive] = useState(true);
  const progressRef = useRef(0);
  const reducedRef = useRef(false);

  useLenis(() => {
    // Cheap even when no ScrollTrigger instance exists (reduced-motion
    // visitors never reach the effect below that creates one) — `update()`
    // simply has nothing registered to refresh.
    if (!reducedRef.current) ScrollTrigger.update();
  });

  useEffect(() => {
    reducedRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Reduced-motion visitors get the static SVG fallback (GXExperience.tsx
    // never mounts GXCanvas for them), so there is nothing for this hook to
    // gate and no scroll-driven state worth computing.
    if (reducedRef.current) return;

    registerGsapScrollTrigger();
    const el = document.getElementById(sectionId);
    if (!el) return;

    // Generous ±20% viewport margin — the canvas should already be
    // rendering slightly before Hero enters view (no first-frame pop-in)
    // and keep rendering slightly after it leaves, not cut off the instant
    // the last pixel scrolls away.
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top bottom+=20%",
      end: "bottom top-=20%",
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
      onToggle: (self) => {
        setActive(self.isActive);
      },
    });

    return () => trigger.kill();
  }, [sectionId]);

  return { active, progressRef };
}
