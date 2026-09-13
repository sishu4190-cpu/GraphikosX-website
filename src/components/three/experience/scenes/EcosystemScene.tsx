"use client";

// ---------------------------------------------------------------------------
// EcosystemScene — Phase 3's third ambient chapter (the Ecosystem section).
// A sparse 3D echo of Ecosystem.tsx's own 2D radial hub-and-spoke diagram —
// eight nodes in a ring around a bright center, connected by thin spokes —
// held far back in Z and dim, so the real interactive 2D diagram (hover
// states, related-node highlighting) stays the only thing anyone actually
// reads or hovers. This is depth, not a second diagram competing for
// attention.
// ---------------------------------------------------------------------------

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 8;
const RADIUS = 2.1;
const HUB_Z = -4.5;

function useRingPositions() {
  return useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const angle = (i / NODE_COUNT) * Math.PI * 2;
      // Alternating slight z-offset so the ring reads as a genuine 3D orbit
      // rather than a flat circle facing the camera.
      const z = HUB_Z + (i % 2 === 0 ? -0.4 : 0.4);
      positions.push([Math.cos(angle) * RADIUS, Math.sin(angle) * RADIUS, z]);
    }
    return positions;
  }, []);
}

function useSpokeGeometry(positions: [number, number, number][]) {
  return useMemo(() => {
    const points: THREE.Vector3[] = [];
    positions.forEach((p) => {
      points.push(new THREE.Vector3(0, 0, HUB_Z), new THREE.Vector3(...p));
    });
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [positions]);
}

export function EcosystemScene({ lite = false }: { lite?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const positions = useRingPositions();
  const spokeGeo = useSpokeGeometry(positions);

  const nodeMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#3a5ce8" }), []);
  const hubMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: "#7c9cff" }), []);
  const spokeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#3a5ce8", transparent: true, opacity: 0.28 }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.z = state.clock.elapsedTime * 0.03;
    const s = THREE.MathUtils.clamp(viewport.width / 10, 0.75, 1.5);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={spokeGeo} material={spokeMaterial} />
      <mesh position={[0, 0, HUB_Z]} material={hubMaterial}>
        <sphereGeometry args={[0.16, 20, 20]} />
      </mesh>
      {positions.map((p, i) => (
        <mesh key={i} position={p} material={nodeMaterial}>
          <sphereGeometry args={[lite ? 0.07 : 0.09, 16, 16]} />
        </mesh>
      ))}
    </group>
  );
}
