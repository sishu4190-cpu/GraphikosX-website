"use client";

/**
 * Shared six-light rig for the persistent GX experience canvas — extracted
 * verbatim from GXScene.tsx/GXSceneLite.tsx (both files had this exact rig
 * duplicated identically) so every scene under
 * components/three/experience/scenes/ lights consistently without re-typing
 * it. Kept deliberately unchanged from the original — see GXScene.tsx's git
 * history for the original per-light reasoning, summarized inline below.
 */
export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.32} />
      {/* Soft sky/ground fill — cheap (no textures/env map), but gives the
          matte black body a continuous top-to-bottom tonal gradient instead
          of one flat black silhouette. This is what actually makes the
          ring's already-smooth curve read as smooth rather than faceted. */}
      <hemisphereLight args={["#eef2ff", "#050506", 0.5]} />
      <directionalLight position={[3, 4, 5]} intensity={0.55} color="#ffffff" />
      {/* Low-angle raking key light — sweeps a thin, precise specular
          highlight across the bevel as the mark idles/tilts, the visual cue
          that reads as "precision-machined metal" rather than "flat
          cutout". */}
      <directionalLight position={[-4, 1.2, 3.5]} intensity={0.4} color="#ffffff" />
      {/* Electric-blue rim lighting — the signature GraphikosX accent. */}
      <pointLight position={[-3.5, -1, -2.5]} intensity={20} color="#1D4ED8" />
      <pointLight position={[2.6, -1.6, 1.6]} intensity={7} color="#1D4ED8" />
    </>
  );
}
