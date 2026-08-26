"use client";

/**
 * The graded-film backdrop (Step 2) — texture, not content; if a visitor
 * consciously notices it, it's too strong. Mounted permanently inside the
 * persistent canvas, rendered before <View.Port /> so it sits behind
 * every tracked 3D moment (Hero, CTA). depthWrite/depthTest false on the
 * material means it never occludes anything regardless of draw order.
 */

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { damp } from "maath/easing";

import "@/components/three/materials/backdrop-material";
import type { BackdropMaterialImpl } from "@/components/three/materials/backdrop-material";
import { readCssColor } from "@/components/three/materials/cta-scene-colors";
import { useScrollProgress } from "@/hooks/use-scroll-progress";

export function BackdropScene() {
  const materialRef = useRef<BackdropMaterialImpl>(null);
  const scrollProgress = useScrollProgress();
  const dampedScroll = useRef({ value: 0 });
  const { viewport } = useThree();

  const base = readCssColor("--background", "#0b0b0a");
  const accent = readCssColor("--accent", "#a64f39");

  useFrame((state, delta) => {
    if (document.hidden) return;
    const material = materialRef.current;
    if (!material) return;

    material.uTime = state.clock.elapsedTime;
    material.uAspect = viewport.width / viewport.height;

    damp(dampedScroll.current, "value", scrollProgress.current, 0.35, delta);
    material.uScroll = dampedScroll.current.value;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <backdropMaterial
        ref={materialRef}
        uBase={base}
        uAccent={accent}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
