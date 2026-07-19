export const CLIENT_IDS = [
  "aureate",
  "clix",
  "cybernetix",
  "hihat",
  "pixelscape",
  "eternal",
  "friends-perk-cafe",
] as const;

export type ClientId = (typeof CLIENT_IDS)[number];

export interface Client {
  id: ClientId;
  name: string;
  industry?: string;
  website?: string;
}

export const clients: Client[] = [
  { id: "aureate", name: "Aureate" },
  { id: "clix", name: "Clix" },
  { id: "cybernetix", name: "Cybernetix" },
  { id: "hihat", name: "Hihat" },
  { id: "pixelscape", name: "Pixelscape" },
  { id: "eternal", name: "Eternal" },
  { id: "friends-perk-cafe", name: "Friends Perk Cafe" },
];

export function getClientById(id: ClientId): Client | undefined {
  return clients.find((client) => client.id === id);
}
