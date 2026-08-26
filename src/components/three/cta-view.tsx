"use client";

/**
 * Thin wrapper so cta.tsx never statically imports @react-three/* — see
 * hero-view.tsx for why (kept out of every route's initial bundle).
 */

import { View } from "@react-three/drei";
import type { RefObject } from "react";

import { CtaScene } from "@/components/three/scenes/cta-scene";

interface CtaViewProps {
  track: RefObject<HTMLElement>;
}

export function CtaView({ track }: CtaViewProps) {
  return (
    <View track={track} className="absolute inset-0 -z-10">
      <CtaScene />
    </View>
  );
}
