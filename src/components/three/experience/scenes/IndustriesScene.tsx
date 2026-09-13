"use client";

// ---------------------------------------------------------------------------
// IndustriesScene — Phase 4's ambient chapter (the Industries section).
// Deliberately the LIGHTEST of the four ambient scenes: IndustriesTeaser.tsx
// already runs its own real-time animation (an SVG orbit with a pulsing
// connector line, a one-time auto-play sequence cycling through all ten
// nodes, and a framer-motion card transition), so this scene's whole job is
// to add depth without competing for frame budget — see the Phase 4
// CHANGELOG entry for the actual measured frame timing with both running
// together.
//
// Also deliberately NOT another hub-and-spoke ring: IndustriesTeaser's own
// 2D diagram already IS a hub-and-spoke orbit (ten nodes around a center),
// and EcosystemScene already provides that motif in 3D elsewhere on the
// page — stacking a third, near-identical ring here would read as
// repetitive rather than additive. Instead: a single sparse, slowly
// drifting field of small points — one draw call, no shader, no per-frame
// geometry mutation — visualizing breadth/reach across many industries
// rather than any one structural diagram.
// ---------------------------------------------------------------------------

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function makeFieldPositions(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 0.6 + Math.random() * 3.2;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = Math.sin(angle) * radius * 0.65;
    positions[i * 3 + 2] = -3 - Math.random() * 4;
  }
  return positions;
}

function useFieldGeometry(count: number) {
  return useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(makeFieldPositions(count), 3));
    return geometry;
  }, [count]);
}

export function IndustriesScene({ lite = false }: { lite?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  // Sparsest field of the four ambient scenes on purpose (see file header) —
  // roughly a third of Journey's/half of Problem's own particle counts.
  const geometry = useFieldGeometry(lite ? 18 : 30);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#7c9cff",
        size: 0.045,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    // Slower than any other chapter's drift (0.03 vs 0.04-0.05 elsewhere) —
    // this section has the most going on already, so the backdrop stays as
    // close to "barely moving" as still reads as alive.
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.03) * 0.06;
    const s = THREE.MathUtils.clamp(viewport.width / 10, 0.75, 1.5);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry} material={material} />
    </group>
  );
}
