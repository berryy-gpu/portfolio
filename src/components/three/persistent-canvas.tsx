"use client";

/**
 * The site's one persistent WebGL surface — dynamically imported with
 * ssr:false by webgl-provider.tsx. Fixed, full-viewport, pointer-events
 * none, at zIndex.canvas (a deliberately NEGATIVE z-index — not 0) so it
 * stacks behind ordinary page content by construction, not because every
 * section happens to declare its own higher z-index. Individual 3D
 * moments (the Hero scene, the CTA scene) declare themselves via drei's
 * `<View track={ref}>` against a real DOM element elsewhere on the page;
 * `<View.Port />` here is what actually renders them into this shared
 * canvas. Never create a second `<Canvas>` anywhere else — multiple WebGL
 * contexts get silently killed by the browser past ~8-16 of them.
 *
 * The graded-film BackdropScene (Step 2) mounts here too, rendered
 * BEFORE <View.Port /> so it sits behind every tracked 3D moment — but
 * only at the 'high'/'medium' tiers. At 'low' (the canvas itself may
 * still be mounted here for Hero's sake, per webgl-provider.tsx's own
 * "never unmount the canvas for a tier change" rule) the backdrop shader
 * specifically doesn't render; webgl-provider.tsx shows a static CSS
 * gradient in its place instead.
 */

import { Canvas } from "@react-three/fiber";
import { View } from "@react-three/drei";

import { BackdropScene } from "@/components/three/scenes/backdrop-scene";
import type { QualityTier } from "@/components/providers/quality-provider";
import { zIndex } from "@/lib/motion-tokens";

interface PersistentCanvasProps {
  dpr: number;
  tier: QualityTier;
  onReady?: () => void;
}

export function PersistentCanvas({ dpr, tier, onReady }: PersistentCanvasProps) {
  return (
    <Canvas
      style={{
        position: "fixed",
        inset: 0,
        zIndex: zIndex.canvas,
        pointerEvents: "none",
      }}
      dpr={dpr}
      gl={{ antialias: true, alpha: true }}
      onCreated={() => onReady?.()}
    >
      {tier !== "low" && <BackdropScene />}
      <View.Port />
    </Canvas>
  );
}
