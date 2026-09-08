"use client";

import { useMemo, useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";

export interface HeroTouchTarget {
  /** Cumulative, persistent Y-axis spin (radians), driven by horizontal
   *  drag distance. Unlike `tiltTarget` below, this never springs back —
   *  "swipe further, it rotates further" — and is added on top of (not
   *  instead of) the scene's always-running idle auto-rotation, so a phone
   *  visitor who never touches the hologram still sees it turning slowly on
   *  its own, exactly like desktop. */
  spin: number;
  /** X-axis tilt target (radians) for the SAME damped-lerp-to-target
   *  mechanism GXForm's useFrame already runs for the desktop mouse tilt —
   *  springs back to 0 on release, same as the mouse's, just fed from a
   *  touch-specific target instead of a mouse one. */
  tiltTarget: number;
  /** True for the duration of an active single-finger drag on the hero's
   *  hit region. Also read by GXTouchGlow to decide whether its trail is
   *  visible — a glow with no drag in progress would just read as noise. */
  active: boolean;
  /** Last raw viewport coordinates of the drag, read (never written) by
   *  GXTouchGlow to position its glow — kept on this same ref rather than a
   *  second one/listener, so there's a single source of truth per drag. */
  clientX: number;
  clientY: number;
}

const SPIN_PER_PX = 0.012; // radians of persistent spin per pixel of horizontal drag
const TILT_PER_PX = 0.006; // radians of tilt target per pixel of vertical drag
const MAX_TILT = Math.PI / 11; // matches the desktop mouse tilt's rough range (see GXScene.tsx)

/**
 * Touch-drag control for the GX hologram — shared between GXScene.tsx
 * (desktop + tablet, "full" mode) and GXSceneLite.tsx (phones, "lite" mode)
 * so the trickiest piece of interaction logic lives in exactly one place,
 * rather than being copied and risking the two copies drifting apart. The
 * surrounding *visual* code (geometry/materials/lighting/postprocessing)
 * still duplicates between those two files — consistent with this project's
 * own stated convention of touching only what a given phase actually needs
 * (see the WebGL-capability check comment in WorkScene.tsx) — this hook
 * exists specifically because the interaction logic, not the visuals, is
 * where a copy-paste drift would risk an actual bug (e.g. spin and tilt
 * fighting each other, or a dropped pointer-capture release leaving a scene
 * stuck mid-drag).
 *
 * Deliberately NOT reusing the existing mouse-tilt code path (`pointerRef`
 * in GXScene.tsx): mouse tilt snaps to an absolute target and springs back
 * on both axes when the cursor leaves, while touch needs a persistent spin
 * on one axis and a spring-back tilt on the other — different enough
 * semantics that conflating them risked cross-talk bugs between the two
 * input types. They're combined only where GXForm's useFrame reads both
 * refs and picks "whichever input is currently active" per frame.
 *
 * Returns plain refs, not React state, for the same reason
 * CursorAtmosphere.tsx and Header.tsx's scroll-glass ramp do: pointermove
 * fires far more often than a component should re-render for, and nothing
 * here needs to trigger a re-render — GXForm's useFrame reads `target`
 * directly every frame, same as it already does for the mouse pointer ref.
 */
export function useHeroTouchControl() {
  const target = useRef<HeroTouchTarget>({
    spin: 0,
    tiltTarget: 0,
    active: false,
    clientX: 0,
    clientY: 0,
  });
  const last = useRef<{ x: number; y: number } | null>(null);

  // Stable handler identities (empty-dep useMemo) so passing these as JSX
  // props never causes the hit-region div to rebind its listeners.
  const handlers = useMemo(
    () => ({
      onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "touch") return;
        target.current.active = true;
        target.current.clientX = event.clientX;
        target.current.clientY = event.clientY;
        last.current = { x: event.clientX, y: event.clientY };
        // Pointer capture keeps move/up events targeting this element even
        // if the finger drifts outside the (fairly generous) hit region
        // mid-drag — combined with `touch-action: none` on that same
        // element, this is what makes "drag the hologram while also
        // scrolling past it" behave predictably instead of the drag
        // randomly dropping or the page scrolling underneath the finger.
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // Best-effort — a rare browser without setPointerCapture support
          // still gets a working drag, just slightly less robust right at
          // the hit region's edge.
        }
      },
      onPointerMove: (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "touch" || !last.current) return;
        const dx = event.clientX - last.current.x;
        const dy = event.clientY - last.current.y;
        last.current = { x: event.clientX, y: event.clientY };
        target.current.clientX = event.clientX;
        target.current.clientY = event.clientY;
        target.current.spin += dx * SPIN_PER_PX;
        target.current.tiltTarget = Math.max(
          -MAX_TILT,
          Math.min(MAX_TILT, target.current.tiltTarget + dy * TILT_PER_PX)
        );
      },
      onPointerEnd: (event: ReactPointerEvent<HTMLDivElement>) => {
        if (event.pointerType !== "touch") return;
        target.current.active = false;
        target.current.tiltTarget = 0; // tilt springs back; spin persists
        last.current = null;
        try {
          event.currentTarget.releasePointerCapture(event.pointerId);
        } catch {
          // No-op — capture may already have been released by the browser.
        }
      },
    }),
    []
  );

  return { target, handlers };
}
