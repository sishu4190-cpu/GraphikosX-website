"use client";

import { Canvas } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise } from "@react-three/postprocessing";
import { useState } from "react";
import { SceneLighting } from "@/components/three/experience/SceneLighting";
import { HeroScene } from "@/components/three/experience/scenes/HeroScene";
import { HeroSceneLite } from "@/components/three/experience/scenes/HeroSceneLite";
import { JourneyScene } from "@/components/three/experience/scenes/JourneyScene";
import { ProblemScene } from "@/components/three/experience/scenes/ProblemScene";
import { IndustriesScene } from "@/components/three/experience/scenes/IndustriesScene";
import { BuildGrowScaleScene } from "@/components/three/experience/scenes/BuildGrowScaleScene";
import { EcosystemScene } from "@/components/three/experience/scenes/EcosystemScene";
import { FinalCTAScene } from "@/components/three/experience/scenes/FinalCTAScene";
import type { AnchorState, ChapterId, PointerTarget } from "@/components/three/experience/types";
import type { HeroTouchTarget } from "@/components/three/useHeroTouchControl";

/**
 * The one persistent `<Canvas>` for the homepage's 3D experience — never a
 * second Canvas, per the Phase 1 plan. Phase 2 hosted HeroScene/
 * HeroSceneLite only; Phase 3 added JourneyScene/ProblemScene/
 * EcosystemScene; Phase 4 added IndustriesScene; Phase 5 added
 * BuildGrowScaleScene and FinalCTAScene, the last two chapters per the
 * master plan — switching between all seven based on `activeChapter`
 * (from ScrollDirector's `useChapterVisibility`). Absolutely positioned to
 * cover GXExperience's own wrapper — as of Phase 3 that wrapper is `fixed
 * inset-0` (the whole viewport), not just the Hero section, so this canvas
 * spans the entire homepage.
 *
 * `frameloop` and opacity are both driven by whether any chapter is active
 * at all (`activeChapter !== null`) — this is the "pause rendering / fade
 * out when nothing to show" requirement from the "fade out between
 * chapters" decision: during the gap sections (CostOfWaiting; the run
 * between Problem and Ecosystem) no scene is selected, `active` goes
 * false, and the canvas fades to 0 opacity and stops rendering entirely
 * until the next chapter's trigger fires.
 */
export function GXCanvas({
  mode,
  activeChapter,
  anchorStateRef,
  pointerRef,
  touchRef,
}: {
  mode: "full" | "lite";
  activeChapter: ChapterId | null;
  anchorStateRef: React.MutableRefObject<AnchorState>;
  pointerRef: React.MutableRefObject<PointerTarget>;
  touchRef: React.MutableRefObject<HeroTouchTarget>;
}) {
  const [ready, setReady] = useState(false);
  const active = activeChapter !== null;

  let scene: React.ReactNode = null;
  if (activeChapter === "gx-hero-section") {
    scene =
      mode === "full" ? (
        <HeroScene pointerRef={pointerRef} touchRef={touchRef} anchorStateRef={anchorStateRef} />
      ) : (
        <HeroSceneLite pointerRef={pointerRef} touchRef={touchRef} anchorStateRef={anchorStateRef} />
      );
  } else if (activeChapter === "gx-journey-section") {
    scene = <JourneyScene lite={mode === "lite"} />;
  } else if (activeChapter === "gx-problem-section") {
    scene = <ProblemScene lite={mode === "lite"} />;
  } else if (activeChapter === "gx-industries-section") {
    scene = <IndustriesScene lite={mode === "lite"} />;
  } else if (activeChapter === "gx-buildgrowscale-section") {
    scene = <BuildGrowScaleScene lite={mode === "lite"} />;
  } else if (activeChapter === "gx-ecosystem-section") {
    scene = <EcosystemScene lite={mode === "lite"} />;
  } else if (activeChapter === "gx-finalcta-section") {
    scene = <FinalCTAScene lite={mode === "lite"} />;
  }

  // Phase 4: skip postprocessing specifically for the Industries chapter —
  // IndustriesTeaser.tsx already runs its own SVG/framer-motion animation
  // (auto-play sequence, pulsing connector, card transitions), so this is
  // the one section where the frame budget is tightest. IndustriesScene
  // itself is already the lightest of the four scenes (see that file); this
  // is the second, independent cut on top of that — see the CHANGELOG's
  // Phase 4 entry for the measured frame timing with/without this.
  //
  // Phase 5: BuildGrowScaleScene and FinalCTAScene do NOT get the same
  // treatment — neither BuildGrowScale.tsx nor FreeAuditCTA.tsx runs any
  // continuous competing animation the way IndustriesTeaser does (both are
  // one-shot `whileInView` reveals that finish and stop), and both new
  // scenes are already the cheapest of the seven (a handful of boxes/
  // points with no shader). Bloom stays on for them, consistent with Hero/
  // Journey/Problem/Ecosystem's default — the Industries cut was a
  // response to that section's own specific competing animation, not a
  // blanket policy.
  const enablePostprocessing = mode === "full" && !!scene && activeChapter !== "gx-industries-section";

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={mode === "full" ? [1, 1.6] : [1, 2]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0, 6.4], fov: 40 }}
      onCreated={() => setReady(true)}
      frameloop={active ? "always" : "never"}
      style={{ opacity: ready && active ? 1 : 0, transition: "opacity 700ms ease", pointerEvents: "none" }}
    >
      <SceneLighting />
      {scene}
      {/* PHASE 7 postprocessing, unchanged from the original GXScene.tsx —
          full tier only. Phase 3: wraps whichever scene is currently
          selected (was HeroScene-only in Phase 2) so Journey/Problem/
          Ecosystem's bright accents bloom the same way the hero mark's do. */}
      {enablePostprocessing && (
        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={0.35} luminanceThreshold={0.28} luminanceSmoothing={0.9} mipmapBlur />
          <ChromaticAberration offset={[0.0006, 0.0006]} radialModulation={false} modulationOffset={0} />
          <Noise opacity={0.03} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
