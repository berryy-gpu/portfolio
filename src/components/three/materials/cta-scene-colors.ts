import * as THREE from "three";

/** Reads an already-approved CSS token at runtime rather than hardcoding
 *  a second copy of its hex value — same approach as the Hero shader. */
export function readCssColor(variable: string, fallback: string): THREE.Color {
  if (typeof window === "undefined") return new THREE.Color(fallback);
  const value = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
  return new THREE.Color(value || fallback);
}
