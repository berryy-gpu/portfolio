import type { ClientId } from "./clients";
import { projects, type Project } from "./projects";

/**
 * Homepage presentation decisions — which projects the homepage features,
 * and in what order. This is deliberately separate from projects.ts:
 * "featured" is a homepage concern, not a fact about a project, so it
 * doesn't belong on the Project data model. Projects only describe
 * projects; the homepage decides how to present them.
 *
 * Order here is the source of truth for Featured Work's sequence — it
 * does not depend on projects.ts's own `order` field, which remains a
 * general catalog concern (used by the future Work index) independent
 * of this homepage-specific list.
 */
export const featuredProjectClientIds: ClientId[] = [
  "cybernetix",
  "pixelscape",
  "aureate",
];

export function getFeaturedProjects(): Project[] {
  return featuredProjectClientIds
    .map((clientId) => projects.find((project) => project.clientId === clientId))
    .filter((project): project is Project => Boolean(project));
}
