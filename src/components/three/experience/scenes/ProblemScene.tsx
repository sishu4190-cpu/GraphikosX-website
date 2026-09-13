"use client";

// ---------------------------------------------------------------------------
// ProblemScene — Phase 3's second ambient chapter (DigitalPresenceProblem /
// "the Problem section"). A loose field of dark, angular shard meshes with
// thin electric-blue traced edges, visualizing "fragmentation" as an
// ambient backdrop echo of DigitalPresenceProblem.tsx's own 2D scattered-
// card motif (see that file's `scatter` offsets) — never competing with it:
// low opacity, held well back in Z, no interaction of its own. The 2D hub-
// and-spoke UI stays the thing anyone actually reads or hovers.
// ---------------------------------------------------------------------------

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface Shard {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  seed: number;
}

function makeShards(count: number): Shard[] {
  const shards: Shard[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 1.6 + Math.random() * 1.6;
    shards.push({
      position: [
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.6 + (Math.random() - 0.5),
        -3 - Math.random() * 2.5,
      ],
      rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
      scale: 0.34 + Math.random() * 0.4,
      seed: Math.random() * Math.PI * 2,
    });
  }
  return shards;
}

// An irregular flat quad (not a plain square) so every instance reads as a
// distinct broken-off "shard" rather than a uniform tile.
function useShardGeometry() {
  return useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.5, -0.3);
    shape.lineTo(0.4, -0.5);
    shape.lineTo(0.5, 0.35);
    shape.lineTo(-0.2, 0.5);
    shape.closePath();
    return new THREE.ExtrudeGeometry(shape, { depth: 0.04, bevelEnabled: false });
  }, []);
}

export function ProblemScene({ lite = false }: { lite?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const shards = useMemo(() => makeShards(lite ? 6 : 9), [lite]);
  const shardGeo = useShardGeometry();
  const edgesGeo = useMemo(() => new THREE.EdgesGeometry(shardGeo), [shardGeo]);

  const faceMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#0a0a0c", transparent: true, opacity: 0.55 }),
    []
  );
  const edgeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#3a5ce8", transparent: true, opacity: 0.7 }),
    []
  );

  const shardRefs = useRef<(THREE.Group | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(time * 0.04) * 0.1;
      const s = THREE.MathUtils.clamp(viewport.width / 10, 0.75, 1.5);
      groupRef.current.scale.setScalar(s);
    }
    shardRefs.current.forEach((g, i) => {
      if (!g) return;
      const shard = shards[i];
      // Gentle independent bob/rotate per shard — bounded oscillation
      // (never permanent drift) so the field reads as a persistent ambient
      // loop no matter how long a visitor lingers on this chapter.
      g.rotation.x = shard.rotation[0] + Math.sin(time * 0.15 + shard.seed) * 0.12;
      g.rotation.z = shard.rotation[2] + Math.cos(time * 0.12 + shard.seed) * 0.1;
      g.position.y = shard.position[1] + Math.sin(time * 0.2 + shard.seed) * 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {shards.map((shard, i) => (
        <group
          key={i}
          ref={(el) => {
            shardRefs.current[i] = el;
          }}
          position={shard.position}
          rotation={shard.rotation}
          scale={shard.scale}
        >
          <mesh geometry={shardGeo} material={faceMaterial} />
          <lineSegments geometry={edgesGeo} material={edgeMaterial} />
        </group>
      ))}
    </group>
  );
}
