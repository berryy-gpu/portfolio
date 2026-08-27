import type { Metadata } from "next";

import { GalleryContent } from "@/components/gallery/gallery-content";

import { galleryDescription } from "./page-meta";

export const metadata: Metadata = {
  title: "Gallery",
  description: galleryDescription,
};

export default function GalleryPage() {
  return <GalleryContent />;
}
