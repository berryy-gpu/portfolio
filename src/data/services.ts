import type { ProjectImagePath, ServiceImagePath, SocialImagePath } from "./assets";
import type { CategoryId } from "./categories";

export interface ServicePreviewImage {
  src: ProjectImagePath | SocialImagePath | ServiceImagePath;
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
   * service. Capabilities renders the row without a preview when this is
   * absent — never a placeholder image. website-care has none, correctly:
   * it's ongoing maintenance work with no single representative shot.
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
      src: "/images/services/service-social-media-marketing.webp",
      alt: "30-day organic reach results — 21K views, real numbers",
    },
  },
  {
    id: "video-editing",
    title: "Video Editing",
    categoryIds: ["video-editing"],
    order: 4,
    previewImage: {
      src: "/images/services/service-video-editing-timeline.webp",
      alt: "Video editing timeline in DaVinci Resolve",
    },
  },
  {
    id: "video-production",
    title: "Video Production",
    categoryIds: ["video-production"],
    order: 5,
    previewImage: {
      src: "/images/services/service-video-production-set.webp",
      alt: "On-set video production — camera and lighting setup",
    },
  },
  {
    id: "seo",
    title: "SEO",
    categoryIds: ["seo"],
    order: 6,
    previewImage: {
      src: "/images/services/service-seo-structure-beats-keywords.webp",
      alt: "Technical SEO — site structure over keyword stuffing",
    },
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    categoryIds: ["ai-automation"],
    order: 7,
    previewImage: {
      src: "/images/services/service-ai-automation-logic.webp",
      alt: "AI automation — trigger and action logic",
    },
  },
];

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getServicesByCategoryId(categoryId: CategoryId): Service[] {
  return services.filter((service) => service.categoryIds.includes(categoryId));
}
