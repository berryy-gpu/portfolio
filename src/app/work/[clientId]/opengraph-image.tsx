import {
  getAllClientIds,
  getClientStoryDescription,
  getClientStoryDetail,
} from "@/data/client-story";
import {
  ogImageContentType,
  ogImageSize,
  renderOgImage,
} from "@/lib/og-image";

interface OgImageProps {
  params: Promise<{ clientId: string }>;
}

export const size = ogImageSize;
export const contentType = ogImageContentType;
export const alt = "Client story";

export function generateStaticParams() {
  return getAllClientIds().map((clientId) => ({ clientId }));
}

export default async function Image({ params }: OgImageProps) {
  const { clientId } = await params;
  const story = getClientStoryDetail(clientId);

  if (!story) {
    return renderOgImage({ title: "Client story" });
  }

  return renderOgImage({
    title: story.client.name,
    subtitle: getClientStoryDescription(story),
    accent: story.atmosphere.accent,
  });
}
