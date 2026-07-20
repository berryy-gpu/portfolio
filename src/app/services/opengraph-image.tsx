import {
  ogImageContentType,
  ogImageSize,
  renderOgImage,
} from "@/lib/og-image";

import { servicesDescription } from "./page-meta";

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Services";

export default function Image() {
  return renderOgImage({ title: "Services", subtitle: servicesDescription });
}
