"use client";

/**
 * Thin wrapper so hero.tsx never statically imports anything from
 * @react-three/* — this whole file is loaded via next/dynamic(ssr:false)
 * from hero.tsx instead, keeping the ~150KB three.js/postprocessing/maath
 * stack out of the homepage's initial bundle, per the performance budget.
 */

import { View } from "@react-three/drei";
import type { RefObject } from "react";

import { HeroScene } from "@/components/three/scenes/hero-scene";
import type { QualityTier } from "@/components/providers/quality-provider";

interface HeroViewProps {
  track: RefObject<HTMLElement>;
  videoElement: HTMLVideoElement;
  tier: QualityTier;
  isCoarsePointer: boolean;
}

export function HeroView({ track, videoElement, tier, isCoarsePointer }: HeroViewProps) {
  return (
    <View track={track} className="absolute inset-0 -z-10">
      <HeroScene videoElement={videoElement} tier={tier} isCoarsePointer={isCoarsePointer} />
    </View>
  );
}
