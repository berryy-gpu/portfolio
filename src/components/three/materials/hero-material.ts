/**
 * The Hero's custom shader (REBUILD-SPEC.md section 01): the video
 * footage is already a warm red/orange plexus close to the site palette,
 * so this only needs to nudge it — desaturate to ~25% of its original
 * saturation (not 15%, which crushes it to a flat orange smear) plus a
 * light accent multiply, a cursor-trailing ripple, slow ambient noise so
 * it stays alive when the pointer is still, and a bottom-third vignette
 * fading to the page background.
 *
 * uAccent/uBackground default to the real approved token values
 * (#a64f39 / #0b0b0a) as a safe initial paint before hero-scene.tsx reads
 * the actual computed CSS custom properties at mount — not new colors,
 * just this shader's only way to consume the existing frozen tokens
 * (GLSL uniforms can't read CSS custom properties directly).
 */

import { shaderMaterial } from "@react-three/drei";
import type { ThreeElement } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform float uTime;
  uniform vec2 uPointer;
  uniform vec3 uAccent;
  uniform vec3 uBackground;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;

    // Cursor ripple: radial UV displacement around the damped pointer
    // position. The damping itself happens JS-side in useFrame (maath
    // damp3) before this uniform is ever set, so the ripple trails the
    // real cursor rather than snapping to it.
    vec2 toPointer = uv - uPointer;
    float dist = length(toPointer);
    float ripple = sin(dist * 18.0 - uTime * 1.5) * 0.015 * smoothstep(0.35, 0.0, dist);
    vec2 dir = dist > 0.0001 ? toPointer / dist : vec2(0.0);
    uv += dir * ripple;

    // Slow ambient noise so the surface stays alive when the pointer
    // hasn't moved.
    float n = (hash(floor(uv * 400.0) + floor(uTime * 6.0)) - 0.5) * 0.02;

    vec4 tex = texture2D(uTexture, uv);

    float luma = dot(tex.rgb, vec3(0.299, 0.587, 0.114));
    vec3 desaturated = mix(vec3(luma), tex.rgb, 0.25);
    vec3 tinted = desaturated * mix(vec3(1.0), uAccent, 0.15);
    tinted += n;

    float vignette = smoothstep(0.0, 0.33, uv.y);
    vec3 color = mix(uBackground, tinted, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface HeroMaterialUniforms {
  uTexture: THREE.Texture | null;
  uTime: number;
  uPointer: THREE.Vector2;
  uAccent: THREE.Color;
  uBackground: THREE.Color;
}

export type HeroMaterialImpl = THREE.ShaderMaterial & HeroMaterialUniforms;

export const HeroMaterial = shaderMaterial(
  {
    uTexture: null as THREE.Texture | null,
    uTime: 0,
    uPointer: new THREE.Vector2(0.5, 0.5),
    uAccent: new THREE.Color("#a64f39"),
    uBackground: new THREE.Color("#0b0b0a"),
  },
  vertexShader,
  fragmentShader
);

extend({ HeroMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    heroMaterial: ThreeElement<typeof HeroMaterial>;
  }
}
