import {
  ogImageContentType,
  ogImageSize,
  renderOgImage,
} from "@/lib/og-image";

import { workDescription } from "./page-meta";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Selected Work";

export default function Image() {
  return renderOgImage({
    title: "Selected Work",
    subtitle: workDescription,
  });
}
