"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise } from "@react-three/postprocessing";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";
import { GXTouchGlow } from "@/components/three/GXTouchGlow";
import { useHeroTouchControl, type HeroTouchTarget } from "@/components/three/useHeroTouchControl";

// ---------------------------------------------------------------------------
// Geometry source of truth: every point below was traced directly from the
// official GraphikosX GX logo PNG (not hand-drawn/approximated). The PNG's
// dark-pixel silhouette was segmented into its three real strokes — the G
// ring and the two crossing X blades — via connected-component analysis and
// contour extraction (OpenCV `findContours` + `approxPolyDP`), then
// normalized into this local unit space (centered on the mark's combined
// bounding box, Y flipped since image coordinates grow downward). The same
// three polygons drive both this 3D extrusion and the 2D SVG fallback in
// GXFallback.tsx, so both renderings are pixel-faithful to the same source
// and to each other. Point order/positions are UNCHANGED from the traced
// data — see smoothShapeFromOutline() below for how the visible G arc was
// made round without altering a single coordinate.
// ---------------------------------------------------------------------------

type Point = [number, number];

// The G ring — one continuous outline. Because the ring is an open "C" (not
// a closed annulus), its true silhouette is a SINGLE closed polygon that
// already traces both the outer arc and the inner arc, meeting at the two
// diagonally-cut terminus points — no separate "hole" shape is needed.
const RING_OUTLINE: Point[] = [
  [-0.1806, 1.2556], [-0.6306, 1.2833], [-1.0417, 1.1444], [-1.4083, 0.8278],
  [-1.625, 0.3944], [-1.6639, -0.0778], [-1.5417, -0.4833], [-1.2528, -0.8611],
  [-0.8472, -1.0889], [-0.5861, -0.8], [-0.7806, -0.7444], [-0.9917, -0.6167],
  [-1.1528, -0.4444], [-1.2528, -0.2556], [-1.3028, 0.1778], [-1.2306, 0.4222],
  [-1.1139, 0.6111], [-0.8861, 0.8056], [-0.5194, 0.9167], [-0.175, 0.8556],
  [-0.0139, 0.7556], [0.1139, 0.6111], [0.5306, 0.6111], [0.4194, 0.8333],
  [0.2583, 1.0167], [0.0528, 1.1611],
];

// RING_OUTLINE indices 8, 9, 21, 22 are the two flat "cut" faces at the G's
// terminus (bottom cut: 8→9, top cut: 21→22) — found by measuring the
// turning angle at every vertex: these four turn 48°–117°, every other
// vertex turns a consistent, gentle ~15°–27° (the round arc). They're no
// longer read at runtime (the ring is now built from RING_ARC's precomputed
// circular-arc parameters below, not from this point array directly), but
// stay documented here because RING_ARC's own derivation depended on this
// same corner/arc split — see the comment above RING_ARC.

// X blade "A" — the long diagonal stroke (top-right to bottom-left). In the
// source PNG this stroke is visually split by the weave gap where blade B
// crosses in front of it; the true outline is the convex hull of both
// fragments, which reconstructs the full parallelogram exactly.
const BLADE_A_OUTLINE: Point[] = [
  [1.6639, 1.1778], [-0.3917, -1.2833], [-0.8361, -1.2833], [1.2806, 1.1778],
];

// X blade "B" — the shorter diagonal stroke, drawn in front at the crossing,
// with the small elbow near its near end that tucks into the G's opening
// (the interlocking negative space that reads as one connected "GX" mark).
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

// ---------------------------------------------------------------------------
// RING ARC GEOMETRY — round 2 of the "not properly curved" fix.
//
// Round 1 (Catmull-Rom `splineThru()` through the 26 traced points, see git
// history) fixed the *faceting* — the ring stopped being visibly polygonal —
// but Prakash's follow-up feedback was sharper than that: the arc still
// didn't read as a true circle the way the reference logo's does, because a
// spline through hand/auto-traced points follows whatever small noise is in
// that tracing (a few hundredths of a unit of wobble per point), and that
// noise stays visible as a not-quite-constant curvature even after it's
// smoothed. A real "C" ring in a vector logo is almost always two concentric
// circular arcs, not a hand-fit curve — so this round replaces the spline
// with actual circular arcs.
//
// RING_ARC is fit *offline* (see /tmp/gx-work/arc-fit/final.mjs, not part of
// this repo) by least-squares-fitting a circle through the 13 points that
// make up each of the ring's two curved runs (points 9-21 for the inner
// edge, 22-8 for the outer edge — the same runs round 1 already treated as
// "the curved parts", see RING_CORNER_INDICES below), then averaging the two
// fitted centers (they were already only ~0.03 units apart out of a ~1-unit
// radius, so this is a sub-1% nudge, not a reshaping). The four corner
// points — the ring's genuinely flat cut faces at the G's terminus — are
// then snapped onto their respective circle at their own existing angle
// (moved by at most ~0.03 units) so the straight cut edges below meet the
// arcs with zero kink. Same source data, same proportions, same corners —
// the curved parts are just mathematically perfect circles now instead of a
// close approximation of one.
const RING_ARC = {
  cx: -0.48484,
  cy: 0.06517,
  innerR: 0.84487,
  outerR: 1.19612,
  // s8/s9 bound the bottom straight cut; s21/s22 bound the top straight cut.
  // Angles are radians in THREE's standard (Y-up, counter-clockwise-positive)
  // convention, ready for Shape.absarc().
  s8: { x: -0.84315, y: -1.07601, a: -1.87503 },
  s9: { x: -0.58305, y: -0.77397, a: -1.68731 },
  s21: { x: 0.13948, y: 0.63442, a: 0.73929 },
  s22: { x: 0.56867, y: 0.63157, a: 0.49329 },
};

/**
 * Builds the G ring as two true circular arcs (inner edge, outer edge)
 * joined by the two straight cut faces at the terminus — see RING_ARC above
 * for how the arc parameters were derived. Direction (`absarc`'s `clockwise`
 * flag) for each arc was determined empirically from the source points'
 * actual angular progression around the fitted center, not assumed: the
 * inner edge sweeps clockwise, the outer edge counter-clockwise, both the
 * "long way" (~221°/~224°) around, since the ring is open only at the
 * narrow terminus gap.
 */
function ringShapeFromArcs() {
  const { cx, cy, innerR, outerR, s8, s9, s21, s22 } = RING_ARC;
  const shape = new THREE.Shape();
  shape.moveTo(s8.x, s8.y);
  shape.lineTo(s9.x, s9.y); // bottom cut face (straight)
  shape.absarc(cx, cy, innerR, s9.a, s21.a, true); // inner edge
  shape.lineTo(s22.x, s22.y); // top cut face (straight)
  shape.absarc(cx, cy, outerR, s22.a, s8.a, false); // outer edge
  shape.closePath();
  return shape;
}

function useTracedGeometry(points: Point[], depth: number, smooth: boolean) {
  return useMemo(() => {
    // `smooth` is only ever true for the ring (see call sites below), which
    // now builds from two true circular arcs (ringShapeFromArcs, see above)
    // rather than a generic point-based curve — `points` is unused on that
    // branch as a result, kept only so both call sites share one signature.
    const shape = smooth ? ringShapeFromArcs() : shapeFromOutline(points);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      // Straight-edged blades need no curve subdivision. The ring is built
      // from two circular arcs (see ringShapeFromArcs), so it needs a high
      // segment count for those arcs to render smooth instead of visibly
      // faceted — this tessellation is cheap for a shape this simple, so
      // there's no real cost to erring generous here.
      bevelSegments: smooth ? 14 : 4,
      curveSegments: smooth ? 96 : 6,
    });
    // Smooth (averaged) vertex normals across the curved ring faces so the
    // shading itself gradients continuously instead of faceting per
    // triangle — the geometric curve can be perfectly smooth and still
    // *read* faceted under specular light if adjacent triangles keep their
    // own flat face normals instead of blending at shared vertices.
    geometry.computeVertexNormals();
    return geometry;
  }, [points, depth, smooth]);
}

/** Bounding Y-extent of the traced mark, computed once from the source
 * outlines themselves (not a runtime Box3 pass) — used to position the
 * ground shadow and reflection exactly at the mark's true bottom/top edge
 * regardless of which stroke happens to reach furthest. */
const ALL_OUTLINE_POINTS = [...RING_OUTLINE, ...BLADE_A_OUTLINE, ...BLADE_B_OUTLINE];
const SHAPE_MIN_Y = Math.min(...ALL_OUTLINE_POINTS.map((p) => p[1]));
const SHAPE_HALF_WIDTH = Math.max(...ALL_OUTLINE_POINTS.map((p) => Math.abs(p[0])));

interface PointerTarget {
  x: number;
  y: number;
  active: boolean;
}

/** Soft, heavily-blurred radial-gradient canvas texture for the contact
 * shadow — generated once client-side (this component only ever mounts
 * inside the "3d" branch, post-hydration, so `document` is always safe
 * here). A baked-blur gradient texture costs nothing per-frame to draw,
 * unlike a real-time blur pass, and reads exactly as "heavily blurred, low
 * opacity" per spec. */
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

/**
 * Soft, heavily-blurred radial-gradient canvas texture for the reflection
 * pool beneath the mark — same baked-gradient technique as the contact
 * shadow above (`useShadowTexture`), tinted with the brand's rim-light blue
 * instead of near-black, so it reads as the mark's own light pooling on a
 * surface rather than a second shadow.
 *
 * Replaces a previous version that mirrored the mark's own G+X geometry
 * vertically with an alpha-faded shader. That looked like "a thin line"
 * rather than a reflection pool for a structural reason, not just a tuning
 * one: it was a genuine 3D mesh nested inside the SAME rotating group as
 * the mark, so at most rotation angles (mid-drag, mid-idle-spin) it
 * presented almost no cross-section to the camera — a mostly-flat shape
 * foreshortens to near-nothing from the side, same as a coin turned edge-on
 * disappears. It also was never round/oval to begin with — it was the
 * letter-shaped silhouette, mirrored, so even face-on it never read as "a
 * pool". A camera-facing billboard plane (below) can't foreshorten to a
 * line no matter how the mark itself rotates — exactly why the contact
 * shadow was already built this way (see that mesh's own comment) — and a
 * radial gradient is round/oval by construction.
 */
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

// ---------------------------------------------------------------------------
// PHASE 6 — hero atmosphere: liquid-noise background glow + a sparse
// particle field, both added purely as a background/atmosphere LAYER behind
// the traced GX mark, per the plan ("the traced geometry stays as the
// centerpiece; shader work becomes the background around it, not a
// replacement for the logo mesh itself"). Neither the mark's geometry, its
// material, the lighting, nor GXHero.tsx's capability gate (WebGL support /
// deviceMemory / prefers-reduced-motion / small screen — reduced-motion
// visitors never reach this file at all, so nothing here needs its own
// reduced-motion branch) change at all in this phase.
//
// Deliberately a hand-rolled hash-based value-noise `fbm()` (below), not a
// ported Simplex/Perlin implementation — cheaper per-pixel (no gradient
// table, no permutation lookups), visually indistinguishable at the very
// low opacity/blur this is used at, and zero risk of a subtly-wrong port of
// someone else's GLSL. No new npm dependency either way — this is plain
// GLSL source, same as the shadow/reflection canvas-texture gradients above.
// ---------------------------------------------------------------------------
const NOISE_GLSL = `
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }
  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  // Fractal Brownian Motion: several octaves of the value noise above,
  // each half the amplitude and double the frequency of the last — this is
  // what turns a single blobby noise field into something that reads as
  // organic/liquid rather than a blurry checkerboard.
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * valueNoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }
`;

/**
 * Soft, slowly-flowing gradient-noise glow on a single background plane —
 * the "liquid distortion" half of Phase 6. Domain-warped fbm (the noise
 * field is itself displaced by a second noise field before the final
 * lookup — the standard technique for turning blobby noise into something
 * that reads as flowing liquid rather than static clouds), faded to zero
 * via a radial mask so it reads as atmosphere concentrated around the mark
 * rather than a flat painted panel filling the whole canvas. Additive
 * blending + a low alpha ceiling (~0.1) keeps this from ever competing with
 * the mark itself or the existing `.gx-hero-glow` CSS glow behind it — it's
 * meant to be felt more than seen.
 */
function useAtmosphereMaterial() {
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
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          ${NOISE_GLSL}
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            vec2 uv = vUv * 2.0 - 1.0; // recenter to -1..1
            vec2 p = uv * 1.6;
            vec2 warp = vec2(
              fbm(p + uTime * 0.035),
              fbm(p + vec2(5.2, 1.3) - uTime * 0.028)
            );
            float n = fbm(p * 0.8 + warp * 0.9);
            float radial = 1.0 - smoothstep(0.0, 1.15, length(uv));
            float alpha = n * radial * 0.10;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
      }),
    []
  );
}

// Kept deliberately modest — this is exactly the "GPU frame time on a
// mid-range device" risk the plan flags for Phase 6, and GXHero's gate
// already only lets capable-but-not-necessarily-high-end devices reach
// this component (it excludes low deviceMemory/small screens, not "desktop
// only"). 180 points with a 2-instruction vertex shader and a
// single-circle fragment shader is a trivial GPU cost either way.
const PARTICLE_COUNT = 180;

/**
 * Particle positions scattered in a ring-biased volume around the mark
 * (angle + radius, not a uniform box) so particles frame the mark rather
 * than cluster in front of its face reading as noise on top of the logo.
 * `aSeed` is a per-particle random phase so the drift/twinkle in the
 * material below is staggered rather than every particle moving in lockstep.
 */
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

/**
 * Particle field material — the second half of Phase 6's atmosphere layer.
 * Each point drifts on a slow sine/cosine orbit (driven by `uTime` + its own
 * `aSeed`, so motion is smooth and never repeats in sync across particles)
 * and gently twinkles in size/opacity the same way. `gl_PointSize` is
 * attenuated by camera distance so nearer particles read larger, same
 * depth cue a real particle system would have. Additive blending + capped
 * alpha (~0.5 of an already-soft circular falloff) keeps these reading as
 * faint drifting light motes, not a busy field of dots.
 */
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

function GXForm({
  pointerRef,
  touchRef,
}: {
  pointerRef: React.MutableRefObject<PointerTarget>;
  touchRef: React.MutableRefObject<HeroTouchTarget>;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const reflection = useRef<THREE.Mesh>(null);
  const current = useRef({ x: 0, y: 0 });
  // Idle auto-rotation is now accumulated into its own persistent angle
  // (rather than written straight to `inner.rotation.y` each frame) so a
  // touch drag's cumulative spin (see useHeroTouchControl.ts) can be added
  // on TOP of it every frame without the two fighting over the same
  // read-modify-write — idleAngle always keeps advancing at its own steady
  // rate regardless of what touch is doing, exactly like desktop's idle
  // rotation always has.
  const idleAngle = useRef(0);
  const { viewport } = useThree();
  // Declared here (not down by the JSX that uses it) purely so the
  // useFrame callback below can close over the same variable — refs may
  // not be mutated during render (see the ground-shadow update inside
  // useFrame), and `viewport` is already reactive, so a plain `const`
  // recomputed each render is both simpler and correct: useFrame's
  // callback is passed to a subscription that always invokes the latest
  // render's closure, so this never goes stale between resizes.
  const scaleFactorValue = Math.min(viewport.width / 6.2, 1.05);

  const ringGeo = useTracedGeometry(RING_OUTLINE, 0.34, true);
  const bladeAGeo = useTracedGeometry(BLADE_A_OUTLINE, 0.3, false);
  const bladeBGeo = useTracedGeometry(BLADE_B_OUTLINE, 0.3, false);
  const shadowTexture = useShadowTexture();
  const reflectionTexture = useReflectionPoolTexture();
  const atmosphereMaterial = useAtmosphereMaterial();
  const particleGeo = useParticleGeometry();
  const particleMaterial = useParticleMaterial();

  // Matte black / dark metallic body — the blue reads entirely from rim
  // lighting (see the point lights in GXScene below), never from the
  // material's own color, matching the flat-black official mark. Clearcoat
  // raised slightly and its roughness lowered (0.35 -> 0.22) so the bevel
  // edges catch a crisp, thin, precision-machined highlight under the
  // raking fill light added below, instead of the body reading as one flat
  // silhouette with no visible curvature from most angles.
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
    // Phase 6 atmosphere: both shader materials are pure functions of
    // elapsed time, no per-frame branching or ref needed beyond the
    // uniform write itself.
    atmosphereMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    particleMaterial.uniforms.uTime.value = state.clock.elapsedTime;

    if (!group.current || !inner.current) return;

    // Idle rotation — ~1.8x the previous rate (0.09 -> 0.16 rad/s), still
    // smooth and cinematic, deliberately short of feeling like it's
    // "spinning". Frame-rate independent since it's scaled by delta. A
    // touch drag's persistent spin (useHeroTouchControl.ts) is added on top
    // of this every frame — never replaces it — so idle rotation keeps
    // advancing at its own pace whether or not anyone has touched the mark.
    idleAngle.current += delta * 0.16;
    const touch = touchRef.current;
    inner.current.rotation.y = idleAngle.current + touch.spin;

    // Mouse-controlled orientation: left/right cursor movement drives Y-axis
    // rotation, up/down drives X-axis tilt, so the mark reads as physically
    // responding to the cursor rather than just idly turning. `pointerRef`
    // is only ever marked `active` on fine-pointer (mouse) devices, and a
    // touch drag never sets it — so the two inputs never fight over the
    // same value. When a touch drag IS active, its own tilt target (same
    // spring-back damped-lerp mechanism, just fed from the finger's
    // vertical movement instead of the mouse's) takes over the X axis.
    const p = pointerRef.current;
    const targetX = touch.active ? touch.tiltTarget : p.active ? (p.y * Math.PI) / 13 : 0;
    const targetY = p.active ? (p.x * Math.PI) / 8 : 0;

    // Frame-rate independent critically-damped approach to the target
    // (exponential smoothing keyed off `delta`, not a fixed per-frame
    // fraction) — smooth and controlled at 30fps, 60fps or 120fps alike.
    // When the cursor leaves the hero (or on touch), the target snaps back
    // to (0, 0) above, so this same lerp carries the mark smoothly back into
    // its idle orientation rather than cutting immediately.
    const damping = 1 - Math.pow(0.02, delta);
    current.current.x += (targetX - current.current.x) * damping;
    current.current.y += (targetY - current.current.y) * damping;
    group.current.rotation.x = current.current.x;
    group.current.rotation.y = current.current.y;

    // Very subtle perspective/parallax nudge in the same direction as the
    // tilt, reinforcing the sense of orbiting the mark rather than it simply
    // rotating in place. Kept tiny on purpose.
    group.current.position.x = current.current.y * 0.12;
    group.current.position.y = -current.current.x * 0.08;

    // Ground shadow: deliberately NOT a child of `group`/`inner` (which
    // would tilt the flat ellipse in 3D right along with the mark and break
    // the "resting on a surface" read). Instead it stays a flat,
    // camera-facing plane and only ever nudges its position/stretch by a
    // small fraction of the same damped tilt values — "slightly responsive
    // to orientation", per spec, not literally rotating with it.
    if (shadow.current) {
      shadow.current.position.x = current.current.y * 0.16 * scaleFactorValue;
      shadow.current.scale.x = scaleFactorValue * (1 + Math.abs(current.current.x) * 0.1);
    }

    // Reflection pool: same "flat camera-facing billboard, nudged not
    // rotated" treatment as the shadow just above, for the same reason —
    // see useReflectionPoolTexture()'s comment for why this replaced a
    // rotating mirrored-geometry mesh.
    if (reflection.current) {
      reflection.current.position.x = current.current.y * 0.16 * scaleFactorValue;
      reflection.current.scale.x = scaleFactorValue * (1 + Math.abs(current.current.x) * 0.08);
    }
  });

  return (
    <>
      {/* Phase 6 atmosphere layer — a large soft-noise plane and a sparse
          particle field, both well behind the mark (negative Z) and both
          outside the `group`/`inner` rotation groups so they read as
          ambient environment rather than turning with the mark itself.
          Fixed generous plane size rather than computed per-viewport: the
          radial fade in the shader already tapers it to fully transparent
          well before any realistic hero viewport's edge, so exact
          edge-to-edge coverage isn't needed. */}
      <mesh position={[0, 0, -3]} material={atmosphereMaterial}>
        <planeGeometry args={[24, 16]} />
      </mesh>
      <points geometry={particleGeo} material={particleMaterial} />

      <group ref={group} scale={scaleFactorValue}>
        <group ref={inner} rotation={[0.1, 0.25, 0.02]}>
          {/* All three strokes share one traced coordinate space, so they are
              already positioned correctly relative to each other — no manual
              per-mesh offsets needed. */}
          <mesh geometry={ringGeo} material={material} castShadow receiveShadow />
          <mesh geometry={bladeAGeo} material={material} position={[0, 0, -0.02]} castShadow receiveShadow />
          <mesh geometry={bladeBGeo} material={material} position={[0, 0, 0.05]} castShadow receiveShadow />
        </group>
      </group>

      {/* Reflection pool — a flat, camera-facing billboard with a
          blue-tinted radial-gradient texture, positioned just beneath the
          mark and just in front of (closer to camera than) the contact
          shadow below, so it layers as a brighter, tighter pool of light
          sitting inside the shadow's broader, darker spread. Deliberately
          NOT nested inside `group`/`inner` — see useReflectionPoolTexture's
          comment for why a billboard (not a rotating mirrored mesh) is what
          keeps this reading as an oval reflection at every rotation angle,
          same reasoning as the contact shadow just below. */}
      {reflectionTexture && (
        <mesh
          ref={reflection}
          position={[0, (SHAPE_MIN_Y - 0.28) * scaleFactorValue, -0.3]}
          scale={[scaleFactorValue, scaleFactorValue, 1]}
        >
          <planeGeometry args={[SHAPE_HALF_WIDTH * 2.1, SHAPE_HALF_WIDTH * 0.85]} />
          <meshBasicMaterial map={reflectionTexture} transparent opacity={0.6} depthWrite={false} />
        </mesh>
      )}

      {/* Contact shadow — a heavily-blurred, low-opacity radial gradient on
          a flat camera-facing plane positioned just beneath the mark. This
          is intentionally NOT a rotated "floor" plane: the camera looks at
          the mark head-on with no elevation, so a true ground plane would
          render edge-on and be invisible. A billboard ellipse is the
          standard cheap technique for a "grounding" contact shadow in a
          frontal product-shot composition like this one, and is what the
          spec asks for ("without making it look like it is sitting on an
          obvious floor"). */}
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

export default function GXScene() {
  const [ready, setReady] = useState(false);
  const pointer = useRef<PointerTarget>({ x: 0, y: 0, active: false });
  const isFinePointer = useRef(false);
  const { target: touchTarget, handlers: touchHandlers } = useHeroTouchControl();

  // Resolved lazily on the first real pointer event rather than in an
  // effect-on-mount, so there's zero risk of it running before hydration —
  // matchMedia is only ever read from inside a browser-only event handler.
  const resolvePointerCapability = () => {
    if (typeof window !== "undefined" && window.matchMedia) {
      isFinePointer.current = window.matchMedia("(pointer: fine)").matches;
    }
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return; // touch/pen: idle rotation only, per spec
    resolvePointerCapability();
    if (!isFinePointer.current) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pointer.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.current.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    pointer.current.active = true;
  };

  const handlePointerLeave = () => {
    // Cursor left the hero — the useFrame loop above lerps smoothly back to
    // pure idle rotation rather than snapping.
    pointer.current.active = false;
  };

  return (
    // Everything here stays pointer-events-none (inherited from Hero.tsx's
    // decorative wrapper) EXCEPT the small centered overlay below — the
    // mouse-controlled tilt only needs to know roughly where the cursor is
    // relative to the mark, not to hit-test the whole half-width decorative
    // box (which can geometrically approach the CTA buttons at
    // tablet/narrow-desktop widths — see the comment in Hero.tsx).
    <div className="absolute inset-0">
      <Canvas
        className="!absolute inset-0"
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.4], fov: 40 }}
        onCreated={() => setReady(true)}
        style={{ opacity: ready ? 1 : 0, transition: "opacity 700ms ease", pointerEvents: "none" }}
      >
        <ambientLight intensity={0.32} />
        {/* Soft sky/ground fill — cheap (no textures/env map), but gives the
            matte black body a continuous top-to-bottom tonal gradient
            instead of one flat black silhouette. This is what actually
            makes the ring's already-smooth curve *read* as smooth rather
            than faceted: a perfectly round surface under totally flat
            lighting still looks like an undifferentiated black shape. */}
        <hemisphereLight args={["#eef2ff", "#050506", 0.5]} />
        <directionalLight position={[3, 4, 5]} intensity={0.55} color="#ffffff" />
        {/* Low-angle raking key light — sweeps a thin, precise specular
            highlight across the bevel as the mark idles/tilts, the visual
            cue that reads as "precision-machined metal" rather than
            "flat cutout". */}
        <directionalLight position={[-4, 1.2, 3.5]} intensity={0.4} color="#ffffff" />
        {/* Electric-blue rim lighting — the signature GraphikosX accent */}
        <pointLight position={[-3.5, -1, -2.5]} intensity={20} color="#1D4ED8" />
        <pointLight position={[2.6, -1.6, 1.6]} intensity={7} color="#1D4ED8" />
        <GXForm pointerRef={pointer} touchRef={touchTarget} />

        {/* PHASE 7 — postprocessing. Imported only from this file, which is
            itself only ever reached via GXHero.tsx's `dynamic(..., { ssr:
            false })` import — already an isolated, homepage-only chunk since
            Phase 6 (verified below). Kept to exactly the plan's three
            effects, since each EffectComposer pass is real extra GPU cost on
            mobile:
              - Bloom: catches genuine bright pixels (the rim-lit metal
                specular highlights from the blue point lights, and the
                additive Phase 6 atmosphere/particles where they overlap
                densely) and gives them a soft glow halo. `luminanceThreshold`
                is deliberately not near 0 — the scene's transparent
                background and matte body should stay untouched; only real
                highlights should bloom. `mipmapBlur` is the cheaper of the
                two blur strategies this library offers and still reads as a
                smooth falloff at this scale.
              - ChromaticAberration: a barely-there RGB channel offset
                (fractions of a pixel) for a touch of lens realism — enough to
                feel intentional, not enough to look like a glitch effect.
                `radialModulation`/`modulationOffset` are required props on
                this component's type even though we don't want radial
                falloff behavior, so they're set to their "off" values
                explicitly rather than left to an implicit default.
              - Noise: very low opacity film grain over the whole canvas, the
                classic "this was rendered, not a flat vector" texture cue —
                capped low enough that it never reads as visible static over
                the crisp brand mark.
            No `SMAA`/`FXAA` pass added on top — the Canvas already requests
            `antialias: true` GL-level MSAA, and adding a 4th composited pass
            here purely for AA isn't worth the frame-time cost per the plan's
            "keep the effect stack short" guidance. */}
        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={0.35} luminanceThreshold={0.28} luminanceSmoothing={0.9} mipmapBlur />
          <ChromaticAberration offset={[0.0006, 0.0006]} radialModulation={false} modulationOffset={0} />
          <Noise opacity={0.03} />
        </EffectComposer>
      </Canvas>

      {/* Touch-only glow trail (GXTouchGlow.tsx) — reads the same
          touchTarget ref the hit region below feeds, only ever visible
          while a finger is actively dragging (see that component's own
          `.gx-touch-glow` CSS + `is-active` toggle). Painted above the
          Canvas, `pointer-events: none` throughout so it never interferes
          with the hit region's own touch handling. */}
      <GXTouchGlow targetRef={touchTarget} />

      {/* Invisible, precisely-scoped hit area for the mouse/touch
          interaction — centered on the mark, well short of the box edges
          nearest the text column. `data-gx-cursor="drag"` is Phase 9's
          full-custom-cursor state hook (GXCursor.tsx, mounted in
          app/page.tsx) — read via delegated `pointerover`, not a listener
          added here, so this stays a plain data attribute with zero new
          behavior of its own.

          `touchAction: "none"` is scoped to ONLY this small region (not the
          page, not even the rest of the hero) — dragging the hologram
          itself should rotate it rather than scroll the page underneath
          the finger, but scrolling must stay 100% native everywhere else,
          including the rest of this same hero section. Combined with
          useHeroTouchControl.ts's pointer-capture-on-down, this is what
          makes "drag the hologram while also scrolling past it" (the
          worst-case combined-load scenario) behave predictably: the drag
          started on this element keeps belonging to it regardless of where
          the finger wanders, and never gets reinterpreted as a page
          scroll gesture partway through. */}
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
