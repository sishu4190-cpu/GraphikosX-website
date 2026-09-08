"use client";

// ---------------------------------------------------------------------------
// GXSceneLite — the phone tier of GXHero.tsx's capability gate. Same traced
// GX mark, same materials, same lighting, same touch-drag interaction as
// GXScene.tsx (the desktop/tablet "full" scene), but with the two most
// GPU-expensive subsystems dropped entirely rather than just turned down:
//
//   - No full-screen domain-warped fbm() "atmosphere" plane. That's a
//     24x16-unit plane running ~12 noise evaluations per pixel every frame
//     across a large screen area — by far the single most expensive part of
//     GXScene.tsx, and a large per-pixel fragment-shader cost is exactly
//     what a phone GPU (typically bandwidth/fillrate-bound, not
//     compute-bound the way a discrete desktop GPU is) pays for most
//     directly.
//   - No EffectComposer postprocessing stack (Bloom/ChromaticAberration/
//     Noise). Each is a full-framebuffer pass; sequential full-screen
//     passes compound worse on a mobile GPU's shared, lower memory
//     bandwidth than the same passes do on desktop.
//   - `dpr` capped lower ([1, 1.2] vs. the full scene's [1, 1.6]) and the
//     particle count roughly halved (90 vs. 180) as two smaller, cheap
//     extra-margin cuts on top of the two big ones above.
//
// This file duplicates GXScene.tsx's geometry/material/lighting code rather
// than sharing it via a prop-driven "lite" flag on that file — consistent
// with this project's own stated convention of touching only what a given
// phase actually needs, and avoiding a single file that has to branch its
// way through two very different perf budgets (see the WebGL-capability
// check comment in WorkScene.tsx for the prior instance of this same
// convention). The one piece that IS shared, deliberately, is the touch
// interaction logic (useHeroTouchControl.ts) — that's the part where a
// second hand-copied implementation would risk the two drifting into
// actually-different (and buggier) drag behavior, not just a different
// look.
// ---------------------------------------------------------------------------

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import { GXTouchGlow } from "@/components/three/GXTouchGlow";
import { useHeroTouchControl, type HeroTouchTarget } from "@/components/three/useHeroTouchControl";

type Point = [number, number];

// Identical traced source data to GXScene.tsx — see that file's own header
// comment for the full provenance (OpenCV contour extraction from the
// official GX logo PNG). Duplicated here rather than imported so this file
// has zero dependency on GXScene.tsx and can be code-split/loaded fully
// independently of it.
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

// Same fitted-circular-arc ring geometry as GXScene.tsx — see that file's
// RING_ARC comment for the derivation.
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

interface PointerTarget {
  x: number;
  y: number;
  active: boolean;
}

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

function useReflectionMaterial() {
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
        uniforms: {
          uColor: { value: new THREE.Color("#05060a") },
          uOpacity: { value: 0.09 },
          uMinY: { value: SHAPE_MIN_Y },
          uFadeRange: { value: 0.85 },
        },
        vertexShader: `
          varying float vY;
          void main() {
            vY = position.y;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 uColor;
          uniform float uOpacity;
          uniform float uMinY;
          uniform float uFadeRange;
          varying float vY;
          void main() {
            float t = clamp((vY - uMinY) / uFadeRange, 0.0, 1.0);
            gl_FragColor = vec4(uColor, uOpacity * (1.0 - t));
          }
        `,
      }),
    []
  );
}

// Roughly half of GXScene.tsx's 180 — the particle field itself was already
// identified as cheap (a 2-instruction vertex shader, a single-circle
// fragment shader), so this is a small extra-margin cut, not one of the two
// load-bearing ones (those are the dropped atmosphere plane and
// postprocessing stack above).
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

function GXFormLite({
  pointerRef,
  touchRef,
}: {
  pointerRef: React.MutableRefObject<PointerTarget>;
  touchRef: React.MutableRefObject<HeroTouchTarget>;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const current = useRef({ x: 0, y: 0 });
  const idleAngle = useRef(0);
  const { viewport } = useThree();
  const scaleFactorValue = Math.min(viewport.width / 6.2, 1.05);

  const ringGeo = useTracedGeometry(RING_OUTLINE, 0.34, true);
  const bladeAGeo = useTracedGeometry(BLADE_A_OUTLINE, 0.3, false);
  const bladeBGeo = useTracedGeometry(BLADE_B_OUTLINE, 0.3, false);
  const shadowTexture = useShadowTexture();
  const reflectionMaterial = useReflectionMaterial();
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

    if (!group.current || !inner.current) return;

    // Same idle-rotation + touch-spin composition as GXScene.tsx's GXForm —
    // see that file's identical comment for the reasoning.
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
      shadow.current.position.x = current.current.y * 0.16 * scaleFactorValue;
      shadow.current.scale.x = scaleFactorValue * (1 + Math.abs(current.current.x) * 0.1);
    }
  });

  return (
    <>
      {/* No atmosphere plane here — see the file header for why this is the
          single biggest cost cut for the phone tier. */}
      <points geometry={particleGeo} material={particleMaterial} />

      <group ref={group} scale={scaleFactorValue}>
        <group ref={inner} rotation={[0.1, 0.25, 0.02]}>
          <mesh geometry={ringGeo} material={material} castShadow receiveShadow />
          <mesh geometry={bladeAGeo} material={material} position={[0, 0, -0.02]} castShadow receiveShadow />
          <mesh geometry={bladeBGeo} material={material} position={[0, 0, 0.05]} castShadow receiveShadow />

          <group position={[0, 2 * SHAPE_MIN_Y, 0]} scale={[1, -1, 1]}>
            <mesh geometry={ringGeo} material={reflectionMaterial} />
            <mesh geometry={bladeAGeo} material={reflectionMaterial} position={[0, 0, -0.02]} />
            <mesh geometry={bladeBGeo} material={reflectionMaterial} position={[0, 0, 0.05]} />
          </group>
        </group>
      </group>

      {shadowTexture && (
        <mesh
          ref={shadow}
          position={[0, (SHAPE_MIN_Y - 0.55) * scaleFactorValue, -0.4]}
          scale={[scaleFactorValue, scaleFactorValue, 1]}
        >
          <planeGeometry args={[SHAPE_HALF_WIDTH * 2.3, SHAPE_HALF_WIDTH * 1.05]} />
          <meshBasicMaterial map={shadowTexture} transparent opacity={0.55} depthWrite={false} />
        </mesh>
      )}
    </>
  );
}

export default function GXSceneLite() {
  const [ready, setReady] = useState(false);
  const pointer = useRef<PointerTarget>({ x: 0, y: 0, active: false });
  const isFinePointer = useRef(false);
  const { target: touchTarget, handlers: touchHandlers } = useHeroTouchControl();

  const resolvePointerCapability = () => {
    if (typeof window !== "undefined" && window.matchMedia) {
      isFinePointer.current = window.matchMedia("(pointer: fine)").matches;
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    resolvePointerCapability();
    if (!isFinePointer.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    pointer.current.active = true;
  };

  const handlePointerLeave = () => {
    pointer.current.active = false;
  };

  return (
    <div className="absolute inset-0">
      <Canvas
        className="!absolute inset-0"
        // Capped lower than the full scene's [1, 1.6] — one of this tier's
        // two small extra-margin cuts (see file header). Phones' higher
        // typical devicePixelRatio (2-3x) means an uncapped-further value
        // here would matter a lot more than it does on desktop.
        dpr={[1, 1.2]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.4], fov: 40 }}
        onCreated={() => setReady(true)}
        style={{ opacity: ready ? 1 : 0, transition: "opacity 700ms ease", pointerEvents: "none" }}
      >
        <ambientLight intensity={0.32} />
        <hemisphereLight args={["#eef2ff", "#050506", 0.5]} />
        <directionalLight position={[3, 4, 5]} intensity={0.55} color="#ffffff" />
        <directionalLight position={[-4, 1.2, 3.5]} intensity={0.4} color="#ffffff" />
        <pointLight position={[-3.5, -1, -2.5]} intensity={20} color="#1D4ED8" />
        <pointLight position={[2.6, -1.6, 1.6]} intensity={7} color="#1D4ED8" />
        <GXFormLite pointerRef={pointer} touchRef={touchTarget} />
        {/* No EffectComposer/Bloom/ChromaticAberration/Noise — see file
            header for why this is the phone tier's other big cost cut. */}
      </Canvas>

      <GXTouchGlow targetRef={touchTarget} />

      <div
        aria-hidden
        data-gx-cursor="drag"
        className="absolute top-1/2 left-1/2 h-[60%] w-[60%] max-h-[380px] max-w-[380px] -translate-x-1/2 -translate-y-1/2"
        style={{ pointerEvents: "auto", touchAction: "none" }}
        onPointerDown={touchHandlers.onPointerDown}
        onPointerMove={(event) => {
          handlePointerMove(event);
          touchHandlers.onPointerMove(event);
        }}
        onPointerUp={touchHandlers.onPointerEnd}
        onPointerCancel={touchHandlers.onPointerEnd}
        onPointerLeave={handlePointerLeave}
      />
    </div>
  );
}
