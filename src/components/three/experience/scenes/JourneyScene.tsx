"use client";

// ---------------------------------------------------------------------------
// JourneyScene — Phase 3's first ambient chapter (Customer Journey). Unlike
// HeroScene/HeroSceneLite, this is NOT anchor-tracked to any DOM element —
// it's a full-viewport ambient backdrop that drifts behind
// CustomerJourney.tsx's own 2D step timeline (ScrollScrubTimelineHost),
// per the Phase 1 principle of keeping the existing 2D/CSS systems as the
// primary UI with 3D only as atmosphere.
//
// A single glowing thread strung through five waypoints (echoing the five
// Search -> Check -> Compare -> Trust -> Decide steps) with a bright pulse
// travelling along it end-to-end visualizes the IDEA of a journey/
// progression, rather than illustrating the steps literally — the 2D
// timeline already does that job and stays the thing anyone actually reads.
// ---------------------------------------------------------------------------

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const WAYPOINTS: [number, number, number][] = [
  [-3.4, 0.6, -4.5],
  [-1.6, -0.5, -5.2],
  [0.2, 0.7, -4.8],
  [1.9, -0.4, -5.6],
  [3.4, 0.5, -5.0],
];

// Full traversals per second — deliberately slow; this is ambient
// atmosphere, not a progress indicator tied to actual scroll/step state.
const PULSE_SPEED = 0.09;

function usePathCurve() {
  return useMemo(() => new THREE.CatmullRomCurve3(WAYPOINTS.map((p) => new THREE.Vector3(...p))), []);
}

function usePathGeometry(curve: THREE.CatmullRomCurve3, lite: boolean) {
  return useMemo(() => new THREE.TubeGeometry(curve, lite ? 48 : 96, 0.014, 6, false), [curve, lite]);
}

// Deliberately static (no per-frame shimmer shader, unlike HeroScene's
// particle field) — a plain built-in PointsMaterial needs nothing mutated
// every frame, avoiding the "modifying a value returned from a hook"
// immutability lint rule that a custom ShaderMaterial's per-frame uTime
// uniform update would trip (HeroScene/HeroSceneLite already carry that
// tradeoff for their own focal particle fields; there's no need to add a
// third instance of it just for this scene's much more peripheral sprinkle
// of background dust — the group's own slow rotation already keeps this
// from looking frozen).
function makeParticlePositions(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 9;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
    positions[i * 3 + 2] = -3.5 - Math.random() * 4;
  }
  return positions;
}

function useAmbientParticles(count: number) {
  return useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(makeParticlePositions(count), 3));
    return geometry;
  }, [count]);
}

export function JourneyScene({ lite = false }: { lite?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const { viewport } = useThree();

  const curve = usePathCurve();
  const pathGeo = usePathGeometry(curve, lite);
  const particleGeo = useAmbientParticles(lite ? 40 : 80);

  // Electric-blue accent rather than pale grey — this scene sits on
  // CustomerJourney's own light bg-grey-100/90 background, where a light
  // grey thread turned out (caught in verification, comparing screenshots)
  // to have almost no contrast at 90% background opacity. The brand's own
  // accent blue reads clearly against both light and dark sections alike.
  const pathMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#1D4ED8", transparent: true, opacity: 0.55 }),
    []
  );
  const nodeMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#1D4ED8" }), []);
  const pulseMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#ffffff" }), []);
  const particleMaterial = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#3a5ce8",
        size: 0.06,
        transparent: true,
        opacity: 0.45,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  );

  useFrame((state, delta) => {
    if (groupRef.current) {
      // Slow ambient drift — just enough that the backdrop reads as alive
      // rather than a static render, matching Hero's own idle rotation in
      // spirit (never enough to feel like it's "for" anything).
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.08;
      // No DOM anchor to read a size from here (unlike HeroScene) — scale
      // gently with viewport width so the path spans a proportionate slice
      // of the screen at any breakpoint.
      const s = THREE.MathUtils.clamp(viewport.width / 9, 0.7, 1.4);
      groupRef.current.scale.setScalar(s);
    }

    t.current = (t.current + delta * PULSE_SPEED) % 1;
    if (pulseRef.current) {
      pulseRef.current.position.copy(curve.getPointAt(t.current));
    }
  });

  return (
    <group ref={groupRef}>
      <mesh geometry={pathGeo} material={pathMaterial} />
      {WAYPOINTS.map((p, i) => (
        <mesh key={i} position={p} material={nodeMaterial}>
          <sphereGeometry args={[0.05, 16, 16]} />
        </mesh>
      ))}
      <mesh ref={pulseRef} material={pulseMaterial}>
        <sphereGeometry args={[0.075, 16, 16]} />
      </mesh>
      <points geometry={particleGeo} material={particleMaterial} />
    </group>
  );
}
