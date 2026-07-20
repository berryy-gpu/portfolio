import {
  ogImageContentType,
  ogImageSize,
  renderOgImage,
} from "@/lib/og-image";

import { workDescription } from "./page-meta";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Creative Showcase";

export default function Image() {
  return renderOgImage({
    title: "Creative Showcase",
    subtitle: workDescription,
  });
}
