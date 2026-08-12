"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import * as THREE from "three";

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

// The four RING_OUTLINE vertices where the outline genuinely bends sharply —
// the two flat "cut" faces at the G's terminus (bottom cut: 8→9, top cut:
// 21→22). Found by measuring the turning angle at every vertex: these four
// turn 48°–117°, every other vertex turns a consistent, gentle ~15°–27° (the
// round arc). Keeping exactly these four as hard straight-line joints and
// Catmull-Rom-splining every other run of vertices between them is what
// removes the polygon facets from the arc while leaving the G's real flat
// terminus corners exactly where the source mark has them — see
// smoothShapeFromOutline().
const RING_CORNER_INDICES = [8, 9, 21, 22];

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

/**
 * Builds a shape from a closed, traced outline where most vertices are
 * smoothed into one continuous Catmull-Rom curve (`Shape.splineThru`) and a
 * given set of "corner" vertices stay hard straight-line joints. This is the
 * fix for the previously facet-visible G ring: same 26 traced points, same
 * order, same proportions — just curved between them instead of straight-
 * lined, except at the two real flat-cut corners, which correctly stay
 * sharp. Traversal starts at a corner (not index 0) so no spline run has to
 * wrap across the array boundary.
 */
function smoothShapeFromOutline(points: Point[], cornerIndices: number[]) {
  const n = points.length;
  const vecs = points.map(([x, y]) => new THREE.Vector2(x, y));
  const corners = new Set(cornerIndices);
  const startIdx = cornerIndices.length > 0 ? cornerIndices[0] : 0;

  const shape = new THREE.Shape();
  shape.moveTo(vecs[startIdx].x, vecs[startIdx].y);

  let run: THREE.Vector2[] = [];
  const flush = () => {
    if (run.length > 0) {
      shape.splineThru(run);
      run = [];
    }
  };

  for (let step = 1; step <= n - 1; step++) {
    const idx = (startIdx + step) % n;
    const v = vecs[idx];
    if (corners.has(idx)) {
      flush();
      shape.lineTo(v.x, v.y);
    } else {
      run.push(v);
    }
  }
  flush();
  shape.closePath();
  return shape;
}

function useTracedGeometry(points: Point[], depth: number, smooth: boolean, cornerIndices?: number[]) {
  return useMemo(() => {
    const shape = smooth ? smoothShapeFromOutline(points, cornerIndices ?? []) : shapeFromOutline(points);
    const geometry = new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      // Straight-edged blades need no curve subdivision. The ring is now
      // built from splined curves (see above), so it needs a high segment
      // count for the arc to render smooth instead of visibly faceted —
      // raised further (48 -> 64 curve, 8 -> 10 bevel) so the curve reads
      // smooth even under the tighter, more raking light angles added below
      // (a coarser tessellation that looked fine under flat lighting can
      // still show facet edges once real specular highlights sweep across
      // it — this is headroom for the lighting change, not a sign the
      // previous curveSegments value was wrong).
      bevelSegments: smooth ? 10 : 4,
      curveSegments: smooth ? 64 : 6,
    });
    // Smooth (averaged) vertex normals across the curved ring faces so the
    // shading itself gradients continuously instead of faceting per
    // triangle — the geometric curve can be perfectly smooth and still
    // *read* faceted under specular light if adjacent triangles keep their
    // own flat face normals instead of blending at shared vertices.
    geometry.computeVertexNormals();
    return geometry;
  }, [points, depth, smooth, cornerIndices]);
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
 * Minimal unlit shader for the reflection meshes: fades alpha from
 * `uOpacity` (capped at spec's 5-10% max) down to 0 over a short vertical
 * distance in the mark's own local space, so the mirrored copy reads as a
 * quick "gradient/mask" falloff rather than a full mirror image — per spec,
 * this is a suggestion of a reflective surface, not a real reflection.
 * A custom ShaderMaterial (rather than a texture-based fade) needs no extra
 * render target or postprocessing pass — just a per-vertex varying, so it
 * costs about the same as the plain material it replaces.
 */
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

function GXForm({ pointerRef }: { pointerRef: React.MutableRefObject<PointerTarget> }) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const shadow = useRef<THREE.Mesh>(null);
  const current = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();
  // Declared here (not down by the JSX that uses it) purely so the
  // useFrame callback below can close over the same variable — refs may
  // not be mutated during render (see the ground-shadow update inside
  // useFrame), and `viewport` is already reactive, so a plain `const`
  // recomputed each render is both simpler and correct: useFrame's
  // callback is passed to a subscription that always invokes the latest
  // render's closure, so this never goes stale between resizes.
  const scaleFactorValue = Math.min(viewport.width / 6.2, 1.05);

  const ringGeo = useTracedGeometry(RING_OUTLINE, 0.34, true, RING_CORNER_INDICES);
  const bladeAGeo = useTracedGeometry(BLADE_A_OUTLINE, 0.3, false);
  const bladeBGeo = useTracedGeometry(BLADE_B_OUTLINE, 0.3, false);
  const shadowTexture = useShadowTexture();
  const reflectionMaterial = useReflectionMaterial();

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

  useFrame((_state, delta) => {
    if (!group.current || !inner.current) return;

    // Idle rotation — ~1.8x the previous rate (0.09 -> 0.16 rad/s), still
    // smooth and cinematic, deliberately short of feeling like it's
    // "spinning". Frame-rate independent since it's scaled by delta.
    inner.current.rotation.y += delta * 0.16;

    // Mouse-controlled orientation: left/right cursor movement drives Y-axis
    // rotation, up/down drives X-axis tilt, so the mark reads as physically
    // responding to the cursor rather than just idly turning. `pointerRef`
    // is only ever marked `active` on fine-pointer (mouse) devices — see the
    // default export below — so touch/mobile always falls straight through
    // to pure idle rotation with zero added branching here.
    const p = pointerRef.current;
    const targetX = p.active ? (p.y * Math.PI) / 13 : 0;
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
  });

  return (
    <>
      <group ref={group} scale={scaleFactorValue}>
        <group ref={inner} rotation={[0.1, 0.25, 0.02]}>
          {/* All three strokes share one traced coordinate space, so they are
              already positioned correctly relative to each other — no manual
              per-mesh offsets needed. */}
          <mesh geometry={ringGeo} material={material} castShadow receiveShadow />
          <mesh geometry={bladeAGeo} material={material} position={[0, 0, -0.02]} castShadow receiveShadow />
          <mesh geometry={bladeBGeo} material={material} position={[0, 0, 0.05]} castShadow receiveShadow />

          {/* Subtle reflection: the same three meshes, mirrored vertically
              across the mark's true bottom edge (SHAPE_MIN_Y) and rendered
              with the fast-fading, capped-opacity shader above. Nested
              inside `inner` so it turns gently together with the mark's own
              idle rotation ("may respond slightly to rotation" per spec) —
              intentionally NOT wired to the mouse-tilt beyond what it
              inherits here, keeping its motion restrained. */}
          <group position={[0, 2 * SHAPE_MIN_Y, 0]} scale={[1, -1, 1]}>
            <mesh geometry={ringGeo} material={reflectionMaterial} />
            <mesh geometry={bladeAGeo} material={reflectionMaterial} position={[0, 0, -0.02]} />
            <mesh geometry={bladeBGeo} material={reflectionMaterial} position={[0, 0, 0.05]} />
          </group>
        </group>
      </group>

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
        <GXForm pointerRef={pointer} />
      </Canvas>

      {/* Invisible, precisely-scoped hit area for the mouse-control
          interaction — centered on the mark, well short of the box edges
          nearest the text column. */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 h-[60%] w-[60%] max-h-[380px] max-w-[380px] -translate-x-1/2 -translate-y-1/2"
        style={{ pointerEvents: "auto" }}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
      />
    </div>
  );
}
