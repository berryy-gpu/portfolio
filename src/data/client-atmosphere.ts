import type { ClientId } from "./clients";

export interface ClientAtmosphere {
  /** A muted accent used only for this client's ambient glow — never a
   *  full brand takeover, just enough to give the page its own mood
   *  while staying inside the same dark theme and type system. */
  accent: string;
  mood: string;
}

/**
 * Per-client atmosphere — real creative direction (approved directly),
 * not fabricated content. Aureate's warm gold specifically matches its
 * real brand (verified against the client's own site during content
 * research). Clix reuses the site's reserved secondary teal
 * (`--secondary-reserved`) as its one deliberate use — the token was
 * always meant to be rare, and a clean SaaS product is exactly that
 * moment.
 */
export const clientAtmosphere: Record<ClientId, ClientAtmosphere> = {
  cybernetix: { accent: "#4A7FB5", mood: "Digital precision" },
  pixelscape: { accent: "#9B7FD4", mood: "Modern agency energy" },
  aureate: { accent: "#C4A575", mood: "Quiet luxury" },
  clix: { accent: "#3D5A54", mood: "Clean product focus" },
  hihat: { accent: "#C97848", mood: "Cinematic warmth" },
  eternal: { accent: "#A6607A", mood: "Timeless elegance" },
  "friends-perk-cafe": { accent: "#B5713F", mood: "Warm and organic" },
};

export function getClientAtmosphere(clientId: ClientId): ClientAtmosphere {
  return clientAtmosphere[clientId];
}
