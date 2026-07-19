"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

/**
 * The single sanctioned Three.js moment on the entire site (Motion System
 * §11 — Minimal usage). Deliberately one simple mesh: a low-poly
 * icosahedron rather than a sphere or wireframe, to read as precise and
 * geometric rather than a generic three.js demo cliché.
 */
function Icosahedron() {
  const meshRef = useRef<Mesh>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!meshRef.current) return;

    // Subtle, capped cursor-reactive tilt — restrained, not a showy follow.
    const targetX = pointer.y * 0.15;
    const targetY = pointer.x * 0.15;
    meshRef.current.rotation.x +=
      (targetX - meshRef.current.rotation.x) * 0.03;
    meshRef.current.rotation.y +=
      (targetY - meshRef.current.rotation.y) * 0.03;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.6} floatIntensity={0.6}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.4, 0]} />
        <meshStandardMaterial color="#a64f39" roughness={0.35} metalness={0.1} />
      </mesh>
    </Float>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 2, 4]} intensity={1.2} color="#f5f3ee" />
      <Icosahedron />
    </Canvas>
  );
}
