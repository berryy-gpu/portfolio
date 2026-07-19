import type { CategoryId } from "./categories";

export interface OutcomePillar {
  id: string;
  title: string;
  description: string;
  categoryIds: CategoryId[];
  order?: number;
}

/**
 * Business-outcome framing for "What I Can Help You Build" — a coarser
 * grouping of the same real service/category data Services Overview
 * lists individually. Grounding each pillar in categoryIds keeps this
 * data-driven rather than free-floating marketing copy: the related
 * services shown alongside each pillar come straight from services.ts.
 */
export const outcomePillars: OutcomePillar[] = [
  {
    id: "digital-presence",
    title: "A digital presence built to perform",
    description:
      "Websites and interfaces designed to hold attention and convert it into action.",
    categoryIds: ["web-development", "ui-ux", "seo"],
    order: 1,
  },
  {
    id: "content-momentum",
    title: "Content that keeps momentum",
    description:
      "Social content and video that keeps a brand visible between launches.",
    categoryIds: [
      "social-media",
      "video-editing",
      "video-production",
      "marketing",
    ],
    order: 2,
  },
  {
    id: "smarter-systems",
    title: "Systems that scale the work",
    description: "Automation that removes repetitive load so the work compounds.",
    categoryIds: ["ai-automation"],
    order: 3,
  },
];

export function getOutcomePillars(): OutcomePillar[] {
  return [...outcomePillars].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}
