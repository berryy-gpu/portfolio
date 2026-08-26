/**
 * Sticky sidebar (lg+): client, services, deliverable counts, live URL.
 * Collapses to a normal block below lg (no sticky positioning at that
 * breakpoint — nothing to stick against in a single-column layout).
 */

import { Badge } from "@/components/ui/badge";
import { getCaseStudyDeliverableCounts } from "@/data/case-studies";
import type { ClientStoryDetail } from "@/data/client-story";
import { ENGAGEMENT_LABELS, getClientEngagement } from "@/data/projects";

interface ClientSidebarProps {
  story: ClientStoryDetail;
}

export function ClientSidebar({ story }: ClientSidebarProps) {
  const counts = getCaseStudyDeliverableCounts(story.client.id);
  const domain = story.project?.websitePreview?.domain;
  const engagement = getClientEngagement(story.client.id);

  return (
    <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
      <div className="flex flex-col gap-1">
        <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
          Client
        </span>
        <span className="text-body text-text-primary">{story.client.name}</span>
      </div>

      {engagement && (
        <div className="flex flex-col gap-2">
          <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
            Engagement
          </span>
          <Badge className="w-fit border-accent/40 text-accent">
            {ENGAGEMENT_LABELS[engagement]}
          </Badge>
        </div>
      )}

      {story.services.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
            Services
          </span>
          <div className="flex flex-wrap gap-2">
            {story.services.map((service) => (
              <Badge key={service.id}>{service.title}</Badge>
            ))}
          </div>
        </div>
      )}

      {(counts.socialPosts > 0 || counts.reels > 0 || counts.showreels > 0) && (
        <div className="flex flex-col gap-1">
          <span className="font-mono text-caption tracking-caption text-text-tertiary uppercase">
            Deliverables
          </span>
          <ul className="flex flex-col gap-1 text-small text-text-secondary">
            {counts.socialPosts > 0 && <li>{counts.socialPosts} social posts</li>}
            {counts.reels > 0 && <li>{counts.reels} reels</li>}
            {counts.showreels > 0 && <li>{counts.showreels} showreels</li>}
          </ul>
        </div>
      )}

      {domain && (
        <a
          href={`https://${domain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit font-mono text-caption tracking-caption text-accent uppercase transition-colors hover:text-text-primary"
        >
          {domain} ↗
        </a>
      )}
    </aside>
  );
}
