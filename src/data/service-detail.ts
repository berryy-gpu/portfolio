import { getClientStories } from "./work";
import type { CategoryId } from "./categories";
import type { Client } from "./clients";

export interface ServiceDetail {
  /** Matches services.ts's id. */
  serviceId: string;
  problem: string;
  approach: string;
  outcome: string;
}

/**
 * The problem/approach/outcome framing per real service (services.ts) —
 * honest, general capability language, never invented metrics or
 * client-specific claims. One entry per real service; nothing merged or
 * dropped, so this stays a true reflection of services.ts rather than a
 * hand-picked subset.
 */
export const serviceDetails: ServiceDetail[] = [
  {
    serviceId: "web-development",
    problem: "Need a premium online presence?",
    approach:
      "Design and build a site that looks as good as it performs — from the first wireframe to a responsive, production-ready build.",
    outcome:
      "A site that's fast, accessible, and actually represents the brand — not just something that exists.",
  },
  {
    serviceId: "social-media-marketing",
    problem: "Need consistent brand visibility?",
    approach:
      "Plan and produce a steady stream of on-brand content, built for how people actually scroll.",
    outcome: "A social presence that stays consistent and recognizable, post after post.",
  },
  {
    serviceId: "video-editing",
    problem: "Need engaging short-form content?",
    approach:
      "Cut and pace footage for platforms where the first second decides whether someone keeps watching.",
    outcome: "Reels that hold attention and feel native to the platform they're on.",
  },
  {
    serviceId: "video-production",
    problem: "Need a piece that represents the brand at its best?",
    approach:
      "Shape raw footage into a polished, cinematic piece built to be the definitive showreel.",
    outcome: "A showreel-quality film worth sending to anyone who asks what the brand does.",
  },
  {
    serviceId: "seo",
    problem: "Need to be found, not just built?",
    approach:
      "Get the fundamentals right — structure, performance, and content — so the site is actually discoverable.",
    outcome: "A site search engines can properly read, index, and rank.",
  },
  {
    serviceId: "ai-automation",
    problem: "Need better internal workflows?",
    approach:
      "Find the repetitive parts of a workflow and automate them, so time goes toward the work that actually needs a person.",
    outcome: "Fewer manual steps, and more time for what actually moves the business forward.",
  },
];

export function getServiceDetail(serviceId: string): ServiceDetail | undefined {
  return serviceDetails.find((detail) => detail.serviceId === serviceId);
}

/** Real clients whose actual work touches this service's categories —
 *  reuses the same aggregation Client Stories is built on, nothing new. */
export function getRelevantClients(categoryIds: CategoryId[]): Client[] {
  return getClientStories()
    .filter((story) => story.categoryIds.some((id) => categoryIds.includes(id)))
    .map((story) => story.client);
}
