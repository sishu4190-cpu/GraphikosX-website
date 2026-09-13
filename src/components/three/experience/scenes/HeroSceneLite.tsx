"use client";

// ---------------------------------------------------------------------------
// HeroSceneLite — the "lite" (phone) tier of the persistent GX experience
// canvas. Ported from the pre-Phase-2 GXSceneLite.tsx's <GXFormLite> almost
// verbatim — same traced mark, same materials, same lighting, same
// touch-drag interaction as HeroScene.tsx, but with the atmosphere shader
// plane and postprocessing dropped entirely and the particle count halved,
// exactly as GXSceneLite.tsx's own header comment explains. Duplicated
// rather than shared with HeroScene.tsx, matching that same established
// full/lite convention.
//
// See HeroScene.tsx's header comment for why anchor tracking exists at all
// (one shared canvas now spans the whole Hero section instead of a
// dedicated per-layout box) — the derivation is identical here.
// ---------------------------------------------------------------------------

import { useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import type { HeroTouchTarget } from "@/components/three/useHeroTouchControl";
import type { AnchorState, PointerTarget } from "@/components/three/experience/types";

type Point = [number, number];

const RING_OUTLINE: Point[] = [
  [-0.1806, 1.2556], [-0.6306, 1.2833], [-1.0417, 1.1444], [-1.4083, 0.8278],
  [-1.625, 0.3944], [-1.6639, -0.0778], [-1.5417, -0.4833], [-1.2528, -0.8611],
  [-0.8472, -1.0889], [-0.5861, -0.8], [-0.7806, -0.7444], [-0.9917, -0.6167],
  [-1.1528, -0.4444], [-1.2528, -0.2556], [-1.3028, 0.1778], [-1.2306, 0.4222],
  [-1.1139, 0.6111], [-0.8861, 0.8056], [-0.5194, 0.9167], [-0.175, 0.8556],
  [-0.0139, 0.7556], [0.1139, 0.6111], [0.5306, 0.6111], [0.4194, 0.8333],
  [0.2583, 1.0167], [0.0528, 1.1611],
];

const BLADE_A_OUTLINE: Point[] = [
  [1.6639, 1.1778], [-0.3917, -1.2833], [-0.8361, -1.2833], [1.2806, 1.1778],
];

const BLADE_B_OUTLINE: Point[] = [
  [-0.6917, 0.2611], [-0.4472, -0.0444], [-0.0694, -0.05], [0.975, -1.2833],
  [1.4028, -1.2778], [0.1417, 0.2556],
];

function shapeFromOutline(points: Point[]) {
  const shape = new THREE.Shape();
  shape.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) {
    shape.lineTo(points[i][0], points[i][1]);
  }
  shape.closePath();
  return shape;
}

const RING_ARC = {
  cx: -0.48484,
  cy: 0.06517,
  innerR: 0.84487,
  outerR: 1.19612,
  s8: { x: -0.84315, y: -1.07601, a: -1.87503 },
  s9: { x: -0.58305, y: -0.77397, a: -1.68731 },
  s21: { x: 0.13948, y: 0.63442, a: 0.73929 },
  s22: { x: 0.56867, y: 0.63157, a: 0.49329 },
};

function ringShapeFromArcs() {
  const { cx, cy, innerR, outerR, s8, s9, s21, s22 } = RING_ARC;
  const shape = new THREE.Shape();
  shape.moveTo(s8.x, s8.y);
  shape.lineTo(s9.x, s9.y);
  shape.absarc(cx, cy, innerR, s9.a, s21.a, true);
  shape.lineTo(s22.x, s22.y);
  shape.absarc(cx, cy, outerR, s22.a, s8.a, false);
  shape.closePath();
  return shape;
}

function useTracedGeometry(points: Point[], depth: number, smooth: boolean) {
  return useMemo(() => {
    const shape = smooth ? ringShapeFromArcs() : shapeFromOutline(points);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      bevelSegments: smooth ? 14 : 4,
      curveSegments: smooth ? 96 : 6,
    });
    geometry.computeVertexNormals();
    return geometry;
  }, [points, depth, smooth]);
}

const ALL_OUTLINE_POINTS = [...RING_OUTLINE, ...BLADE_A_OUTLINE, ...BLADE_B_OUTLINE];
const SHAPE_MIN_Y = Math.min(...ALL_OUTLINE_POINTS.map((p) => p[1]));
const SHAPE_HALF_WIDTH = Math.max(...ALL_OUTLINE_POINTS.map((p) => Math.abs(p[0])));

function useShadowTexture() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(10,12,18,0.5)");
    gradient.addColorStop(0.55, "rgba(10,12,18,0.22)");
    gradient.addColorStop(1, "rgba(10,12,18,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

function useReflectionPoolTexture() {
  return useMemo(() => {
    const size = 256;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    gradient.addColorStop(0, "rgba(29,78,216,0.55)");
    gradient.addColorStop(0.5, "rgba(29,78,216,0.22)");
    gradient.addColorStop(1, "rgba(29,78,216,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
  }, []);
}

// Roughly half of HeroScene.tsx's 180 — see GXSceneLite.tsx's original
// header comment for why this is a small extra-margin cut, not one of the
// two load-bearing ones (the dropped atmosphere plane and postprocessing).
const PARTICLE_COUNT = 90;

function useParticleGeometry() {
  return useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.9 + Math.random() * 2.6;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = Math.sin(angle) * radius * 0.7 + (Math.random() - 0.5) * 0.6;
      positions[i * 3 + 2] = -0.7 - Math.random() * 3.4;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));
    return geometry;
  }, []);
}

function useParticleMaterial() {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new THREE.Color("#1D4ED8") },
        },
        vertexShader: `
          attribute float aSeed;
          uniform float uTime;
          varying float vAlpha;
          void main() {
            vec3 pos = position;
            pos.x += sin(uTime * 0.15 + aSeed) * 0.25;
            pos.y += cos(uTime * 0.12 + aSeed * 1.7) * 0.2;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            float dist = max(-mvPosition.z, 0.001);
            gl_PointSize = (60.0 / dist) * (0.5 + 0.5 * sin(uTime * 0.4 + aSeed));
            vAlpha = 0.35 + 0.35 * sin(uTime * 0.5 + aSeed * 2.3);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          varying float vAlpha;
          void main() {
            vec2 c = gl_PointCoord - 0.5;
            float soft = smoothstep(0.5, 0.0, length(c));
            gl_FragColor = vec4(uColor, soft * vAlpha * 0.5);
          }
        `,
      }),
    []
  );
}

export function HeroSceneLite({
  pointerRef,
  touchRef,
  anchorStateRef,
}: {
  pointerRef: React.MutableRefObject<PointerTarget>;
  touchRef: React.MutableRefObject<HeroTouchTarget>;
  anchorStateRef: React.MutableRefObject<AnchorState>;
}) {
  const sceneRoot = useRef<THREE.Group>(null);
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const reflection = useRef<THREE.Mesh>(null);
  const current = useRef({ x: 0, y: 0 });
  const idleAngle = useRef(0);
  const { viewport, size } = useThree();

  const ringGeo = useTracedGeometry(RING_OUTLINE, 0.34, true);
  const bladeAGeo = useTracedGeometry(BLADE_A_OUTLINE, 0.3, false);
  const bladeBGeo = useTracedGeometry(BLADE_B_OUTLINE, 0.3, false);
  const shadowTexture = useShadowTexture();
  const reflectionTexture = useReflectionPoolTexture();
  const particleGeo = useParticleGeometry();
  const particleMaterial = useParticleMaterial();

  const material = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#0a0a0c",
        metalness: 0.55,
        roughness: 0.34,
        clearcoat: 0.55,
        clearcoatRoughness: 0.22,
      }),
    []
  );

  useFrame((state, delta) => {
    particleMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    if (!group.current || !inner.current || !sceneRoot.current) return;

    // See HeroScene.tsx's identical block for the full derivation of why
    // this needs BOTH the anchor-aspect-recovered scale AND the
    // anchor-height-to-canvas-height correction (the second one is what
    // matters most here — HeroSceneLite is the phone tier, where the
    // shared canvas is far taller in pixels than the anchor strip alone).
    const anchor = anchorStateRef.current;
    let scaleFactorValue = 1;
    if (anchor.visible && anchor.heightPx > 0 && size.height > 0) {
      const anchorAspect = anchor.widthPx / anchor.heightPx;
      const recoveredWorldWidth = viewport.height * anchorAspect;
      const anchorScaleFactorValue = Math.min(recoveredWorldWidth / 6.2, 1.05);
      const canvasToAnchorHeightRatio = anchor.heightPx / size.height;
      scaleFactorValue = anchorScaleFactorValue * canvasToAnchorHeightRatio;
      sceneRoot.current.position.x = anchor.nx * (viewport.width / 2);
      sceneRoot.current.position.y = anchor.ny * (viewport.height / 2);
    }
    group.current.scale.setScalar(scaleFactorValue);

    idleAngle.current += delta * 0.16;
    const touch = touchRef.current;
    inner.current.rotation.y = idleAngle.current + touch.spin;

    const p = pointerRef.current;
    const targetX = touch.active ? touch.tiltTarget : p.active ? (p.y * Math.PI) / 13 : 0;
    const targetY = p.active ? (p.x * Math.PI) / 8 : 0;

    const damping = 1 - Math.pow(0.02, delta);
    current.current.x += (targetX - current.current.x) * damping;
    current.current.y += (targetY - current.current.y) * damping;
    group.current.rotation.x = current.current.x;
    group.current.rotation.y = current.current.y;

    group.current.position.x = current.current.y * 0.12;
    group.current.position.y = -current.current.x * 0.08;

    if (shadow.current) {
      shadow.current.position.y = (SHAPE_MIN_Y - 0.55) * scaleFactorValue;
      shadow.current.scale.y = scaleFactorValue;
      shadow.current.position.x = current.current.y * 0.16 * scaleFactorValue;
      shadow.current.scale.x = scaleFactorValue * (1 + Math.abs(current.current.x) * 0.1);
    }

    if (reflection.current) {
      reflection.current.position.y = (SHAPE_MIN_Y - 0.28) * scaleFactorValue;
      reflection.current.scale.y = scaleFactorValue;
      reflection.current.position.x = current.current.y * 0.16 * scaleFactorValue;
      reflection.current.scale.x = scaleFactorValue * (1 + Math.abs(current.current.x) * 0.08);
    }
  });

  return (
    <group ref={sceneRoot}>
      {/* No atmosphere plane here — see the file header for why this is the
          single biggest cost cut for the phone tier. */}
      <points geometry={particleGeo} material={particleMaterial} />

      <group ref={group}>
        <group ref={inner} rotation={[0.1, 0.25, 0.02]}>
          <mesh geometry={ringGeo} material={material} castShadow receiveShadow />
          <mesh geometry={bladeAGeo} material={material} position={[0, 0, -0.02]} castShadow receiveShadow />
          <mesh geometry={bladeBGeo} material={material} position={[0, 0, 0.05]} castShadow receiveShadow />
        </group>
      </group>

      {reflectionTexture && (
        <mesh ref={reflection} position={[0, 0, -0.3]}>
          <planeGeometry args={[SHAPE_HALF_WIDTH * 2.1, SHAPE_HALF_WIDTH * 0.85]} />
          <meshBasicMaterial map={reflectionTexture} transparent opacity={0.6} depthWrite={false} />
        </mesh>
      )}

      {shadowTexture && (
        <mesh ref={shadow} position={[0, 0, -0.4]}>
          <planeGeometry args={[SHAPE_HALF_WIDTH * 2.3, SHAPE_HALF_WIDTH * 1.05]} />
          <meshBasicMaterial map={shadowTexture} transparent opacity={0.55} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}
