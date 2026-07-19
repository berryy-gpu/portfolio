export type TechnologyCategory =
  | "framework"
  | "language"
  | "styling"
  | "ui"
  | "animation"
  | "3d";

export interface Technology {
  id: string;
  name: string;
  category: TechnologyCategory;
  order?: number;
}

export const technologies: Technology[] = [
  { id: "nextjs", name: "Next.js", category: "framework", order: 1 },
  { id: "react", name: "React", category: "framework", order: 2 },
  { id: "typescript", name: "TypeScript", category: "language", order: 3 },
  { id: "tailwindcss", name: "Tailwind CSS", category: "styling", order: 4 },
  { id: "shadcn-ui", name: "shadcn/ui", category: "ui", order: 5 },
  { id: "lucide-react", name: "Lucide", category: "ui", order: 6 },
  { id: "gsap", name: "GSAP", category: "animation", order: 7 },
  { id: "scrolltrigger", name: "ScrollTrigger", category: "animation", order: 8 },
  { id: "lenis", name: "Lenis", category: "animation", order: 9 },
  { id: "framer-motion", name: "Framer Motion", category: "animation", order: 10 },
  { id: "react-three-fiber", name: "React Three Fiber", category: "3d", order: 11 },
  { id: "three", name: "Three.js", category: "3d", order: 12 },
];
