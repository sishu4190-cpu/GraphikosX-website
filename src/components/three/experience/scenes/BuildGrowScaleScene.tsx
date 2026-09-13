"use client";

// ---------------------------------------------------------------------------
// BuildGrowScaleScene — Phase 5's fourth ambient chapter (the "Build. Grow.
// Scale." section). Three translucent step blocks of increasing height,
// arranged in a rising staircase with a thin electric-blue connector running
// along the ascent — a literal echo of the section's own "Build -> Grow ->
// Scale" progression, and of that same section's 2D UI (three stacked cards
// linked by a short vertical connector between each pair). Reuses the
// face+edges material pattern ProblemScene established (a translucent dark
// fill plus a traced electric-blue outline) on box geometry instead of
// irregular shards, so it reads as part of the same visual family as the
// other ambient chapters while still being a distinct shape language (no
// scene so far has used a literal "ascending steps" motif).
// ---------------------------------------------------------------------------

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

// Fixed at three — Build, Grow, Scale — this is a literal match to the
// section's own three groups, not a density knob like the other scenes'
// particle/shard counts.
const STEP_COUNT = 3;

interface Step {
  position: [number, number, number];
  height: number;
}

function makeSteps(): Step[] {
  const steps: Step[] = [];
  for (let i = 0; i < STEP_COUNT; i++) {
    const height = 0.5 + i * 0.45;
    steps.push({
      position: [-1.6 + i * 1.6, -0.9 + height / 2 + i * 0.45, -4 - i * 0.3],
      height,
    });
  }
  return steps;
}

function useStepGeometries(steps: Step[]) {
  return useMemo(() => steps.map((step) => new THREE.BoxGeometry(0.9, step.height, 0.9)), [steps]);
}

// Connector geometry as consecutive line-segment pairs (step[i]-top to
// step[i+1]-top), matching EcosystemScene's own hub-to-node spoke pattern —
// not a single continuous polyline (JSX has no precedent for the `<line>`
// primitive elsewhere in this codebase; `lineSegments` is the established,
// proven-safe way to draw disjoint segments here).
function useConnectorGeometry(steps: Step[]) {
  return useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < steps.length - 1; i++) {
      const a = steps[i];
      const b = steps[i + 1];
      points.push(
        new THREE.Vector3(a.position[0], a.position[1] + a.height / 2, a.position[2]),
        new THREE.Vector3(b.position[0], b.position[1] + b.height / 2, b.position[2])
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, [steps]);
}

export function BuildGrowScaleScene({ lite = false }: { lite?: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const steps = useMemo(() => makeSteps(), []);
  const geometries = useStepGeometries(steps);
  const edgesGeos = useMemo(() => geometries.map((g) => new THREE.EdgesGeometry(g)), [geometries]);
  const connectorGeo = useConnectorGeometry(steps);

  // Dimmer on the lite tier, matching every other scene's lite/full
  // material split — this scene's primitive count (3 boxes + one
  // connector) is already the cheapest of the five regardless of tier, so
  // there's no meaningful count/segment reduction left to make; opacity is
  // the one knob worth turning.
  const faceMaterial = useMemo(
    () => new THREE.MeshBasicMaterial({ color: "#0a0a0c", transparent: true, opacity: lite ? 0.35 : 0.45 }),
    [lite]
  );
  const edgeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#1D4ED8", transparent: true, opacity: 0.65 }),
    []
  );
  const connectorMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: "#7c9cff", transparent: true, opacity: 0.35 }),
    []
  );

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;
    // Slow rotation plus a gentle bounded vertical breathing — never a
    // permanent climb, so the "ascending" motif stays a stable ambient loop
    // no matter how long a visitor lingers, matching every other scene's
    // own bounded-oscillation rule.
    groupRef.current.rotation.y = Math.sin(time * 0.045) * 0.09;
    groupRef.current.position.y = Math.sin(time * 0.08) * 0.08;
    const s = THREE.MathUtils.clamp(viewport.width / 10, 0.75, 1.5);
    groupRef.current.scale.setScalar(s);
  });

  return (
    <group ref={groupRef}>
      <lineSegments geometry={connectorGeo} material={connectorMaterial} />
      {steps.map((step, i) => (
        <group key={i} position={step.position}>
          <mesh geometry={geometries[i]} material={faceMaterial} />
          <lineSegments geometry={edgesGeos[i]} material={edgeMaterial} />
        </group>
      ))}
    </group>
  );
}
