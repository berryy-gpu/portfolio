import type { CategoryId } from "./categories";

export interface Service {
  id: string;
  title: string;
  description?: string;
  categoryIds: CategoryId[];
  order?: number;
}

export const services: Service[] = [
  {
    id: "web-development",
    title: "Web Development",
    categoryIds: ["web-development"],
    order: 1,
  },
  {
    id: "social-media-marketing",
    title: "Social Media Marketing",
    categoryIds: ["social-media", "marketing"],
    order: 2,
  },
  {
    id: "video-editing",
    title: "Video Editing",
    categoryIds: ["video-editing"],
    order: 3,
  },
  {
    id: "video-production",
    title: "Video Production",
    categoryIds: ["video-production"],
    order: 4,
  },
  {
    id: "seo",
    title: "SEO",
    categoryIds: ["seo"],
    order: 5,
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    categoryIds: ["ai-automation"],
    order: 6,
  },
];

export function getServiceById(id: string): Service | undefined {
  return services.find((service) => service.id === id);
}

export function getServicesByCategoryId(categoryId: CategoryId): Service[] {
  return services.filter((service) => service.categoryIds.includes(categoryId));
}
