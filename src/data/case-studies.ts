import { getClientAtmosphere } from "./client-atmosphere";
import type { ClientId } from "./clients";
import { getReelsByClientId } from "./reels";
import { getShowreelsByClientId } from "./showreels";
import { getSocialCampaignsByClientId } from "./socialCampaigns";

/**
 * FIRST-PASS DRAFT — written 2026-08-24, not final copy.
 *
 * REBUILD-SPEC.md's /work/[clientId] page needs real brief/approach/
 * outcome narrative per client, and none existed anywhere in the repo
 * (service-detail.ts is honest per-SERVICE capability language, not a
 * per-CLIENT project story). Rather than invent business outcomes,
 * metrics, or narrative details nobody here actually knows, every
 * sentence below is derived strictly from facts already elsewhere in
 * src/data: the real domain (projects.ts), which pages were actually
 * captured (projects.ts images), each client's real category/discipline
 * mix (categoryIds), and the approved creative mood (client-atmosphere.ts).
 * No invented metrics, no fabricated client quotes, no claimed results.
 *
 * Treat this as a draft to rewrite with the real brief/story only you
 * know — what the client actually asked for, what the actual challenge
 * was, what happened after launch. friends-perk-cafe has no entry here on
 * purpose (REBUILD-SPEC.md: no case study, gallery-only variant).
 */
export interface CaseStudy {
  clientId: ClientId;
  brief: string;
  approach: string;
  outcome: string;
}

export const caseStudies: CaseStudy[] = [
  {
    clientId: "cybernetix",
    brief:
      "Cybernetix needed a website that read as precise and technical rather than generic — the kind of digital presence a technology brand can point clients to with confidence.",
    approach:
      "Designed and built the site around a considered, data-forward visual language, with dedicated homepage, about, and services pages, then carried that same precision into a run of published social content.",
    outcome:
      "A live site at cybernetix.ae, backed by seven published social posts extending the same identity beyond the homepage.",
  },
  {
    clientId: "pixelscape",
    brief:
      "Pixelscape needed a site with the energy of a modern creative agency — confident, current, built to be the first thing a prospective client sees.",
    approach:
      "Built a full homepage experience matched to that agency energy, then supported it with the largest social content run in the portfolio to keep the brand visible between projects.",
    outcome:
      "A live site at pixelscape.com.pk, with fifteen published social posts — more ongoing content than any other client here.",
  },
  {
    clientId: "aureate",
    brief:
      "Aureate needed a site that felt as considered as the brand itself — quiet, premium, nothing rushed.",
    approach:
      "Built as a single long-form homepage rather than a fragmented multi-page site, so the story reads in one continuous scroll. The gold accent used throughout the site's presentation is pulled directly from Aureate's own brand, not a generic placeholder.",
    outcome: "A live site at aureate161.com that carries that restraint all the way through.",
  },
  {
    clientId: "clix",
    brief:
      "Clix needed a homepage and feature page that could sell a CRM product on clarity — a SaaS site has to explain what the product does fast, without losing the polish.",
    approach:
      "Built the homepage and a dedicated feature page around clean product storytelling, reserving the site's teal accent specifically for this engagement rather than spreading it across every project.",
    outcome: "A live product site at clix-crm.com.",
  },
  {
    clientId: "hihat",
    brief:
      "Hi-Hat Productions needed a site that read as cinematic as the work it represents — a production company's homepage is itself a piece of creative work.",
    approach:
      "Built the homepage and about page with deliberately large, cinematic visual treatment rather than the site's standard layout, matching the warmth of a production studio's own creative direction.",
    outcome: "A live site at hi-hatproductions.com.",
  },
  {
    clientId: "eternal",
    brief:
      "Eternal's strength is motion, not a website — the brief here was video-first: reels and a showreel that carry the brand's timeless, elegant tone.",
    approach:
      "Edited and produced a set of short-form reels alongside a longer showreel piece, then extended the same visual language into a run of published social content.",
    outcome: "Two published reels, two showreel pieces, and seven published social posts.",
  },
];

export function getCaseStudyByClientId(clientId: ClientId): CaseStudy | undefined {
  return caseStudies.find((caseStudy) => caseStudy.clientId === clientId);
}

/** A real, honest deliverable-count line for a client's case study —
 *  assembled the same way work.ts's getClientSummaryLine derives its
 *  summary, never hardcoded or invented. */
export function getCaseStudyDeliverableCounts(clientId: ClientId) {
  return {
    socialPosts: getSocialCampaignsByClientId(clientId).flatMap(
      (campaign) => campaign.images
    ).length,
    reels: getReelsByClientId(clientId).length,
    showreels: getShowreelsByClientId(clientId).length,
    mood: getClientAtmosphere(clientId)?.mood,
  };
}
