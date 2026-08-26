export const CATEGORY_IDS = [
  "website",
  "web-development",
  "ui-ux",
  "branding",
  "social-media",
  "marketing",
  "video-editing",
  "video-production",
  "seo",
  "ai-automation",
  "web-care",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export interface Category {
  id: CategoryId;
  label: string;
}

export const categories: Category[] = [
  { id: "website", label: "Website" },
  { id: "web-development", label: "Web Development" },
  { id: "ui-ux", label: "UI/UX" },
  { id: "branding", label: "Branding" },
  { id: "social-media", label: "Social Media" },
  { id: "marketing", label: "Marketing" },
  { id: "video-editing", label: "Video Editing" },
  { id: "video-production", label: "Video Production" },
  { id: "seo", label: "SEO" },
  { id: "ai-automation", label: "AI Automation" },
  { id: "web-care", label: "Website Care" },
];

export function getCategoryById(id: CategoryId): Category | undefined {
  return categories.find((category) => category.id === id);
}
