import type { ClientId } from "./clients";
import { projects, type Project } from "./projects";

/**
 * Homepage presentation decisions — which projects the homepage features,
 * and in what order. This is deliberately separate from projects.ts:
 * "featured" is a homepage concern, not a fact about a project, so it
 * doesn't belong on the Project data model. Projects only describe
 * projects; the homepage decides how to present them.
 *
 * All six "build" website projects are featured, in the same order as
 * projects.ts's own `order` field (the general catalog sequence) — the
 * five "care" projects (ongoing development on sites built by someone
 * else) are deliberately excluded from the homepage's lead showcase,
 * which is specifically a "here's what I design and build" moment. The
 * list stays explicit rather than "just render all projects" so a future
 * homepage-only curation change doesn't require touching projects.ts.
 */
export const featuredProjectClientIds: ClientId[] = [
  "ay-architects",
  "cybernetix",
  "pixelscape",
  "aureate",
  "clix",
  "hihat",
];

export function getFeaturedProjects(): Project[] {
  return featuredProjectClientIds
    .map((clientId) => projects.find((project) => project.clientId === clientId))
    .filter((project): project is Project => Boolean(project));
}
