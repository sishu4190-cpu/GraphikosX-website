"use client";

// ---------------------------------------------------------------------------
// FinalCTAScene — Phase 5's fifth and final ambient chapter (FreeAuditCTA —
// the closing "Get Your Free Audit" section, the last thing a visitor sees
// on the homepage before the footer). Deliberately the most restrained of
// all five ambient scenes on purpose: fewer, dimmer, slower-moving points
// than even IndustriesScene's own already-sparse field. Two reasons. First,
// this section already carries its own CSS aurora glow
// (`gx-bg-dark-aurora`) — a second, louder 3D effect on top would compete
// with it rather than complement it. Second, and more importantly, this is
// a conversion CTA: the headline, the "Get Your Free Audit" / WhatsApp
// buttons, and the email line are the only things that should hold a
// visitor's attention here, not a closing-chapter showpiece.
// ---------------------------------------------------------------------------

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

function makeEmberPositions(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 6.5;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 3.4;
    positions[i * 3 + 2] = -3.5 - Math.random() * 3.5;
  }
  return positions;
}

function useEmberGeometry(count: number) {
  return useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(makeEmberPositions(count), 3));
    return geometry;
  }, [count]);
}

export function FinalCTAScene({ lite = false }: { lite?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  // Sparsest field of any of the five ambient scenes on purpose (see file
  // header) — roughly half of IndustriesScene's own already-sparse count.
  const geometry = useEmberGeometry(lite ? 8 : 14);

  const material = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: "#7c9cff",
        size: 0.04,
        transparent: true,
        opacity: 0.25,
        depthWrite: false,
        sizeAttenuation: true,
      }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    // The slowest, smallest motion of any chapter — a quiet "breathing"
    // rise/fall rather than any earlier chapter's more visible rotation,
    // matching this closing chapter's deliberately low-key treatment.
    // Bounded oscillation, never permanent drift, same rule every other
    // scene's per-frame motion already follows.
    const time = state.clock.elapsedTime;
    groupRef.current.position.y = Math.sin(time * 0.025) * 0.18;
    groupRef.current.rotation.y = Math.sin(time * 0.02) * 0.05;
    const s = THREE.MathUtils.clamp(viewport.width / 10, 0.75, 1.5);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <points geometry={geometry} material={material} />
    </group>
  );
}
