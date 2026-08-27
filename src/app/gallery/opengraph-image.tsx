import {
  ogImageContentType,
  ogImageSize,
  renderOgImage,
} from "@/lib/og-image";

import { galleryDescription } from "./page-meta";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Gallery";

export default function Image() {
  return renderOgImage({
    title: "Gallery",
    subtitle: galleryDescription,
  });
}
