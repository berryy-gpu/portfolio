import type { ProjectImagePath, SocialImagePath } from "./assets";
import type { CategoryId } from "./categories";

export interface ServicePreviewImage {
  src: ProjectImagePath | SocialImagePath;
  alt: string;
}

export interface Service {
  id: string;
  title: string;
  description?: string;
  categoryIds: CategoryId[];
  order?: number;
  /**
   * Sanctioned data addition for REBUILD-SPEC.md's Capabilities section
   * (the cursor-follow preview). Only mapped to a REAL existing asset —
   * left unset rather than guessing when nothing genuinely represents the
   * service (video-editing/video-production have no poster images yet,
   * ffmpeg wasn't available in Phase 1; seo/ai-automation have no
   * deliverable screenshot at all). Capabilities renders the row without
   * a preview when this is absent — never a placeholder image.
   */
  previewImage?: ServicePreviewImage;
}

export const services: Service[] = [
  {
    id: "web-development",
    title: "Web Development",
    categoryIds: ["web-development"],
    order: 1,
    previewImage: {
      src: "/images/projects/cybernetix-homepage.png",
      alt: "Cybernetix — homepage",
    },
  },
  {
    id: "website-care",
    title: "Website Care & Maintenance",
    description:
      "Ongoing development on live sites — content updates, new pages, design changes, and fixes, delivered without downtime.",
    categoryIds: ["web-care", "web-development"],
    order: 2,
  },
  {
    id: "social-media-marketing",
    title: "Social Media Marketing",
    categoryIds: ["social-media", "marketing"],
    order: 3,
    previewImage: {
      src: "/images/social/pixelscape/pixelscape-01.jpg",
      alt: "Pixelscape — social post",
    },
  },
  {
    id: "video-editing",
    title: "Video Editing",
    categoryIds: ["video-editing"],
    order: 4,
  },
  {
    id: "video-production",
    title: "Video Production",
    categoryIds: ["video-production"],
    order: 5,
  },
  {
    id: "seo",
    title: "SEO",
    categoryIds: ["seo"],
    order: 6,
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    categoryIds: ["ai-automation"],
    order: 7,
  },
];

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getServicesByCategoryId(categoryId: CategoryId): Service[] {
  return services.filter((service) => service.categoryIds.includes(categoryId));
}
