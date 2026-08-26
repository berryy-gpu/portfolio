import { shaderMaterial } from "@react-three/drei";
import type { ThreeElement } from "@react-three/fiber";
import { extend } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The graded-film backdrop shader (Step 2). Fullscreen quad in clip
 * space — no projection, the vertex positions are already -1..1. A
 * static value-noise fbm field (never touches uScroll/uTime — light
 * travels across fixed grain, that's what real film does) plus one warm
 * bloom from uAccent that drifts on a slow orbit and is pushed vertically
 * by scroll, a vignette, and a film-grain dither as the very last step
 * (kills gradient banding on dark 8-bit displays).
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uScroll;
  uniform float uAspect;
  uniform vec3 uBase;
  uniform vec3 uAccent;
  varying vec2 vUv;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float valueNoise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 4; i++) {
      value += amplitude * valueNoise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = vec2(uv.x * uAspect, uv.y);

    // Static — never mixes in uScroll or uTime.
    float n = fbm(p * 3.0);

    // ONE warm bloom only. A second coloured light at these low
    // opacities just mixes toward muddy brown.
    vec2 bloomCenter = vec2(
      0.5 * uAspect + sin(uTime * 0.05) * 0.3,
      0.5 + cos(uTime * 0.05) * 0.25 - uScroll * 0.5
    );
    float bloom = smoothstep(0.7, 0.0, distance(p, bloomCenter));

    vec3 col = uBase * (0.9 + n * 0.2);
    col += uAccent * bloom * 0.20;

    float vignette = 1.0 - smoothstep(0.35, 1.15, distance(vUv, vec2(0.5))) * 0.85;
    col *= vignette;

    col += (hash(gl_FragCoord.xy + uTime) - 0.5) * 0.035;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export interface BackdropMaterialUniforms {
  uTime: number;
  uScroll: number;
  uAspect: number;
  uBase: THREE.Color;
  uAccent: THREE.Color;
}

export type BackdropMaterialImpl = THREE.ShaderMaterial & BackdropMaterialUniforms;

export const BackdropMaterial = shaderMaterial(
  {
    uTime: 0,
    uScroll: 0,
    uAspect: 1,
    uBase: new THREE.Color("#0b0b0a"),
    uAccent: new THREE.Color("#a64f39"),
  },
  vertexShader,
  fragmentShader
);

extend({ BackdropMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    backdropMaterial: ThreeElement<typeof BackdropMaterial>;
  }
}
