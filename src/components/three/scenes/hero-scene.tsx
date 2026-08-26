"use client";

/**
 * The Hero's R3F scene content — rendered via drei's <View track={ref}>
 * into the one persistent canvas (webgl-provider.tsx), never its own
 * <Canvas>. A single full-viewport plane using heroMaterial, textured
 * from the real <video> element hero.tsx keeps in the DOM (hidden, still
 * playing, so its frames are readable). Quality tier and coarse-pointer
 * are passed in as props rather than read via context here — the
 * View/tunnel-rat portal boundary makes context propagation into this
 * tree harder to reason about than just passing what's needed down from
 * hero.tsx, which already reads both normally.
 */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Bloom, EffectComposer, Noise, Vignette } from "@react-three/postprocessing";
import { damp3 } from "maath/easing";
import * as THREE from "three";

import "@/components/three/materials/hero-material";
import type { HeroMaterialImpl } from "@/components/three/materials/hero-material";
import type { QualityTier } from "@/components/providers/quality-provider";

interface HeroSceneProps {
  videoElement: HTMLVideoElement;
  tier: QualityTier;
  isCoarsePointer: boolean;
}

function readCssColor(variable: string, fallback: string): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color(fallback);
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return new THREE.Color(value || fallback);
}

export function HeroScene({ videoElement, tier, isCoarsePointer }: HeroSceneProps) {
  const materialRef = useRef<HeroMaterialImpl>(null);
  const pointerVec = useRef(new THREE.Vector3(0.5, 0.5, 0));
  const { viewport } = useThree();

  const texture = useMemo(() => {
    const videoTexture = new THREE.VideoTexture(videoElement);
    videoTexture.colorSpace = THREE.SRGBColorSpace;
    return videoTexture;
  }, [videoElement]);

  useEffect(() => {
    return () => texture.dispose();
  }, [texture]);

  useEffect(() => {
    const material = materialRef.current;
    if (!material) return;
    material.uAccent = readCssColor("--accent", "#a64f39");
    material.uBackground = readCssColor("--background", "#0b0b0a");
  }, []);

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) return;

    material.uTime += delta;

    const targetX = (state.pointer.x + 1) / 2;
    const targetY = (state.pointer.y + 1) / 2;
    damp3(pointerVec.current, [targetX, targetY, 0], 0.4, delta);
    material.uPointer.set(pointerVec.current.x, pointerVec.current.y);
  });

  const showEffects = tier !== "low" && !isCoarsePointer;

  return (
    <>
      <mesh scale={[viewport.width, viewport.height, 1]}>
        <planeGeometry args={[1, 1]} />
        <heroMaterial ref={materialRef} uTexture={texture} toneMapped={false} />
      </mesh>
      {showEffects && (
        <EffectComposer>
          {tier === "high" ? (
            <>
              <Bloom intensity={0.35} luminanceThreshold={0.75} />
              <Noise opacity={0.025} />
              <Vignette darkness={0.4} />
            </>
          ) : (
            <Noise opacity={0.025} />
          )}
        </EffectComposer>
      )}
    </>
  );
}
