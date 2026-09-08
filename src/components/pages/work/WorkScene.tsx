"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, ChromaticAberration, EffectComposer, Noise } from "@react-three/postprocessing";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import * as THREE from "three";
import { workCaseStudy, type WorkFacet } from "@/lib/data/work";

// ---------------------------------------------------------------------------
// PHASE 8 — "Our Work" showcase grid. In the spirit of Lusion's featured-work
// grids per the plan: a small row of textured planes with a hover-driven
// distortion shader, reusing the same "hand-rolled GLSL ShaderMaterial, no
// drei" discipline as GXScene.tsx (Phases 6/7). This component is the
// decorative visual centerpiece ONLY — the real, always-rendered content
// (real <Image>s, real text, real DOM anchors) lives in WorkCaseStudy.tsx
// and is what search engines and keyboard/screen-reader users actually get;
// see WorkShowcase.tsx for how this component is gated and marked
// aria-hidden.
// ---------------------------------------------------------------------------

// Matches the generated tile artwork's own pixel aspect ratio (1000x1250)
// exactly, so the plane never stretches the image.
const TILE_ASPECT = 1000 / 1250;
const TILE_H = 2.5;
const TILE_W = TILE_H * TILE_ASPECT;
const SPACING = TILE_W * 1.22;

/**
 * Manual texture loader (no drei's `useTexture`, consistent with the rest of
 * this codebase's "no drei" constraint) — returns `null` until the image has
 * actually decoded, so callers can render a real placeholder in the
 * meantime rather than a blank/invisible plane (the plan's explicit test
 * for this phase: "image texture loading has a real loading/placeholder
 * state").
 */
function useLoadedTexture(url: string) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);
  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    loader.load(url, (tex) => {
      if (cancelled) return;
      tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
    });
    return () => {
      cancelled = true;
    };
  }, [url]);
  return texture;
}

// A single 1x1 white pixel so the shader's `uMap` sampler always has a valid
// texture bound (avoids a WebGL warning/undefined read before the real
// image loads) — its color never actually shows, since `uLoaded` is 0 until
// the real texture is ready and the fragment shader mixes from
// `uPlaceholderColor`, not from this dummy texture, while uLoaded is low.
function useDummyTexture() {
  return useMemo(() => {
    const data = new Uint8Array([255, 255, 255, 255]);
    const tex = new THREE.DataTexture(data, 1, 1, THREE.RGBAFormat);
    tex.needsUpdate = true;
    return tex;
  }, []);
}

/**
 * The hover "morph/distortion" shader — a radial ripple in UV space whose
 * amplitude scales with a smoothed `uHover` value (0..1, eased in useFrame
 * below rather than snapping), plus a faint blue wash toward the brand
 * accent on hover for a "glass" feel. Deliberately a UV-space fragment
 * distortion rather than true vertex displacement: visually reads the same
 * as a "liquid" hover morph at this scale, and needs no extra geometry
 * subdivision — cheaper, same hand-rolled-shader spirit as GXScene.tsx.
 */
const TILE_FRAGMENT_SHADER = `
  uniform sampler2D uMap;
  uniform float uHover;
  uniform float uLoaded;
  uniform float uTime;
  uniform vec3 uPlaceholderColor;
  varying vec2 vUv;

  void main() {
    vec2 centered = vUv - 0.5;
    float dist = length(centered);
    float ripple = sin(dist * 16.0 - uTime * 2.5) * 0.018 * uHover;
    vec2 distortedUv = vUv + normalize(centered + 0.0001) * ripple;
    vec3 texColor = texture2D(uMap, distortedUv).rgb;
    vec3 color = mix(uPlaceholderColor, texColor, uLoaded);
    color = mix(color, color + vec3(0.02, 0.05, 0.18), uHover * 0.4);
    gl_FragColor = vec4(color, 1.0);
  }
`;

const TILE_VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

function Tile({
  facet,
  index,
  hovered,
  onHover,
  onSelect,
}: {
  facet: WorkFacet;
  index: number;
  hovered: boolean;
  onHover: (index: number | null) => void;
  onSelect: (slug: string) => void;
}) {
  const texture = useLoadedTexture(facet.image);
  const dummyTexture = useDummyTexture();
  const meshRef = useRef<THREE.Mesh>(null);
  const hoverAmount = useRef(0);
  const loadedAmount = useRef(0);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uMap: { value: dummyTexture },
          uHover: { value: 0 },
          uLoaded: { value: 0 },
          uTime: { value: 0 },
          // Neutral light-grey placeholder (matches the site's --color-
          // grey-100 token) rather than a jarring flat color while the real
          // artwork decodes.
          uPlaceholderColor: { value: new THREE.Color("#f2f3f5") },
        },
        vertexShader: TILE_VERTEX_SHADER,
        fragmentShader: TILE_FRAGMENT_SHADER,
      }),
    [dummyTexture]
  );

  useEffect(() => {
    if (texture) material.uniforms.uMap.value = texture;
  }, [texture, material]);

  useFrame((state, delta) => {
    const targetHover = hovered ? 1 : 0;
    const targetLoaded = texture ? 1 : 0;
    const damping = 1 - Math.pow(0.001, delta);
    hoverAmount.current += (targetHover - hoverAmount.current) * damping;
    loadedAmount.current += (targetLoaded - loadedAmount.current) * damping;
    material.uniforms.uHover.value = hoverAmount.current;
    material.uniforms.uLoaded.value = loadedAmount.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;

    if (meshRef.current) {
      const targetScale = 1 + hoverAmount.current * 0.035;
      const current = meshRef.current.scale.x;
      const next = current + (targetScale - current) * 0.2;
      meshRef.current.scale.setScalar(next);
    }
  });

  const x = (index - (workCaseStudy.facets.length - 1) / 2) * SPACING;

  return (
    <mesh
      ref={meshRef}
      position={[x, 0, 0]}
      material={material}
      onPointerOver={(e) => {
        e.stopPropagation();
        onHover(index);
      }}
      onPointerOut={() => onHover(null)}
      onClick={() => onSelect(facet.slug)}
    >
      <planeGeometry args={[TILE_W, TILE_H]} />
    </mesh>
  );
}

export default function WorkScene() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [ready, setReady] = useState(false);
  const lenis = useLenis();

  const handleSelect = (slug: string) => {
    const el = document.getElementById(`work-${slug}`);
    if (!el) return;
    // Same lenis.scrollTo-with-native-fallback pattern as
    // FreeAuditWizard.tsx's goToStep — lenis is undefined whenever
    // SmoothScrollProvider didn't mount it (prefers-reduced-motion), so the
    // native fallback is already the correct reduced-motion behavior, not
    // just a safety net.
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.1, offset: -40 });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="relative aspect-[21/9] w-full cursor-pointer"
      style={{ cursor: hoveredIndex !== null ? "pointer" : "default" }}
    >
      <Canvas
        dpr={[1, 1.6]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 6.4], fov: 38 }}
        onCreated={() => setReady(true)}
        style={{ opacity: ready ? 1 : 0, transition: "opacity 500ms ease" }}
        onPointerMissed={() => setHoveredIndex(null)}
      >
        {workCaseStudy.facets.map((facet, i) => (
          <Tile
            key={facet.slug}
            facet={facet}
            index={i}
            hovered={hoveredIndex === i}
            onHover={setHoveredIndex}
            onSelect={handleSelect}
          />
        ))}

        {/* Phase 7's exact effect recipe (Bloom + ChromaticAberration +
            Noise) doesn't transplant unchanged onto this scene's content the
            way it does onto the homepage hero: that Canvas has a transparent
            background behind a mostly-dark mark, so a low luminance
            threshold only ever catches real specular highlights. These
            tiles are mostly light-background artwork filling the whole
            frame — the same low threshold would bloom the entire white
            background, not just genuine highlights. Same three effects,
            same "keep it to three passes" discipline, but Bloom's threshold
            is tuned much higher here so it only catches truly bright spots
            (the tile-3 artwork's saturated blue mark, the hover accent
            wash) instead of washing out every tile. */}
        <EffectComposer enableNormalPass={false}>
          <Bloom intensity={0.25} luminanceThreshold={0.94} luminanceSmoothing={0.6} mipmapBlur />
          {/* Much smaller offset than the homepage hero's 0.0006: this
              scene's tiles are dense, high-contrast flat artwork (black
              text bars, hard tile-edge boundaries) filling the whole frame,
              versus the hero's mostly-transparent canvas around a single
              dark mark — the same offset that read as "barely there" there
              read as a visible color-fringed outline here. Tuned down by
              eye until the fringe stopped being individually noticeable at
              normal viewing distance. */}
          <ChromaticAberration offset={[0.00012, 0.00012]} radialModulation={false} modulationOffset={0} />
          <Noise opacity={0.025} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
