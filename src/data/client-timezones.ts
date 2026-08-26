import type { ClientId } from "./clients";

export interface ClientTimezone {
  /** IANA timezone name for the client's real, stated location. */
  timeZone: string;
  /** Display label — the client's Client.location string, verbatim. */
  label: string;
}

/**
 * IANA timezones for clients with a real, known location
 * (REBUILD-SPEC.md 4a's "Clients Worldwide" homepage section) — a factual
 * geographic lookup derived from each client's real `location` in
 * clients.ts, not invented data. Deliberately curated to four distinct
 * zones (not one per client) so the section reads as genuine global
 * spread rather than a duplicate Pakistan/Australia entry sitting next
 * to another. Extend this table, not the section component, if more
 * clients' real locations become confirmed.
 */
export const clientTimezones: Partial<Record<ClientId, ClientTimezone>> = {
  cybernetix: { timeZone: "Asia/Dubai", label: "UAE" },
  "ay-architects": { timeZone: "Asia/Karachi", label: "Lahore, Pakistan" },
  "zoe-ministries": { timeZone: "America/New_York", label: "New York, USA" },
  thompson: { timeZone: "Australia/Brisbane", label: "Sunshine Coast, Australia" },
};

/** Display order for the Clients Worldwide section — kept explicit and
 *  separate from clientTimezones' key order (object key order isn't a
 *  contract worth relying on for presentation). */
export const clientsWorldwideOrder: ClientId[] = [
  "ay-architects",
  "cybernetix",
  "zoe-ministries",
  "thompson",
];

export function getClientTimezone(clientId: ClientId): ClientTimezone | undefined {
  return clientTimezones[clientId];
}
