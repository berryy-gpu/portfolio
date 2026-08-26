"use client";

/**
 * The site's SECOND and FINAL 3D moment (REBUILD-SPEC.md section 10) —
 * per hero.tsx's own docstring, no third 3D moment should be added
 * without revisiting the approved spec. Tier 'high' only; the CTA
 * section decides whether to mount this at all.
 *
 * Environment: drei's top-level <Environment> dispatches on its props —
 * `ground` -> EnvironmentGround, `map` -> EnvironmentMap, `children` ->
 * EnvironmentPortal, and otherwise (its actual default) EnvironmentCube,
 * which calls useEnvironment() and — with no `files`/`preset` given —
 * defaults to fetching /px.png,/nx.png,... A bare `scene` prop with none
 * of the above still falls through to that default-cubemap branch
 * (`scene` only tells EnvironmentCube which THREE.Scene to APPLY the
 * result to, not where to source it from), which is what actually caused
 * the 404s here — not RoomEnvironment() itself, which is a plain function
 * returning a populated THREE.Scene, not a class. Giving <Environment>
 * real Lightformer children instead routes it through EnvironmentPortal,
 * which renders those children into an offscreen scene and bakes a cube
 * render target from them — frames={1} bakes it once and stops, so
 * nothing is fetched, ever, and nothing re-renders every frame either.
 */

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import type { Mesh } from "three";

import { readCssColor } from "@/components/three/materials/cta-scene-colors";

export function CtaScene() {
  const meshRef = useRef<Mesh>(null);
  const accent = readCssColor("--accent", "#a64f39");
  const background = readCssColor("--background", "#0b0b0a");

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.x += delta * 0.08;
    mesh.rotation.y += delta * 0.12;
    mesh.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.15;
    mesh.position.x = Math.cos(state.clock.elapsedTime * 0.2) * 0.1;
  });

  return (
    <>
      <Environment resolution={256} frames={1}>
        <color attach="background" args={[background.r, background.g, background.b]} />
        <Lightformer intensity={2.4} position={[0, 3, 2]} scale={[6, 3, 1]} />
        <Lightformer intensity={1.4} position={[-3, 1, 2]} scale={[3, 3, 1]} color={accent} />
        <Lightformer intensity={0.7} position={[3, -1, 2]} scale={[3, 3, 1]} />
      </Environment>
      <mesh ref={meshRef} scale={1.6}>
        <icosahedronGeometry args={[1, 2]} />
        <MeshTransmissionMaterial
          thickness={0.6}
          roughness={0.1}
          chromaticAberration={0.05}
          color={accent}
          backside
          backsideThickness={0.3}
        />
      </mesh>
    </>
  );
}
