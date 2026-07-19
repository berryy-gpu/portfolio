import type { ProjectImagePath } from "./assets";
import type { CategoryId } from "./categories";
import type { ClientId } from "./clients";

export interface ProjectImage {
  src: ProjectImagePath;
  alt: string;
}

export interface Project {
  id: string;
  title: string;
  clientId: ClientId;
  categoryIds: CategoryId[];
  summary?: string;
  images: ProjectImage[];
  order?: number;
}

export const projects: Project[] = [
  {
    id: "aureate",
    title: "Aureate",
    clientId: "aureate",
    categoryIds: ["website", "web-development"],
    order: 3,
    images: [
      { src: "/images/projects/aureate-01.png", alt: "Aureate — screen 1" },
      { src: "/images/projects/aureate-02.png", alt: "Aureate — screen 2" },
      { src: "/images/projects/aureate-03.png", alt: "Aureate — screen 3" },
      { src: "/images/projects/aureate-04.png", alt: "Aureate — screen 4" },
      { src: "/images/projects/aureate-05.png", alt: "Aureate — screen 5" },
      { src: "/images/projects/aureate-06.png", alt: "Aureate — screen 6" },
    ],
  },
  {
    id: "clix",
    title: "Clix",
    clientId: "clix",
    categoryIds: ["website", "web-development"],
    order: 4,
    images: [
      { src: "/images/projects/clix-homepage.png", alt: "Clix — homepage" },
      {
        src: "/images/projects/clix-featurepage.png",
        alt: "Clix — feature page",
      },
    ],
  },
  {
    id: "cybernetix",
    title: "Cybernetix",
    clientId: "cybernetix",
    categoryIds: ["website", "web-development"],
    order: 1,
    images: [
      {
        src: "/images/projects/cybernetix-homepage.png",
        alt: "Cybernetix — homepage",
      },
      {
        src: "/images/projects/cybernetix-aboutus.png",
        alt: "Cybernetix — about us",
      },
      {
        src: "/images/projects/cybernetix-services.png",
        alt: "Cybernetix — services",
      },
    ],
  },
  {
    id: "hihat",
    title: "Hihat",
    clientId: "hihat",
    categoryIds: ["website", "web-development"],
    order: 5,
    images: [
      { src: "/images/projects/hihat-homepage.png", alt: "Hihat — homepage" },
      { src: "/images/projects/hihat-aboutus.png", alt: "Hihat — about us" },
    ],
  },
  {
    id: "pixelscape",
    title: "Pixelscape",
    clientId: "pixelscape",
    categoryIds: ["website", "web-development"],
    order: 2,
    images: [
      {
        src: "/images/projects/pixelscape-homepage.png",
        alt: "Pixelscape — homepage",
      },
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}

export function getProjectsByClientId(clientId: ClientId): Project[] {
  return projects.filter((project) => project.clientId === clientId);
}
